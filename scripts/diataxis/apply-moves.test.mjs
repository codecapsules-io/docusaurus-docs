import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import {applyMoves, writeLandingPages} from './apply-moves.mjs';
import {parseDoc} from './lib/frontmatter.mjs';

async function fixture(files) {
  const root = await fs.mkdtemp(path.join(os.tmpdir(), 'dx-'));
  for (const [p, text] of Object.entries(files)) {
    await fs.mkdir(path.dirname(path.join(root, p)), {recursive: true});
    await fs.writeFile(path.join(root, p), text);
  }
  return root;
}
const doc = (slug, body) => `---\nslug: "${slug}"\ntitle: "T"\n---\n${body}`;
const exists = (root, p) => fs.access(path.join(root, p)).then(() => true, () => false);
const read = (root, p) => fs.readFile(path.join(root, p), 'utf8');

const moves = [
  {oldPath: 'docs/frontend/react.md', oldSlug: '/frontend/react', type: 'how-to', newPath: 'docs/how-to/frontend/react.md', newSlug: '/how-to/frontend/react'},
  {oldPath: 'docs/tutorials/t.md', oldSlug: '/tutorials/t', type: 'tutorial', newPath: 'docs/tutorials/t.md', newSlug: '/tutorials/t'},
  {oldPath: 'release-notes/a.md', oldSlug: null, type: 'release-notes', newPath: 'release-notes/a.md', newSlug: null},
];

test('applyMoves: moves the file, updates slug and diataxis, keeps the body byte-identical', async () => {
  const body = '\n# React\n\nSee [x](/a).\n';
  const root = await fixture({
    'docs/frontend/react.md': doc('/frontend/react', body),
    'docs/tutorials/t.md': doc('/tutorials/t', 'Tut\n'),
    'release-notes/a.md': doc('/release-notes/a', 'RN\n'),
  });
  const rn = await read(root, 'release-notes/a.md');
  await applyMoves(root, moves);
  assert.equal(await exists(root, 'docs/frontend/react.md'), false);
  const moved = parseDoc(await read(root, 'docs/how-to/frontend/react.md'));
  assert.equal(moved.frontmatter.slug, '/how-to/frontend/react');
  assert.equal(moved.frontmatter.diataxis, 'how-to');
  assert.equal(moved.body, body);
  assert.equal(parseDoc(await read(root, 'docs/tutorials/t.md')).frontmatter.diataxis, 'tutorial');
  assert.equal(await read(root, 'release-notes/a.md'), rn);
});

test('applyMoves: running twice changes nothing', async () => {
  const root = await fixture({
    'docs/frontend/react.md': doc('/frontend/react', 'B\n'),
    'docs/tutorials/t.md': doc('/tutorials/t', 'Tut\n'),
    'release-notes/a.md': doc('/release-notes/a', 'RN\n'),
  });
  await applyMoves(root, moves);
  const once = await read(root, 'docs/how-to/frontend/react.md');
  await applyMoves(root, moves);
  assert.equal(await read(root, 'docs/how-to/frontend/react.md'), once);
});

test('writeLandingPages: writes how-to, reference, explanation; leaves an existing tutorials hub alone', async () => {
  const hub = doc('/tutorials', 'Hub\n');
  const root = await fixture({'docs/tutorials/index.md': hub});
  await writeLandingPages(root);
  for (const [dir, type] of [['how-to', 'how-to'], ['reference', 'reference'], ['explanation', 'explanation']]) {
    const {frontmatter, body} = parseDoc(await read(root, `docs/${dir}/index.md`));
    assert.equal(frontmatter.slug, `/${dir}`);
    assert.equal(frontmatter.diataxis, type);
    assert.match(body, /DocCardList/);
  }
  assert.equal(parseDoc(await read(root, 'docs/tutorials/index.md')).body, 'Hub\n');
  assert.equal(parseDoc(await read(root, 'docs/tutorials/index.md')).frontmatter.sidebar_position, '0');
  assert.equal(parseDoc(await read(root, 'docs/how-to/index.md')).frontmatter.sidebar_position, '0');
  const again = await read(root, 'docs/tutorials/index.md');
  await writeLandingPages(root);
  assert.equal(await read(root, 'docs/tutorials/index.md'), again);
});

test('writeLandingPages: refuses to overwrite a different doc at a landing path', async () => {
  const root = await fixture({'docs/how-to/index.md': doc('/something-else', 'X\n')});
  await assert.rejects(() => writeLandingPages(root), /landing/i);
});
