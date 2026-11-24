import fs from 'node:fs/promises';
import path from 'node:path';
import {pathToFileURL} from 'node:url';
import {parseDoc} from './lib/frontmatter.mjs';

const TIE_ORDER = ['how-to', 'reference', 'explanation', 'tutorial'];
const FOLDER = {tutorial: 'tutorials', 'how-to': 'how-to', reference: 'reference', explanation: 'explanation', index: 'indexes'};

// Link-only hub pages move to docs/indexes/ so that category folders stay pure containers.
const INDEX_PAGES = {
  'docs/backend/index.md': 'backend-guides.md',
  'docs/backend/go/index.md': 'go-guides.md',
  'docs/backend/node.js/index.md': 'node-guides.md',
  'docs/backend/python/index.md': 'python-guides.md',
  'docs/database/index.md': 'database-guides.md',
  'docs/frontend/index.md': 'frontend-guides.md',
  'docs/full-stack/index.md': 'full-stack-guides.md',
  'docs/full-stack/next.js/index.md': 'nextjs-full-stack-guides.md',
  'docs/cli/readme/getting-started/index.md': 'cli-getting-started.md',
  'docs/cli/index.md': 'cli.md',
  'docs/platform/index.md': 'platform.md',
  'docs/products/index.md': 'products.md',
  'docs/enterprise/index.md': 'enterprise.md',
  'docs/products/backend-capsule/index.md': 'backend-capsule.md',
  'docs/products/database-capsule/index.md': 'database-capsule.md',
  'docs/products/docker-capsule/index.md': 'docker-capsule.md',
  'docs/products/frontend-capsule/index.md': 'frontend-capsule.md',
  'docs/products/backend-capsule/deploy.md': 'backend-deploy.md',
  'docs/products/frontend-capsule/deploy.md': 'frontend-deploy.md',
  'docs/products/wordpress-capsule/backups.md': 'wordpress-backups.md',
};

// index.md pages with real content become ordinary pages named overview.md.
const OVERVIEW_PAGES = new Set([
  'docs/agentic-automation/index.md',
  'docs/backend/docker/index.md',
  'docs/cli/readme/commands/index.md',
  'docs/database/mongodb/index.md',
  'docs/database/mysql/index.md',
  'docs/products/database-capsule/mongodb/versions/upgrades/index.md',
  'docs/products/database-capsule/mysql/versions/upgrades/index.md',
  'docs/sandbox/python/index.md',
  'docs/sandbox/typescript/index.md',
]);

// Tutorials are named <thing>-<stack>: no verbs, no filler words.
const TUTORIAL_NAMES = {
  'build-a-generative-art-application-with-pillow-flask-and-htmx': 'generative-art-flask',
  'build-a-mern-job-board': 'mern-job-board',
  'build-a-personal-calendar-assistant-with-telegram-and-agent-capsules': 'telegram-calendar-assistant',
  'build-a-slackbot-with-node.js-to-monitor-your-applications': 'monitoring-slackbot-node',
  'building-a-book-recommendations-app-with-php-sqlite-and-docker': 'book-recommendations-php',
  'building-a-full-stack-application-with-express-and-htmx': 'full-stack-express-htmx',
  'building-a-full-stack-application-with-flask-and-htmx': 'full-stack-flask-htmx',
  'building-a-game-catalogue-api': 'game-catalogue-api',
  'building-a-web-file-store': 'web-file-store',
  'create-and-host-a-telegram-bot-with-node.js-on-code-capsules': 'telegram-bot-node',
  'how-to-create-and-host-a-telegram-bot-on-code-capsules': 'telegram-bot-python',
  'create-and-host-go-ai-telegram-bot': 'telegram-bot-go-ai',
  'create-and-host-an-api-with-flask': 'flask-api',
  'getting-started-with-mean-stack-a-step-by-step-tutorial': 'mean-stack-app',
  'how-to-simply-host-a-production-wordpress-blog': 'wordpress-blog',
};

const OVERRIDES = {
  'docs/wordpress.md': 'capsules/wordpress/managed-wordpress.md',
  'docs/persistent-storage.md': 'capsules/storage/persistent-storage.md',
  'docs/platform/platform.md': 'platform/overview.md',
  'docs/products/agent-capsule/chat/index.md': 'capsules/agent/chat-api.md',
  'docs/sandbox/index.md': 'sandbox/overview.md',
  'docs/products/alerting.md': 'capsules/alerting.md',
  'docs/products/frontend-capsule/container/deploy.md': 'capsules/frontend/deploy-container.md',
  'docs/products/frontend-capsule/static/deploy.md': 'capsules/frontend/deploy-static.md',
  'docs/products/frontend-capsule/static/plans.md': 'capsules/frontend/static-plans.md',
  'docs/products/agent-capsule/chat/agent-api-sample.mdx': 'capsules/agent/agent-api-sample.mdx',
};

function tidy(rest) {
  rest = rest.replace(/^(backend|frontend|database)\//, 'capsules/$1/guides/').replace(/^products\//, '').replace(/^(agent|backend|database|docker|frontend|storage|wordpress)-capsule\//, 'capsules/$1/').replace(/(^|\/)readme\//, '$1').replace(/\/versions\/upgrades\//, '/upgrades/');
  return rest.startsWith('platform/') && rest.split('/').length >= 3 ? rest.slice('platform/'.length) : rest;
}

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
  if (INDEX_PAGES[oldPath]) return 'index';
  if (['docs/products/agent-capsule/chat/index.md', 'docs/products/wordpress-capsule/security.md', 'docs/products/wordpress-capsule/configure.md', 'docs/products/wordpress-capsule/caching.md', 'docs/products/wordpress-capsule/cron.md'].includes(oldPath)) return 'reference';
  if (oldPath === 'docs/cli/readme/getting-started/quick-start.md' || oldPath === 'docs/sandbox/quickstart.md') return 'how-to';
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
  if (INDEX_PAGES[oldPath]) rest = INDEX_PAGES[oldPath];
  else if (OVERRIDES[oldPath]) rest = OVERRIDES[oldPath];
  else if (oldPath === 'docs/products/index.md') rest = 'products/index.md';
  else if (oldPath.startsWith('docs/tutorials/')) {
    const file = oldPath.slice('docs/tutorials/'.length);
    const renamed = TUTORIAL_NAMES[file.replace(/\.md$/, '')];
    rest = type === 'tutorial' ? (renamed ? `${renamed}.md` : null) : `guides/${file}`;
  } else rest = tidy(oldPath.slice('docs/'.length));
  if (OVERVIEW_PAGES.has(oldPath)) rest = rest.replace(/index\.md$/, 'overview.md');
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
