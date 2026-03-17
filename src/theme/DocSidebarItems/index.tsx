import React from 'react';
import OriginalDocSidebarItems from '@theme-original/DocSidebarItems';
import type DocSidebarItemsType from '@theme/DocSidebarItems';
import type {WrapperProps} from '@docusaurus/types';

type Props = WrapperProps<typeof DocSidebarItemsType>;

export default function DocSidebarItemsWrapper(props: Props): React.JSX.Element {
  return <OriginalDocSidebarItems {...props} />;
}
