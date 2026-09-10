import { DatabaseSync } from 'node:sqlite';
import { seed } from './seed.mjs';

export class Store {
  constructor(path = ':memory:') {
    this.db = new DatabaseSync(path);
    this.db.exec(`PRAGMA journal_mode = WAL;
      CREATE TABLE IF NOT EXISTS app_state (id INTEGER PRIMARY KEY CHECK(id = 1), data TEXT NOT NULL);
      CREATE TABLE IF NOT EXISTS issued_offers (
        lead_id TEXT PRIMARY KEY,
        original_cents INTEGER NOT NULL CHECK(original_cents > 0),
        uplift_cents INTEGER NOT NULL CHECK(uplift_cents >= 0 AND uplift_cents <= 50000),
        cap_cents INTEGER NOT NULL CHECK(cap_cents >= 0 AND cap_cents <= 50000),
        total_cents INTEGER NOT NULL,
        CHECK(uplift_cents <= cap_cents),
        CHECK(total_cents = original_cents + uplift_cents)
      ) STRICT;
      CREATE TRIGGER IF NOT EXISTS immutable_offer BEFORE UPDATE ON issued_offers
      BEGIN SELECT RAISE(ABORT, 'Issued offers cannot be changed'); END;`);
    if (!this.db.prepare('SELECT id FROM app_state WHERE id = 1').get()) this.save(seed());
  }
  read() { return JSON.parse(this.db.prepare('SELECT data FROM app_state WHERE id = 1').get().data); }
  save(state) { this.db.prepare('INSERT INTO app_state(id, data) VALUES (1, ?) ON CONFLICT(id) DO UPDATE SET data = excluded.data').run(JSON.stringify(state)); }
  issue(lead) {
    const q = lead.quote;
    this.db.prepare('INSERT INTO issued_offers VALUES (?, ?, ?, ?, ?)').run(lead.id, q.originalCents, q.upliftCents, q.capCents, q.totalCents);
  }
  transaction(fn) {
    this.db.exec('BEGIN IMMEDIATE');
    try {
      const state = this.read();
      const result = fn(state);
      this.save(state);
      this.db.exec('COMMIT');
      return result;
    } catch (error) { this.db.exec('ROLLBACK'); throw error; }
  }
  reset() {
    this.db.exec('BEGIN IMMEDIATE');
    try { this.db.exec('DELETE FROM issued_offers'); this.save(seed()); this.db.exec('COMMIT'); }
    catch (error) { this.db.exec('ROLLBACK'); throw error; }
  }
  close() { this.db.close(); }
}
