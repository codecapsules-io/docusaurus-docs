# SEO Implementation Prompt — Code Capsules (PaaS)

## Context & Goal

You are implementing a comprehensive, production-grade SEO system for **Code Capsules** (codecapsules.io), a Developer Platform as a Service (PaaS) that allows developers to deploy, host, and scale applications without managing infrastructure. Think: Heroku, Railway, Render — but built for African developers and teams globally.

The site serves several distinct page types:
- **Product / Capsule Type pages** — describing each deployable capsule (Backend, Frontend, Docker, Database, Data Science, etc.)
- **Technology stack pages** — "Deploy Node.js on Code Capsules", "Host a Django App", etc.
- **Pricing & Plan pages** — Free, Team, Pro, Enterprise tiers
- **Documentation pages** — guides, references, quickstarts
- **Blog / Tutorial pages** — developer content, how-tos, release notes
- **Customer / Use Case pages** — case studies, industry verticals
- **Landing pages** — feature-specific (CI/CD, Custom Domains, Auto-scaling, etc.)
- **Region pages** — if applicable (AWS Cape Town, EU regions, etc.)

Your job is to implement **all SEO systems described below** across the entire site. This is a full SEO engineering brief — treat it as a production implementation, not a proof of concept.

---

## 1. PROGRAMMATIC METADATA & HEADING PATTERNS

### 1.1 Variables & Taxonomy

The Code Capsules content taxonomy has the following dimensions:

**[CapsuleType]** — The deployable unit type:
- Backend Capsule
- Frontend Capsule
- Docker Capsule
- Database Capsule
- Data Science Capsule
- Static Site

**[Language / Framework]** — The technology stack:
- Node.js / Express
- Python / Django / Flask / FastAPI
- Ruby / Rails
- Go
- Java / Spring
- PHP / Laravel
- .NET / C#
- React / Next.js / Vue / Nuxt / Angular / Svelte
- PostgreSQL / MySQL / MongoDB / Redis

**[UseCase]** — What the developer is trying to accomplish:
- Deploy an API
- Host a web app
- Run a background worker
- Host a database
- Build a data pipeline
- Deploy a static site

**[Plan]** — Pricing tier:
- Free
- Team
- Pro
- Enterprise

**[Region]** — Deployment region (if applicable):
- South Africa
- EU (Europe)
- Global

**[Tenant]** — The brand name: "Code Capsules"

---

### 1.2 Title Tag Patterns

Apply these patterns based on the page context. Titles must be under 60 characters where possible. Prioritise the developer's intent keyword first.

**Capsule Type landing pages (no stack filter):**
- `{CapsuleType} Hosting — Deploy on Code Capsules`
- Example: `Backend Capsule Hosting — Deploy on Code Capsules`

**Technology stack pages (single language/framework):**
- `Deploy {Language} Apps on Code Capsules | {CapsuleType}`
- Example: `Deploy Node.js Apps on Code Capsules | Backend Capsule`
- Example: `Host a Django App on Code Capsules | Python Hosting`

**Technology + Use Case combination pages:**
- `{UseCase} with {Language} — Code Capsules`
- Example: `Deploy a REST API with Node.js — Code Capsules`
- Example: `Host a Flask Web App — Code Capsules`

**Pricing / Plan pages:**
- `Code Capsules {Plan} Plan — PaaS Pricing`
- National/global: `Code Capsules Pricing — Free PaaS for Developers`

**Feature pages (CI/CD, Custom Domains, Auto-scaling, etc.):**
- `{Feature} for Developers — Code Capsules`
- Example: `CI/CD Pipeline Hosting — Code Capsules`
- Example: `Custom Domains & SSL — Code Capsules`

**Documentation pages:**
- `{Guide Title} — Code Capsules Docs`
- Example: `Deploying a Node.js App — Code Capsules Docs`

**Blog / Tutorial pages:**
- `{Article Headline} | Code Capsules Blog`

**Homepage:**
- `Code Capsules — PaaS for Developers | Deploy in Minutes`

---

### 1.3 H1 Patterns

H1s must match search intent and avoid duplicating the title tag exactly. They should be direct, developer-facing, and action-oriented.

**Capsule Type pages:**
- `{CapsuleType} Hosting`
- Example: `Backend Capsule Hosting`

**Technology stack pages:**
- `Deploy {Language} on Code Capsules`
- Example: `Deploy Node.js on Code Capsules`

**Technology + Use Case:**
- `{UseCase} with {Language}`
- Example: `Build and Deploy a REST API with Python`

**Pricing pages:**
- `Simple, Transparent PaaS Pricing`
- or: `Code Capsules {Plan} — What's Included`

**Feature pages:**
- `{Feature} Built for Developers`

**Documentation pages:**
- Use the guide/article title verbatim as H1

**Blog pages:**
- Use the article headline verbatim as H1

---

### 1.4 Keyword Substitution Rules

Apply these substitutions consistently across all programmatic titles and H1s:

| Raw value | Display substitution |
|-----------|---------------------|
| `backend-capsule` | `Backend Capsule` |
| `frontend-capsule` | `Frontend Capsule` |
| `docker-capsule` | `Docker Capsule` |
| `database-capsule` | `Database Capsule` |
| `data-science-capsule` | `Data Science Capsule` |
| `static-site` | `Static Site` |
| `nodejs` / `node-js` | `Node.js` |
| `nextjs` / `next-js` | `Next.js` |
| `vuejs` / `vue-js` | `Vue.js` |
| `nuxtjs` / `nuxt-js` | `Nuxt.js` |
| `react` | `React` |
| `django` | `Django` |
| `flask` | `Flask` |
| `fastapi` | `FastAPI` |
| `postgresql` / `postgres` | `PostgreSQL` |
| `mongodb` | `MongoDB` |
| `redis` | `Redis` |
| `mysql` | `MySQL` |
| `dotnet` / `.net` | `.NET` |
| `csharp` | `C#` |

Add a default fallback: if no match, title-case the slug and use as-is.

---

### 1.5 Meta Description Patterns

Meta descriptions must be under 155 characters and include a clear value proposition and implicit or explicit CTA.

**Capsule Type pages:**
`Host your {Language} {CapsuleType} on Code Capsules. Push to GitHub, deploy in seconds. Free plan available. No infrastructure headaches.`

**Technology stack pages:**
`Deploy your {Language} app to Code Capsules in minutes. Git-based deployments, auto-scaling, custom domains & SSL included. Start free.`

**Feature pages:**
`Code Capsules gives you {Feature} out of the box. Built for developers who want to ship fast without managing servers.`

**Pricing pages:**
`Code Capsules pricing starts free. Scale to Team, Pro, or Enterprise as you grow. No surprise bills. Transparent PaaS pricing.`

---

## 2. INTERLINKING STRATEGY

Internal links are one of the most powerful SEO signals. They distribute PageRank, establish topical authority, and help Google understand your site architecture. The following rules define the interlinking hierarchy for Code Capsules.

### 2.1 Linking Hierarchy

```
Homepage
  └── Capsule Type pages (Backend, Frontend, Docker, Database, Data Science)
        └── Technology Stack pages (per capsule type)
              └── Use Case / Tutorial pages (per stack)
                    └── Individual Blog / Doc pages
```

Links must always flow **downward** (parent → child) or **laterally** (same level, related topic). Never link up without a contextual reason.

### 2.2 Page-Level Interlinking Rules

**Homepage:**
- Must feature a **Mega Footer** linking to all Capsule Type pages, top Language pages, all Plan pages, and key Feature pages
- Must link to the 3–5 most important technology stack pages (e.g. Node.js, Python, Docker)
- Must link to Docs, Blog, and Pricing

**Capsule Type pages (e.g. /capsules/backend):**
- Must link to every supported language/framework for that capsule type
- Must link to 3–5 relevant tutorials or quickstart docs
- Must link to Pricing
- Must link to other Capsule Type pages (lateral: "Also explore Docker Capsules")

**Technology Stack pages (e.g. /capsules/backend/nodejs):**
- Must link to 3–5 related tutorial/blog pages ("How to deploy Express.js", "Node.js env vars on Code Capsules")
- Must link back to parent Capsule Type page
- Must link laterally to related stacks ("Also deploy Python backends")
- Must link to the Quickstart doc for that stack

**Tutorial / Documentation pages:**
- Must link to the relevant Capsule Type page and Language page
- Must link to 2–4 related tutorials ("Next steps", "Related guides")
- Must link to Pricing if relevant

**Blog / Article pages:**
- Must link to 1–2 product pages that are contextually relevant to the article
- Must link to related articles (2–4 "You might also like" links)
- Must NOT be isolated pages with no outbound internal links

**All non-product pages (legal, about, contact):**
- Must include a **Mini Footer** with links to Capsule Types, Pricing, Docs, and Blog

### 2.3 Anchor Text Rules

- Use descriptive, keyword-rich anchor text: "Deploy Node.js on Code Capsules" not "click here"
- Never use the same anchor text for two different destination URLs
- Vary anchor text naturally across pages — don't repeat identical anchors on every page
- For lateral links, use the destination page's H1 as anchor text

### 2.4 Mini Footer (All non-homepage pages)

The mini footer must include:
- Links to all Capsule Types
- Links to Pricing
- Links to Documentation
- Links to Blog
- Links to About, Contact, Status, GitHub

### 2.5 Mega Footer (Homepage and Capsule Type pages)

The mega footer must include:
- **Column 1: Capsule Types** — Backend, Frontend, Docker, Database, Data Science, Static Site
- **Column 2: Languages & Frameworks** — Node.js, Python, Ruby, Go, Java, PHP, .NET, React, Next.js, Vue, Django, Laravel
- **Column 3: Resources** — Docs, Blog, Tutorials, API Reference, Status Page, Changelog
- **Column 4: Company** — About, Pricing, Careers, Contact, GitHub, Twitter/X, LinkedIn

---

## 3. SITEMAP INDEX STRUCTURE

Sitemaps must be split by content type to keep them under 10,000 URLs each and to signal topical authority to search engines. All sitemaps must reference LASTMOD dates.

### 3.1 Sitemap Architecture

```
sitemap-index.xml
  ├── sitemap-product-pages-index.xml
  │     └── sitemap-product-pages-{n}.xml          [Capsule type, feature, plan pages]
  ├── sitemap-stack-pages-index.xml
  │     └── sitemap-stack-pages-{n}.xml             [Language/framework pages]
  ├── sitemap-docs-index.xml
  │     └── sitemap-docs-{n}.xml                    [All documentation pages]
  ├── sitemap-blog-index.xml
  │     └── sitemap-blog-{n}.xml                    [All blog/tutorial posts]
  ├── sitemap-use-case-index.xml
  │     └── sitemap-use-case-{n}.xml                [Use case / industry pages]
  └── sitemap-pages-index.xml
        └── sitemap-pages-{n}.xml                   [Static pages: about, pricing, contact, legal]
```

### 3.2 Priority Values

| Sitemap | Priority |
|---------|----------|
| `sitemap-product-pages-{n}.xml` | 1.0 |
| `sitemap-stack-pages-{n}.xml` | 0.9 |
| `sitemap-use-case-{n}.xml` | 0.8 |
| `sitemap-docs-{n}.xml` | 0.8 |
| `sitemap-blog-{n}.xml` | 0.7 |
| `sitemap-pages-{n}.xml` | 0.6 |

### 3.3 Update Frequency

- Product/stack/feature pages: `weekly`
- Documentation: `weekly`
- Blog posts: `monthly` after publish date (do not artificially inflate)
- Static pages: `monthly`

### 3.4 LASTMOD

Every URL in every sitemap must include a `<lastmod>` in ISO 8601 / RFC 3339 format (e.g. `2026-04-15T09:00:00+02:00`). Update LASTMOD whenever the page content changes meaningfully — not on every deploy if content hasn't changed.

---

## 4. JSON-LD SCHEMA MARKUP

Use JSON-LD exclusively (Google's preferred format). Inject into `<head>` dynamically per page type. Never mark up content that isn't visible to the user on the page.

Validate all schema using:
- https://validator.schema.org
- https://search.google.com/test/rich-results

---

### 4.1 Homepage Schema

```json
{
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebSite",
      "@id": "https://codecapsules.io/#website",
      "name": "Code Capsules",
      "alternateName": "Code Capsules PaaS",
      "url": "https://codecapsules.io",
      "inLanguage": "en",
      "potentialAction": {
        "@type": "SearchAction",
        "target": {
          "@type": "EntryPoint",
          "urlTemplate": "https://codecapsules.io/docs/search?q={search_term_string}"
        },
        "query-input": "required name=search_term_string"
      }
    },
    {
      "@type": "Organization",
      "@id": "https://codecapsules.io/#organization",
      "name": "Code Capsules",
      "url": "https://codecapsules.io",
      "logo": {
        "@type": "ImageObject",
        "url": "https://codecapsules.io/images/logo.png",
        "width": 300,
        "height": 60
      },
      "description": "Code Capsules is a developer-focused Platform as a Service (PaaS) that lets teams deploy, host, and scale applications without managing infrastructure.",
      "foundingLocation": {
        "@type": "Place",
        "name": "South Africa"
      },
      "sameAs": [
        "https://twitter.com/codecapsules",
        "https://github.com/codecapsules-io",
        "https://linkedin.com/company/codecapsules",
        "https://www.youtube.com/@codecapsules"
      ],
      "contactPoint": {
        "@type": "ContactPoint",
        "contactType": "customer support",
        "url": "https://codecapsules.io/contact",
        "availableLanguage": "English"
      }
    }
  ]
}
```

**Fields to populate dynamically:**
- `logo.url` — from site settings
- `sameAs` — from social media settings
- `description` — from site tagline/settings

---

### 4.2 Product / Capsule Type Page Schema

Use `SoftwareApplication` as the primary type. Nest an `Offer` for pricing.

```json
{
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "SoftwareApplication",
      "@id": "https://codecapsules.io/capsules/backend/#product",
      "name": "Backend Capsule",
      "description": "Deploy Node.js, Python, Go, Ruby, Java or .NET backend APIs and services on Code Capsules. Git-based deployments, auto-scaling, and custom domains included.",
      "url": "https://codecapsules.io/capsules/backend",
      "applicationCategory": "DeveloperApplication",
      "operatingSystem": "Any",
      "offers": [
        {
          "@type": "Offer",
          "name": "Free Plan",
          "price": "0",
          "priceCurrency": "USD",
          "availability": "https://schema.org/InStock",
          "url": "https://codecapsules.io/pricing"
        },
        {
          "@type": "Offer",
          "name": "Team Plan",
          "price": "TBD",
          "priceCurrency": "USD",
          "availability": "https://schema.org/InStock",
          "url": "https://codecapsules.io/pricing"
        }
      ],
      "featureList": [
        "Git-based deployments",
        "Auto-scaling",
        "Custom domains",
        "Free SSL certificates",
        "Environment variable management",
        "Build logs and metrics"
      ],
      "publisher": {
        "@id": "https://codecapsules.io/#organization"
      }
    },
    {
      "@type": "BreadcrumbList",
      "itemListElement": [
        { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://codecapsules.io" },
        { "@type": "ListItem", "position": 2, "name": "Capsules", "item": "https://codecapsules.io/capsules" },
        { "@type": "ListItem", "position": 3, "name": "Backend Capsule", "item": "https://codecapsules.io/capsules/backend" }
      ]
    }
  ]
}
```

**Generate dynamically:**
- `name`, `description`, `url` from page context
- `featureList` from the feature set associated with each capsule type
- `offers` from the pricing configuration
- Breadcrumb from page URL hierarchy

---

### 4.3 Technology Stack Page Schema

Use `TechArticle` or `SoftwareApplication` depending on whether it is editorial or product-driven.

```json
{
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "TechArticle",
      "@id": "https://codecapsules.io/capsules/backend/nodejs/#page",
      "headline": "Deploy Node.js Apps on Code Capsules",
      "description": "Learn how to deploy Node.js and Express applications to Code Capsules. Covers environment setup, GitHub integration, and custom domains.",
      "url": "https://codecapsules.io/capsules/backend/nodejs",
      "inLanguage": "en",
      "about": {
        "@type": "SoftwareApplication",
        "name": "Node.js",
        "url": "https://nodejs.org"
      },
      "publisher": {
        "@id": "https://codecapsules.io/#organization"
      },
      "datePublished": "{ISO_DATE}",
      "dateModified": "{ISO_DATE}"
    },
    {
      "@type": "BreadcrumbList",
      "itemListElement": [
        { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://codecapsules.io" },
        { "@type": "ListItem", "position": 2, "name": "Capsules", "item": "https://codecapsules.io/capsules" },
        { "@type": "ListItem", "position": 3, "name": "Backend Capsule", "item": "https://codecapsules.io/capsules/backend" },
        { "@type": "ListItem", "position": 4, "name": "Node.js", "item": "https://codecapsules.io/capsules/backend/nodejs" }
      ]
    }
  ]
}
```

---

### 4.4 Documentation Page Schema

```json
{
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "TechArticle",
      "@id": "https://codecapsules.io/docs/deploying-nodejs/#article",
      "headline": "Deploying a Node.js App — Code Capsules Docs",
      "description": "Step-by-step guide to deploying a Node.js application on Code Capsules using GitHub integration.",
      "url": "https://codecapsules.io/docs/deploying-nodejs",
      "inLanguage": "en",
      "datePublished": "{ISO_DATE}",
      "dateModified": "{ISO_DATE}",
      "author": {
        "@type": "Organization",
        "@id": "https://codecapsules.io/#organization"
      },
      "publisher": {
        "@id": "https://codecapsules.io/#organization"
      },
      "isPartOf": {
        "@type": "WebSite",
        "@id": "https://codecapsules.io/#website"
      },
      "about": {
        "@type": "SoftwareApplication",
        "name": "Node.js"
      }
    },
    {
      "@type": "BreadcrumbList",
      "itemListElement": [
        { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://codecapsules.io" },
        { "@type": "ListItem", "position": 2, "name": "Docs", "item": "https://codecapsules.io/docs" },
        { "@type": "ListItem", "position": 3, "name": "Deploying a Node.js App", "item": "https://codecapsules.io/docs/deploying-nodejs" }
      ]
    }
  ]
}
```

---

### 4.5 Blog / Tutorial Article Schema

Google strongly recommends three image aspect ratios for Google Discover eligibility. This is mandatory.

```json
{
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "BlogPosting",
      "@id": "https://codecapsules.io/blog/{slug}/#article",
      "headline": "{Article Title — under 110 chars}",
      "description": "{Meta description}",
      "url": "https://codecapsules.io/blog/{slug}",
      "inLanguage": "en",
      "image": [
        {
          "@type": "ImageObject",
          "url": "https://codecapsules.io/images/blog/{slug}-1x1.jpg",
          "width": 1200,
          "height": 1200
        },
        {
          "@type": "ImageObject",
          "url": "https://codecapsules.io/images/blog/{slug}-4x3.jpg",
          "width": 1200,
          "height": 900
        },
        {
          "@type": "ImageObject",
          "url": "https://codecapsules.io/images/blog/{slug}-16x9.jpg",
          "width": 1200,
          "height": 675
        }
      ],
      "datePublished": "{ISO_DATE_WITH_TIMEZONE}",
      "dateModified": "{ISO_DATE_WITH_TIMEZONE}",
      "author": [
        {
          "@type": "Person",
          "name": "{Author Name}",
          "url": "https://codecapsules.io/authors/{author-slug}",
          "image": "https://codecapsules.io/images/authors/{author-slug}.jpg"
        }
      ],
      "publisher": {
        "@type": "Organization",
        "@id": "https://codecapsules.io/#organization",
        "name": "Code Capsules",
        "logo": {
          "@type": "ImageObject",
          "url": "https://codecapsules.io/images/logo.png"
        }
      },
      "isPartOf": {
        "@type": "WebSite",
        "@id": "https://codecapsules.io/#website"
      }
    },
    {
      "@type": "BreadcrumbList",
      "itemListElement": [
        { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://codecapsules.io" },
        { "@type": "ListItem", "position": 2, "name": "Blog", "item": "https://codecapsules.io/blog" },
        { "@type": "ListItem", "position": 3, "name": "{Article Title}", "item": "https://codecapsules.io/blog/{slug}" }
      ]
    }
  ]
}
```

**Critical:** `datePublished` and `dateModified` MUST include timezone offset (e.g. `2026-04-15T09:00:00+02:00` for SAST). If an article is updated, `dateModified` must update automatically.

**Author E-E-A-T:** Link each author to a profile page. If the author is a developer/expert, mention their credentials in the author bio. Google's E-E-A-T (Experience, Expertise, Authoritativeness, Trustworthiness) signals heavily weight developer content written by verified practitioners.

---

### 4.6 Blog / Docs Archive (Collection) Page Schema

```json
{
  "@context": "https://schema.org",
  "@type": "CollectionPage",
  "name": "Code Capsules Blog — Developer Tutorials & PaaS Guides",
  "description": "Tutorials, how-tos, and engineering guides for developers deploying on Code Capsules.",
  "url": "https://codecapsules.io/blog",
  "mainEntity": {
    "@type": "ItemList",
    "itemListOrder": "https://schema.org/ItemListOrderDescending",
    "numberOfItems": {COUNT},
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "item": {
          "@type": "BlogPosting",
          "url": "https://codecapsules.io/blog/{slug}",
          "headline": "{Article Title}",
          "image": "https://codecapsules.io/images/blog/{slug}-16x9.jpg",
          "datePublished": "{ISO_DATE}"
        }
      }
    ]
  }
}
```

---

### 4.7 Pricing Page Schema

```json
{
  "@context": "https://schema.org",
  "@type": "WebPage",
  "name": "Code Capsules Pricing — PaaS Plans for Developers",
  "description": "Compare Code Capsules plans. Start free, scale to Team, Pro or Enterprise. No infrastructure overhead.",
  "url": "https://codecapsules.io/pricing",
  "mainEntity": {
    "@type": "ItemList",
    "name": "Code Capsules Pricing Plans",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "item": {
          "@type": "Offer",
          "name": "Free Plan",
          "description": "For individual developers and side projects.",
          "price": "0",
          "priceCurrency": "USD",
          "availability": "https://schema.org/InStock",
          "url": "https://codecapsules.io/pricing#free"
        }
      },
      {
        "@type": "ListItem",
        "position": 2,
        "item": {
          "@type": "Offer",
          "name": "Team Plan",
          "description": "For small teams who need collaboration and more resources.",
          "price": "{PRICE}",
          "priceCurrency": "USD",
          "availability": "https://schema.org/InStock",
          "url": "https://codecapsules.io/pricing#team"
        }
      }
    ]
  }
}
```

---

### 4.8 FAQ Schema

Any page with a FAQ section (pricing, product pages, docs) must include:

```json
{
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "What is a Capsule?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "A Capsule is a deployable unit on Code Capsules. Each Capsule type (Backend, Frontend, Docker, Database) maps to a specific kind of workload."
      }
    },
    {
      "@type": "Question",
      "name": "Is Code Capsules free to use?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Yes. Code Capsules offers a permanent free plan for individual developers. Paid plans unlock more resources, team collaboration, and advanced features."
      }
    }
  ]
}
```

Implement this dynamically — parse FAQ blocks or accordion components from page content and generate the schema automatically. Only output it if the page actually contains visible FAQ content.

---

### 4.9 BreadcrumbList (Site-wide)

Every page on the site must output a `BreadcrumbList`. Generate it dynamically from the URL path. Rules:

- Always start with Home → `https://codecapsules.io`
- Maximum 5 levels deep
- The last item in the breadcrumb is the current page (no trailing `item` URL required per Google spec, but include it)
- Do NOT output breadcrumbs if a third-party SEO plugin is already generating them — check for existing output first

---

## 5. CANONICALIZATION RULES

### 5.1 Core Rules

| Page type | Canonical strategy |
|-----------|-------------------|
| Single filter (one stack, one capsule type) | Self-canonical |
| Multiple filters applied | Strip extra filters, canonical = clean base URL |
| Paginated pages | Self-canonical with `?page=N` appended LAST |
| Sort/order parameters | Always strip from canonical |
| UTM parameters | Always strip from canonical |
| Session/auth tokens | Always strip from canonical |
| Search result pages | Canonical to base collection URL |

### 5.2 Critical Canonical URL Components (strict order)

The canonical URL must only include these components in this exact sequence:

1. `category` (e.g. `backend`, `frontend`, `docker`)
2. `stack` or `language` (e.g. `nodejs`, `python`) — optional
3. `plan` (e.g. `free`, `team`) — optional
4. `region` (e.g. `za`, `eu`) — optional
5. `page=N` — if paginated, ALWAYS last

All other query parameters (sort, utm_*, ref, session, etc.) must be stripped from the canonical.

### 5.3 Multiple Filter Consolidation

**If a user selects multiple stacks or categories**, the canonical must fall back to the lowest common parent:

- `?category=backend&stack=nodejs&stack=python` → canonical: `?category=backend` (strip multi-stack, keep category)
- `?category=backend&category=frontend` → canonical: `/capsules/` (strip all, use parent collection)

**If a user selects multiple regions**, resolve to the lowest common ancestor:
- EU + SA regions selected → canonical: base product page (no region filter)

### 5.4 Pagination Canonicalization

- Page 1: canonical = clean URL with NO page parameter
- Page 2+: canonical = clean URL + `?page=N` (appended last, using `&page=N` not `&amp;page=N`)
- Pagination pages must be `index, follow` — they are NOT thin content and must be crawlable
- Never use `rel="prev"` / `rel="next"` (deprecated by Google) — rely on self-canonicals + internal linking

**Bug to avoid:** Do NOT double-escape the ampersand in canonical tags. The HTML output must be `&amp;` in the attribute value (correct HTML encoding), NOT `&amp;amp;` or `#038;`. Build the URL with raw `&` then use a single HTML-safe output function — never escape twice.

### 5.5 URL Structure

Recommended clean URL structure (implement if not already in place):

```
/capsules/                                    → All capsule types
/capsules/backend/                            → Backend Capsule landing
/capsules/backend/nodejs/                     → Node.js on Backend Capsule
/capsules/frontend/                           → Frontend Capsule landing
/capsules/frontend/react/                     → React on Frontend Capsule
/capsules/docker/                             → Docker Capsule landing
/capsules/database/postgresql/                → PostgreSQL Database Capsule
/docs/                                        → Documentation root
/docs/{category}/{guide-slug}/                → Individual doc page
/blog/                                        → Blog root
/blog/{slug}/                                 → Individual blog post
/pricing/                                     → Pricing page
/about/                                       → About page
```

Avoid query-parameter-based navigation for SEO-critical pages. Clean path segments rank significantly better for long-tail queries like "deploy django on paas" or "nodejs hosting free tier".

---

## 6. REDIRECT SYSTEM

### 6.1 Standard Redirect Rules

Implement these redirect rules at the server/infrastructure level (not application-level where possible — 301 at nginx/CDN is faster and leaks less PageRank):

- `http://` → `https://` (301)
- `www.codecapsules.io` → `codecapsules.io` (301) — or vice versa, pick one and be consistent
- Trailing slash normalisation: enforce a consistent rule (either always trailing slash or never) and 301 the other
- Old URL patterns from any prior site architecture → new canonical URL (maintain a redirect map)

### 6.2 AI-Driven Semantic Redirect System

For migration scenarios or legacy URL handling, implement an automated redirect system using vector embeddings. This is a novel approach to prevent 404-induced ranking loss during platform migrations.

**Architecture:**

```
[User hits 404]
       │
       ▼
[Standard pattern matching]
  (exact match, slug match, ID lookup)
       │
       ├── Match found → 301 redirect
       │
       └── No match
              │
              ▼
       [Vector API call]
         POST /api/redirect-suggest
         { "url": "/old/path" }
              │
              ▼
       [API looks up URL in qdrant]
       (pre-indexed embeddings of all live site URLs)
              │
              ▼
       [Returns { best_match_url, confidence_score }]
              │
              ├── confidence_score >= 0.75 → 301 to best_match_url
              │
              └── confidence_score < 0.75 → Show smart 404 page
                    (suggest closest matches, link to docs/blog/pricing)
```

**Components to build:**

1. **Sitemap Indexer** — A script that reads your sitemap, fetches each URL's title/meta description/slug, and generates a text embedding using `nomic-embed-text` (768 dimensions). Store each embedding in qdrant with the URL as metadata.

2. **Qdrant Collection** — Create a collection `site_urls` with vector size 768 and cosine similarity. Each point stores `{ url, title, description, page_type }`.

3. **Embedding API** — An endpoint (e.g. a Code Capsules Backend Capsule — dogfood your own product!) that:
   - Accepts a raw URL string
   - Embeds it using nomic
   - Queries qdrant for top-3 nearest neighbours
   - Returns `{ matches: [{ url, title, confidence }] }`

4. **404 Handler** — On every 404:
   - First check a static redirect table (fast lookup)
   - If no match, call the embedding API
   - If `confidence >= 0.75`, fire a 301
   - If `confidence < 0.75`, render the smart 404 page with the top 3 suggestions displayed to the user

5. **Smart 404 Page** — Must include:
   - Top 3 vector-suggested pages with titles and descriptions
   - Link to Docs, Blog, and Pricing
   - Search bar
   - Never a dead end

**Note:** This system CANNOT handle pages that require authentication or user-specific data (e.g. dashboard URLs, capsule management pages). Limit it to public marketing/docs/blog URLs only.

**Re-indexing:** Re-run the sitemap indexer whenever significant new content is published (weekly cron is fine).

---

## 7. ADDITIONAL PAAS-SPECIFIC SEO REQUIREMENTS

These are best practices specific to developer-focused SaaS/PaaS platforms that go beyond the core report recommendations.

### 7.1 Programmatic "Deploy X on Y" Pages

One of the highest-value SEO opportunities for a PaaS is programmatic pages targeting "{framework} hosting" and "deploy {language}" queries. These have clear commercial intent from developers.

Generate a page for every supported combination of `[CapsuleType] × [Language/Framework]`:
- `/capsules/backend/nodejs` → "Deploy Node.js on Code Capsules"
- `/capsules/backend/python` → "Deploy Python on Code Capsules"
- `/capsules/backend/django` → "Deploy Django on Code Capsules"
- `/capsules/frontend/react` → "Host React Apps on Code Capsules"
- `/capsules/frontend/nextjs` → "Deploy Next.js on Code Capsules"
- `/capsules/database/postgresql` → "PostgreSQL Hosting on Code Capsules"

Each page must have:
- Unique H1 and title tag (not templated/duplicated)
- At least 300 words of unique content (not a copy of the parent capsule page)
- A code snippet or CLI example specific to that stack
- A CTA to sign up / deploy now
- Links to the relevant quickstart doc

### 7.2 Comparison / Alternative Pages

High-intent queries like "heroku alternative" or "render vs code capsules" are worth targeting explicitly:
- `/alternatives/heroku` → "Code Capsules vs Heroku"
- `/alternatives/railway` → "Code Capsules vs Railway"
- `/alternatives/render` → "Code Capsules vs Render"

These pages must:
- Use an honest comparison table (don't trash competitors — Google values balanced content)
- Include schema markup: use `WebPage` with a clear `name` and `description`
- Link back to the Pricing page

### 7.3 Open Graph & Twitter Card Tags

Every page must output complete Open Graph and Twitter Card meta tags:

```html
<meta property="og:type" content="website" />
<meta property="og:title" content="{Page Title}" />
<meta property="og:description" content="{Meta Description}" />
<meta property="og:url" content="{Canonical URL}" />
<meta property="og:image" content="https://codecapsules.io/images/og/{page-slug}.jpg" />
<meta property="og:image:width" content="1200" />
<meta property="og:image:height" content="630" />
<meta property="og:site_name" content="Code Capsules" />

<meta name="twitter:card" content="summary_large_image" />
<meta name="twitter:site" content="@codecapsules" />
<meta name="twitter:title" content="{Page Title}" />
<meta name="twitter:description" content="{Meta Description}" />
<meta name="twitter:image" content="https://codecapsules.io/images/og/{page-slug}.jpg" />
```

OG images must be 1200×630px minimum. Generate them dynamically per page using a canvas/Puppeteer/Vercel OG image approach if possible.

### 7.4 Core Web Vitals

Google uses Core Web Vitals as a ranking signal. For a developer platform these are especially important — developers will judge your platform partly by your own site's performance.

- **LCP (Largest Contentful Paint):** Must be under 2.5s. Preload hero images. Use `loading="eager"` on above-fold images.
- **CLS (Cumulative Layout Shift):** Must be under 0.1. Always specify explicit width/height on images. Reserve space for async-loaded content.
- **INP (Interaction to Next Paint):** Must be under 200ms. Defer non-critical JS. Avoid large JS bundles.

Dogfood your own infrastructure: host your marketing site on Code Capsules and use it as a live performance benchmark.

### 7.5 hreflang (If Multi-language)

If Code Capsules serves content in multiple languages (e.g. English + Afrikaans, or English + French for African markets), implement `hreflang` tags:

```html
<link rel="alternate" hreflang="en" href="https://codecapsules.io/capsules/backend" />
<link rel="alternate" hreflang="fr" href="https://codecapsules.io/fr/capsules/backend" />
<link rel="alternate" hreflang="x-default" href="https://codecapsules.io/capsules/backend" />
```

### 7.6 robots.txt

Ensure `robots.txt` blocks non-SEO-relevant paths:

```
User-agent: *
Disallow: /dashboard/
Disallow: /account/
Disallow: /api/
Disallow: /admin/
Disallow: /_next/
Allow: /

Sitemap: https://codecapsules.io/sitemap-index.xml
```

### 7.7 Changelog / Release Notes as SEO Content

Developer platforms that publish changelogs and release notes build strong topical authority and attract backlinks from developer communities. Implement:
- `/changelog/` — paginated, most recent first
- Each release gets its own page with a unique slug
- Use `BlogPosting` or `TechArticle` schema
- Include dates prominently (recency is a ranking signal for developer content)
- Submit changelog URLs to the `sitemap-blog-{n}.xml` sitemap

### 7.8 Status Page Integration

Link to your status page (e.g. `status.codecapsules.io`) from the footer and from error/outage-related documentation. A visible status page builds trust and reduces negative search queries like "is code capsules down".

### 7.9 Structured Snippet Opportunities

For Pricing and Feature pages, use table markup and clear headings to target **featured snippets**. Google frequently pulls comparison tables into rich results for "heroku pricing" style queries. Structure your pricing tables using proper `<table>` HTML with `<th>` headers.

### 7.10 Internal Search Optimisation

If Code Capsules has site search:
- Exclude search result URLs from indexing (`noindex` on `?q=` pages)
- But DO use the `SearchAction` potentialAction in the WebSite schema (already included above) to enable Google Sitelinks Searchbox

---

## 8. IMPLEMENTATION CHECKLIST

Work through each item in priority order. Mark each as done only when it is fully functional and validated.

### Priority 1 — Core foundations (do these first)
- [ ] Title tag patterns implemented for all page types
- [ ] Meta description patterns implemented for all page types
- [ ] H1 patterns match spec for all page types
- [ ] Canonical tags correctly output (no double-escaping, correct parameter order)
- [ ] robots.txt reviewed and correct
- [ ] Sitemap index live and linked in robots.txt

### Priority 2 — Schema markup
- [ ] Homepage schema (WebSite + Organization)
- [ ] Product/Capsule Type page schema (SoftwareApplication + Offer + Breadcrumb)
- [ ] Stack/language page schema (TechArticle + Breadcrumb)
- [ ] Blog post schema (BlogPosting with 3 image aspect ratios + author)
- [ ] Blog/Docs archive schema (CollectionPage + ItemList)
- [ ] Pricing page schema (WebPage + ItemList of Offers)
- [ ] FAQ schema (dynamic, from page content)
- [ ] BreadcrumbList on all pages
- [ ] Validated with Google Rich Results Test

### Priority 3 — Sitemap
- [ ] sitemap-index.xml pointing to all sub-sitemaps
- [ ] sitemap-product-pages with correct priorities
- [ ] sitemap-stack-pages
- [ ] sitemap-docs
- [ ] sitemap-blog
- [ ] sitemap-pages
- [ ] All URLs include LASTMOD in RFC 3339 format
- [ ] Sitemap submitted to Google Search Console

### Priority 4 — Interlinking
- [ ] Mega footer on homepage and capsule type pages
- [ ] Mini footer on all other pages
- [ ] Capsule type pages link to all language/framework subpages
- [ ] Language pages link to relevant docs and related stacks
- [ ] Blog posts link to relevant product pages
- [ ] Programmatic "Deploy X on Y" pages all generated

### Priority 5 — Advanced
- [ ] Open Graph + Twitter Card tags on all pages
- [ ] OG images generated (1200×630px) per page
- [ ] Comparison/alternative pages (/alternatives/heroku, etc.)
- [ ] Changelog as structured SEO content
- [ ] Core Web Vitals baseline measured (target: LCP < 2.5s, CLS < 0.1, INP < 200ms)
- [ ] AI-driven redirect system built and deployed
- [ ] Smart 404 page implemented

---

## 9. VALIDATION & TESTING

After implementing each section, validate using:

- **Google Rich Results Test** — https://search.google.com/test/rich-results — for all JSON-LD schema
- **Schema Markup Validator** — https://validator.schema.org — for spec compliance
- **Google Search Console** — check for crawl errors, sitemap indexing, Core Web Vitals
- **Screaming Frog** (or similar crawler) — audit canonical tags, title tags, meta descriptions, internal links across the entire site
- **PageSpeed Insights** — https://pagespeed.web.dev — Core Web Vitals per page
- **ahrefs / Semrush** — track keyword rankings for target queries ("deploy nodejs free", "python hosting paas", "heroku alternative", etc.)

For canonical tag testing specifically: fetch the raw HTML source of each page type and confirm:
1. Exactly one `<link rel="canonical">` tag is present
2. The `href` value uses `&amp;` (not `#038;` or `&amp;amp;`) for query string separators
3. Pagination pages have the correct page number appended last
4. No extraneous parameters (utm_*, sort, session) appear in the canonical

---

## 10. NOTES & CONSTRAINTS

- All schema must be JSON-LD injected into `<head>` — no Microdata or RDFa
- Never mark up content that is not visible to the user on the page
- Do not add the same schema type twice on a single page
- If a third-party SEO plugin (e.g. Yoast, Rank Math, SEOPress) is already outputting any of these schema types, either disable the plugin's output for that type or extend it — never duplicate
- The AI redirect system must NOT fire on authenticated/dashboard URLs — public marketing and docs pages only
- LASTMOD dates must reflect real content changes — do not update them on every deploy if content hasn't changed, as this signals spam to Google
- Image alt text on all images is mandatory — it is both an SEO and an accessibility requirement
- Every page must have a unique title tag and meta description — no duplicates

---

*End of SEO implementation brief. Implement all items above for the Code Capsules PaaS platform (codecapsules.io). Work through the priority checklist in order. Validate each section before moving to the next.*
