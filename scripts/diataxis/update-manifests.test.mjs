import test from 'node:test';
import assert from 'node:assert/strict';
import {updatePaths} from './update-manifests.mjs';

test('updatePaths: replaces backticked old doc paths and nothing else', () => {
  const moves = [{oldPath: 'docs/frontend/react.md', newPath: 'docs/how-to/frontend/react.md'}];
  const text = '| `docs/frontend/react.md` | How to Host React (docs/frontend/react.md) |\n| `docs/other.md` | x |';
  assert.equal(updatePaths(text, moves), '| `docs/how-to/frontend/react.md` | How to Host React (docs/frontend/react.md) |\n| `docs/other.md` | x |');
});
