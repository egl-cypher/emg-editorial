# Exclusive Multimedia Group (EMG) — Corporate Website

React + TypeScript + Vite + Tailwind CSS v4 + lucide-react.
The design language comes from the NovaAI reference: a scroll-scrubbed cinematic video,
frosted glass, Inter, and mono labels. It is rebuilt for EMG's content and adds one warm amber accent.

```bash
npm install
npm run dev      # http://localhost:5199
npm run build    # production build in /dist
```

## Where things live
| What | File |
|---|---|
| All website copy (verbatim from EMG's content doc) | `src/data/site.ts` |
| Contact details, WhatsApp, form endpoint | `src/data/site.ts` → `CONTACT` |
| Background video / poster / logo | `src/assets.ts` |
| Design tokens (colours, fonts, motion) | `src/index.css` (`@theme`) |
| UI primitives (Badge, Button, IndexRow, Panel…) | `src/components/ui.tsx` |
| Forms (enquiry, 4-step proposal, partnership/careers) | `src/components/Forms.tsx` |
| Routes | `src/App.tsx` |
| Living design-system reference | `/design-system` page |

## Routes
`/` · `/about` · `/services` · `/services/:division` (7) · `/services/:division/:service` (42) ·
`/work` · `/industries` · `/insights` · `/contact` · `/request-a-proposal` (`?service=<division-slug>` preselects) ·
`/partnerships` · `/careers` · `/privacy-policy` · `/terms-of-service` · `/cookie-policy` · `/design-system`

The site uses History-API routing. On the host, rewrite all paths to `index.html`
(Netlify `_redirects`: `/* /index.html 200`; Vercel does this by default for Vite SPAs).

## Before launch (from the content brief)
- [ ] **Phone numbers conflict:** the Contact section lists +231 772 350 783 / 776 921 583; the Footer lists +231 777 019 200 / 776 921 583.
- [ ] **Official email address** → `CONTACT.email`
- [ ] **WhatsApp number** → `CONTACT.whatsapp` (enables the WhatsApp button)
- [ ] **Form backend** → `CONTACT.formEndpoint` (until it's set, forms show the confirmation message without sending anything)
- [ ] **EMG showreel** → `HERO_VIDEO`; best structured Create → Capture → Connect; serve with CORS or from `/public`
- [ ] **Logo** → `LOGO_SRC`
- [ ] **Verified projects / posts / team profiles / testimonials** → `PROJECTS`, `POSTS` (slots show "Awaiting verified content" until filled)
- [ ] **Legal text** for Privacy, Terms and Cookie pages
- [ ] Budget ranges on the proposal form are in US$. Adjust if needed.

## Forms backend (`server/`)

A small Node.js server (Express) receives the four website forms and also serves the built site, so the
whole site runs as one Node app (e.g. a Hostinger Node.js website).

| Form (page) | Endpoint | Files |
|---|---|---|
| Enquiry (Contact) | `POST /api/forms/enquiry` | `attachment`, optional |
| Proposal (Request a Proposal) | `POST /api/forms/proposal` | `documents`, optional |
| Careers registration (Careers) | `POST /api/forms/careers` | `file` (CV), required |
| Partnership registration (Partnerships) | `POST /api/forms/partnership` | `file`, optional |

- Validation per form (`server/schemas.mjs`), honeypot field, rate limit per IP (default 6 per 10 min).
- Uploads: PDF, Word, PowerPoint, Excel, PNG, JPG, WebP; checked by extension, type and file signature;
  10 MB each, max 5; stored under random names.
- Storage: `data/submissions.jsonl` + `data/uploads/<id>/` (set `DATA_DIR`; back it up; it is git-ignored).
- Email: team notification (with files) and optional acknowledgement via SMTP (`.env`). Without SMTP the
  server still stores everything.
- Admin (set `ADMIN_TOKEN`): `GET /api/admin/submissions`, `/api/admin/submissions.csv`,
  `/api/admin/files/<id>/<file>` with `Authorization: Bearer <token>`.

```bash
cp .env.example .env   # then fill in SMTP, NOTIFY_TO, ADMIN_TOKEN
npm run api            # form server on :8787 (the dev site proxies /api to it)
npm run dev            # site on :5399
npm test               # site + server tests
npm run build && npm start   # production: site + API on PORT
```
