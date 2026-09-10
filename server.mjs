import http from 'node:http';
import { readFileSync, mkdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import { Store } from './lib/store.mjs';
import { Engine } from './lib/engine.mjs';
import { DomainError } from './lib/policy.mjs';

const root = path.dirname(fileURLToPath(import.meta.url));
const assets = new Map([['/', ['index.html', 'text/html']], ['/app.js', ['app.js', 'text/javascript']], ['/styles.css', ['styles.css', 'text/css']], ['/favicon.svg', ['favicon.svg', 'image/svg+xml']]]);
export function createApp(store) {
  const engine = new Engine(store);
  const appServer = http.createServer(async (req, res) => {
    const host = req.headers.host;
    const port = req.socket.localPort;
    const localHosts = [`127.0.0.1:${port}`, `localhost:${port}`];
    if (process.env.NODE_ENV !== 'production' && !localHosts.includes(host)) { res.writeHead(403); res.end('Local access only'); return; }
    const headers = { 'X-Content-Type-Options': 'nosniff', 'Cache-Control': 'no-store', 'Referrer-Policy': 'no-referrer',
      'Content-Security-Policy': "default-src 'self'; script-src 'self'; style-src 'self'; img-src 'self' data:; connect-src 'self'; frame-ancestors 'none'; base-uri 'none'; form-action 'self'" };
    const send = (status, data) => { res.writeHead(status, { ...headers, 'Content-Type': 'application/json' }); res.end(JSON.stringify(data)); };
    try {
      const url = new URL(req.url, `http://${host}`);
      if (req.method === 'GET' && url.pathname === '/api/state') return send(200, engine.view());
      if (req.method === 'GET' && url.pathname === '/api/export') {
        const s = engine.view();
        res.writeHead(200, { ...headers, 'Content-Type': 'application/json', 'Content-Disposition': 'attachment; filename="returnlane-demo-audit.json"' });
        return res.end(JSON.stringify({ disclosure: 'FICTIONAL DEMO DATA. Not actual dealership performance. Local audit is not tamper-proof.', ...s }, null, 2));
      }
      if (req.method === 'GET' && assets.has(url.pathname)) {
        const [file, type] = assets.get(url.pathname);
        res.writeHead(200, { ...headers, 'Content-Type': `${type}; charset=utf-8` });
        return res.end(readFileSync(path.join(root, 'public', file)));
      }
      if (req.method !== 'POST' || !url.pathname.startsWith('/api/')) return send(404, { error: 'Not found' });
      if (req.headers.origin && req.headers.origin !== `http://${host}`) return send(403, { error: 'Cross-origin request blocked' });
      if (req.headers['x-returnlane-client'] !== 'local-demo' || !req.headers['content-type']?.startsWith('application/json')) return send(403, { error: 'Local demo JSON client required' });
      let raw = '';
      for await (const chunk of req) { raw += chunk; if (Buffer.byteLength(raw) > 16000) throw new DomainError('Request too large.', 413); }
      let b;
      try { b = JSON.parse(raw || '{}'); } catch { throw new DomainError('Invalid JSON.', 400); }
      if (!b || typeof b !== 'object' || Array.isArray(b)) throw new DomainError('JSON object required.', 400);
      let result;
      switch (url.pathname) {
        case '/api/shutdown': send(200, { result: { ok: true } }); appServer.emit('demoShutdown'); return;
        case '/api/run': if (b.id !== undefined && typeof b.id !== 'string') throw new DomainError('Invalid lead ID.', 400); result = engine.run(b.id); break;
        case '/api/reply': result = engine.reply(b.id, b.text); break;
        case '/api/book': result = engine.book(b.id, b.slotId); break;
        case '/api/acknowledge': result = engine.acknowledge(b.id); break;
        case '/api/import': result = engine.importDemo(); break;
        case '/api/pause': result = engine.pause(b.paused); break;
        case '/api/advance': result = engine.advance(); break;
        case '/api/challenge': result = engine.challenge(b.id, b.upliftCents); break;
        case '/api/reset': if (b.confirm !== 'RESET DEMO') throw new DomainError('Explicit demo reset confirmation required.', 400); store.reset(); result = { ok: true }; break;
        default: return send(404, { error: 'Not found' });
      }
      send(200, { result, state: engine.view() });
    } catch (e) {
      if (!(e instanceof DomainError)) console.error(e);
      send(e instanceof DomainError ? e.status : 500, { error: e instanceof DomainError ? e.message : 'Local storage error. No partial action was committed.' });
    }
  });
  return appServer;
}
if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  mkdirSync(path.join(root, 'data'), { recursive: true });
  const store = new Store(path.join(root, 'data', 'returnlane.sqlite'));
  const server = createApp(store);
  const port = Number(process.env.PORT || process.env.RETURNLANE_PORT || 4317);
  const host = process.env.NODE_ENV === 'production' ? '0.0.0.0' : '127.0.0.1';
  server.listen(port, host, () => console.log(`Returnlane running on ${host}:${port}\nAll records and messages are fictional. No external integrations or model calls.`));
  server.on('error', e => { console.error(e.message); store.close(); process.exitCode = 1; });
  server.on('demoShutdown', () => server.close(() => { store.close(); process.exit(0); }));
  for (const signal of ['SIGINT', 'SIGTERM']) process.on(signal, () => server.close(() => { store.close(); process.exit(0); }));
}
