/**
 * File-based storage: one JSON line per submission in <dataDir>/submissions.jsonl and uploads in
 * <dataDir>/uploads/<id>/<random>.<ext>. No database or native modules, so it runs on any Node host.
 */
import fs from 'node:fs/promises';
import { createReadStream, existsSync } from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import readline from 'node:readline';

export function createStorage(dataDir) {
  const log = path.join(dataDir, 'submissions.jsonl');
  const uploads = path.join(dataDir, 'uploads');

  async function save({ form, fields, files }) {
    const id = `${new Date().toISOString().slice(0, 10).replace(/-/g, '')}-${crypto.randomBytes(5).toString('hex')}`;
    const stored = [];
    if (files.length) {
      const dir = path.join(uploads, id);
      await fs.mkdir(dir, { recursive: true });
      for (const f of files) {
        const ext = path.extname(f.originalname).toLowerCase();
        const storedName = `${crypto.randomBytes(8).toString('hex')}${ext}`;
        await fs.writeFile(path.join(dir, storedName), f.buffer, { mode: 0o600 });
        stored.push({ field: f.fieldname, name: f.safeName, storedName, size: f.size, type: f.mimetype });
      }
    }
    const record = { id, form, receivedAt: new Date().toISOString(), fields, files: stored };
    await fs.mkdir(dataDir, { recursive: true });
    await fs.appendFile(log, JSON.stringify(record) + '\n', { mode: 0o600 });
    return record;
  }

  async function list({ form, limit = 500 } = {}) {
    if (!existsSync(log)) return [];
    const out = [];
    const rl = readline.createInterface({ input: createReadStream(log, 'utf8'), crlfDelay: Infinity });
    for await (const line of rl) {
      if (!line.trim()) continue;
      try {
        const r = JSON.parse(line);
        if (!form || r.form === form) out.push(r);
      } catch {
        /* skip a damaged line rather than failing the whole list */
      }
    }
    return out.reverse().slice(0, limit);
  }

  /** Absolute path of an uploaded file, or null if the id/name are not well-formed or missing. */
  function filePath(id, storedName) {
    if (!/^\d{8}-[a-f0-9]{10}$/.test(id) || !/^[a-f0-9]{16}\.[a-z0-9]{2,5}$/.test(storedName)) return null;
    const p = path.join(uploads, id, storedName);
    return existsSync(p) ? p : null;
  }

  return { save, list, filePath };
}
