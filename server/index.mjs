/**
 * Starts the EMG website server. Settings come from environment variables, or a .env file in the project
 * root (see .env.example).
 *
 *   npm run api      # API only on PORT (default 8787); `npm run dev` proxies /api to it
 *   npm start        # API + the built site from dist/ (run `npm run build` first)
 */
import path from 'node:path';
import { existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { createApp } from './app.mjs';
import { createMailer } from './mailer.mjs';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
if (existsSync(path.join(root, '.env'))) process.loadEnvFile(path.join(root, '.env'));
const env = process.env;

if (env.ADMIN_TOKEN && env.ADMIN_TOKEN.length < 24) {
  console.error('ADMIN_TOKEN must be at least 24 characters. Admin routes stay disabled.');
  env.ADMIN_TOKEN = '';
}

const mailer = createMailer(env);
const app = createApp({
  dataDir: path.resolve(root, env.DATA_DIR || 'data'),
  distDir: env.SERVE_SITE === 'false' ? null : path.join(root, 'dist'),
  mailer,
  adminToken: env.ADMIN_TOKEN || '',
  allowedOrigins: (env.ALLOWED_ORIGINS || '').split(',').map((s) => s.trim()).filter(Boolean),
  rate: { max: Number(env.RATE_MAX || 6), windowMs: Number(env.RATE_WINDOW_MIN || 10) * 60 * 1000 },
  trustProxy: env.TRUST_PROXY ? Number(env.TRUST_PROXY) || env.TRUST_PROXY : 1,
});

const port = Number(env.PORT || 8787);
app.listen(port, () => {
  console.log(`EMG server on http://localhost:${port}  ·  email ${mailer ? 'on' : 'off (no SMTP settings)'}  ·  admin ${env.ADMIN_TOKEN ? 'on' : 'off'}`);
});
