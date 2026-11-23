import fs from 'node:fs/promises';
import path from 'node:path';
import {execFileSync} from 'node:child_process';
import {pathToFileURL} from 'node:url';
import {setFrontmatter} from './lib/frontmatter.mjs';

const exists = (p) => fs.access(p).then(() => true, () => false);

async function move(root, from, to) {
  await fs.mkdir(path.dirname(path.join(root, to)), {recursive: true});
  if (await exists(path.join(root, '.git'))) {
    execFileSync('git', ['mv', from, to], {cwd: root});
  } else {
    await fs.rename(path.join(root, from), path.join(root, to));
  }
}

export async function applyMoves(root, moves, {dryRun = false} = {}) {
  for (const m of moves) {
    if (m.type === 'release-notes') continue;
    const onDisk = await exists(path.join(root, m.oldPath));
    if (m.newPath !== m.oldPath && onDisk && !dryRun) await move(root, m.oldPath, m.newPath);
    if (dryRun) continue;
    const file = path.join(root, m.newPath);
    const text = await fs.readFile(file, 'utf8');
    const next = setFrontmatter(text, {slug: m.newSlug, diataxis: m.type});
    if (next !== text) await fs.writeFile(file, next);
  }
}

const LANDING = [
  {dir: 'tutorials', type: 'tutorial', title: 'Tutorials', description: 'Learn by building: step-by-step projects that end in a working app.'},
  {dir: 'how-to', type: 'how-to', title: 'How-to guides', description: 'Task-focused guides for deploying, configuring and running your apps.'},
  {dir: 'reference', type: 'reference', title: 'Reference', description: 'Facts to look up: supported runtimes, versions, limits, CLI commands and SDK methods.'},
  {dir: 'explanation', type: 'explanation', title: 'Explanation', description: 'Background on how Code Capsules works and why.'},
];

export async function writeLandingPages(root) {
  for (const l of LANDING) {
    const file = path.join(root, 'docs', l.dir, 'index.md');
    const slug = `/${l.dir}`;
    if (await exists(file)) {
      const text = await fs.readFile(file, 'utf8');
      if (!text.includes(`slug: "${slug}"`)) throw new Error(`landing page path is taken by another doc: ${file}`);
      if (!/^sidebar_position:/m.test(text)) {
        await fs.writeFile(file, text.replace(`slug: "${slug}"`, `slug: "${slug}"\nsidebar_position: 0`));
      }
      continue;
    }
    await fs.mkdir(path.dirname(file), {recursive: true});
    await fs.writeFile(file, `---\nslug: "${slug}"\nsidebar_position: 0\ndiataxis: ${l.type}\ntitle: "${l.title}"\ndescription: "${l.description}"\n---\n\nimport DocCardList from '@theme/DocCardList';\n\n# ${l.title}\n\n${l.description}\n\n<DocCardList />\n`);
  }
}

async function main() {
  const root = process.cwd();
  const moves = JSON.parse(await fs.readFile(path.join(root, 'scripts/diataxis/moves.json'), 'utf8'));
  await applyMoves(root, moves);
  await writeLandingPages(root);
  console.log(`applied ${moves.length} moves`);
}

if (import.meta.url === pathToFileURL(process.argv[1]).href) await main();
