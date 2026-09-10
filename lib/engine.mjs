import { randomUUID } from 'node:crypto';
import { POLICY, DomainError, eligibility, quoteFor, renderMessage, classifyReply, stamp, dollars, inContactWindow } from './policy.mjs';
import { newLead } from './seed.mjs';

const event = (state, lead, type, title, detail) => state.events.push({ id: randomUUID(), at: state.now, leadId: lead?.id ?? null, type, title, detail });
const findLead = (s, id) => { const l = s.leads.find(l => l.id === id); if (!l) throw new DomainError('Lead not found.', 404); return l; };
const outbound = (s, l, action, extra = {}) => {
  const text = renderMessage(action, { lead: l, quote: l.quote, ...extra });
  l.messages.push({ id: randomUUID(), at: s.now, direction: 'out', text, action, transport: 'simulated' });
  event(s, l, 'message', 'Message delivered to demo inbox', `Controlled template: ${action}. No SMS was sent.`);
};
const handoff = (s, l, reason) => {
  if (!l.handoff) l.handoff = { id: randomUUID(), at: s.now, owner: l.salesperson, acknowledged: false, reason };
  else l.handoff.reason = reason;
  event(s, l, 'handoff', `Routed to ${l.salesperson}`, reason);
};

export function slotsFor(state, lead) {
  const slots = [];
  for (let h = 1; h < 168 && slots.length < 18; h++) {
    const time = new Date(Date.parse(state.now) + h * 3600000);
    time.setUTCMinutes(0, 0, 0);
    const iso = time.toISOString();
    if (!inContactWindow(iso)) continue;
    if (Date.parse(iso) >= Date.parse(lead.expiresAt)) continue;
    if (state.leads.some(l => l.appointment?.at === iso && l.salesperson === lead.salesperson)) continue;
    const label = new Intl.DateTimeFormat('en-US', { timeZone: POLICY.timezone, weekday: 'short', month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit', timeZoneName: 'short' }).format(time);
    slots.push({ id: iso, label });
  }
  return slots;
}

export class Engine {
  constructor(store) { this.store = store; }
  view() {
    const s = this.store.read();
    const leads = s.leads.map(l => ({ ...l, eligibility: eligibility(l, s), slots: l.status === 'interested' ? slotsFor(s, l) : [] }));
    return { ...s, leads, policy: POLICY, metrics: {
      imported: leads.length, eligible: leads.filter(l => l.eligibility.ok).length,
      contacted: leads.filter(l => l.touches > 0).length,
      engaged: leads.filter(l => l.handoff && ['interested', 'booked', 'closed'].includes(l.status)).length,
      appointments: leads.filter(l => l.appointment).length,
      attention: leads.filter(l => l.handoff && !l.handoff.acknowledged && l.status !== 'opted_out').length,
      reservedUpliftCents: leads.filter(l => l.quote && !['opted_out', 'closed'].includes(l.status)).reduce((sum, l) => sum + l.quote.upliftCents, 0),
    } };
  }
  run(id) {
    return this.store.transaction(s => {
      const candidates = id ? [findLead(s, id)] : s.leads;
      const sent = [], skipped = [];
      for (const l of candidates) {
        const check = eligibility(l, s);
        if (!check.ok) { skipped.push({ id: l.id, name: l.name, reason: check.reason }); continue; }
        if (!l.quote) {
          l.quote = quoteFor(l, Math.min(POLICY.initialUpliftCents, POLICY.hardCapCents, l.capCents));
          this.store.issue(l);
          event(s, l, 'offer', 'Offer authorized by policy', `${dollars(l.quote.originalCents)} + ${dollars(l.quote.upliftCents)} = ${dollars(l.quote.totalCents)}. Immutable original; ${dollars(l.quote.capCents)} increase limit.`);
        }
        outbound(s, l, l.touches ? 'reminder' : 'followup');
        l.touches++; l.lastSentAt = s.now; l.status = 'contacted'; sent.push(l.id);
      }
      s.runs++;
      event(s, null, 'run', 'Recovery cycle completed', `${sent.length} simulated follow-ups; ${skipped.length} excluded. Eligibility checked again immediately before each message.`);
      return { sent, skipped };
    });
  }
  reply(id, text) {
    if (typeof text !== 'string' || !text.trim() || text.length > 2000) throw new DomainError('Enter a reply between 1 and 2,000 characters.', 400);
    return this.store.transaction(s => {
      const l = findLead(s, id);
      if (!l.touches) throw new DomainError('Run a follow-up before simulating a customer reply.');
      const action = classifyReply(text);
      l.messages.push({ id: randomUUID(), at: s.now, direction: 'in', text: text.trim(), action: 'customer', transport: 'simulated' });
      event(s, l, 'reply', 'Simulated customer reply received', `Mock intent classifier: ${action}. Customer text is treated as data.`);
      if (action === 'opt_out') {
        l.status = 'opted_out'; l.consent = false;
        if (l.handoff) { l.handoff.acknowledged = true; l.handoff.reason = 'Customer opted out. No further automated contact.'; }
        event(s, l, 'suppressed', 'Opt-out applied immediately', 'All further automated messages suppressed. Any existing appointment is retained for human review.');
        return { action };
      }
      if (l.status === 'opted_out' || !l.consent) { event(s, l, 'suppressed', 'Reply retained; no response sent', 'Opt-out cannot be reversed by the mock model.'); return { action: 'suppressed' }; }
      if (['booked', 'review', 'closed'].includes(l.status)) { event(s, l, 'human_owned', 'Reply retained for salesperson', 'Automated conversation has ended.'); return { action: 'human_owned' }; }
      if (action === 'decline') {
        l.status = 'closed'; event(s, l, 'closed', 'Recovery closed: customer declined', 'No additional follow-ups scheduled. This is not a recovered sale.');
      } else if (action === 'interested' && Date.parse(l.expiresAt) > Date.parse(s.now) && !s.paused && inContactWindow(s.now)) {
        if (l.status === 'interested') return { action: 'already_interested' };
        l.status = 'interested'; handoff(s, l, 'Customer wants to return. Confirm their visit and review the trade-in.'); outbound(s, l, 'interested');
      } else {
        l.status = 'review'; handoff(s, l, action === 'interested' ? 'Customer interested; authorization expired, recovery paused, or outside contact hours. Personal follow-up required.' : 'Customer question or negotiation requires a human. No offer changed and no automatic promise made.');
      }
      return { action };
    });
  }
  book(id, slotId) {
    return this.store.transaction(s => {
      const l = findLead(s, id);
      if (s.paused || l.status !== 'interested' || !l.consent) throw new DomainError('Only an active, interested customer can book a demo appointment.');
      if (Date.parse(l.expiresAt) <= Date.parse(s.now)) throw new DomainError('Appraisal authorization expired; salesperson review required.');
      if (!inContactWindow(s.now)) throw new DomainError('Outside demo contact hours.');
      const slot = slotsFor(s, l).find(x => x.id === slotId);
      if (!slot) throw new DomainError('That time is no longer available. Choose a current demo slot.');
      l.appointment = { id: randomUUID(), at: slot.id, label: slot.label, owner: l.salesperson, source: 'simulated_calendar' };
      l.status = 'booked'; handoff(s, l, `Return visit booked: ${slot.label}. Original offer ${dollars(l.originalCents)}; authorized follow-up ${dollars(l.quote.totalCents)}. Reinspect and close in person.`);
      outbound(s, l, 'booked', { slot });
      event(s, l, 'appointment', 'Return visit booked on demo calendar', `${slot.label} with ${l.salesperson}. No live calendar is connected.`);
      return { appointment: l.appointment };
    });
  }
  acknowledge(id) {
    return this.store.transaction(s => {
      const l = findLead(s, id);
      if (!l.handoff || l.status === 'opted_out') throw new DomainError('No active handoff to acknowledge.');
      if (!l.handoff.acknowledged) { l.handoff.acknowledged = true; event(s, l, 'acknowledged', 'Salesperson accepted handoff', `${l.salesperson} owns the next step. This click simulates a CRM task acknowledgement.`); }
      return { ok: true };
    });
  }
  importDemo() {
    return this.store.transaction(s => {
      s.imported++;
      const n = s.imported;
      const l = newLead(`L-${2000 + n}`, n === 1 ? 'Sam Rivera' : `Sam Rivera ${n}`, '2022 Mercedes-Benz GLC 300', 3290000, 'Jordan Ellis', s.now, { notes: 'Demo walk-out: liked the new GLC, but wanted a little more for the trade-in. Same salesperson retained.' });
      s.leads.unshift(l); event(s, l, 'crm_import', 'Cold lead imported from demo CRM', 'Fictional visit, original appraisal, SMS consent, and salesperson ownership captured together.');
      return { id: l.id };
    });
  }
  pause(paused) {
    if (typeof paused !== 'boolean') throw new DomainError('paused must be boolean.', 400);
    return this.store.transaction(s => { s.paused = paused; event(s, null, 'policy', paused ? 'Recovery paused' : 'Recovery resumed', 'Manager control applied. Opt-outs are always processed, even while paused.'); return { paused }; });
  }
  advance() {
    return this.store.transaction(s => { s.now = stamp(Date.parse(s.now) + 48 * 3600000); event(s, null, 'clock', 'Demo clock advanced 48 hours', 'No real time elapsed. Run recovery to evaluate due reminders and expirations.'); return { now: s.now }; });
  }
  challenge(id, amount) {
    return this.store.transaction(s => {
      const l = findLead(s, id);
      let result;
      try { const q = quoteFor(l, amount); result = { allowed: true, totalCents: q.totalCents, reason: 'Within policy. Validation only: no offer changed or message sent.' }; }
      catch (e) { if (!(e instanceof DomainError)) throw e; result = { allowed: false, reason: e.message }; }
      event(s, l, 'guardrail', result.allowed ? 'Policy test passed' : 'Policy blocked proposed increase', `${String(amount)} cents proposed. ${result.reason}`);
      return result;
    });
  }
}
