import {themes as prismThemes} from 'prism-react-renderer';
import type {Config} from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';

const redirects = [
  {from: ['/readme'], to: '/'},
  {from: ['/cli/readme'], to: '/cli'},
];

const url = process.env.DOCUSAURUS_URL || 'http://localhost';
const baseUrl = process.env.DOCUSAURUS_BASE_URL || '/';

// Converts GitBook-flavoured card tables to card grid divs.
// MDX parses raw HTML as mdxJsxFlowElement nodes, so we work with the MDX AST.
// Input:  <table data-card-size="large" data-view="cards">...</table>
// Output: <div className="cards-grid"><a className="card" href="...">…</a>…</div>
function remarkGitbookCards() {
  function hasAttr(node: any, name: string, value: string): boolean {
    return node.attributes?.some(
      (a: any) => a.type === 'mdxJsxAttribute' && a.name === name && a.value === value,
    ) ?? false;
  }

  function isJsxEl(n: any, tagName: string): boolean {
    return (n.type === 'mdxJsxFlowElement' || n.type === 'mdxJsxTextElement') && n.name === tagName;
  }

  function findChild(node: any, tagName: string): any {
    return node.children?.find((c: any) => isJsxEl(c, tagName));
  }

  function getAttrValue(node: any, name: string): string | undefined {
    const attr = node.attributes?.find((a: any) => a.name === name);
    return typeof attr?.value === 'string' ? attr.value : undefined;
  }

  function transformTable(tableNode: any): any {
    const tbody = findChild(tableNode, 'tbody');
    if (!tbody) return tableNode;

    const rows = (tbody.children ?? []).filter((n: any) => isJsxEl(n, 'tr'));

    const cards = rows.map((row: any) => {
      const cells = (row.children ?? []).filter((n: any) => isJsxEl(n, 'td'));
      if (cells.length < 2) return null;

      const titleCell = cells[0];
      const descCell  = cells[1];
      const linkCell  = cells[2];

      let href: string | undefined;
      if (linkCell) {
        const aEl = findChild(linkCell, 'a');
        if (aEl) {
          const raw = getAttrValue(aEl, 'href');
          // ignore image/asset hrefs — those are cover images, not page links
          if (raw && !/\.(png|jpe?g|gif|svg|webp|pdf)$/i.test(raw)) {
            href = raw;
          }
        }
      }

      const tagName = href ? 'a' : 'div';
      const attrs: any[] = [
        {type: 'mdxJsxAttribute', name: 'className', value: href ? 'card' : 'card card--disabled'},
      ];
      if (href) attrs.push({type: 'mdxJsxAttribute', name: 'href', value: href});

      return {
        type: 'mdxJsxFlowElement',
        name: tagName,
        attributes: attrs,
        children: [
          ...(titleCell.children ?? []),
          {
            type: 'mdxJsxFlowElement',
            name: 'p',
            attributes: [],
            children: descCell.children ?? [],
          },
        ],
      };
    }).filter(Boolean);

    return {
      type: 'mdxJsxFlowElement',
      name: 'div',
      attributes: [{type: 'mdxJsxAttribute', name: 'className', value: 'cards-grid'}],
      children: cards,
    };
  }

  function walk(node: any): any {
    if (
      node.type === 'mdxJsxFlowElement' &&
      node.name === 'table' &&
      hasAttr(node, 'data-card-size', 'large') &&
      hasAttr(node, 'data-view', 'cards')
    ) {
      return transformTable(node);
    }
    if (node.children) {
      node.children = node.children.map((c: any) => walk(c));
    }
    return node;
  }

  return (tree: any) => {
    tree.children = tree.children.map((c: any) => walk(c));
  };
}

const config: Config = {
  title: 'Code Capsules',
  tagline: 'Product docs, tutorials, and platform guides',
  favicon: 'img/favicon.png',

  future: {
    v4: true,
  },

  url,
  baseUrl,
  trailingSlash: true,
  onBrokenLinks: 'warn',
  markdown: {
    hooks: {
      onBrokenMarkdownLinks: 'throw',
    },
  },

  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
  },

  presets: [
    [
      'classic',
      {
        docs: {
          routeBasePath: '/',
          sidebarPath: './sidebars.ts',
          breadcrumbs: true,
          remarkPlugins: [remarkGitbookCards],
        },
        blog: false,
        theme: {
          customCss: './src/css/custom.css',
        },
        gtag: {
          trackingID: 'G-KXQN2K3LKN',
          anonymizeIP: true,
        },
      } satisfies Preset.Options,
    ],
  ],

  plugins: [
    [
      '@easyops-cn/docusaurus-search-local',
      {
        docsRouteBasePath: '/',
        indexDocs: true,
        indexBlog: false,
        hashed: true,
        language: ['en'],
        highlightSearchTermsOnTargetPage: true,
        explicitSearchResultPath: true,
      },
    ],
    [
      '@docusaurus/plugin-client-redirects',
      {
        redirects,
      },
    ],
  ],

  themeConfig: {
    image: 'img/logo.png',
    colorMode: {
      defaultMode: 'light',
      disableSwitch: true,
      respectPrefersColorScheme: false,
    },
    navbar: {
      title: '',
      logo: {
        alt: 'Code Capsules',
        src: 'https://cdn.prod.website-files.com/67ceb2cb686dbb71573b4e01/67cebcb49209deccb991799d_Code%20Capsules%20-%20Logo%201.svg',
        href: 'https://www.codecapsules.io/',
        target: '_self',
      },
      items: [
        {
          to: '/',
          position: 'left',
          label: 'Get Started',
          activeBaseRegex: '^(/|/frontend|/backend|/database|/full-stack|/persistent-storage|/wordpress)(/|$)',
        },
        {to: '/platform', label: 'Platform', position: 'left'},
        {to: '/products', label: 'Products', position: 'left'},
        {to: '/tutorials', label: 'Tutorials', position: 'left'},
        {to: '/enterprise', label: 'Enterprise', position: 'left'},
        {to: '/cli', label: 'CLI', position: 'left'},
        {type: 'search', position: 'right'},
        {
          href: 'https://codecapsules.io/slack',
          label: 'Support',
          position: 'right',
        },
        {
          href: 'https://app.codecapsules.io/auth/login',
          label: 'Get Started ↗',
          position: 'right',
          className: 'navbar-cta',
        },
      ],
    },
    docs: {
      sidebar: {
        autoCollapseCategories: false,
        hideable: false,
      },
    },
    footer: {
      style: 'light',
      links: [
        {
          title: 'Docs',
          items: [
            {label: 'Get Started', to: '/'},
            {label: 'Platform', to: '/platform'},
            {label: 'Products', to: '/products'},
            {label: 'Tutorials', to: '/tutorials'},
          ],
        },
        {
          title: 'Company',
          items: [
            {label: 'Home', href: 'https://www.codecapsules.io/'},
            {label: 'App', href: 'https://app.codecapsules.io/auth/login'},
            {label: 'Support', href: 'https://codecapsules.io/slack'},
          ],
        },
        {
          title: 'More',
          items: [
            {label: 'Enterprise', to: '/enterprise'},
            {label: 'CLI', to: '/cli'},
          ],
        },
      ],
      copyright: `Copyright © ${new Date().getFullYear()} Code Capsules.`,
    },
    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.github,
    },
  } satisfies Preset.ThemeConfig,
};

export default config;
