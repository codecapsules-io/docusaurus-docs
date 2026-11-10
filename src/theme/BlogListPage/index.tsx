/**
 * Release notes listing page (the only blog instance, id "release-notes").
 * Based on @docusaurus/theme-classic BlogListPage, with a page header added.
 */
import React from 'react';
import clsx from 'clsx';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import {PageMetadata, HtmlClassNameProvider, ThemeClassNames} from '@docusaurus/theme-common';
import BlogLayout from '@theme/BlogLayout';
import BlogListPaginator from '@theme/BlogListPaginator';
import SearchMetadata from '@theme/SearchMetadata';
import BlogPostItems from '@theme/BlogPostItems';
import BlogListPageStructuredData from '@theme/BlogListPage/StructuredData';
import type {Props} from '@theme/BlogListPage';

function BlogListPageMetadata(props: Props): JSX.Element {
  const {metadata} = props;
  const {siteConfig: {title: siteTitle}} = useDocusaurusContext();
  const {blogDescription, blogTitle, permalink} = metadata;
  const title = permalink === '/' ? siteTitle : blogTitle;
  return (
    <>
      <PageMetadata title={title} description={blogDescription} />
      <SearchMetadata tag="blog_posts_list" />
    </>
  );
}

function ReleaseNotesHeader({metadata}: Pick<Props, 'metadata'>): JSX.Element {
  const feed = `${metadata.permalink.replace(/\/$/, '')}/rss.xml`;
  return (
    <header className="rn-hero">
      <span className="rn-hero__eyebrow">Changelog</span>
      <h1 className="rn-hero__title">{metadata.blogTitle}</h1>
      <p className="rn-hero__lead">{metadata.blogDescription}</p>
      <div className="rn-hero__actions">
        <a className="rn-hero__button" href={feed}>
          <svg aria-hidden="true" width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M6.18 15.64a2.18 2.18 0 1 1 0 4.36 2.18 2.18 0 0 1 0-4.36ZM4 4.44A15.56 15.56 0 0 1 19.56 20h-2.83A12.73 12.73 0 0 0 4 7.27V4.44Zm0 5.66a9.9 9.9 0 0 1 9.9 9.9h-2.83A7.07 7.07 0 0 0 4 12.93V10.1Z" /></svg>
          Subscribe via RSS
        </a>
        <Link className="rn-hero__link" to="/">Back to the docs</Link>
      </div>
    </header>
  );
}

function BlogListPageContent(props: Props): JSX.Element {
  const {metadata, items, sidebar} = props;
  return (
    <BlogLayout sidebar={sidebar}>
      <ReleaseNotesHeader metadata={metadata} />
      <div className="rn-timeline">
        <BlogPostItems items={items} />
      </div>
      <BlogListPaginator metadata={metadata} />
    </BlogLayout>
  );
}

export default function BlogListPage(props: Props): JSX.Element {
  return (
    <HtmlClassNameProvider className={clsx(ThemeClassNames.wrapper.blogPages, ThemeClassNames.page.blogListPage)}>
      <BlogListPageMetadata {...props} />
      <BlogListPageStructuredData {...props} />
      <BlogListPageContent {...props} />
    </HtmlClassNameProvider>
  );
}
