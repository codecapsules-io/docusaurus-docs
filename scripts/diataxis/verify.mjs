import fs from 'node:fs/promises';
import path from 'node:path';
import {execFileSync} from 'node:child_process';
import {pathToFileURL} from 'node:url';
import {parseDoc} from './lib/frontmatter.mjs';
import {rewriteLinks} from './rewrite-links.mjs';

const FOLDER = {tutorial: 'tutorials', 'how-to': 'how-to', reference: 'reference', explanation: 'explanation', index: 'indexes'};

export function checkTypes(docs) {
  const errors = [];
  for (const d of docs) {
    if (!FOLDER[d.diataxis]) {
      errors.push(`${d.path}: missing or invalid diataxis (${d.diataxis ?? 'none'})`);
    } else if (d.path !== 'docs/index.md' && !d.path.startsWith(`docs/${FOLDER[d.diataxis]}/`)) {
      errors.push(`${d.path}: type ${d.diataxis} but not under docs/${FOLDER[d.diataxis]}/`);
    }
  }
  return errors;
}

const normalise = (text) => rewriteLinks(parseDoc(text).body, '', () => 'X').text;

export function checkBodies(pairs) {
  return pairs
    .filter((p) => normalise(p.before) !== normalise(p.after))
    .map((p) => `${p.path}: body changed beyond link targets`);
}

export function checkNoOldSlugs(files, oldOnlySlugs) {
  const old = new Set(oldOnlySlugs);
  const errors = [];
  for (const f of files) {
    rewriteLinks(f.text, '', (target) => {
      const p = target.split(/[?#]/)[0].replace(/(.)\/$/, '$1');
      if (old.has(p)) errors.push(`${f.path}: links to removed slug ${p}`);
      return null;
    });
  }
  return errors;
}

async function* walk(dir) {
  for (const e of await fs.readdir(dir, {withFileTypes: true})) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) yield* walk(p);
    else if (/\.mdx?$/.test(e.name)) yield p;
  }
}

async function main() {
  const root = process.cwd();
  const read = (p) => fs.readFile(path.join(root, p), 'utf8');
  const moves = JSON.parse(await read('scripts/diataxis/moves.json'));
  const sha = (await read('specs/baseline/pre-move-commit.txt')).trim();
  const errors = [];

  const docs = [];
  const current = [];
  for (const dir of ['docs', 'release-notes']) {
    for await (const f of walk(path.join(root, dir))) {
      const rel = path.relative(root, f).split(path.sep).join('/');
      const text = await fs.readFile(f, 'utf8');
      current.push({path: rel, text});
      if (dir === 'docs') docs.push({path: rel, diataxis: parseDoc(text).frontmatter.diataxis});
    }
  }
  const landing = 4 - 1;
  const expected = moves.length + landing;
  if (current.length !== expected) errors.push(`file count ${current.length}, expected ${expected}`);
  errors.push(...checkTypes(docs));

  // Index pages are regenerated from the folder tree, so their bodies are not compared.
  const pairs = moves.filter((m) => m.type !== 'index').map((m) => ({
    path: m.newPath,
    before: execFileSync('git', ['show', `${sha}:${m.oldPath}`], {cwd: root, encoding: 'utf8', maxBuffer: 1 << 26}),
    after: current.find((c) => c.path === m.newPath)?.text ?? '',
  }));
  errors.push(...checkBodies(pairs));

  const newSlugs = new Set(moves.map((m) => m.newSlug));
  const oldOnly = moves.map((m) => m.oldSlug).filter((s) => s && !newSlugs.has(s));
  const scanned = [...current];
  for (const dir of ['src']) {
    try {
      for await (const f of walk(path.join(root, dir))) scanned.push({path: path.relative(root, f), text: await fs.readFile(f, 'utf8')});
    } catch {}
  }
  errors.push(...checkNoOldSlugs(scanned, oldOnly));

  const config = await read('docusaurus.config.ts');
  if (/\bredirects\b/.test(config) || /plugin-client-redirects/.test(config)) errors.push('docusaurus.config.ts still configures redirects');
  if (/plugin-client-redirects/.test(await read('package.json'))) errors.push('package.json still depends on plugin-client-redirects');

  console.log(`${errors.length} errors`);
  if (errors.length) {
    console.error(errors.join('\n'));
    process.exit(1);
  }
}

if (import.meta.url === pathToFileURL(process.argv[1]).href) await main();
