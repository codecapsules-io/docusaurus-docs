import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import {categoryLabel, writeCategoryFiles} from './write-category-files.mjs';

test('categoryLabel: title-cases folder names', () => {
  assert.equal(categoryLabel('backend-capsule'), 'Backend Capsule');
  assert.equal(categoryLabel('getting-started'), 'Getting Started');
});

test('categoryLabel: capsule type folders', () => {
  assert.equal(categoryLabel('wordpress'), 'WordPress');
  assert.equal(categoryLabel('agent'), 'Agent');
  assert.equal(categoryLabel('capsules'), 'Capsules');
});

test('categoryLabel: overrides for acronyms and product names', () => {
  assert.equal(categoryLabel('node.js'), 'Node.js');
  assert.equal(categoryLabel('cli'), 'CLI');
  assert.equal(categoryLabel('mongodb'), 'MongoDB');
  assert.equal(categoryLabel('full-stack'), 'Full-Stack');
});

test('writeCategoryFiles: writes one _category_.json per area folder, never in the type root, and is idempotent', async () => {
  const root = await fs.mkdtemp(path.join(os.tmpdir(), 'dx-cat-'));
  await fs.mkdir(path.join(root, 'docs/how-to/backend-capsule/logs'), {recursive: true});
  await fs.mkdir(path.join(root, 'docs/reference/cli'), {recursive: true});
  await fs.writeFile(path.join(root, 'docs/reference/cli/_category_.json'), '{"label":"Mine"}');
  assert.equal(await writeCategoryFiles(root), 2);
  const read = async (p) => JSON.parse(await fs.readFile(path.join(root, p), 'utf8'));
  assert.deepEqual(await read('docs/how-to/backend-capsule/_category_.json'), {label: 'Backend Capsule', key: 'how-to/backend-capsule'});
  assert.deepEqual(await read('docs/how-to/backend-capsule/logs/_category_.json'), {label: 'Logs', key: 'how-to/backend-capsule/logs'});
  assert.deepEqual(await read('docs/reference/cli/_category_.json'), {label: 'Mine'});
  await assert.rejects(fs.access(path.join(root, 'docs/how-to/_category_.json')));
  assert.equal(await writeCategoryFiles(root), 0);
});

test('writeCategoryFiles: a folder with index.md links to it explicitly', async () => {
  const root = await fs.mkdtemp(path.join(os.tmpdir(), 'dx-cat-'));
  await fs.mkdir(path.join(root, 'docs/how-to/backend/go'), {recursive: true});
  await fs.writeFile(path.join(root, 'docs/how-to/backend/go/index.md'), '---\nslug: "/x"\n---\n');
  await fs.writeFile(path.join(root, 'docs/how-to/backend/go/go.md'), '---\nslug: "/y"\n---\n');
  await writeCategoryFiles(root);
  const json = JSON.parse(await fs.readFile(path.join(root, 'docs/how-to/backend/go/_category_.json'), 'utf8'));
  assert.deepEqual(json.link, {type: 'doc', id: 'how-to/backend/go/index'});
  const backend = JSON.parse(await fs.readFile(path.join(root, 'docs/how-to/backend/_category_.json'), 'utf8'));
  assert.equal(backend.link, undefined);
});
