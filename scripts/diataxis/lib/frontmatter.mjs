const FM = /^---\n([\s\S]*?)\n---\n/;

export function parseDoc(text) {
  const m = FM.exec(text);
  if (!m) return {frontmatter: {}, body: text};
  const frontmatter = {};
  for (const line of m[1].split('\n')) {
    const kv = /^([A-Za-z_][\w-]*):\s*(.*)$/.exec(line);
    if (kv) frontmatter[kv[1]] = kv[2].replace(/^"(.*)"$/, '$1').replace(/^'(.*)'$/, '$1');
  }
  return {frontmatter, body: text.slice(m[0].length)};
}

export function setFrontmatter(text, {slug, diataxis}) {
  const m = FM.exec(text);
  if (!m) throw new Error('no frontmatter');
  let lines = m[1].split('\n');
  if (diataxis !== undefined) lines = lines.filter((l) => !/^diataxis:/.test(l));
  const slugAt = lines.findIndex((l) => /^slug:/.test(l));
  if (slug !== undefined) {
    if (slugAt >= 0) lines[slugAt] = `slug: "${slug}"`;
    else lines.unshift(`slug: "${slug}"`);
  }
  if (diataxis !== undefined) {
    const at = lines.findIndex((l) => /^slug:/.test(l));
    lines.splice(at + 1, 0, `diataxis: ${diataxis}`);
  }
  return `---\n${lines.join('\n')}\n---\n` + text.slice(m[0].length);
}
