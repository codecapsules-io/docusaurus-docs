import React from 'react';
import type {ReactNode} from 'react';
import Layout from '@theme-original/DocItem/Layout';
import type LayoutType from '@theme/DocItem/Layout';
import type {WrapperProps} from '@docusaurus/types';
import {useDoc} from '@docusaurus/plugin-content-docs/client';
import Head from '@docusaurus/Head';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';

type Props = WrapperProps<typeof LayoutType>;

const SITE_URL = 'https://codecapsules.io';

/**
 * Converts a URL slug segment to title case.
 * Applies Code Capsules–specific substitutions from the SEO spec first.
 */
function slugToLabel(slug: string): string {
  const substitutions: Record<string, string> = {
    'backend-capsule': 'Backend Capsule',
    'frontend-capsule': 'Frontend Capsule',
    'docker-capsule': 'Docker Capsule',
    'database-capsule': 'Database Capsule',
    'data-science-capsule': 'Data Science Capsule',
    'static-site': 'Static Site',
    nodejs: 'Node.js',
    'node-js': 'Node.js',
    nextjs: 'Next.js',
    'next-js': 'Next.js',
    vuejs: 'Vue.js',
    'vue-js': 'Vue.js',
    nuxtjs: 'Nuxt.js',
    'nuxt-js': 'Nuxt.js',
    react: 'React',
    django: 'Django',
    flask: 'Flask',
    fastapi: 'FastAPI',
    postgresql: 'PostgreSQL',
    postgres: 'PostgreSQL',
    mongodb: 'MongoDB',
    redis: 'Redis',
    mysql: 'MySQL',
    dotnet: '.NET',
    csharp: 'C#',
  };

  const lower = slug.toLowerCase();
  if (substitutions[lower]) return substitutions[lower];

  return slug
    .split('-')
    .map(w => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ');
}

function buildBreadcrumbItems(
  permalink: string,
  docTitle: string,
): {
  '@type': string;
  position: number;
  name: string;
  item: string;
}[] {
  const parts = permalink.replace(/^\/|\/$/g, '').split('/').filter(Boolean);

  const items: {'@type': string; position: number; name: string; item: string}[] = [
    {'@type': 'ListItem', position: 1, name: 'Home', item: `${SITE_URL}/`},
  ];

  for (let i = 0; i < parts.length - 1; i++) {
    items.push({
      '@type': 'ListItem',
      position: i + 2,
      name: slugToLabel(parts[i]),
      item: `${SITE_URL}/${parts.slice(0, i + 1).join('/')}/`,
    });
  }

  // Current page — last breadcrumb item
  items.push({
    '@type': 'ListItem',
    position: parts.length + 1,
    name: docTitle,
    item: `${SITE_URL}${permalink}`,
  });

  // Cap at 5 levels per spec
  return items.slice(0, 5);
}

export default function DocItemLayout(props: Props): ReactNode {
  const {metadata, frontMatter} = useDoc();
  const {siteConfig} = useDocusaurusContext();

  const fm = frontMatter as Record<string, unknown>;
  const title = metadata.title || String(fm.title || '');
  const description =
    metadata.description ||
    String(fm.description || siteConfig.tagline || '');
  const permalink = metadata.permalink;

  // lastUpdatedAt is a Unix timestamp (seconds); fall back to build time
  const lastUpdatedAt = (metadata as {lastUpdatedAt?: number}).lastUpdatedAt;
  const dateModified = lastUpdatedAt
    ? new Date(lastUpdatedAt * 1000).toISOString()
    : new Date().toISOString();

  const pageUrl = `${SITE_URL}${permalink}`;

  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'TechArticle',
        '@id': `${pageUrl}#article`,
        headline: title,
        description,
        url: pageUrl,
        inLanguage: 'en',
        dateModified,
        author: {
          '@type': 'Organization',
          '@id': `${SITE_URL}/#organization`,
        },
        publisher: {
          '@id': `${SITE_URL}/#organization`,
        },
        isPartOf: {
          '@type': 'WebSite',
          '@id': `${SITE_URL}/#website`,
        },
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: buildBreadcrumbItems(permalink, title),
      },
    ],
  };

  return (
    <>
      <Head>
        <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>
      </Head>
      <Layout {...props} />
    </>
  );
}
