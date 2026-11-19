import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join } from 'node:path';

// Ink (`white` token) below 60% opacity on paper is under 4.5:1 (60% = 4.63:1).
// Placeholders are exempt because every field has a visible label. /30 and below are kept only for
// decorative marks (chevron icons, the large outline numerals, dimmed siblings during a hover).
const LOW = /(?<!placeholder:)\btext-white\/(?:3[5-9]|4\d|5\d)\b/g;

function files(dir: string): string[] {
  return readdirSync(dir).flatMap((f) => {
    const p = join(dir, f);
    return statSync(p).isDirectory() ? files(p) : p.endsWith('.tsx') ? [p] : [];
  });
}

test('no text set in ink below 60% opacity (WCAG AA on paper)', () => {
  const hits = files('src').flatMap((f) =>
    [...readFileSync(f, 'utf8').matchAll(LOW)].map((m) => `${f}: ${m[0]}`),
  );
  assert.deepEqual(hits, []);
});
