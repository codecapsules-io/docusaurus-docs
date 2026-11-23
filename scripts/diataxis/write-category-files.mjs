import fs from 'node:fs/promises';
import path from 'node:path';
import {pathToFileURL} from 'node:url';

const TYPE_FOLDERS = ['tutorials', 'how-to', 'reference', 'explanation'];
const LABELS = {
  'node.js': 'Node.js',
  'next.js': 'Next.js',
  mongodb: 'MongoDB',
  mysql: 'MySQL',
  postgresql: 'PostgreSQL',
  documentdb: 'DocumentDB',
  'wordpress-capsule': 'WordPress Capsule',
  cli: 'CLI',
  'full-stack': 'Full-Stack',
  typescript: 'TypeScript',
};

export function categoryLabel(dirName) {
  return LABELS[dirName] ?? dirName.split('-').map((w) => w[0].toUpperCase() + w.slice(1)).join(' ');
}

export async function writeCategoryFiles(root) {
  let written = 0;
  async function visit(dir) {
    for (const e of await fs.readdir(dir, {withFileTypes: true})) {
      if (!e.isDirectory()) continue;
      const sub = path.join(dir, e.name);
      const file = path.join(sub, '_category_.json');
      try {
        await fs.access(file);
      } catch {
        await fs.writeFile(file, JSON.stringify({label: categoryLabel(e.name), key: path.relative(path.join(root, 'docs'), sub).split(path.sep).join('/')}, null, 2) + '\n');
        written++;
      }
      await visit(sub);
    }
  }
  for (const t of TYPE_FOLDERS) {
    try {
      await visit(path.join(root, 'docs', t));
    } catch {}
  }
  return written;
}

if (import.meta.url === pathToFileURL(process.argv[1]).href) {
  console.log(`wrote ${await writeCategoryFiles(process.cwd())} category files`);
}
