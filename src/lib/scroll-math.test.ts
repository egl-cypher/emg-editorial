import { test } from 'node:test';
import assert from 'node:assert/strict';
import { restProgress, triggerRange } from './scroll-math.ts';

test('through range spans top-hits-bottom to bottom-leaves-top', () => {
  assert.deepEqual(triggerRange('through'), { start: 'top bottom', end: 'bottom top' });
});

test('pin range spans top-hits-top to bottom-hits-bottom', () => {
  assert.deepEqual(triggerRange('pin'), { start: 'top top', end: 'bottom bottom' });
});

test('enter range spans top-hits-bottom to top-hits-top', () => {
  assert.deepEqual(triggerRange('enter'), { start: 'top bottom', end: 'top top' });
});

test('reduced-motion rest progress per mode', () => {
  assert.equal(restProgress('pin'), 0);
  assert.equal(restProgress('through'), 0.5);
  assert.equal(restProgress('enter'), 1);
});
