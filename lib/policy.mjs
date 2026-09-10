export const POLICY = Object.freeze({
  version: 'TRADE-1.0', hardCapCents: 50000, initialUpliftCents: 25000,
  minAgeHours: 24, cooldownHours: 48, maxTouches: 2,
  timezone: 'America/New_York', openHour: 9, closeHour: 18,
});

export class DomainError extends Error {
  constructor(message, status = 409) { super(message); this.status = status; }
}
export const dollars = cents => new Intl.NumberFormat('en-US', {
  style: 'currency', currency: 'USD', minimumFractionDigits: cents % 100 ? 2 : 0, maximumFractionDigits: 2,
}).format(cents / 100);
const expiryLabel = value => new Intl.DateTimeFormat('en-US', { timeZone: POLICY.timezone, month: 'short', day: 'numeric', year: 'numeric', hour: 'numeric', minute: '2-digit', timeZoneName: 'short' }).format(new Date(value));
export const stamp = ms => new Date(ms).toISOString();
export const hoursBetween = (a, b) => (Date.parse(a) - Date.parse(b)) / 3600000;

export function quoteFor(lead, upliftCents = POLICY.initialUpliftCents) {
  for (const [name, value] of Object.entries({ originalCents: lead.originalCents, capCents: lead.capCents, upliftCents })) {
    if (!Number.isSafeInteger(value) || value < 0) throw new DomainError(`${name} must be a non-negative integer in cents.`, 400);
  }
  if (lead.originalCents === 0 || lead.originalCents > 100000000) throw new DomainError('Original appraisal is invalid.', 400);
  const allowed = Math.min(POLICY.hardCapCents, lead.capCents);
  if (upliftCents > allowed) throw new DomainError(`Blocked: increase exceeds the ${dollars(allowed)} limit.`, 400);
  return Object.freeze({ originalCents: lead.originalCents, upliftCents,
    totalCents: lead.originalCents + upliftCents, capCents: allowed,
    expiresAt: lead.expiresAt, policyVersion: POLICY.version });
}

export function inContactWindow(now) {
  const p = Object.fromEntries(new Intl.DateTimeFormat('en-US', { timeZone: POLICY.timezone,
    weekday: 'short', hour: 'numeric', hourCycle: 'h23' }).formatToParts(new Date(now)).map(x => [x.type, x.value]));
  return p.weekday !== 'Sun' && Number(p.hour) >= POLICY.openHour && Number(p.hour) < POLICY.closeHour;
}

export function eligibility(lead, state) {
  if (lead.status === 'opted_out') return { ok: false, reason: 'Customer opted out', code: 'opted_out' };
  if (!lead.consent) return { ok: false, reason: 'No recorded SMS consent', code: 'no_consent' };
  if (['interested', 'booked', 'review', 'closed'].includes(lead.status)) return { ok: false, reason: 'Owned by salesperson', code: 'human_owned' };
  if (state.paused) return { ok: false, reason: 'Recovery is paused', code: 'paused' };
  if (Date.parse(lead.expiresAt) <= Date.parse(state.now)) return { ok: false, reason: 'Appraisal authorization expired', code: 'expired' };
  if (lead.touches >= POLICY.maxTouches) return { ok: false, reason: 'Two-touch sequence completed', code: 'exhausted' };
  if (hoursBetween(state.now, lead.visitedAt) < POLICY.minAgeHours) return { ok: false, reason: 'Waiting until 24h after visit', code: 'too_recent' };
  if (lead.lastSentAt && hoursBetween(state.now, lead.lastSentAt) < POLICY.cooldownHours) return { ok: false, reason: '48h spacing between follow-ups', code: 'cooldown' };
  if (!inContactWindow(state.now)) return { ok: false, reason: 'Outside demo contact hours', code: 'quiet_hours' };
  return { ok: true, reason: lead.touches ? 'Reminder is due' : 'Ready for first follow-up', code: 'ready' };
}

// The mock model returns only a symbolic action. No generated prose, prices,
// arbitrary tool calls, or customer instructions reach the outbound renderer.
export function classifyReply(text) {
  const t = text.trim().toLowerCase().replace(/[’]/g, "'");
  if (/\b(stop|unsubscribe|cancel|end|quit)\b|do not (text|contact)|don't (text|contact)|remove me|no more (texts|messages)/i.test(t)) return 'opt_out';
  if (/^(yes|i'm interested|i am interested|interested|yes, i'm interested\.?|yes, i'd like to come back\.?|sounds good|can i come back\??)[.!?]?$/.test(t)) return 'interested';
  if (/^(not interested|no thanks|no thank you|already bought a car)[.!]?$/.test(t)) return 'decline';
  return 'human_review';
}

export function renderMessage(action, { lead, quote, slot }) {
  const first = lead.name.split(' ')[0];
  if (action === 'followup') return `Hi ${first}, this is Returnlane, the automated follow-up assistant for Buckhead Motor Co. Following your visit with ${lead.salesperson}, we can offer ${dollars(quote.totalCents)} for your ${lead.vehicle} (${dollars(quote.upliftCents)} above your original appraisal), subject to unchanged vehicle condition and reinspection. This authorization expires ${expiryLabel(quote.expiresAt)}. Would you like to reconnect with ${lead.salesperson}? Reply STOP to opt out.`;
  if (action === 'reminder') return `Hi ${first}, one final follow-up from Buckhead Motor Co.'s automated assistant. Your ${dollars(quote.totalCents)} trade-in offer is still available until ${expiryLabel(quote.expiresAt)}, subject to unchanged condition and reinspection. ${lead.salesperson} can help with next steps. Reply STOP to opt out.`;
  if (action === 'interested') return `Thanks, ${first}. I've flagged your interest for ${lead.salesperson}, the salesperson you met. You can choose an available return-visit time below, or ${lead.salesperson} can help arrange one. They will handle the vehicle review and any final agreement.`;
  if (action === 'booked') return `Your return visit with ${lead.salesperson} is booked for ${slot.label} at Buckhead Motor Co. Please bring your trade-in. ${lead.salesperson} will review its condition and walk you through next steps.`;
  throw new DomainError('Unknown outbound action.', 400);
}
