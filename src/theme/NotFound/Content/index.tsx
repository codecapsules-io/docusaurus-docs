/**
 * The docs are served by a static Frontend Capsule with SPA routing, so unknown
 * URLs return the site's index.html with HTTP 200 and this content renders
 * client-side (docs live at "/", so the docs plugin renders it for any unmatched path).
 * Mark it noindex so search engines drop those URLs instead of indexing duplicates.
 */
import React from 'react';
import Head from '@docusaurus/Head';
import Content from '@theme-original/NotFound/Content';
import type ContentType from '@theme/NotFound/Content';
import type {WrapperProps} from '@docusaurus/types';

type Props = WrapperProps<typeof ContentType>;

export default function NotFoundContentWrapper(props: Props): JSX.Element {
  return (
    <>
      <Head>
        <meta name="robots" content="noindex, follow" />
        <title>Page not found | Code Capsules Docs</title>
      </Head>
      <Content {...props} />
    </>
  );
}
