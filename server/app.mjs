/**
 * EMG website server: the form API plus (optionally) the built site from dist/.
 *
 *   POST /api/forms/:kind      kind = enquiry | proposal | careers | partnership   (multipart/form-data)
 *   GET  /api/health
 *   GET  /api/admin/submissions[?form=&limit=]   Bearer ADMIN_TOKEN   → JSON
 *   GET  /api/admin/submissions.csv[?form=]      Bearer ADMIN_TOKEN   → CSV
 *   GET  /api/admin/files/:id/:storedName        Bearer ADMIN_TOKEN   → the uploaded file
 */
import express from 'express';
import multer from 'multer';
import path from 'node:path';
import crypto from 'node:crypto';
import { existsSync } from 'node:fs';
import { FORMS, HONEYPOT, validate } from './schemas.mjs';
import { checkFile, safeName } from './files.mjs';
import { createStorage } from './storage.mjs';
import { createRateLimit } from './rateLimit.mjs';

export function createApp({ dataDir, distDir, mailer = null, adminToken = '', allowedOrigins = [], rate = { max: 6, windowMs: 10 * 60 * 1000 }, trustProxy = 1, log = console } = {}) {
  const app = express();
  const storage = createStorage(dataDir);
  const limiter = createRateLimit(rate);
  app.disable('x-powered-by');
  app.set('trust proxy', trustProxy);

  app.use((req, res, next) => {
    res.set({ 'X-Content-Type-Options': 'nosniff', 'Referrer-Policy': 'strict-origin-when-cross-origin', 'X-Frame-Options': 'SAMEORIGIN' });
    next();
  });

  // CORS only when the site is hosted on a different origin than the API
  app.use('/api', (req, res, next) => {
    const origin = req.get('origin');
    if (origin && allowedOrigins.includes(origin)) {
      res.set({ 'Access-Control-Allow-Origin': origin, Vary: 'Origin', 'Access-Control-Allow-Methods': 'GET,POST,OPTIONS', 'Access-Control-Allow-Headers': 'Accept,Authorization,Content-Type' });
      if (req.method === 'OPTIONS') return res.sendStatus(204);
    }
    next();
  });

  app.get('/api/health', (req, res) => res.json({ ok: true }));

  const upload = multer({
    storage: multer.memoryStorage(),
    limits: { fileSize: 10 * 1024 * 1024, files: 5, fields: 40, fieldSize: 20 * 1024, parts: 50 },
  });

  app.post('/api/forms/:kind', (req, res, next) => {
    const form = FORMS[req.params.kind];
    if (!form) return res.status(404).json({ ok: false, message: 'Unknown form.' });
    if (!limiter.take(req.ip)) return res.status(429).json({ ok: false, message: 'Too many submissions. Please wait a few minutes and try again.' });
    upload.any()(req, res, (err) => {
      if (err) {
        const message = err.code === 'LIMIT_FILE_SIZE' ? 'Each file must be 10 MB or smaller.' : err.code === 'LIMIT_FILE_COUNT' ? 'Attach at most 5 files.' : 'The submission could not be read.';
        return res.status(400).json({ ok: false, message, errors: err.code?.startsWith('LIMIT_FILE') ? { [form.files.field]: message } : {} });
      }
      handle(form, req.params.kind, req, res).catch(next);
    });
  });

  async function handle(form, kind, req, res) {
    // Honeypot: real visitors never see or fill this field. Pretend success so bots learn nothing.
    if (req.body?.[HONEYPOT]) return res.json({ ok: true, id: 'received' });

    const { data, errors } = validate(form, req.body || {});
    const files = (req.files || []).filter((f) => f.size > 0);
    const foreign = files.find((f) => f.fieldname !== form.files.field);
    if (foreign) errors[form.files.field] = 'Unexpected file field.';
    const mine = files.filter((f) => f.fieldname === form.files.field);
    if (form.files.required && mine.length === 0) errors[form.files.field] = 'Please attach a file.';
    if (mine.length > form.files.max) errors[form.files.field] = `Attach at most ${form.files.max} files.`;
    for (const f of mine) {
      const problem = checkFile(f);
      if (problem) { errors[form.files.field] = `${safeName(f.originalname)}: ${problem}`; break; }
      f.safeName = safeName(f.originalname);
    }
    if (Object.keys(errors).length) return res.status(400).json({ ok: false, message: 'Please check the highlighted fields.', errors });

    const record = await storage.save({ form: kind, fields: data, files: mine });
    log.info?.(`[forms] ${kind} ${record.id} stored (${mine.length} file${mine.length === 1 ? '' : 's'})`);
    if (mailer) {
      mailer.notify(record, form.label, mine).catch((e) => log.error?.(`[forms] notify failed for ${record.id}: ${e.message}`));
      mailer.acknowledge(record, form.label).catch((e) => log.error?.(`[forms] acknowledgement failed for ${record.id}: ${e.message}`));
    }
    res.json({ ok: true, id: record.id });
  }

  // ───────── admin (disabled unless ADMIN_TOKEN is set) ─────────
  const admin = (req, res, next) => {
    if (!adminToken) return res.status(404).json({ ok: false, message: 'Not found.' });
    const got = (req.get('authorization') || '').replace(/^Bearer\s+/i, '');
    const a = Buffer.from(got), b = Buffer.from(adminToken);
    if (a.length !== b.length || !crypto.timingSafeEqual(a, b)) return res.status(401).json({ ok: false, message: 'Unauthorised.' });
    res.set('Cache-Control', 'no-store');
    next();
  };
  const formFilter = (q) => (q && FORMS[q] ? q : undefined);

  app.get('/api/admin/submissions', admin, async (req, res) => {
    const limit = Math.min(Number(req.query.limit) || 200, 2000);
    res.json({ ok: true, submissions: await storage.list({ form: formFilter(req.query.form), limit }) });
  });

  app.get('/api/admin/submissions.csv', admin, async (req, res) => {
    const rows = await storage.list({ form: formFilter(req.query.form), limit: 100000 });
    const keys = [...new Set(rows.flatMap((r) => Object.keys(r.fields)))];
    const esc = (v) => {
      let s = Array.isArray(v) ? v.join('; ') : String(v ?? '');
      if (/^[=+\-@\t\r]/.test(s)) s = `'${s}`; // keep spreadsheets from running formulas
      return `"${s.replace(/"/g, '""')}"`;
    };
    const head = ['id', 'form', 'receivedAt', ...keys, 'files'];
    const body = rows.map((r) => [r.id, r.form, r.receivedAt, ...keys.map((k) => r.fields[k]), r.files.map((f) => `${f.name} (/api/admin/files/${r.id}/${f.storedName})`).join('; ')].map(esc).join(','));
    res.set({ 'Content-Type': 'text/csv; charset=utf-8', 'Content-Disposition': 'attachment; filename="emg-submissions.csv"' });
    res.send('﻿' + [head.map(esc).join(','), ...body].join('\r\n'));
  });

  app.get('/api/admin/files/:id/:storedName', admin, (req, res) => {
    const p = storage.filePath(req.params.id, req.params.storedName);
    if (!p) return res.status(404).json({ ok: false, message: 'Not found.' });
    res.download(p, path.basename(p));
  });

  app.use('/api', (req, res) => res.status(404).json({ ok: false, message: 'Not found.' }));

  // ───────── the built site (single-page app) ─────────
  if (distDir && existsSync(path.join(distDir, 'index.html'))) {
    app.use(express.static(distDir, { index: false, maxAge: '1h', setHeaders: (res, p) => { if (p.includes(`${path.sep}assets${path.sep}`)) res.set('Cache-Control', 'public, max-age=31536000, immutable'); } }));
    app.get(/^(?!\/api\/).*/, (req, res) => res.sendFile(path.join(distDir, 'index.html')));
  }

  app.use((err, req, res, _next) => {
    log.error?.(`[server] ${err.stack || err.message}`);
    res.status(500).json({ ok: false, message: 'Something went wrong on our side. Please try again.' });
  });

  return app;
}
