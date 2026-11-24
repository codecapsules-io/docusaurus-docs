import test from 'node:test';
import assert from 'node:assert/strict';
import {checkTypes, checkBodies, checkNoOldSlugs, checkSplit} from './verify.mjs';

test('checkTypes: passes a doc in the folder that matches its type', () => {
  assert.deepEqual(checkTypes([
    {path: 'docs/how-to/frontend/react.md', diataxis: 'how-to'},
    {path: 'docs/tutorials/t.md', diataxis: 'tutorial'},
    {path: 'docs/index.md', diataxis: 'how-to'},
  ]), []);
});

test('checkTypes: index pages live under docs/indexes/', () => {
  assert.deepEqual(checkTypes([{path: 'docs/indexes/backend-guides.md', diataxis: 'index'}]), []);
  assert.equal(checkTypes([{path: 'docs/how-to/x.md', diataxis: 'index'}]).length, 1);
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

const page = (body) => `---\nslug: "/x"\n---\n${body}`;

test('checkSplit: passes when every original line survives in some part, allowing added lines and link-target changes', () => {
  const before = page('# T\n\nIntro line.\n\n## A\n\nSee [x](#a).\n\n## B\n\n| a | b |\n');
  const parts = [
    page('# T\n\nIntro line.\n\nNew cross link.\n\n## A\n\nSee [x](/other/#a).\n'),
    page('# Ref\n\n## B\n\n|   a   |  b  |\n'),
  ];
  assert.deepEqual(checkSplit(before, parts), []);
});

test('checkSplit: reports an original line that no part contains', () => {
  const before = page('# T\n\nKeep me.\n\nLose me.\n');
  const missing = checkSplit(before, [page('# T\n\nKeep me.\n')]);
  assert.deepEqual(missing, ['Lose me.']);
});

test('checkSplit: a line listed as deliberately rewritten is not reported', () => {
  const before = page('# T\n\nOld intro that no longer fits.\n\nKeep me.\n');
  const parts = [page('# T\n\nKeep me.\n')];
  assert.deepEqual(checkSplit(before, parts, ['Old intro that no longer fits.']), []);
  assert.deepEqual(checkSplit(before, parts), ['Old intro that no longer fits.']);
});
