/**
 * Upload checks. A file is accepted only if its extension, its declared type AND its first bytes agree
 * on one of the allowed formats, so a renamed executable or script is rejected.
 */
import path from 'node:path';

const ZIP = [0x50, 0x4b, 0x03, 0x04]; // docx / pptx / xlsx are zip containers
const OLE = [0xd0, 0xcf, 0x11, 0xe0, 0xa1, 0xb1, 0x1a, 0xe1]; // legacy .doc / .ppt / .xls

const TYPES = {
  '.pdf': { magic: [[0x25, 0x50, 0x44, 0x46]], mime: ['application/pdf'] },
  '.png': { magic: [[0x89, 0x50, 0x4e, 0x47]], mime: ['image/png'] },
  '.jpg': { magic: [[0xff, 0xd8, 0xff]], mime: ['image/jpeg', 'image/pjpeg'] },
  '.jpeg': { magic: [[0xff, 0xd8, 0xff]], mime: ['image/jpeg', 'image/pjpeg'] },
  '.webp': { magic: [[0x52, 0x49, 0x46, 0x46]], mime: ['image/webp'] },
  '.docx': { magic: [ZIP], mime: ['application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'application/zip', 'application/octet-stream'] },
  '.pptx': { magic: [ZIP], mime: ['application/vnd.openxmlformats-officedocument.presentationml.presentation', 'application/zip', 'application/octet-stream'] },
  '.xlsx': { magic: [ZIP], mime: ['application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 'application/zip', 'application/octet-stream'] },
  '.doc': { magic: [OLE], mime: ['application/msword', 'application/octet-stream'] },
  '.ppt': { magic: [OLE], mime: ['application/vnd.ms-powerpoint', 'application/octet-stream'] },
  '.xls': { magic: [OLE], mime: ['application/vnd.ms-excel', 'application/octet-stream'] },
};

export const ACCEPT = Object.keys(TYPES).join(',');

const starts = (buf, sig) => sig.every((b, i) => buf[i] === b);

/** Returns null when the file is acceptable, otherwise a short reason. */
export function checkFile(file) {
  const ext = path.extname(file.originalname || '').toLowerCase();
  const t = TYPES[ext];
  if (!t) return 'Only PDF, Word, PowerPoint, Excel, PNG, JPG or WebP files are accepted.';
  if (file.mimetype && !t.mime.includes(file.mimetype)) return 'The file type does not match its name.';
  if (!file.buffer || !t.magic.some((sig) => starts(file.buffer, sig))) return 'The file content does not match its type.';
  return null;
}

/** A safe display name (kept only as metadata; files are stored under random names). */
export const safeName = (name) => path.basename(String(name || 'file')).replace(/[^\w.\- ()]+/g, '_').slice(0, 120);
