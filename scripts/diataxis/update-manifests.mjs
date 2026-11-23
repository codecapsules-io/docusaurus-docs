import fs from 'node:fs/promises';
import path from 'node:path';
import {pathToFileURL} from 'node:url';

export function updatePaths(text, moves) {
  let out = text;
  for (const m of moves) {
    if (m.oldPath !== m.newPath) out = out.split(`\`${m.oldPath}\``).join(`\`${m.newPath}\``);
  }
  return out;
}

async function main() {
  const root = process.cwd();
  const moves = JSON.parse(await fs.readFile(path.join(root, 'scripts/diataxis/moves.json'), 'utf8'));
  for (const name of ['MANIFEST.md', 'DIATAXIS.md']) {
    const file = path.join(root, name);
    let text;
    try {
      text = await fs.readFile(file, 'utf8');
    } catch {
      console.log(`${name}: not present, skipped`);
      continue;
    }
    await fs.writeFile(file, updatePaths(text, moves));
    console.log(`${name}: updated`);
  }
}

if (import.meta.url === pathToFileURL(process.argv[1]).href) await main();
