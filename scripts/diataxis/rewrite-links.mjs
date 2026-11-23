import fs from 'node:fs/promises';
import path from 'node:path';
import {pathToFileURL} from 'node:url';

const SKIP_PREFIXES = ['/gitbook-assets/', '/img/', '/openapi/', '/release-notes'];
const ASSET_EXT = /\.(png|jpe?g|gif|svg|webp|avif|pdf|ico|json|txt|html|xml|css|js)$/i;

function split(target) {
  const i = target.search(/[?#]/);
  return i < 0 ? [target, ''] : [target.slice(0, i), target.slice(i)];
}

// Returns the new target, null to leave the link alone, or undefined when an
// internal link matches no doc.
export function buildResolver(moves) {
  const bySlug = new Map();
  const byNewSlug = new Set();
  const byPath = new Map();
  for (const m of moves) {
    if (m.oldSlug) bySlug.set(m.oldSlug, m.newSlug);
    if (m.newSlug) byNewSlug.add(m.newSlug);
    byPath.set(m.oldPath, m);
  }
  return (target, fromOldPath) => {
    if (/^([a-z][a-z0-9+.-]*:|\/\/|#)/i.test(target)) return null;
    const [p, suffix] = split(target);
    if (p === '') return null;
    if (p.startsWith('/')) {
      if (SKIP_PREFIXES.some((s) => p.startsWith(s))) return null;
      const trailing = p.length > 1 && p.endsWith('/');
      const key = trailing ? p.slice(0, -1) : p;
      const hit = bySlug.get(key) ?? (byNewSlug.has(key) ? key : undefined);
      if (hit === undefined) return /\.[a-z0-9]+$/i.test(key) ? (ASSET_EXT.test(key) ? null : undefined) : undefined;
      return hit + (trailing && hit !== '/' ? '/' : '') + suffix;
    }
    if (ASSET_EXT.test(p)) return null;
    const joined = path.posix.normalize(path.posix.join(path.posix.dirname(fromOldPath), p));
    for (const c of [joined, `${joined}.md`, `${joined}.mdx`, `${joined}/index.md`]) {
      const m = byPath.get(c);
      if (m) return m.newSlug + suffix;
    }
    return undefined;
  };
}

const MD_LINK = /\]\(([^)\s]+)((?:\s+"[^"]*")?)\)/g;
const ATTR = /\b(href|to|src)=("([^"]*)"|'([^']*)')/g;
const PROP = /\b(href|to):(\s*)(['"])(\/[^'"]*)\3/g;
const REF_DEF = /^(\[[^\]]+\]:\s*)(\S+)/;

export function rewriteLinks(text, fromOldPath, resolve) {
  const unresolved = [];
  const fix = (target) => {
    const r = resolve(target, fromOldPath);
    if (r === undefined) {
      unresolved.push(target);
      return target;
    }
    return r === null ? target : r;
  };
  let fenced = false;
  const lines = text.split('\n').map((line) => {
    if (/^\s*(```|~~~)/.test(line)) {
      fenced = !fenced;
      return line;
    }
    if (fenced) return line;
    return line
      .split(/(`[^`]*`)/)
      .map((seg, i) => {
        if (i % 2 === 1) return seg;
        return seg
          .replace(REF_DEF, (_, a, t) => a + fix(t))
          .replace(MD_LINK, (_, t, title) => `](${fix(t)}${title})`)
          .replace(PROP, (_, name, ws, q, t) => `${name}:${ws}${q}${fix(t)}${q}`)
          .replace(ATTR, (_, name, quoted, dq, sq) => {
            const q = quoted[0];
            return `${name}=${q}${fix(dq ?? sq)}${q}`;
          });
      })
      .join('');
  });
  return {text: lines.join('\n'), unresolved};
}

async function* walk(dir, exts) {
  for (const e of await fs.readdir(dir, {withFileTypes: true})) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) yield* walk(p, exts);
    else if (exts.test(e.name)) yield p;
  }
}

async function main() {
  const root = process.cwd();
  const moves = JSON.parse(await fs.readFile(path.join(root, 'scripts/diataxis/moves.json'), 'utf8'));
  const resolve = buildResolver(moves);
  const oldOf = new Map(moves.map((m) => [m.newPath, m.oldPath]));
  const scopes = [['docs', /\.mdx?$/], ['release-notes', /\.mdx?$/], ['src', /\.(mdx?|tsx?|jsx?)$/], ['static', /\.html$/]];
  let files = 0;
  let links = 0;
  const problems = [];
  const targets = [];
  for (const [dir, exts] of scopes) {
    try {
      for await (const f of walk(path.join(root, dir), exts)) targets.push(f);
    } catch {}
  }
  for (const file of targets) {
    const rel = path.relative(root, file).split(path.sep).join('/');
    const before = await fs.readFile(file, 'utf8');
    const {text, unresolved} = rewriteLinks(before, oldOf.get(rel) ?? rel, resolve);
    for (const u of unresolved) problems.push(`${rel}: ${u}`);
    if (text !== before) {
      await fs.writeFile(file, text);
      files++;
      links += before.split('\n').filter((l, i) => l !== text.split('\n')[i]).length;
    }
  }
  console.log(`rewrote ${files} files (${links} changed lines)`);
  if (problems.length) {
    console.error(`unresolved links:\n${problems.join('\n')}`);
    process.exit(1);
  }
}

if (import.meta.url === pathToFileURL(process.argv[1]).href) await main();
