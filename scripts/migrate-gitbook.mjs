import fs from 'node:fs/promises';
import path from 'node:path';
import https from 'node:https';
import {normalizeGitBookAssets} from './normalize-gitbook-assets.mjs';

const projectRoot = process.cwd();
const sourceRoot = path.resolve(projectRoot, '..');
const docsRoot = path.join(projectRoot, 'docs');
const staticRoot = path.join(projectRoot, 'static');
const generatedRoot = path.join(projectRoot, 'generated');

const sections = [
  {
    key: 'get-started',
    sourceDir: 'get-started',
    summary: 'get-started/SUMMARY.md',
    navbarPath: '/',
    spaceIds: ['xjp0G5hHSJs8nyv5Z5g7'],
  },
  {
    key: 'platform',
    sourceDir: 'platform',
    summary: 'platform/SUMMARY.md',
    navbarPath: '/platform',
    spaceIds: ['gIlxo9gU7Lotj1cdGRh6'],
  },
  {
    key: 'products',
    sourceDir: 'products',
    summary: 'products/SUMMARY.md',
    navbarPath: '/products',
    spaceIds: ['oyCI3rJYfUxA3cJhHZbu'],
  },
  {
    key: 'tutorials',
    sourceDir: 'tutorials',
    summary: 'tutorials/SUMMARY.md',
    navbarPath: '/tutorials',
    spaceIds: ['QxXPZz73XKehWd1HyCQn'],
  },
  {
    key: 'cli',
    sourceDir: 'cli',
    summary: 'cli/SUMMARY.md',
    navbarPath: '/cli',
    spaceIds: ['mbIMmtQGsG9TeQSECL0E'],
  },
];

const enterprisePages = [
  {title: 'Enterprise', slug: '', targetRel: 'enterprise/index.md'},
  {title: 'AWS', slug: 'aws', targetRel: 'enterprise/aws.md'},
  {title: 'Azure', slug: 'azure', targetRel: 'enterprise/azure.md'},
  {title: 'GCP', slug: 'gcp', targetRel: 'enterprise/gcp.md'},
  {title: 'VMware', slug: 'vmware', targetRel: 'enterprise/vmware.md'},
];

const routeAliases = {
  '/products/backups': '/products/database-capsule/backups',
  '/code-capsules-cli/commands': '/cli/readme/commands',
};

const legacyRedirectMap = {
  '/comparing-paas-providers-heroku-vs-digitalocean-vs-code-capsules/':
    '/docs/comparisons/comparing-paas-providers-heroku-vs-digitalocean-vs-code-capsules',
  '/saas-vs-paas-vs-iaas-comparing-three-paradigms/':
    '/docs/comparisons/saas-paas-iaas',
  '/hosting-a-front-end-building-and-deploying-your-portfolio-to-code-capsules/':
    '/docs/tutorials/host-a-frontend',
  '/customising-your-domain-on-code-capsules/': '/docs/tutorials/customising-domain',
  '/how-to-connect-a-mongodb-using-mongodb-atlas-with-your-code-capsules-application/':
    '/docs/tutorials/connect-mongodb-atlas-to-code-capsules',
  '/creating-and-hosting-a-personal-api-with-flask-and-code-capsules/':
    '/docs/tutorials/creating-and-hosting-a-flask-api',
  '/adding-functionality-to-your-web-application-setting-up-stripe-checkout-and-email-subscription-with-flask-and-code-capsules/':
    '/docs/tutorials/stripe-checkout-and-email-with-flask',
  '/create-and-host-a-telegram-bot-on-code-capsules/':
    '/docs/tutorials/create-and-host-telegram-bot',
  '/developing-a-persistent-sleep-tracker-part-1-handling-users-with-flask-login/':
    '/docs/tutorials/develop-persistent-sleep-tracker-part-1',
  '/developing-a-persistent-sleep-tracker-part-2-tracking-and-graphing-sleep-data/':
    '/docs/tutorials/develop-persistent-sleep-tracker-part-2',
  '/build-a-slack-bot-with-nodejs-to-monitor-your-applications/':
    '/docs/tutorials/build-slackbot-with-node',
  '/custom-domains/': '/docs/reference/custom_domains',
  '/how-to-deploy-a-react-application-to-production-on-code-capsules/':
    '/docs/deployment/how-to-deploy-react-application-to-production',
  '/how-to-deploy-an-angular-application-to-production-on-code-capsules/':
    '/docs/deployment/how-to-deploy-angular-application-to-production',
  '/how-to-deploy-an-express-js-application-to-production-on-code-capsules/':
    '/docs/deployment/how-to-deploy-express-application-to-production',
  '/how-to-deploy-an-html-site-to-production-on-code-capsules/':
    '/docs/deployment/how-to-deploy-static-html-to-production',
  '/how-to-deploy-a-java-application-to-production-on-code-capsules/':
    '/docs/deployment/how-to-deploy-java-application-to-production',
  '/how-to-deploy-a-flask-application-to-production-on-code-capsules/':
    '/docs/deployment/how-to-deploy-flask-application-to-production',
  '/how-to-deploy-a-vue-application-to-production-on-code-capsules/':
    '/docs/deployment/how-to-deploy-vue-application-to-production',
  '/faq/teams-spaces-and-capsules/': '/docs/FAQ/teams-spaces-capsules',
  '/codecapsules-hack-days/': '/docs/community/codecapsules-hack-days',
  '/introducing-code-capsules/': '/docs/community/introducing-code-capsules',
  '/founder-fridays/': '/docs/community/founder-fridays',
  '/topic/community/': '/docs/community/introducing-code-capsules',
  '/topic/tutorials/': '/docs/tutorials',
  '/faq/': '/docs/FAQ/teams-spaces-capsules',
};

const unresolvedLinks = new Map();

function asPosix(value) {
  return value.split(path.sep).join('/');
}

function normalizeRoute(route) {
  if (!route) return '/';
  let normalized = route.replace(/\/index$/, '').replace(/\/+$/, '');
  if (!normalized.startsWith('/')) normalized = `/${normalized}`;
  return normalized || '/';
}

function routeForTargetRel(targetRel) {
  const withoutExt = targetRel.replace(/\.md$/, '');
  if (withoutExt === 'index') return '/';
  if (withoutExt.endsWith('/index')) {
    return normalizeRoute(withoutExt.slice(0, -('/index'.length)));
  }
  return normalizeRoute(withoutExt);
}

function docIdForTargetRel(targetRel) {
  return targetRel.replace(/\.md$/, '');
}

function encodePathForUrl(route) {
  return route
    .split('/')
    .map((segment, index) => (index === 0 ? segment : encodeURIComponent(segment)))
    .join('/');
}

async function pathExists(filePath) {
  try {
    await fs.access(filePath);
    return true;
  } catch {
    return false;
  }
}

async function walkMarkdownFiles(dir) {
  const entries = await fs.readdir(dir, {withFileTypes: true});
  const files = [];
  for (const entry of entries) {
    const abs = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...(await walkMarkdownFiles(abs)));
      continue;
    }
    if (entry.isFile() && abs.endsWith('.md')) {
      files.push(abs);
    }
  }
  return files;
}

async function walkFiles(dir) {
  const entries = await fs.readdir(dir, {withFileTypes: true});
  const files = [];
  for (const entry of entries) {
    const abs = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...(await walkFiles(abs)));
      continue;
    }
    if (entry.isFile()) {
      files.push(abs);
    }
  }
  return files;
}

async function getPublishedSourcePaths(section) {
  const summaryPath = path.join(sourceRoot, section.summary);
  const summary = await fs.readFile(summaryPath, 'utf8');
  const published = new Set();
  for (const line of summary.split('\n')) {
    const bulletMatch = line.match(/^\s*\*\s+\[(.+?)\]\((.+?)\)$/);
    if (!bulletMatch) continue;
    published.add(normalizeSummaryPath(bulletMatch[2]));
  }
  return [...published];
}

function targetRelForSource(sectionKey, sourceRel) {
  if (sectionKey === 'get-started') {
    if (sourceRel === 'README.md') return 'index.md';
    return sourceRel.replace(/README\.md$/, 'index.md');
  }
  if (sectionKey === 'cli') {
    if (sourceRel === 'README.md') return 'cli/index.md';
    const nested = sourceRel.replace(/^code-capsules-cli\//, 'cli/readme/');
    return nested.replace(/README\.md$/, 'index.md');
  }
  const prefix = `${sectionKey}/`;
  if (sourceRel === 'README.md') return `${sectionKey}/index.md`;
  if (sourceRel === 'README (1).md') return `${sectionKey}/readme.md`;
  return `${prefix}${sourceRel.replace(/README\.md$/, 'index.md')}`;
}

function addUnresolved(kind, sourceFile, value) {
  const key = `${kind}::${asPosix(path.relative(projectRoot, sourceFile))}::${value}`;
  unresolvedLinks.set(key, {
    kind,
    sourceFile: asPosix(path.relative(projectRoot, sourceFile)),
    value,
  });
}

function splitHash(value) {
  const hashIndex = value.indexOf('#');
  if (hashIndex === -1) {
    return {pathname: value, hash: ''};
  }
  return {
    pathname: value.slice(0, hashIndex),
    hash: value.slice(hashIndex),
  };
}

function normalizeSummaryPath(value) {
  return value.replace(/^<|>$/g, '');
}

function parseLinkDestination(raw) {
  const trimmed = raw.trim();
  if (trimmed.startsWith('<')) {
    const closeIndex = trimmed.indexOf('>');
    if (closeIndex !== -1) {
      return {
        destination: trimmed.slice(1, closeIndex),
        suffix: trimmed.slice(closeIndex + 1),
      };
    }
  }
  const firstSpace = trimmed.search(/\s/);
  if (firstSpace === -1) {
    return {destination: trimmed, suffix: ''};
  }
  return {
    destination: trimmed.slice(0, firstSpace),
    suffix: trimmed.slice(firstSpace),
  };
}

function formatLinkDestination(destination, suffix) {
  return `${destination}${suffix}`;
}

function transformOutsideCodeFences(content, transformer) {
  return content
    .split(/(```[\s\S]*?```)/g)
    .map((part) => (part.startsWith('```') ? part : transformer(part)))
    .join('');
}

function fetchText(url) {
  return new Promise((resolve, reject) => {
    const visit = (currentUrl) => {
      https
        .get(currentUrl, (response) => {
          const status = response.statusCode ?? 0;
          if ([301, 302, 303, 307, 308].includes(status) && response.headers.location) {
            const nextUrl = new URL(response.headers.location, currentUrl).toString();
            response.resume();
            visit(nextUrl);
            return;
          }
          if (status >= 400) {
            reject(new Error(`Failed to fetch ${currentUrl}: ${status}`));
            return;
          }
          let body = '';
          response.setEncoding('utf8');
          response.on('data', (chunk) => {
            body += chunk;
          });
          response.on('end', () => resolve(body));
        })
        .on('error', reject);
    };
    visit(url);
  });
}

function routeToLiveMarkdownUrl(route) {
  if (route === '/') return 'https://docs.codecapsules.io/readme.md';
  if (route === '/enterprise') return 'https://docs.codecapsules.io/enterprise/enterprise.md';
  return `https://docs.codecapsules.io${route}.md`;
}

function guessCodeLanguage(title = '') {
  const normalized = title.toLowerCase();
  if (normalized.endsWith('.ts')) return 'ts';
  if (normalized.endsWith('.js')) return 'js';
  if (normalized.endsWith('.json')) return 'json';
  if (normalized.endsWith('.py')) return 'py';
  if (normalized.endsWith('.sh')) return 'bash';
  if (normalized.endsWith('.html')) return 'html';
  return '';
}

function normalizeGitBookSyntax(content) {
  const hintType = {
    info: 'info',
    success: 'tip',
    warning: 'warning',
    danger: 'danger',
  };

  let normalized = content;
  normalized = normalized.replace(/^<<<<<<< Updated upstream\s*(.+)$/gm, '$1');
  normalized = normalized.replace(/^<<<<<<<[^\n]*$/gm, '');
  normalized = normalized.replace(/^\\?=======$/gm, '');
  normalized = normalized.replace(/^>>>>>>>[^\n]*$/gm, '');
  normalized = normalized.replace(/^>\s*>\s*>\s*>\s*>\s*>\s*>\s*.*$/gm, '');
  normalized = normalized.replace(/\{% raw %\}|\{% endraw %\}/g, '');
  normalized = normalized.replace(
    /\{% code(?: title="([^"]+)")? %\}\n?([\s\S]*?)\n?\{% endcode %\}/g,
    (_, title, inner) => `\n\`\`\`${guessCodeLanguage(title)}\n${inner.trim()}\n\`\`\`\n`,
  );
  normalized = normalized.replace(
    /\{% openapi-[^%]+%\}\n?([\s\S]*?)\n?\{% endopenapi-[^%]+%\}/g,
    (_, inner) => `${inner.trim()}\n`,
  );
  normalized = normalized.replace(
    /\{% hint style="([^"]+)" %\}/g,
    (_, style) => `\n:::${hintType[style] ?? 'info'}\n`,
  );
  normalized = normalized.replace(/\{% endhint %\}/g, '\n:::\n');
  normalized = normalized.replace(/\{% tabs %\}|\{% endtabs %\}/g, '');
  normalized = normalized.replace(/\{% tab title="([^"]+)" %\}/g, '\n#### $1\n');
  normalized = normalized.replace(/\{% endtab %\}/g, '\n');
  normalized = normalized.replace(/\{% stepper %\}|\{% endstepper %\}/g, '');
  normalized = normalized.replace(/\{% step %\}|\{% endstep %\}/g, '\n');
  normalized = normalized.replace(/\sstyle="[^"]*"/g, '');
  normalized = normalized.replace(/<img([^>]*?)(?<!\/)>/g, '<img$1 />');
  normalized = normalized.replace(/<br>/g, '<br />');
  normalized = normalized.replace(/\]\(\.\/#/g, '](#');
  normalized = normalized.replace(
    /\/platform\/capsules\/how-to-add-a-custom-domain#steps-to-add-a-custom-domain/g,
    '/platform/capsules/how-to-add-a-custom-domain#add-a-custom-domain',
  );
  normalized = normalized.replace(
    /\(#how-to-migrate-from-heroku-to-code-capsules\)/g,
    '(/tutorials/heroku-migration-guide)',
  );
  return normalized;
}

async function loadSourceContent(doc) {
  if (doc.remoteUrl) {
    return fetchText(doc.remoteUrl);
  }

  const localContent = await fs.readFile(doc.sourceAbs, 'utf8');
  if (!localContent.includes('<<<<<<<')) {
    return localContent;
  }

  try {
    return await fetchText(routeToLiveMarkdownUrl(doc.route));
  } catch {
    return localContent;
  }
}

function buildGitBookRoute(spaceId, rest) {
  if (spaceId === 'mbIMmtQGsG9TeQSECL0E') {
    return rest ? normalizeRoute(`/cli/readme/${rest}`) : '/cli';
  }
  if (spaceId === 'xjp0G5hHSJs8nyv5Z5g7') {
    return rest ? normalizeRoute(rest) : '/';
  }
  const section = sections.find((candidate) => candidate.spaceIds.includes(spaceId));
  if (!section) return null;
  return rest ? normalizeRoute(`/${section.key}/${rest}`) : section.navbarPath;
}

function mapAbsoluteUrlToRoute(urlValue, routeSet) {
  let parsed;
  try {
    parsed = new URL(urlValue);
  } catch {
    return null;
  }

  const host = parsed.hostname.replace(/^www\./, '');
  const pathname = parsed.pathname;

  if (host === 'app.gitbook.com') {
    const match =
      pathname.match(/^\/s\/([^/]+)\/?(.*)$/) ||
      pathname.match(/^\/o\/[^/]+\/s\/([^/]+)\/?(.*)$/);
    if (!match) return null;
    const [, spaceId, rest] = match;
    const route = buildGitBookRoute(spaceId, rest);
    return route && routeSet.has(route) ? route : route;
  }

  if (host === 'docs.codecapsules.io') {
    if (pathname.endsWith('.md')) {
      const markdownRoute = pathname
        .replace(/\/enterprise\/enterprise\.md$/, '/enterprise')
        .replace(/\/index\.md$/, '')
        .replace(/\.md$/, '');
      return normalizeRoute(markdownRoute);
    }
    return normalizeRoute(pathname);
  }

  if (host === 'codecapsules.io') {
    if (pathname === '/slack') return null;
    if (pathname === '/docs' || pathname === '/doc') return '/';
    if (pathname.startsWith('/docs/')) {
      const stripped = normalizeRoute(pathname.slice('/docs'.length));
      return routeSet.has(stripped) ? stripped : stripped;
    }
    if (pathname.startsWith('/doc/')) {
      const stripped = normalizeRoute(pathname.slice('/doc'.length));
      return routeSet.has(stripped) ? stripped : null;
    }
    const legacyTarget = legacyRedirectMap[`${pathname.replace(/\/?$/, '/')}`];
    if (legacyTarget) {
      const normalized = normalizeRoute(legacyTarget.replace(/^\/docs/, ''));
      return routeSet.has(normalized) ? normalized : null;
    }
  }

  return null;
}

async function resolveLocalAssetUrl(sourceAbs, rawPath, assetMap) {
  const decoded = decodeURIComponent(rawPath);
  const candidate = path.resolve(path.dirname(sourceAbs), decoded);
  const key = asPosix(candidate);
  return assetMap.get(key) ?? null;
}

async function rewriteDestination(rawValue, sourceAbs, routeBySourceAbs, routeSet, assetMap) {
  const {pathname, hash} = splitHash(rawValue);
  if (!pathname || pathname.startsWith('#')) return rawValue;

  if (/^[a-z]+:\/\//i.test(pathname)) {
    const mappedRoute = mapAbsoluteUrlToRoute(pathname, routeSet);
    if (mappedRoute && routeSet.has(mappedRoute)) {
      return `${encodePathForUrl(mappedRoute)}${hash}`;
    }
    return rawValue;
  }

  if (pathname.startsWith('/')) {
    const normalized = normalizeRoute(decodeURIComponent(pathname));
    const aliased = routeAliases[normalized] ?? normalized;
    if (routeSet.has(aliased)) {
      return `${encodePathForUrl(aliased)}${hash}`;
    }
    return rawValue;
  }

  if (pathname.endsWith('.md') || pathname.endsWith('.mdx')) {
    const decoded = decodeURIComponent(pathname);
    const targetAbs = path.resolve(path.dirname(sourceAbs), decoded);
    const fallbackAbs = path.resolve(
      sourceRoot,
      decoded.replace(/^(\.\.\/)+/, '').replace(/^\.\/+/, ''),
    );
    const mappedRoute =
      routeBySourceAbs.get(asPosix(targetAbs)) ?? routeBySourceAbs.get(asPosix(fallbackAbs));
    if (mappedRoute) {
      return `${encodePathForUrl(mappedRoute)}${hash}`;
    }
    addUnresolved('doc-link', sourceAbs, rawValue);
    return rawValue;
  }

  const assetUrl = await resolveLocalAssetUrl(sourceAbs, pathname, assetMap);
  if (assetUrl) {
    return `${assetUrl}${hash}`;
  }

  return rawValue;
}

function withExplicitSlug(content, route) {
  const slugLine = `slug: ${JSON.stringify(route)}\n`;
  if (content.startsWith('---\n')) {
    const endIndex = content.indexOf('\n---\n');
    if (endIndex !== -1) {
      const frontmatter = content.slice(0, endIndex + 5);
      if (/^slug:/m.test(frontmatter)) {
        return content;
      }
      return `${content.slice(0, 4)}${slugLine}${content.slice(4)}`;
    }
  }
  return `---\n${slugLine}---\n\n${content}`;
}

async function rewriteContent(content, sourceAbs, route, routeBySourceAbs, routeSet, assetMap) {
  const frontmatterMatch = content.match(/^---\n[\s\S]*?\n---\n?/);
  let frontmatter = '';
  let body = content;

  if (frontmatterMatch) {
    frontmatter = frontmatterMatch[0];
    body = content.slice(frontmatter.length);
  }

  const replaceSegment = async (segment) => {
    let rewritten = segment;
    const fileMatches = [
      ...rewritten.matchAll(
        /(!?)\[([^\]]*)\]\((<.+?\.(?:mdx?|png|jpe?g|gif|webp|svg|ya?ml)(?:#[^>]*)?>|.+?\.(?:mdx?|png|jpe?g|gif|webp|svg|ya?ml)(?:#[^)]+)?)(\s+"[^"]*")?\)/g,
      ),
    ];
    for (const match of fileMatches.reverse()) {
      const [, bang, text, rawDest, titleSuffix = ''] = match;
      const {destination, suffix} = parseLinkDestination(rawDest);
      const nextDestination = await rewriteDestination(
        destination,
        sourceAbs,
        routeBySourceAbs,
        routeSet,
        assetMap,
      );
      if (nextDestination === destination) continue;
      const replacement = `${bang}[${text}](${formatLinkDestination(nextDestination, `${suffix}${titleSuffix}`)})`;
      rewritten =
        rewritten.slice(0, match.index) +
        replacement +
        rewritten.slice(match.index + match[0].length);
    }

    const markdownMatches = [...rewritten.matchAll(/(!?)\[([^\]]*)\]\(([^)]+)\)/g)];
    for (const match of markdownMatches.reverse()) {
      const [, bang, text, rawDest] = match;
      const {destination, suffix} = parseLinkDestination(rawDest);
      const nextDestination = await rewriteDestination(
        destination,
        sourceAbs,
        routeBySourceAbs,
        routeSet,
        assetMap,
      );
      if (nextDestination === destination) continue;
      const replacement = `${bang}[${text}](${formatLinkDestination(nextDestination, suffix)})`;
      rewritten =
        rewritten.slice(0, match.index) +
        replacement +
        rewritten.slice(match.index + match[0].length);
    }

    const htmlMatches = [...rewritten.matchAll(/\b(href|src)=["']([^"']+)["']/g)];
    for (const match of htmlMatches.reverse()) {
      const [, attr, rawDest] = match;
      const nextDestination = await rewriteDestination(
        rawDest,
        sourceAbs,
        routeBySourceAbs,
        routeSet,
        assetMap,
      );
      if (nextDestination === rawDest) continue;
      const replacement = `${attr}="${nextDestination}"`;
      rewritten =
        rewritten.slice(0, match.index) +
        replacement +
        rewritten.slice(match.index + match[0].length);
    }

    return rewritten;
  };

  const parts = body.split(/(```[\s\S]*?```)/g);
  for (let index = 0; index < parts.length; index += 1) {
    if (parts[index].startsWith('```')) continue;
    parts[index] = await replaceSegment(parts[index]);
  }

  const finalContent = `${frontmatter}${parts.join('')}`
    .replace(
      /\/platform\/capsules\/how-to-add-a-custom-domain#steps-to-add-a-custom-domain/g,
      '/platform/capsules/how-to-add-a-custom-domain#add-a-custom-domain',
    );

  return withExplicitSlug(finalContent, route);
}

function buildSidebarItems(nodes) {
  return nodes.map((node) => {
    if (node.kind === 'heading') {
      return {
        type: 'category',
        label: node.label,
        items: buildSidebarItems(node.items),
      };
    }

    if (node.items.length > 0) {
      const category = {
        type: 'category',
        label: node.label,
        items: buildSidebarItems(node.items),
      };
      if (node.docId) {
        category.link = {type: 'doc', id: node.docId};
      }
      return category;
    }

    return node.docId;
  });
}

async function generateSidebar(section, targetRelBySummaryPath) {
  const summaryPath = path.join(sourceRoot, section.summary);
  const summary = await fs.readFile(summaryPath, 'utf8');
  const rootItems = [];
  let currentHeading = null;
  let stack = [];

  for (const line of summary.split('\n')) {
    const headingMatch = line.match(/^##\s+(.+)$/);
    if (headingMatch) {
      currentHeading = {kind: 'heading', label: headingMatch[1].trim(), items: []};
      rootItems.push(currentHeading);
      stack = [];
      continue;
    }

    const bulletMatch = line.match(/^(\s*)\*\s+\[(.+?)\]\((.+?)\)$/);
    if (!bulletMatch) continue;

    const [, spaces, label, rawLink] = bulletMatch;
    const depth = Math.floor(spaces.length / 2);
    const link = normalizeSummaryPath(rawLink);
    const targetRel = targetRelBySummaryPath.get(`${section.key}:${link}`);
    if (!targetRel) {
      throw new Error(`Missing sidebar target for ${section.key}:${link}`);
    }
    const node = {
      kind: 'doc',
      label,
      docId: docIdForTargetRel(targetRel),
      items: [],
    };

    while (stack.length > depth) stack.pop();
    const parent = stack.at(-1);
    const container = parent
      ? parent.items
      : currentHeading
        ? currentHeading.items
        : rootItems;
    container.push(node);
    stack.push(node);
  }

  return buildSidebarItems(rootItems);
}

async function main() {
  await fs.mkdir(generatedRoot, {recursive: true});
  await fs.rm(docsRoot, {recursive: true, force: true});
  await fs.mkdir(docsRoot, {recursive: true});
  await fs.rm(path.join(staticRoot, 'gitbook-assets'), {recursive: true, force: true});

  const docs = [];
  const routeBySourceAbs = new Map();
  const targetRelBySummaryPath = new Map();

  for (const section of sections) {
    const sectionDir = path.join(sourceRoot, section.sourceDir);
    const publishedSourcePaths = await getPublishedSourcePaths(section);
    for (const sourceRel of publishedSourcePaths) {
      const abs = path.join(sectionDir, sourceRel);
      const targetRel = targetRelForSource(section.key, sourceRel);
      const route = routeForTargetRel(targetRel);
      const docId = docIdForTargetRel(targetRel);

      docs.push({
        sectionKey: section.key,
        sourceAbs: abs,
        targetRel,
        route,
        docId,
      });
      routeBySourceAbs.set(asPosix(abs), route);
      targetRelBySummaryPath.set(`${section.key}:${sourceRel}`, targetRel);
    }
  }

  for (const page of enterprisePages) {
    docs.push({
      sectionKey: 'enterprise',
      sourceAbs: path.join(sourceRoot, '__live__', page.targetRel),
      targetRel: page.targetRel,
      route: routeForTargetRel(page.targetRel),
      docId: docIdForTargetRel(page.targetRel),
      remoteUrl: page.slug
        ? `https://docs.codecapsules.io/enterprise/${page.slug}.md`
        : 'https://docs.codecapsules.io/enterprise/enterprise.md',
    });
  }

  const routeSet = new Set(docs.map((doc) => doc.route));

  const assetRoots = [
    {key: 'root', abs: path.join(sourceRoot, '.gitbook', 'assets')},
    ...sections.map((section) => ({
      key: section.key,
      abs: path.join(sourceRoot, section.sourceDir, '.gitbook', 'assets'),
    })),
  ];

  const assetMap = new Map();
  for (const assetRoot of assetRoots) {
    if (!(await pathExists(assetRoot.abs))) continue;
    const destination = path.join(staticRoot, 'gitbook-assets', assetRoot.key);
    await fs.mkdir(path.dirname(destination), {recursive: true});
    await fs.cp(assetRoot.abs, destination, {recursive: true});

    const otherEntries = await walkFiles(assetRoot.abs);
    for (const absPath of otherEntries) {
      const relative = asPosix(path.relative(assetRoot.abs, absPath));
      assetMap.set(
        asPosix(absPath),
        `/gitbook-assets/${assetRoot.key}/${encodePathForUrl(relative)}`,
      );
    }
  }

  for (const doc of docs) {
    const targetPath = path.join(docsRoot, doc.targetRel);
    await fs.mkdir(path.dirname(targetPath), {recursive: true});
    const rawContent = normalizeGitBookSyntax(await loadSourceContent(doc));
    const rewritten = await rewriteContent(
      rawContent,
      doc.sourceAbs,
      doc.route,
      routeBySourceAbs,
      routeSet,
      assetMap,
    );
    await fs.writeFile(targetPath, rewritten);
  }

  const sidebars = {
    getStarted: await generateSidebar(sections[0], targetRelBySummaryPath),
    platform: await generateSidebar(sections[1], targetRelBySummaryPath),
    products: await generateSidebar(sections[2], targetRelBySummaryPath),
    tutorials: await generateSidebar(sections[3], targetRelBySummaryPath),
    cli: await generateSidebar(sections[4], targetRelBySummaryPath),
    enterprise: [
      'enterprise/index',
      'enterprise/aws',
      'enterprise/azure',
      'enterprise/gcp',
      'enterprise/vmware',
    ],
  };

  const sidebarsFile = `import type {SidebarsConfig} from '@docusaurus/plugin-content-docs';\n\nconst sidebars: SidebarsConfig = ${JSON.stringify(sidebars, null, 2)};\n\nexport default sidebars;\n`;
  await fs.writeFile(path.join(projectRoot, 'sidebars.ts'), sidebarsFile);

  const redirects = [
    {from: ['/readme'], to: '/'},
    {from: ['/cli/readme'], to: '/cli'},
  ];
  await fs.writeFile(
    path.join(generatedRoot, 'redirects.json'),
    JSON.stringify(redirects, null, 2),
  );
  await fs.writeFile(
    path.join(generatedRoot, 'route-map.json'),
    JSON.stringify(
      docs.map((doc) => ({
        route: doc.route,
        targetRel: doc.targetRel,
        source: asPosix(path.relative(projectRoot, doc.sourceAbs)),
      })),
      null,
      2,
    ),
  );
  await fs.writeFile(
    path.join(generatedRoot, 'unresolved-links.json'),
    JSON.stringify([...unresolvedLinks.values()], null, 2),
  );

  await normalizeGitBookAssets();

  console.log(`Migrated ${docs.length} docs.`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
