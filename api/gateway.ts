import type {IncomingMessage, ServerResponse} from 'node:http';
import {handleError, respond} from '../server/_lib/admin.js';
import route0 from '../server/admin/studio.js';
import route1 from '../server/community/directory.js';
import route2 from '../server/community/profile.js';
import route3 from '../server/github/import.js';
import route4 from '../server/github/repos.js';
import route5 from '../server/github/repository.js';
import route6 from '../server/insights/pending.js';
import route7 from '../server/insights/revival.js';
import route8 from '../server/metrics/event.js';
import route9 from '../server/projects/detail.js';
import route10 from '../server/projects/market.js';
import route11 from '../server/projects/public.js';
import route12 from '../server/projects/remove.js';
import route13 from '../server/proposals/complete.js';
import route14 from '../server/proposals/decision.js';
import route15 from '../server/proposals/submit.js';

type Handler = (req: IncomingMessage, res: ServerResponse) => void | Promise<void>;
const handlers = new Map<string, Handler>([
  ['admin/studio', route0],
  ['community/directory', route1],
  ['community/profile', route2],
  ['github/import', route3],
  ['github/repos', route4],
  ['github/repository', route5],
  ['insights/pending', route6],
  ['insights/revival', route7],
  ['metrics/event', route8],
  ['projects/detail', route9],
  ['projects/market', route10],
  ['projects/public', route11],
  ['projects/remove', route12],
  ['proposals/complete', route13],
  ['proposals/decision', route14],
  ['proposals/submit', route15],
]);

// Keep the existing public /api/... URLs and the original endpoint handlers.
export default async function gateway(req: IncomingMessage, res: ServerResponse) {
  try {
    const url = new URL(req.url || '/', 'http://localhost');
    const path = url.pathname.replace(/^\/api\//, '').replace(/\/$/, '');
    const key = path === 'gateway' ? url.searchParams.get('__cc_route') || '' : path;
    const handler = handlers.get(key);
    if (!handler) { respond(res, 404, {error: 'API endpoint not found.'}); return; }
    // Preserve original query parameters (id, uid, repository, etc.).
    url.searchParams.delete('__cc_route');
    req.url = `/api/${key}${url.search}`;
    await handler(req, res);
  } catch (error) {
    if (!res.headersSent) handleError(res, error);
    else if (!res.writableEnded) res.end();
  }
}
