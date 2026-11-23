import fs from 'node:fs/promises';
import path from 'node:path';
import {pathToFileURL} from 'node:url';
import {parseDoc} from './lib/frontmatter.mjs';
import {categoryLabel} from './write-category-files.mjs';

const MARKER = '{/* generated-index */}';
const byName = (a, b) => a.name.localeCompare(b.name, undefined, {numeric: true});

export async function buildTree(root, folder, {depth = 2, hubs = {}} = {}) {
  const dir = path.join(root, folder);
  const entries = (await fs.readdir(dir, {withFileTypes: true})).sort(byName);
  const out = [];
  for (const e of entries) {
    if (e.isDirectory()) {
      let label = categoryLabel(e.name);
      try {
        label = JSON.parse(await fs.readFile(path.join(dir, e.name, '_category_.json'), 'utf8')).label ?? label;
      } catch {}
      const sub = `${folder}/${e.name}`;
      if (hubs[sub]) out.push({label, slug: hubs[sub]});
      else if (depth > 1) out.push({label, children: await buildTree(root, sub, {depth: depth - 1, hubs})});
      else out.push({label});
    } else if (/\.mdx?$/.test(e.name)) {
      const {frontmatter} = parseDoc(await fs.readFile(path.join(dir, e.name), 'utf8'));
      if (frontmatter.diataxis === 'index') continue;
      out.push({label: frontmatter.sidebar_label || frontmatter.title || e.name, slug: frontmatter.slug});
    }
  }
  return out;
}

export function renderList(entries, indent = '') {
  let md = '';
  for (const e of entries) {
    md += e.slug ? `${indent}- [${e.label}](${e.slug})\n` : `${indent}- **${e.label}**\n`;
    if (e.children) md += renderList(e.children, indent + '  ');
  }
  return md;
}

export function renderIndex(text, sections) {
  const m = /^---\n[\s\S]*?\n---\n/.exec(text);
  let head = text.slice(m[0].length).split(MARKER)[0];
  head = head.replace(/<table[\s\S]*?<\/table>/g, '').replace(/\n{3,}/g, '\n\n').trimEnd();
  const lists = sections.map((s) => (s.heading ? `## ${s.heading}\n\n` : '') + s.list.trimEnd()).join('\n\n');
  return `${m[0]}${head}\n\n${MARKER}\n\n${lists}\n`;
}

const G = 'how-to/capsules';
const INDEXES = {
  'backend-guides': {sections: [{folder: `docs/${G}/backend/guides`, depth: 2}]},
  'go-guides': {sections: [{folder: `docs/${G}/backend/guides/go`, depth: 1}]},
  'node-guides': {sections: [{folder: `docs/${G}/backend/guides/node.js`, depth: 1}]},
  'python-guides': {sections: [{folder: `docs/${G}/backend/guides/python`, depth: 1}]},
  'database-guides': {sections: [{folder: `docs/${G}/database/guides`, depth: 2}]},
  'frontend-guides': {sections: [{folder: `docs/${G}/frontend/guides`, depth: 1}]},
  'full-stack-guides': {sections: [{folder: 'docs/how-to/full-stack', depth: 2}]},
  'nextjs-full-stack-guides': {sections: [{folder: 'docs/how-to/full-stack/next.js', depth: 1}]},
  'cli-getting-started': {sections: [{folder: 'docs/how-to/cli/getting-started', depth: 1}], extra: [
    {label: 'CLI Quick Start', slug: '/tutorials/cli-quick-start'},
    {label: 'Prerequisites', slug: '/reference/cli/getting-started/prerequisites'},
  ]},
  cli: {sections: [{folder: 'docs/reference/cli', depth: 2}], extra: [{label: 'Getting started with the CLI', slug: '/indexes/cli-getting-started'}]},
  enterprise: {sections: [{folder: 'docs/explanation/enterprise', depth: 1}]},
  platform: {sections: [
    {heading: 'Account', folder: 'docs/how-to/account', depth: 1},
    {heading: 'Billing', folder: 'docs/how-to/billing', depth: 1},
    {heading: 'Teams', folder: 'docs/how-to/teams', depth: 1},
    {heading: 'Spaces', folder: 'docs/how-to/spaces', depth: 1},
    {heading: 'Security', folder: 'docs/how-to/security', depth: 1},
    {heading: 'Capsules', folder: 'docs/how-to/capsules', depth: 1},
  ]},
  products: {sections: [
    {heading: 'Frontend', folder: `docs/${G}/frontend`, depth: 1},
    {heading: 'Backend', folder: `docs/${G}/backend`, depth: 1},
    {heading: 'Database', folder: `docs/${G}/database`, depth: 1},
    {heading: 'Docker', folder: `docs/${G}/docker`, depth: 1},
    {heading: 'Storage', folder: `docs/${G}/storage`, depth: 1},
    {heading: 'WordPress', folder: `docs/${G}/wordpress`, depth: 1},
    {heading: 'Agent', folder: `docs/${G}/agent`, depth: 1},
  ]},
};
const HUBS = {
  [`docs/${G}/backend/guides/go`]: '/indexes/go-guides',
  [`docs/${G}/backend/guides/node.js`]: '/indexes/node-guides',
  [`docs/${G}/backend/guides/python`]: '/indexes/python-guides',
  'docs/how-to/full-stack/next.js': '/indexes/nextjs-full-stack-guides',
};

async function main() {
  const root = process.cwd();
  for (const [name, cfg] of Object.entries(INDEXES)) {
    const file = path.join(root, 'docs/indexes', `${name}.md`);
    const sections = [];
    for (const s of cfg.sections) {
      const own = {...HUBS};
      delete own[s.folder];
      sections.push({heading: s.heading ?? null, list: renderList(await buildTree(root, s.folder, {depth: s.depth, hubs: own}))});
    }
    if (cfg.extra) sections.push({heading: 'Related', list: renderList(cfg.extra)});
    await fs.writeFile(file, renderIndex(await fs.readFile(file, 'utf8'), sections));
  }
  console.log(`generated ${Object.keys(INDEXES).length} index pages`);
}

if (import.meta.url === pathToFileURL(process.argv[1]).href) await main();
