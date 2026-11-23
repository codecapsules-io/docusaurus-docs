import test from 'node:test';
import assert from 'node:assert/strict';
import {checkTypes, checkBodies, checkNoOldSlugs} from './verify.mjs';

test('checkTypes: passes a doc in the folder that matches its type', () => {
  assert.deepEqual(checkTypes([
    {path: 'docs/how-to/frontend/react.md', diataxis: 'how-to'},
    {path: 'docs/tutorials/t.md', diataxis: 'tutorial'},
    {path: 'docs/index.md', diataxis: 'how-to'},
  ]), []);
});

test('checkTypes: flags a type in the wrong folder, a missing type and an invalid type', () => {
  const errors = checkTypes([
    {path: 'docs/reference/x.md', diataxis: 'how-to'},
    {path: 'docs/how-to/y.md'},
    {path: 'docs/how-to/z.md', diataxis: 'hub'},
  ]);
  assert.equal(errors.length, 3);
  assert.match(errors[0], /docs\/reference\/x\.md/);
});

const fm = (body) => `---\nslug: "/a"\n---\n${body}`;

test('checkBodies: passes when only a link target changed', () => {
  assert.deepEqual(checkBodies([{path: 'p.md', before: fm('See [a](/old).\n'), after: `---\nslug: "/new"\ndiataxis: how-to\n---\nSee [a](/new).\n`}]), []);
});

test('checkBodies: fails when a word changed', () => {
  const errors = checkBodies([{path: 'p.md', before: fm('See [a](/old).\n'), after: fm('See [b](/old).\n')}]);
  assert.equal(errors.length, 1);
});

test('checkNoOldSlugs: flags a link to a slug that no longer exists', () => {
  const errors = checkNoOldSlugs([{path: 'docs/a.md', text: 'See [x](/frontend/react/#a).'}], ['/frontend/react']);
  assert.equal(errors.length, 1);
  assert.match(errors[0], /docs\/a\.md/);
  assert.deepEqual(checkNoOldSlugs([{path: 'docs/a.md', text: 'See [x](/how-to/frontend/react).'}], ['/frontend/react']), []);
});
