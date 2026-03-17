import React, {type ReactNode} from 'react';
import Desktop from '@theme-original/DocItem/TOC/Desktop';
import type DesktopType from '@theme/DocItem/TOC/Desktop';
import type {WrapperProps} from '@docusaurus/types';

type Props = WrapperProps<typeof DesktopType>;

export default function DesktopWrapper(props: Props): ReactNode {
  return (
    <div className="toc-with-cta">
      <Desktop {...props} />
      <div className="sidebar-cta">
        <p className="sidebar-cta__title">Ready to deploy?</p>
        <p className="sidebar-cta__desc">Start your free trial and go live in minutes.</p>
        <a
          href="https://app.codecapsules.io"
          target="_blank"
          rel="noreferrer"
          className="sidebar-cta__btn"
        >
          Get Started Free →
        </a>
      </div>
    </div>
  );
}
