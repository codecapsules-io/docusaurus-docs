import fs from 'node:fs/promises';
import path from 'node:path';

const projectRoot = process.cwd();
const docsRoot = path.join(projectRoot, 'docs');
const generatedRoot = path.join(projectRoot, 'generated');
const assetsRoot = path.join(projectRoot, 'static', 'gitbook-assets');

const imageExtensions = new Set([
  '.png',
  '.jpg',
  '.jpeg',
  '.gif',
  '.webp',
  '.svg',
  '.avif',
]);

const sectionKeys = new Set([
  'get-started',
  'platform',
  'products',
  'tutorials',
  'cli',
  'enterprise',
  'root',
]);

function asPosix(value) {
  return value.split(path.sep).join('/');
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

async function walkFiles(dir) {
  const entries = await fs.readdir(dir, {withFileTypes: true});
  const files = [];
  for (const entry of entries) {
    const absPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...(await walkFiles(absPath)));
      continue;
    }
    if (entry.isFile()) {
      files.push(absPath);
    }
  }
  return files;
}

function slugifyBaseName(fileName) {
  const ext = path.extname(fileName).toLowerCase();
  const baseName = path.basename(fileName, path.extname(fileName));
  const slug = baseName
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[’'"]/g, '')
    .replace(/&/g, ' and ')
    .replace(/[^a-zA-Z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .replace(/-+/g, '-')
    .toLowerCase();

  return `${slug || 'asset'}${ext}`;
}

function ensureUniqueTarget(relativePath, usedTargets) {
  const parsed = path.posix.parse(relativePath);
  const baseName = parsed.name;
  const extension = parsed.ext.toLowerCase();
  let candidate = relativePath;
  let counter = 2;

  while (usedTargets.has(candidate)) {
    candidate = path.posix.join(parsed.dir, `${baseName}-${counter}${extension}`);
    counter += 1;
  }

  usedTargets.add(candidate);
  return candidate;
}

function inferSectionKey(docRelativePath) {
  const normalized = asPosix(docRelativePath);
  const [firstSegment] = normalized.split('/');
  if (sectionKeys.has(firstSegment) && firstSegment !== 'get-started' && firstSegment !== 'root') {
    return firstSegment;
  }
  return 'get-started';
}

function replaceExactReferences(content, replacements) {
  let nextContent = content;
  for (const [from, to] of replacements) {
    if (!nextContent.includes(from)) continue;
    nextContent = nextContent.split(from).join(to);
  }
  return nextContent;
}

function buildDirectReferenceReplacements(entries) {
  const replacements = new Map();

  for (const entry of entries) {
    const oldPublicPath = `/gitbook-assets/${entry.oldRelativePath}`;
    const oldEncodedPath = `/gitbook-assets/${encodePathForUrl(entry.oldRelativePath)}`;
    const newPublicPath = `/gitbook-assets/${entry.newRelativePath}`;

    replacements.set(oldPublicPath, newPublicPath);
    replacements.set(oldEncodedPath, newPublicPath);
  }

  return [...replacements.entries()].sort((left, right) => right[0].length - left[0].length);
}

function buildRelativeReferenceReplacements(entries) {
  const replacementsBySection = new Map();

  for (const entry of entries) {
    const [sectionKey, ...rest] = entry.oldRelativePath.split('/');
    if (!sectionKeys.has(sectionKey)) continue;
    const sectionRelativePath = rest.join('/');
    if (!sectionRelativePath) continue;

    const bucket = replacementsBySection.get(sectionKey) ?? new Map();
    bucket.set(`.gitbook/assets/${sectionRelativePath}`, `/gitbook-assets/${entry.newRelativePath}`);
    bucket.set(
      `.gitbook/assets/${encodePathForUrl(sectionRelativePath)}`,
      `/gitbook-assets/${entry.newRelativePath}`,
    );
    replacementsBySection.set(sectionKey, bucket);
  }

  return new Map(
    [...replacementsBySection.entries()].map(([sectionKey, bucket]) => [
      sectionKey,
      [...bucket.entries()].sort((left, right) => right[0].length - left[0].length),
    ]),
  );
}

async function collectImageEntries() {
  if (!(await pathExists(assetsRoot))) {
    return [];
  }

  const files = (await walkFiles(assetsRoot))
    .filter((filePath) => imageExtensions.has(path.extname(filePath).toLowerCase()))
    .sort((left, right) => asPosix(path.relative(assetsRoot, left)).localeCompare(asPosix(path.relative(assetsRoot, right))));

  const usedTargets = new Set();
  return files.map((oldAbsolutePath) => {
    const oldRelativePath = asPosix(path.relative(assetsRoot, oldAbsolutePath));
    const parsed = path.posix.parse(oldRelativePath);
    const sanitizedName = slugifyBaseName(parsed.base);
    const proposedRelativePath = path.posix.join(parsed.dir, sanitizedName);
    const newRelativePath = ensureUniqueTarget(proposedRelativePath, usedTargets);

    return {
      oldAbsolutePath,
      oldRelativePath,
      newRelativePath,
      newAbsolutePath: path.join(assetsRoot, newRelativePath),
    };
  });
}

async function renameAssets(entries) {
  const pendingRenames = entries.filter((entry) => entry.oldRelativePath !== entry.newRelativePath);
  if (pendingRenames.length === 0) {
    return;
  }

  const temporaryEntries = [];
  for (const [index, entry] of pendingRenames.entries()) {
    const temporaryPath = `${entry.oldAbsolutePath}.__renaming__.${index}`;
    await fs.rename(entry.oldAbsolutePath, temporaryPath);
    temporaryEntries.push({...entry, temporaryPath});
  }

  for (const entry of temporaryEntries) {
    await fs.mkdir(path.dirname(entry.newAbsolutePath), {recursive: true});
    await fs.rename(entry.temporaryPath, entry.newAbsolutePath);
  }
}

async function rewriteDocs(entries) {
  if (!(await pathExists(docsRoot))) {
    return;
  }

  const directReplacements = buildDirectReferenceReplacements(entries);
  const relativeReplacementsBySection = buildRelativeReferenceReplacements(entries);
  const docFiles = (await walkFiles(docsRoot)).filter(
    (filePath) => filePath.endsWith('.md') || filePath.endsWith('.mdx'),
  );

  for (const docPath of docFiles) {
    const docRelativePath = asPosix(path.relative(docsRoot, docPath));
    const sectionKey = inferSectionKey(docRelativePath);
    const relativeReplacements = relativeReplacementsBySection.get(sectionKey) ?? [];

    const originalContent = await fs.readFile(docPath, 'utf8');
    let nextContent = replaceExactReferences(originalContent, directReplacements);
    nextContent = replaceExactReferences(nextContent, relativeReplacements);

    if (nextContent !== originalContent) {
      await fs.writeFile(docPath, nextContent);
    }
  }
}

async function writeManifest(entries) {
  await fs.mkdir(generatedRoot, {recursive: true});
  await fs.writeFile(
    path.join(generatedRoot, 'asset-renames.json'),
    JSON.stringify(
      entries.map((entry) => ({
        from: `/gitbook-assets/${entry.oldRelativePath}`,
        to: `/gitbook-assets/${entry.newRelativePath}`,
      })),
      null,
      2,
    ),
  );
}

export async function normalizeGitBookAssets() {
  const entries = await collectImageEntries();
  await renameAssets(entries);
  await rewriteDocs(entries);
  await writeManifest(entries);

  return {
    assetCount: entries.length,
    renamedCount: entries.filter((entry) => entry.oldRelativePath !== entry.newRelativePath).length,
  };
}

if (import.meta.url === `file://${process.argv[1]}`) {
  normalizeGitBookAssets()
    .then(({assetCount, renamedCount}) => {
      console.log(`Normalized ${renamedCount} image asset paths across ${assetCount} files.`);
    })
    .catch((error) => {
      console.error(error);
      process.exit(1);
    });
}
