import fs from 'node:fs/promises';
import path from 'node:path';
import {pathToFileURL} from 'node:url';
import {parseDoc} from './lib/frontmatter.mjs';

const TIE_ORDER = ['how-to', 'reference', 'explanation', 'tutorial'];
const FOLDER = {tutorial: 'tutorials', 'how-to': 'how-to', reference: 'reference', explanation: 'explanation'};

const OVERRIDES = {
  'docs/wordpress.md': 'wordpress-capsule/managed-wordpress.md',
  'docs/persistent-storage.md': 'storage-capsule/persistent-storage.md',
};

export function loadLabels(diataxisMd) {
  const labels = new Map();
  let label = null;
  for (const line of diataxisMd.split('\n')) {
    const h = /^## ([a-z-]+) \(\d+\)/.exec(line);
    if (h) label = h[1];
    const row = /^\| `([^`]+)` \|/.exec(line);
    if (row && label) labels.set(row[1], label);
  }
  return labels;
}

export function resolveType(oldPath, labels) {
  if (oldPath === 'docs/index.md') return 'how-to';
  const label = labels.get(oldPath);
  if (label === 'release-notes') return 'release-notes';
  if (label === 'overview') return 'explanation';
  if (label !== 'hub') return label;
  const dir = path.posix.dirname(oldPath) + '/';
  const counts = new Map();
  for (const [p, l] of labels) {
    if (!p.startsWith(dir) || l === 'hub' || l === 'release-notes') continue;
    const t = l === 'overview' ? 'explanation' : l;
    counts.set(t, (counts.get(t) ?? 0) + 1);
  }
  let best = 'how-to';
  let bestN = 0;
  for (const t of TIE_ORDER) {
    if ((counts.get(t) ?? 0) > bestN) {
      best = t;
      bestN = counts.get(t);
    }
  }
  return best;
}

function slugOf(newPath) {
  if (newPath === 'docs/index.md') return '/';
  return '/' + newPath.replace(/^docs\//, '').replace(/\.mdx?$/, '').replace(/\/index$/, '');
}

export function newLocation(oldPath, type) {
  if (type === 'release-notes' || oldPath === 'docs/index.md') {
    return {newPath: oldPath, newSlug: oldPath === 'docs/index.md' ? '/' : null};
  }
  let rest;
  if (OVERRIDES[oldPath]) rest = OVERRIDES[oldPath];
  else if (oldPath === 'docs/products/index.md') rest = 'products/index.md';
  else if (oldPath.startsWith('docs/tutorials/')) {
    const file = oldPath.slice('docs/tutorials/'.length);
    rest = type === 'tutorial' ? null : `guides/${file}`;
  } else rest = oldPath.slice('docs/'.length).replace(/^products\//, '');
  const newPath = rest === null ? oldPath : `docs/${FOLDER[type]}/${rest}`;
  return {newPath, newSlug: slugOf(newPath)};
}

export function planMoves(labels, oldSlugs) {
  const moves = [];
  const taken = new Map();
  for (const oldPath of [...labels.keys()].sort()) {
    const type = resolveType(oldPath, labels);
    const {newPath, newSlug} = newLocation(oldPath, type);
    if (taken.has(newPath)) throw new Error(`collision: ${taken.get(newPath)} and ${oldPath} -> ${newPath}`);
    taken.set(newPath, oldPath);
    moves.push({oldPath, oldSlug: oldSlugs.get(oldPath) ?? null, type, newPath, newSlug});
  }
  return moves;
}

async function main() {
  const root = process.cwd();
  const labels = loadLabels(await fs.readFile(path.join(root, 'DIATAXIS.md'), 'utf8'));
  const oldSlugs = new Map();
  for (const p of labels.keys()) {
    const {frontmatter} = parseDoc(await fs.readFile(path.join(root, p), 'utf8'));
    if (frontmatter.slug) oldSlugs.set(p, frontmatter.slug);
  }
  const moves = planMoves(labels, oldSlugs);
  await fs.writeFile(path.join(root, 'scripts/diataxis/moves.json'), JSON.stringify(moves, null, 1) + '\n');
  const counts = {};
  for (const m of moves) counts[m.type] = (counts[m.type] ?? 0) + 1;
  console.log(moves.length, counts);
}

if (import.meta.url === pathToFileURL(process.argv[1]).href) await main();
