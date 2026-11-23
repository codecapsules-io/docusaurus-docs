import test from 'node:test';
import assert from 'node:assert/strict';
import {loadLabels, resolveType, newLocation, planMoves} from './plan-moves.mjs';
import {parseDoc, setFrontmatter} from './lib/frontmatter.mjs';

test('newLocation: framework guide keeps its area under how-to', () => {
  assert.deepEqual(newLocation('docs/frontend/react.md', 'how-to'), {
    newPath: 'docs/how-to/frontend/react.md',
    newSlug: '/how-to/frontend/react',
  });
});

test('newLocation: products/ prefix is dropped', () => {
  const r = newLocation('docs/products/backend-capsule/supported-runtimes.md', 'reference');
  assert.equal(r.newPath, 'docs/reference/backend-capsule/supported-runtimes.md');
  assert.equal(r.newSlug, '/reference/backend-capsule/supported-runtimes');
});

test('newLocation: non-tutorial from tutorials/ goes to guides/', () => {
  assert.equal(
    newLocation('docs/tutorials/heroku-migration-guide.md', 'how-to').newPath,
    'docs/how-to/guides/heroku-migration-guide.md',
  );
});

test('newLocation: tutorial from tutorials/ keeps its path', () => {
  assert.deepEqual(newLocation('docs/tutorials/build-a-mern-job-board.md', 'tutorial'), {
    newPath: 'docs/tutorials/build-a-mern-job-board.md',
    newSlug: '/tutorials/build-a-mern-job-board',
  });
});

test('newLocation: index.md slug drops /index', () => {
  assert.equal(newLocation('docs/database/mongodb/index.md', 'how-to').newSlug, '/how-to/database/mongodb');
});

test('newLocation: products/index.md goes to how-to/products/index.md', () => {
  assert.equal(newLocation('docs/products/index.md', 'how-to').newPath, 'docs/how-to/products/index.md');
});

test('newLocation: root files are overridden', () => {
  assert.equal(newLocation('docs/wordpress.md', 'how-to').newPath, 'docs/how-to/wordpress-capsule/managed-wordpress.md');
  assert.equal(newLocation('docs/persistent-storage.md', 'how-to').newPath, 'docs/how-to/storage-capsule/persistent-storage.md');
});

test('newLocation: docs/index.md and release notes do not move', () => {
  assert.deepEqual(newLocation('docs/index.md', 'how-to'), {newPath: 'docs/index.md', newSlug: '/'});
  assert.equal(newLocation('release-notes/2025-08-01-2025-08.md', 'release-notes').newPath, 'release-notes/2025-08-01-2025-08.md');
});

test('resolveType: overview is explanation', () => {
  assert.equal(resolveType('docs/enterprise/aws.md', new Map([['docs/enterprise/aws.md', 'overview']])), 'explanation');
});

test('resolveType: hub takes the majority type under its folder', () => {
  const labels = new Map([
    ['docs/x/index.md', 'hub'],
    ['docs/x/a.md', 'reference'], ['docs/x/b.md', 'reference'], ['docs/x/sub/c.md', 'reference'],
    ['docs/x/d.md', 'how-to'],
  ]);
  assert.equal(resolveType('docs/x/index.md', labels), 'reference');
});

test('resolveType: hub tie goes to how-to', () => {
  const labels = new Map([['docs/x/index.md', 'hub'], ['docs/x/a.md', 'reference'], ['docs/x/b.md', 'how-to']]);
  assert.equal(resolveType('docs/x/index.md', labels), 'how-to');
});

test('loadLabels: reads the tables in DIATAXIS.md', () => {
  const md = '## how-to (1)\n\n| Doc | Title |\n|---|---|\n| `docs/a.md` | A |\n\n## hub (1)\n\n| Doc | Title |\n|---|---|\n| `docs/b/index.md` | B |\n';
  assert.deepEqual([...loadLabels(md)], [['docs/a.md', 'how-to'], ['docs/b/index.md', 'hub']]);
});

test('planMoves: two files mapping to one newPath throws', () => {
  const labels = new Map([['docs/products/a.md', 'how-to'], ['docs/a.md', 'how-to']]);
  assert.throws(() => planMoves(labels, new Map()), /collision/i);
});

test('planMoves: no moved file lands on a type landing page, tutorials hub stays put', () => {
  const labels = new Map([
    ['docs/products/index.md', 'hub'], ['docs/products/a.md', 'how-to'],
    ['docs/tutorials/index.md', 'hub'], ['docs/tutorials/t.md', 'tutorial'], ['docs/index.md', 'hub'],
  ]);
  const moves = planMoves(labels, new Map());
  const byOld = Object.fromEntries(moves.map((m) => [m.oldPath, m.newPath]));
  assert.equal(byOld['docs/products/index.md'], 'docs/how-to/products/index.md');
  assert.equal(byOld['docs/tutorials/index.md'], 'docs/tutorials/index.md');
  assert.equal(byOld['docs/index.md'], 'docs/index.md');
  for (const landing of ['docs/how-to/index.md', 'docs/reference/index.md', 'docs/explanation/index.md']) {
    assert.ok(!moves.some((m) => m.newPath === landing));
  }
});

test('setFrontmatter: replaces slug, inserts diataxis after it, leaves the rest alone', () => {
  const src = '---\nslug: "/a"\ntitle: "T"\n---\nBody\n';
  const out = setFrontmatter(src, {slug: '/b', diataxis: 'how-to'});
  assert.equal(out, '---\nslug: "/b"\ndiataxis: how-to\ntitle: "T"\n---\nBody\n');
  assert.equal(setFrontmatter(out, {slug: '/b', diataxis: 'how-to'}), out);
});

test('parseDoc: returns frontmatter values and the exact body', () => {
  const {frontmatter, body} = parseDoc('---\nslug: "/a"\ntitle: "T"\n---\n\nBody\n');
  assert.equal(frontmatter.slug, '/a');
  assert.equal(frontmatter.title, 'T');
  assert.equal(body, '\nBody\n');
});
