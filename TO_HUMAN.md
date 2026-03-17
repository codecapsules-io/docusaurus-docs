# Migration Notes

- The current live docs are split across separate GitBook spaces: `get-started`, `platform`, `products`, `tutorials`, `cli`, and `enterprise`.
- `enterprise` was live in GitBook but missing from the local source tree. The migration pulls those five pages from GitBook's markdown export so the live URLs remain covered.
- One source page, `tutorials/how-to-simply-host-a-production-wordpress-blog.md`, contained unresolved merge-conflict markers in the local repo. The migration falls back to the published GitBook markdown for conflicted pages instead of copying the broken local content into Docusaurus.
- The older mkdocs/Caddy redirects in the parent project mostly point to legacy mkdocs-only content, not to the current live GitBook tree. I preserved only minimal safe redirects inside Docusaurus (`/readme` and `/cli/readme`) and did not invent broad mappings for the legacy mkdocs routes.
- GitBook-specific syntax needed normalization for Docusaurus:
  - GitBook hints were converted to Docusaurus admonitions.
  - GitBook tabs/code/raw/openapi blocks were flattened into plain markdown where needed.
  - GitBook figure/img HTML was normalized to MDX-safe HTML.
  - Cross-space absolute GitBook links were rewritten to local Docusaurus routes.
  - Section-local asset paths were rewritten into `/gitbook-assets/...`.
- Verification status:
  - `npm run migrate` generates 159 docs, matching the current live sitemap coverage.
  - `npm run build` succeeds.
  - Built sitemap contains all 159 live routes, plus the expected `/search` page from local search.
