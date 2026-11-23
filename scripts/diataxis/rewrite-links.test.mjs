import test from 'node:test';
import assert from 'node:assert/strict';
import {buildResolver, rewriteLinks} from './rewrite-links.mjs';

const mv = (oldPath, oldSlug, newPath, newSlug) => ({oldPath, oldSlug, newPath, newSlug, type: 'how-to'});
const moves = [
  mv('docs/frontend/react.md', '/frontend/react', 'docs/how-to/frontend/react.md', '/how-to/frontend/react'),
  mv('docs/products/alerting.md', '/products/alerting', 'docs/how-to/alerting.md', '/how-to/alerting'),
  mv('docs/agentic-automation/index.md', '/agentic-automation', 'docs/explanation/agentic-automation/index.md', '/explanation/agentic-automation'),
  mv('docs/agentic-automation/the-problem.md', '/agentic-automation/the-problem', 'docs/explanation/agentic-automation/the-problem.md', '/explanation/agentic-automation/the-problem'),
  mv('docs/a/d.md', '/a/d', 'docs/how-to/a/d.md', '/how-to/a/d'),
  mv('docs/a/b/c.md', '/a/b/c', 'docs/how-to/a/b/c.md', '/how-to/a/b/c'),
  mv('docs/index.md', '/', 'docs/index.md', '/'),
];
const resolve = buildResolver(moves);
const rw = (text, from = 'docs/other.md') => rewriteLinks(text, from, resolve);

test('rewrites an absolute markdown link', () => {
  assert.equal(rw('See [React](/frontend/react).').text, 'See [React](/how-to/frontend/react).');
});

test('keeps anchor, query and trailing slash', () => {
  assert.equal(rw('[a](/frontend/react/#set-up)').text, '[a](/how-to/frontend/react/#set-up)');
  assert.equal(rw('[a](/products/alerting?x=1)').text, '[a](/how-to/alerting?x=1)');
  assert.equal(rw('[a](/frontend/react#top)').text, '[a](/how-to/frontend/react#top)');
});

test('rewrites JSX/HTML href, to and src attributes', () => {
  assert.equal(rw('<a className="card" href="/frontend/react">x</a>').text, '<a className="card" href="/how-to/frontend/react">x</a>');
});

test('rewrites object-property links in TS/JS (href: "/x")', () => {
  assert.equal(rw("{ label: 'R', href: '/frontend/react/' },").text, "{ label: 'R', href: '/how-to/frontend/react/' },");
  assert.equal(rw('{to: "/products/alerting"}').text, '{to: "/how-to/alerting"}');
});

test('leaves external links, anchors, assets and release notes alone', () => {
  const t = '[a](https://example.com/frontend/react) [b](#top) ![c](/gitbook-assets/a.png) [d](/release-notes/) [e](mailto:x@y.z)';
  const r = rw(t);
  assert.equal(r.text, t);
  assert.deepEqual(r.unresolved, []);
});

test('resolves relative links against the old file location', () => {
  assert.equal(rw('[a](./the-problem)', 'docs/agentic-automation/index.md').text, '[a](/explanation/agentic-automation/the-problem)');
  assert.equal(rw('[a](../d)', 'docs/a/b/c.md').text, '[a](/how-to/a/d)');
  assert.equal(rw('[a](./the-problem.md#x)', 'docs/agentic-automation/index.md').text, '[a](/explanation/agentic-automation/the-problem#x)');
});

test('does not rewrite inside fenced code blocks or inline code', () => {
  const t = 'Text\n```md\n[a](/frontend/react)\n```\nAnd `[a](/frontend/react)` here.';
  assert.equal(rw(t).text, t);
});

test('reports an unresolved internal link and leaves the text unchanged', () => {
  const r = rw('[a](./does-not-exist) and [b](/nope/nothing)', 'docs/agentic-automation/index.md');
  assert.deepEqual(r.unresolved, ['./does-not-exist', '/nope/nothing']);
  assert.equal(r.text, '[a](./does-not-exist) and [b](/nope/nothing)');
});

test('is idempotent', () => {
  const once = rw('[a](/frontend/react/#x) [b](/)').text;
  assert.equal(rw(once).text, once);
});
