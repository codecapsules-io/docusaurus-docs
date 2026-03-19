import React, {useState, useEffect, type ReactNode} from 'react';
import Content from '@theme-original/DocItem/Content';
import type ContentType from '@theme/DocItem/Content';
import type {WrapperProps} from '@docusaurus/types';
import {useDoc} from '@docusaurus/plugin-content-docs/client';
import useBaseUrl from '@docusaurus/useBaseUrl';
import CategoryCards from '@site/src/components/CategoryCards';

type Props = WrapperProps<typeof ContentType>;

function CopyButton(): ReactNode {
  const [state, setState] = useState<'idle' | 'copied'>('idle');

  function handleCopy() {
    const text = document.querySelector('article')?.innerText ?? '';
    navigator.clipboard.writeText(text).then(() => {
      setState('copied');
      setTimeout(() => setState('idle'), 2000);
    });
  }

  return (
    <button className="copy-page-btn" onClick={handleCopy} aria-label="Copy page as markdown">
      {state === 'copied' ? (
        <>
          <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true"><path d="M13.78 4.22a.75.75 0 0 1 0 1.06l-7.25 7.25a.75.75 0 0 1-1.06 0L2.22 9.28a.75.75 0 0 1 1.06-1.06L6 10.94l6.72-6.72a.75.75 0 0 1 1.06 0z"/></svg>
          Copied!
        </>
      ) : (
        <>
          <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true"><path d="M0 6.75C0 5.784.784 5 1.75 5h1.5a.75.75 0 0 1 0 1.5h-1.5a.25.25 0 0 0-.25.25v7.5c0 .138.112.25.25.25h7.5a.25.25 0 0 0 .25-.25v-1.5a.75.75 0 0 1 1.5 0v1.5A1.75 1.75 0 0 1 9.25 16h-7.5A1.75 1.75 0 0 1 0 14.25Z"/><path d="M5 1.75C5 .784 5.784 0 6.75 0h7.5C15.216 0 16 .784 16 1.75v7.5A1.75 1.75 0 0 1 14.25 11h-7.5A1.75 1.75 0 0 1 5 9.25Zm1.75-.25a.25.25 0 0 0-.25.25v7.5c0 .138.112.25.25.25h7.5a.25.25 0 0 0 .25-.25v-7.5a.25.25 0 0 0-.25-.25Z"/></svg>
          Copy page
        </>
      )}
    </button>
  );
}

export default function ContentWrapper(props: Props): ReactNode {
  const {frontMatter} = useDoc();
  const fm = frontMatter as Record<string, unknown>;
  const cover = fm.cover as string | undefined;
  const coverY = typeof fm.coverY === 'number' ? fm.coverY : undefined;
  const coverUrl = useBaseUrl(cover ?? '');
  const objectPosition = coverY !== undefined ? `center ${coverY}%` : undefined;

  useEffect(() => {
    if (cover) {
      const tocWrap = document.querySelector('.toc-with-cta') as HTMLElement | null;
      if (tocWrap) {
        tocWrap.style.marginTop = '480px';
      }
      return () => {
        if (tocWrap) {
          tocWrap.style.marginTop = '';
        }
      };
    }
  }, [cover]);

  return (
    <>
      {cover && (
        <div className="doc-cover">
          <img src={coverUrl} alt="" className="doc-cover__img" loading="eager" style={objectPosition ? {objectPosition} : undefined} />
        </div>
      )}
      <div className="doc-copy-row">
        <CopyButton />
      </div>
      <Content {...props} />
      <CategoryCards />
    </>
  );
}
