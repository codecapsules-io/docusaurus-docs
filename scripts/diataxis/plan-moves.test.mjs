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
  assert.equal(r.newPath, 'docs/reference/capsules/backend/supported-runtimes.md');
  assert.equal(r.newSlug, '/reference/capsules/backend/supported-runtimes');
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
  assert.equal(newLocation('docs/wordpress.md', 'how-to').newPath, 'docs/how-to/capsules/wordpress/managed-wordpress.md');
  assert.equal(newLocation('docs/persistent-storage.md', 'how-to').newPath, 'docs/how-to/capsules/storage/persistent-storage.md');
});

test('newLocation: the GitBook readme folder is dropped', () => {
  assert.equal(newLocation('docs/cli/readme/commands/login.md', 'reference').newPath, 'docs/reference/cli/commands/login.md');
  assert.equal(newLocation('docs/cli/readme/getting-started/quick-start.md', 'tutorial').newPath, 'docs/tutorials/cli/getting-started/quick-start.md');
  assert.equal(newLocation('docs/cli/readme/global-options.md', 'reference').newSlug, '/reference/cli/global-options');
});

test('newLocation: versions/upgrades collapses to upgrades, versions.md is untouched', () => {
  assert.equal(
    newLocation('docs/products/database-capsule/mongodb/versions/upgrades/7-0-to-8-0.md', 'how-to').newPath,
    'docs/how-to/capsules/database/mongodb/upgrades/7-0-to-8-0.md',
  );
  assert.equal(
    newLocation('docs/products/database-capsule/mysql/versions/upgrades/index.md', 'how-to').newSlug,
    '/how-to/capsules/database/mysql/upgrades',
  );
  assert.equal(newLocation('docs/products/database-capsule/mongodb/versions.md', 'reference').newPath, 'docs/reference/capsules/database/mongodb/versions.md');
});

test('newLocation: the platform/ wrapper is dropped for its areas, kept for the section hub and overview pages', () => {
  assert.equal(newLocation('docs/platform/teams/how-do-i-add-team-members.md', 'how-to').newPath, 'docs/how-to/teams/how-do-i-add-team-members.md');
  assert.equal(newLocation('docs/platform/billing/how-does-the-pricing-work.md', 'reference').newPath, 'docs/reference/billing/how-does-the-pricing-work.md');
  assert.equal(newLocation('docs/platform/index.md', 'how-to').newPath, 'docs/how-to/platform/index.md');
  assert.equal(newLocation('docs/platform/platform.md', 'explanation').newPath, 'docs/explanation/platform/overview.md');
  assert.equal(newLocation('docs/platform/what-is-code-capsules.md', 'explanation').newPath, 'docs/explanation/platform/what-is-code-capsules.md');
});

test('newLocation: every capsule type moves under capsules/ without the -capsule suffix', () => {
  for (const [type, folder] of [['agent', 'agent'], ['backend', 'backend'], ['database', 'database'], ['docker', 'docker'], ['frontend', 'frontend'], ['storage', 'storage'], ['wordpress', 'wordpress']]) {
    assert.equal(
      newLocation(`docs/products/${type}-capsule/configure.md`, 'how-to').newPath,
      `docs/how-to/capsules/${folder}/configure.md`,
    );
  }
  assert.equal(newLocation('docs/products/backend-capsule/index.md', 'how-to').newSlug, '/how-to/capsules/backend');
});

test('newLocation: backend framework guides go under capsules/backend/guides/', () => {
  assert.equal(newLocation('docs/backend/python/django.md', 'how-to').newPath, 'docs/how-to/capsules/backend/guides/python/django.md');
  assert.equal(newLocation('docs/backend/java.md', 'how-to').newSlug, '/how-to/capsules/backend/guides/java');
  assert.equal(newLocation('docs/backend/index.md', 'how-to').newSlug, '/how-to/capsules/backend/guides');
  assert.equal(newLocation('docs/products/backend-capsule/index.md', 'how-to').newSlug, '/how-to/capsules/backend');
});

test('newLocation: platform capsule pages share the capsules/ folder', () => {
  assert.equal(newLocation('docs/platform/capsules/health-checks.md', 'how-to').newPath, 'docs/how-to/capsules/health-checks.md');
});

test('planMoves: backend guides hub and backend capsule hub do not collide', () => {
  const labels = new Map([['docs/backend/index.md', 'hub'], ['docs/backend/java.md', 'how-to'], ['docs/products/backend-capsule/index.md', 'hub'], ['docs/products/backend-capsule/configure.md', 'how-to']]);
  const moves = planMoves(labels, new Map());
  assert.equal(new Set(moves.map((m) => m.newPath)).size, 4);
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
