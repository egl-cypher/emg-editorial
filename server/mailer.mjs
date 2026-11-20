/**
 * Email: a notification to the EMG team for every submission (files attached when small enough) and an
 * optional acknowledgement to the sender. Without SMTP settings it does nothing, and a mail failure never
 * loses a submission: it is stored first, then mailed.
 */
import nodemailer from 'nodemailer';

const LABELS = {
  name: 'Name', organisation: 'Organisation / role', email: 'Email', phone: 'Telephone', country: 'Country',
  location: 'Project location', service: 'Service', title: 'Project title', description: 'Project description',
  objectives: 'Objectives', deliverables: 'Deliverables', start: 'Preferred start', end: 'Preferred completion',
  timeline: 'Timeline', budget: 'Budget', additional: 'Additional requirements', contactMethod: 'Preferred contact',
  link: 'Link', areas: 'Areas', message: 'Message',
};

const MAX_ATTACH = 15 * 1024 * 1024;

export function createMailer(env) {
  if (!env.SMTP_HOST || !env.NOTIFY_TO) return null;
  const transport = nodemailer.createTransport({
    host: env.SMTP_HOST,
    port: Number(env.SMTP_PORT || 465),
    secure: String(env.SMTP_SECURE ?? (Number(env.SMTP_PORT || 465) === 465)) === 'true',
    auth: env.SMTP_USER ? { user: env.SMTP_USER, pass: env.SMTP_PASS } : undefined,
  });
  const from = env.MAIL_FROM || env.SMTP_USER;

  return {
    async notify(record, formLabel, files) {
      const lines = Object.entries(record.fields).map(([k, v]) => `${LABELS[k] || k}: ${Array.isArray(v) ? v.join(', ') : v}`);
      if (record.files.length) lines.push('', `Files: ${record.files.map((f) => `${f.name} (${Math.round(f.size / 1024)} KB)`).join(', ')}`);
      lines.push('', `Reference: ${record.id}`, `Received: ${record.receivedAt}`);
      let total = 0;
      const attachments = [];
      for (const f of files) {
        total += f.size;
        if (total > MAX_ATTACH) break;
        attachments.push({ filename: f.safeName, content: f.buffer, contentType: f.mimetype });
      }
      await transport.sendMail({
        from,
        to: env.NOTIFY_TO,
        replyTo: record.fields.email,
        subject: `[EMG website] ${formLabel} from ${record.fields.name}`,
        text: lines.join('\n'),
        attachments,
      });
    },
    async acknowledge(record, formLabel) {
      if (String(env.ACK_EMAIL) !== 'true') return;
      await transport.sendMail({
        from,
        to: record.fields.email,
        subject: 'We received your message: Exclusive Multimedia Group',
        text: [
          `Hello ${record.fields.name},`,
          '',
          `Thank you for contacting Exclusive Multimedia Group. We have received your ${formLabel.toLowerCase()} and our team will review it and get back to you.`,
          '',
          `Your reference: ${record.id}`,
          '',
          'Exclusive Multimedia Group (EMG)',
        ].join('\n'),
      });
    },
  };
}
