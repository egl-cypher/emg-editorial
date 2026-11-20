/**
 * Form schemas: one per website form. Field names match the inputs in src/components/Forms.tsx.
 * Each rule: { required?, max?, type?: 'email' | 'url' | 'date' | 'list', oneOf?, maxItems? }
 * Files: { field, required?, max } (max = number of files for that field).
 */

const DIVISIONS = [
  'Events & Experiences',
  'Media Production',
  'Digital Solutions & Technology',
  'Branding & Creative Communications',
  'AI, Automation & Innovation',
  'Training & Professional Development',
  'Corporate & Business Support',
];

const contact = {
  name: { required: true, max: 120 },
  email: { required: true, type: 'email', max: 160 },
  phone: { max: 40 },
  country: { max: 80 },
};

export const FORMS = {
  enquiry: {
    label: 'Website enquiry',
    fields: {
      ...contact,
      organisation: { max: 160 },
      service: { max: 160 },
      description: { required: true, max: 5000 },
      timeline: { max: 200 },
      budget: { max: 120 },
      contactMethod: { oneOf: ['Email', 'Phone call', 'WhatsApp'] },
    },
    files: { field: 'attachment', max: 5 },
  },
  proposal: {
    label: 'Proposal request',
    fields: {
      ...contact,
      organisation: { required: true, max: 160 },
      phone: { required: true, max: 40 },
      country: { required: true, max: 80 },
      location: { max: 200 },
      service: { required: true, oneOf: DIVISIONS },
      title: { required: true, max: 200 },
      objectives: { required: true, max: 5000 },
      deliverables: { max: 3000 },
      start: { type: 'date' },
      end: { type: 'date' },
      budget: { max: 120 },
      additional: { max: 3000 },
    },
    files: { field: 'documents', max: 5 },
  },
  careers: {
    label: 'Careers registration',
    fields: {
      ...contact,
      organisation: { max: 160 }, // "Current role or title"
      link: { type: 'url', max: 300 },
      areas: { type: 'list', maxItems: 12, max: 80 },
      message: { required: true, max: 5000 },
    },
    files: { field: 'file', required: true, max: 3 },
  },
  partnership: {
    label: 'Partnership registration',
    fields: {
      ...contact,
      organisation: { required: true, max: 160 },
      link: { type: 'url', max: 300 },
      areas: { type: 'list', maxItems: 12, max: 80 },
      message: { required: true, max: 5000 },
    },
    files: { field: 'file', max: 3 },
  },
};

export const HONEYPOT = 'company_website';

const EMAIL = /^[^\s@<>()[\]\\,;:"]+@[^\s@<>()[\]\\,;:"]+\.[^\s@<>()[\]\\,;:"]{2,}$/;
const DATE = /^\d{4}-\d{2}-\d{2}$/;

const clean = (v) => String(v).replace(/\u0000/g, '').trim();

/** Validates a multer `req.body` against a form schema. Returns { data, errors }. */
export function validate(form, body) {
  const data = {};
  const errors = {};
  for (const [name, rule] of Object.entries(form.fields)) {
    const raw = body[name];
    if (rule.type === 'list') {
      const list = (Array.isArray(raw) ? raw : raw == null || raw === '' ? [] : [raw]).map(clean).filter(Boolean);
      if (list.length > rule.maxItems) errors[name] = `Choose at most ${rule.maxItems}.`;
      else if (list.some((v) => v.length > rule.max)) errors[name] = 'One of the choices is too long.';
      else data[name] = list;
      continue;
    }
    const value = raw == null ? '' : clean(Array.isArray(raw) ? raw[0] : raw);
    if (!value) {
      if (rule.required) errors[name] = 'This field is required.';
      continue;
    }
    if (rule.max && value.length > rule.max) errors[name] = `Keep this under ${rule.max} characters.`;
    else if (rule.type === 'email' && !EMAIL.test(value)) errors[name] = 'Enter a valid email address.';
    else if (rule.type === 'url' && !isHttpUrl(value)) errors[name] = 'Enter a full link starting with http:// or https://.';
    else if (rule.type === 'date' && (!DATE.test(value) || Number.isNaN(Date.parse(value)))) errors[name] = 'Enter a valid date.';
    else if (rule.oneOf && !rule.oneOf.includes(value)) errors[name] = 'Choose one of the listed options.';
    else data[name] = value;
  }
  if (data.start && data.end && data.end < data.start) errors.end = 'The completion date is before the start date.';
  return { data, errors };
}

function isHttpUrl(v) {
  try {
    const u = new URL(v);
    return u.protocol === 'http:' || u.protocol === 'https:';
  } catch {
    return false;
  }
}
