import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import {buildTree, renderList, renderIndex} from './generate-indexes.mjs';

const doc = (slug, label) => `---\nslug: "${slug}"\ntitle: "T ${slug}"\n${label ? `sidebar_label: "${label}"\n` : ''}---\nBody\n`;

async function fixture() {
  const root = await fs.mkdtemp(path.join(os.tmpdir(), 'dx-idx-'));
  const w = async (p, text) => {
    await fs.mkdir(path.dirname(path.join(root, p)), {recursive: true});
    await fs.writeFile(path.join(root, p), text);
  };
  await w('docs/how-to/g/b.md', doc('/how-to/g/b', 'Bee'));
  await w('docs/how-to/g/a.md', doc('/how-to/g/a'));
  await w('docs/how-to/g/py/_category_.json', '{"label":"Python"}');
  await w('docs/how-to/g/py/x.md', doc('/how-to/g/py/x', 'X'));
  await w('docs/how-to/g/py/deep/y.md', doc('/how-to/g/py/deep/y', 'Y'));
  return root;
}

test('buildTree: sorts by file name, labels from sidebar_label or title, folders become categories', async () => {
  const root = await fixture();
  const tree = await buildTree(root, 'docs/how-to/g', {depth: 3});
  assert.deepEqual(tree.map((e) => e.label), ['T /how-to/g/a', 'Bee', 'Python']);
  assert.equal(tree[1].slug, '/how-to/g/b');
  assert.equal(tree[2].slug, undefined);
  assert.deepEqual(tree[2].children.map((e) => e.label), ['Deep', 'X']);
});

test('buildTree: depth limits how far categories are expanded', async () => {
  const root = await fixture();
  const tree = await buildTree(root, 'docs/how-to/g', {depth: 1});
  assert.equal(tree[2].children, undefined);
});

test('buildTree: a category with its own index page links to it instead of expanding', async () => {
  const root = await fixture();
  const tree = await buildTree(root, 'docs/how-to/g', {depth: 3, hubs: {'docs/how-to/g/py': '/indexes/python-guides'}});
  assert.equal(tree[2].slug, '/indexes/python-guides');
  assert.equal(tree[2].children, undefined);
});

test('renderList: nested bullets, links for pages, bold for plain categories', () => {
  const md = renderList([{label: 'A', slug: '/a'}, {label: 'Cat', children: [{label: 'B', slug: '/b'}]}]);
  assert.equal(md, '- [A](/a)\n- **Cat**\n  - [B](/b)\n');
});

test('renderIndex: keeps frontmatter and heading, drops old card tables, appends the list, and is idempotent', () => {
  const src = '---\nslug: "/indexes/x"\ntitle: "X"\n---\n\n# Host X\n\nIntro text.\n\n<table><tbody><tr><td>old</td></tr></tbody></table>\n';
  const once = renderIndex(src, [{heading: null, list: '- [A](/a)\n'}]);
  assert.match(once, /^---\nslug: "\/indexes\/x"\ntitle: "X"\n---\n/);
  assert.match(once, /# Host X/);
  assert.match(once, /Intro text\./);
  assert.doesNotMatch(once, /<table>/);
  assert.match(once, /- \[A\]\(\/a\)/);
  assert.equal(renderIndex(once, [{heading: null, list: '- [A](/a)\n'}]), once);
});
