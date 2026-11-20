import { test, before, after } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { createApp } from './app.mjs';
import { FORMS } from './schemas.mjs';

const TOKEN = 'test-admin-token-0123456789abcdef';
const mail = [];
const mailer = { notify: async (r, label, files) => mail.push({ kind: 'notify', id: r.id, label, files: files.length }), acknowledge: async (r) => mail.push({ kind: 'ack', id: r.id }) };
let dir, server, base, strictServer, strictBase;
const quiet = { info() {}, error() {} };

before(async () => {
  dir = await fs.mkdtemp(path.join(os.tmpdir(), 'emg-forms-'));
  server = createApp({ dataDir: dir, mailer, adminToken: TOKEN, rate: { max: 1000, windowMs: 60000 }, log: quiet }).listen(0);
  base = `http://127.0.0.1:${server.address().port}`;
  strictServer = createApp({ dataDir: path.join(dir, 'strict'), rate: { max: 2, windowMs: 60000 }, log: quiet }).listen(0);
  strictBase = `http://127.0.0.1:${strictServer.address().port}`;
});
after(async () => {
  server.close();
  strictServer.close();
  await fs.rm(dir, { recursive: true, force: true });
});

const fd = (fields, files = []) => {
  const f = new FormData();
  for (const [k, v] of Object.entries(fields)) for (const one of [].concat(v)) f.append(k, one);
  for (const [field, name, bytes, type] of files) f.append(field, new Blob([bytes], { type }), name);
  return f;
};
const post = (kind, body, b = base) => fetch(`${b}/api/forms/${kind}`, { method: 'POST', body, headers: { Accept: 'application/json' } });
const PDF = new Uint8Array([0x25, 0x50, 0x44, 0x46, 0x2d, 0x31, 0x2e, 0x37, 0x0a]);
const enquiry = { name: 'Ama Mensah', email: 'ama@example.com', description: 'Livestream for a two-day summit in Monrovia.', contactMethod: 'Email', country: 'Liberia' };

test('health check', async () => {
  const r = await fetch(`${base}/api/health`);
  assert.equal(r.status, 200);
  assert.deepEqual(await r.json(), { ok: true });
});

test('valid enquiry is stored and the team is notified', async () => {
  const r = await post('enquiry', fd(enquiry));
  const j = await r.json();
  assert.equal(r.status, 200, JSON.stringify(j));
  assert.ok(j.ok && /^\d{8}-[a-f0-9]{10}$/.test(j.id));
  const log = await fs.readFile(path.join(dir, 'submissions.jsonl'), 'utf8');
  const rec = JSON.parse(log.trim().split('\n').at(-1));
  assert.equal(rec.form, 'enquiry');
  assert.equal(rec.fields.name, 'Ama Mensah');
  await new Promise((res) => setTimeout(res, 20));
  assert.ok(mail.some((m) => m.kind === 'notify' && m.id === j.id && m.label === 'Website enquiry'));
});

test('missing required fields come back as field errors', async () => {
  const r = await post('enquiry', fd({ phone: '123' }));
  const j = await r.json();
  assert.equal(r.status, 400);
  assert.deepEqual(Object.keys(j.errors).sort(), ['description', 'email', 'name']);
});

test('bad email, bad choice and over-long text are rejected', async () => {
  const r = await post('enquiry', fd({ ...enquiry, email: 'not-an-email', contactMethod: 'Fax', description: 'x'.repeat(5001) }));
  const j = await r.json();
  assert.equal(r.status, 400);
  assert.ok(j.errors.email && j.errors.contactMethod && j.errors.description);
});

test('unknown form kind is a 404', async () => {
  assert.equal((await post('newsletter', fd(enquiry))).status, 404);
});

test('honeypot submissions look accepted but are not stored', async () => {
  const before = (await fs.readFile(path.join(dir, 'submissions.jsonl'), 'utf8')).length;
  const r = await post('enquiry', fd({ ...enquiry, company_website: 'http://spam.example' }));
  assert.equal(r.status, 200);
  const afterLen = (await fs.readFile(path.join(dir, 'submissions.jsonl'), 'utf8')).length;
  assert.equal(afterLen, before);
});

test('proposal: service must be one of the seven divisions; dates must be in order', async () => {
  const base_ = { name: 'K', organisation: 'Org', email: 'k@example.org', phone: '+231 77 000 0000', country: 'Ghana', title: 'Launch', objectives: 'Brand launch' };
  let r = await post('proposal', fd({ ...base_, service: 'Plumbing' }));
  assert.equal(r.status, 400);
  assert.ok((await r.json()).errors.service);
  r = await post('proposal', fd({ ...base_, service: 'Media Production', start: '2027-05-10', end: '2027-05-01' }));
  assert.ok((await r.json()).errors.end);
  r = await post('proposal', fd({ ...base_, service: 'Media Production', start: '2027-05-01', end: '2027-05-10' }, [['documents', 'brief.pdf', PDF, 'application/pdf']]));
  assert.equal(r.status, 200);
});

test('careers needs a CV; a real PDF is stored, an executable or a renamed file is refused', async () => {
  const cv = { name: 'Jo', email: 'jo@example.com', message: 'Video editor, 5 years.', areas: ['Media Production', 'Digital Solutions'] };
  let r = await post('careers', fd(cv));
  assert.ok((await r.json()).errors.file, 'CV required');
  r = await post('careers', fd(cv, [['file', 'cv.exe', new Uint8Array([0x4d, 0x5a]), 'application/octet-stream']]));
  assert.equal(r.status, 400);
  r = await post('careers', fd(cv, [['file', 'cv.pdf', new Uint8Array([0x4d, 0x5a, 0x90]), 'application/pdf']]));
  assert.match((await r.json()).errors.file, /content does not match/);
  r = await post('careers', fd(cv, [['file', 'cv.pdf', PDF, 'application/pdf']]));
  const j = await r.json();
  assert.equal(r.status, 200, JSON.stringify(j));
  const rec = (await (await fetch(`${base}/api/admin/submissions?form=careers`, { headers: { Authorization: `Bearer ${TOKEN}` } })).json()).submissions[0];
  assert.deepEqual(rec.fields.areas, ['Media Production', 'Digital Solutions']);
  assert.equal(rec.files.length, 1);
  assert.equal(rec.files[0].name, 'cv.pdf');
  assert.notEqual(rec.files[0].storedName, 'cv.pdf', 'stored under a random name');
});

test('files on the wrong field are refused', async () => {
  const r = await post('enquiry', fd(enquiry, [['documents', 'a.pdf', PDF, 'application/pdf']]));
  assert.equal(r.status, 400);
});

test('admin routes need the token; list, CSV and file download work with it', async () => {
  assert.equal((await fetch(`${base}/api/admin/submissions`)).status, 401);
  assert.equal((await fetch(`${base}/api/admin/submissions`, { headers: { Authorization: 'Bearer wrong' } })).status, 401);
  const auth = { headers: { Authorization: `Bearer ${TOKEN}` } };
  const list = await (await fetch(`${base}/api/admin/submissions`, auth)).json();
  assert.ok(list.submissions.length >= 3);
  const csv = await (await fetch(`${base}/api/admin/submissions.csv`, auth)).text();
  assert.match(csv, /"id","form","receivedAt"/);
  const withFile = list.submissions.find((s) => s.files.length);
  const f = await fetch(`${base}/api/admin/files/${withFile.id}/${withFile.files[0].storedName}`, auth);
  assert.equal(f.status, 200);
  assert.equal((await f.arrayBuffer()).byteLength, PDF.byteLength);
  assert.equal((await fetch(`${base}/api/admin/files/${withFile.id}/..%2F..%2Fsubmissions.jsonl`, auth)).status, 404);
});

test('admin is disabled entirely without a token', async () => {
  assert.equal((await fetch(`${strictBase}/api/admin/submissions`)).status, 404);
});

test('rate limit answers 429 after the allowance', async () => {
  const codes = [];
  for (let i = 0; i < 3; i++) codes.push((await post('enquiry', fd(enquiry), strictBase)).status);
  assert.deepEqual(codes, [200, 200, 429]);
});

test('proposal service list matches the division titles in src/data/site.ts', async () => {
  const site = await fs.readFile(new URL('../src/data/site.ts', import.meta.url), 'utf8');
  const block = site.slice(site.indexOf('export const DIVISIONS'));
  const titles = [...block.matchAll(/\n    title: '([^']+)'/g)].map((m) => m[1]).slice(0, 7);
  assert.deepEqual(FORMS.proposal.fields.service.oneOf, titles);
});
