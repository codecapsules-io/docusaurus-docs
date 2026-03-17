import React, {type ReactNode} from 'react';
import {useDoc, useDocsSidebar} from '@docusaurus/plugin-content-docs/client';
import type {PropSidebarItem} from '@docusaurus/plugin-content-docs';

function findCategoryItems(
  items: PropSidebarItem[],
  permalink: string,
): PropSidebarItem[] | null {
  for (const item of items) {
    if (item.type === 'category') {
      if (item.href === permalink) return item.items;
      const found = findCategoryItems(item.items, permalink);
      if (found) return found;
    }
  }
  return null;
}

export default function CategoryCards(): ReactNode {
  const {metadata} = useDoc();
  const sidebar = useDocsSidebar();
  if (!sidebar) return null;

  const children = findCategoryItems(sidebar.items, metadata.permalink);
  if (!children?.length) return null;

  const linkItems = children.filter(
    (item): item is PropSidebarItem & {href: string; label: string} =>
      (item.type === 'link' || item.type === 'category') && !!item.href,
  );
  if (!linkItems.length) return null;

  return (
    <div className="cards-grid" style={{marginTop: '1.5rem'}}>
      {linkItems.map((item) => (
        <a key={item.href} href={item.href} className="card">
          <strong>{item.label}</strong>
        </a>
      ))}
    </div>
  );
}
