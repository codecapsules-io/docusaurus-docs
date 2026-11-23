# Diátaxis Restructure of the Code Capsules Docs

Date: 2026-11-23. Branch: `brenton/diataxis` (base: `main`). Status: draft, awaiting approval.

## Intent and why

The docs are convoluted. The same setup steps (sign up, create a space, create a capsule, set env vars, bind a database) are repeated across dozens of pages, pages mix task steps with explanation and reference, and the navigation is organised by product area, so a reader cannot tell whether a page will teach, instruct, look up, or explain.

The goal is to standardise on the Diátaxis framework (tutorial, how-to, reference, explanation) so every page does one job, the structure is predictable, and shared content lives in one place.

Both the file layout and the public URLs will follow Diátaxis. This is a rebuild: old URLs are not preserved and no redirects are created. The rebuild takes precedence over other in-flight doc work. The site is a Docusaurus site served at `/` (`docsRouteBasePath` is `/`).

## Goals

1. Every page in `docs/` carries exactly one of four Diátaxis types, recorded in frontmatter, and lives under the matching top-level folder and URL prefix.
2. The sidebar and navbar are organised by Diátaxis type first, then by product area.
3. Every internal link in the new site points at a live page (no broken internal links).
4. Phase 2: shared steps are written once and linked, and near-duplicate pages are merged.

## Non-goals

- Rewriting prose for style or tone beyond what a merge or extraction needs.
- Changing the content of the release notes. They stay in `release-notes/` at `/release-notes/`, outside the four types.
- Moving the enterprise pitch pages to the marketing site (listed as a follow-up question, not done here).
- Changing the Docusaurus theme, search plugin, or build tooling.

## Anti-goals (what would make this a failure even if it builds)

- A broken internal link in the rebuilt site.
- Leftover redirect entries or old slugs that point at pages that no longer exist.
- Silently losing content in a merge.
- Phase 1 containing content edits, which would make it unreviewable.

## Constraints and facts from the repo

- 234 files: `docs/` plus `release-notes/`. `DIATAXIS.md` at the repo root is the current type per file (tutorial 17, how-to 144, reference 20, explanation 12, hub 25, overview 7, release-notes 9). It is the starting input and will be revised.
- Every doc has an explicit `slug:` in frontmatter, so file path and URL are independent.
- `docusaurus.config.ts` holds a `redirects` array used by `@docusaurus/plugin-client-redirects`. Because old URLs are not preserved, the array is emptied and the plugin is removed if nothing else uses it.
- `sidebars.ts` is hand-written. The navbar in `docusaurus.config.ts` has one item per product area with `activeBaseRegex` rules tied to current URL prefixes.
- About 1,009 internal links are absolute paths (`/…`) in the markdown. They, and card-grid `href`s produced by `remarkGitbookCards`, must be rewritten to the new URLs.
- Search is `@easyops-cn/docusaurus-search-local` with `docsRouteBasePath: '/'`.
- `MANIFEST.md` lists every doc and a "Follow on CC" flag, keyed by file path. It must be kept in step with the moves.
- `i18n/en/code.json` exists. Whether it references doc paths is unchecked; the builder checks it.
- `onBrokenLinks` is `warn` and `onBrokenMarkdownLinks` is `throw`. Baseline broken links on `main` must be recorded before any move, and the phase 1 gate is "no new broken links versus that baseline", not zero. `trailingSlash` is `true`.
- Other people are merging docs and release-note PRs to `main` regularly (several per week). The rebuild takes precedence: there is no content freeze, and authors of open PRs that touch moved files rebase or redo them on top of the rebuild.

## Diátaxis types

Four types only: `tutorial`, `how-to`, `reference`, `explanation`. Hubs (link-only landing pages) and overviews do not get a fifth type. Each takes the type of the folder it sits in, as a category landing page. Release notes are outside the scheme.

Frontmatter gets a new field, for example `diataxis: how-to`, so the type is explicit and can be checked by script. (Builder's call on the field name.)

## Target structure

```
docs/
  tutorials/<area>/…        /tutorials/…
  how-to/<area>/…           /how-to/…
  reference/<area>/…        /reference/…
  explanation/<area>/…      /explanation/…
release-notes/               /release-notes/   (unchanged)
```

Areas inside each type are product areas, so how-to is not one flat list of 144 pages. Proposed areas, subject to the builder's refinement:

- how-to: `frontend`, `backend`, `full-stack`, `database`, `docker`, `wordpress`, `storage`, `agents`, `account`, `billing`, `teams`, `domains`, `cli`
- reference: `runtimes`, `versions`, `cli`, `sandbox-sdk`, `pricing`, `regions`
- explanation: `platform`, `agentic-automation`, `enterprise`, `sandbox`, `storage`

The `how-to/<area>` split is my call. A flat layout per type is the fallback if the builder finds the areas overlap.

New URLs mirror the new paths, so `docs/frontend/react.md` with slug `/frontend/react` becomes `docs/how-to/frontend/react.md` with slug `/how-to/frontend/react`.

## Navigation

- Navbar: Tutorials, How-to guides, Reference, Explanation, plus the existing "What's new" (release notes) and Support. The current per-product items (Platform, Products, Agentic Automation, Sandbox, Enterprise, CLI) go away as top-level items. `activeBaseRegex` on "Get Started" must be updated.
- Sidebars: one sidebar per type, grouped by area. Category landing pages replace most hand-written hub pages where Docusaurus can generate them.
- `docs/index.md` stays the single entry point and links to the four sections.

## Approaches considered

1. **Everything in one pass.** One branch moves, re-slugs and merges. One review, but a very large diff, and a broken link cannot be traced to the move or the merge.
2. **Two phases (chosen).** Phase 1 is structure only. Phase 2 is content.
3. **One Diátaxis type at a time.** Small steps, but the navigation is half old and half new for a long time.

Chosen: approach 2, because phase 1 can be verified by script and phase 2 then only diffs real content changes.

## Phase 1: structure only (no content edits)

1. Confirm the type for each page, starting from `DIATAXIS.md`, folding the three extra types into the four per the rules above. Hubs and overviews follow the area they sit in. The enterprise pages and `sandbox/index` go under `explanation/` as a loose fit, flagged for phase 2.
2. Add the `diataxis:` frontmatter field.
3. Move each file to its new path and rewrite its `slug:`.
4. Remove the `redirects` array (and the redirect plugin if nothing else uses it). No redirects are generated for old slugs.
5. Rewrite every internal link, including absolute links, card-grid hrefs and links in release notes, to the new URLs.
6. Rebuild `sidebars.ts` and the navbar.
7. Update `MANIFEST.md` paths and `DIATAXIS.md`.

Hub pages are kept as-is in phase 1 (moved to the new location as category landing pages). Pruning link-only hubs happens in phase 2.

#### Calls made while reviewing this design (my calls, not agreed)

- The area-based URL scheme above is final for planning. Generate the whole old-to-new map once from the page list. If the builder finds an area clash, fall back to flat-per-type for that type only and regenerate the map.
- The type of each page is the `DIATAXIS.md` label as given. A page whose content is mostly another type is not re-typed or split in phase 1. Flag it in a list for phase 2. A hub takes the type of the majority of the pages it links to. Hubs that mix types go in the type of their folder's main job.
- "No content edits" in phase 1 means the diff touches only: frontmatter (`slug`, `diataxis`), file moves, link targets, navigation config, removal of the redirects config, `MANIFEST.md`, `DIATAXIS.md`. Hubs move verbatim. Converting hubs to generated category pages is phase 2. A script checks that the body of every moved file is identical apart from link targets.
- The `diataxis:` frontmatter field needs no schema change, since Docusaurus tolerates unknown frontmatter.
- Link rewrite scope: absolute `/…` links, relative `.md` links, anchors (kept), card-grid `href`s, links in `src/`, navbar and footer items in `docusaurus.config.ts`, and `static/` HTML. The script is a link-aware parser, not a one-off regex. It need not be re-runnable against a moving `main`, since there is no freeze, but it should be idempotent.
- Old URLs are free to be reused, since nothing redirects.
- Phase 2 is planned after phase 1 merges, since the overlap measurements will change. The plan covers phase 1 in detail and phase 2 at the level of the table above.
- `MANIFEST.md` has no known consumer outside the repo. It is updated in the same change.

## Phase 1 verification (scripted, must pass)

- File count in equals file count out (234), no file lost.
- Every doc has exactly one valid `diataxis` value and sits under the matching folder and URL prefix.
- No old slug remains in any frontmatter, link or config, and the `redirects` array is gone.
- `npm run build` succeeds, with no new broken-link or broken-anchor warnings versus the baseline recorded from `main`.
- A link check over the built site shows no internal 404s beyond the baseline.
- A script confirms that every moved file's body is identical to the original apart from link targets.

## Phase 2: content consolidation

Measured overlap (similarity of body lines, 0 to 1):

| Pages | Similarity | Action |
|---|---|---|
| `frontend/react` vs `vue` | 0.83 | Merge react, vue, svelte into one runtime-keyed page with a small differences table (`angular` at 0.51 and `next.js` get a look, but may stay separate) |
| `frontend-capsule/custom-domains` vs `platform/capsules/how-to-add-a-custom-domain` | 0.86 | Merge into one how-to, delete the other |
| Postgres vs MySQL vs Redis `logs`, `monitor`, `scale`, `backups` | 0.50 to 0.86, 2–14 lines each | Merge into per-task shared pages with a section per database |
| Database `deploy` pages | 0.09 | Keep separate |
| `docs/wordpress.md` vs `products/wordpress-capsule/deploy` | 0.43 | Merge into the product deploy how-to, delete the other |
| `docs/persistent-storage.md` vs `products/storage-capsule/deploy` | 0.54 | Merge into the product deploy how-to, delete the other |
| `platform/platform.md` vs `what-is-code-capsules` | 0.00 | Leave as two pages (not duplicates) |

Extract and link the repeated procedures, each as one how-to: create an account, create a space, connect GitHub or GitLab (exists), create a capsule, set environment variables, bind a database or storage capsule, add a custom domain. The roughly 19 to 25 pages that repeat these steps replace them with links.

Pull explanation out of procedure pages (for example "why use a health check", "why git is the right deployment primitive") into explanation pages linked from the how-to. Move settings tables out of how-to steps into reference pages.

Merged or deleted pages get no redirect. A diff of the two pages is reviewed before each merge, and unique content is kept.

## What is left to the builder

- Final area names and the per-page area assignment.
- The frontmatter field name and whether to add `sidebar_position`.
- How to implement the move, re-slug and link rewrite (a script is expected, not manual edits).
- Whether the new top-level pages (type landing pages) are generated by Docusaurus or are small hand-written `index.md` files.
- The exact set of verification scripts.

## Open follow-ups (not part of this change)

- Move the five enterprise pitch pages to the marketing site.
- Add troubleshooting content (Diátaxis has no type for it, so it would sit under how-to).
