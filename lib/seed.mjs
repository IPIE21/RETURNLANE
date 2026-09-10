import { stamp } from './policy.mjs';

export function newLead(id, name, vehicle, originalCents, salesperson, now, overrides = {}) {
  return { id, name, vehicle, shoppingFor: '2026 Mercedes-Benz GLC 300', originalCents,
    capCents: 50000, salesperson, consent: true, consentSource: 'Synthetic showroom SMS opt-in',
    visitedAt: stamp(Date.parse(now) - 48 * 3600000), expiresAt: stamp(Date.parse(now) + 5 * 86400000),
    notes: 'Liked the vehicle. Wanted to think about the trade-in appraisal before moving forward.',
    status: 'new', touches: 0, lastSentAt: null, quote: null, messages: [], handoff: null,
    appointment: null, ...overrides };
}

export function seed() {
  // A frozen clock makes presentations repeatable, regardless of wall-clock time.
  const now = '2026-09-08T14:15:00.000Z';
  const leads = [
    newLead('L-1001', 'Alex Morgan', '2021 BMW X3', 2850000, 'Jordan Ellis', now),
    newLead('L-1002', 'Taylor Brooks', '2020 Lexus RX 350', 2675000, 'Morgan Lee', now, { capCents: 30000, shoppingFor: '2026 Mercedes-Benz GLE 350' }),
    newLead('L-1003', 'Cameron Reed', '2022 Audi Q5', 3120000, 'Jordan Ellis', now, { capCents: 20000, shoppingFor: '2026 Mercedes-Benz GLC 300 Coupe' }),
    newLead('L-1004', 'Jamie Parker', '2019 Mercedes-Benz C 300', 1990000, 'Avery Chen', now, { consent: false, consentSource: 'No SMS opt-in recorded', notes: 'Walk-in appraisal. Contact permission was not captured.' }),
    newLead('L-1005', 'Riley Carter', '2023 Volvo XC60', 3480000, 'Morgan Lee', now, { visitedAt: stamp(Date.parse(now) - 3 * 3600000), notes: 'Visited this morning. Give the customer space before following up.' }),
    newLead('L-1006', 'Drew Bennett', '2020 BMW 530i', 2310000, 'Avery Chen', now, { status: 'closed', notes: 'Deal already closed in the simulated CRM. Excluded from recovery.' }),
    newLead('L-1007', 'Quinn Davis', '2018 Audi A6', 1720000, 'Jordan Ellis', now, { expiresAt: stamp(Date.parse(now) - 86400000), notes: 'Original appraisal is out of date. A fresh appraisal is required.' }),
    newLead('L-1008', 'Casey Wilson', '2021 Acura RDX', 2490000, 'Avery Chen', now, { status: 'opted_out', consent: false, consentSource: 'Customer requested no further messages', notes: 'Previously opted out. Do not contact.' }),
  ];
  return { version: 1, now, paused: false, leads, events: [{ id: 'seed', at: now, leadId: null,
    type: 'crm_import', title: 'Demo CRM synchronized', detail: '8 fictional showroom visits imported. No dealership system is connected.' }], runs: 0, imported: 0 };
}
