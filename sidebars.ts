import type { SidebarsConfig } from '@docusaurus/plugin-content-docs';

const sidebars: SidebarsConfig = {
  getStarted: [
    'index',
    {
      type: 'category',
      label: 'Frontend',
      items: [
        'frontend/angular',
        'frontend/react',
        'frontend/vue',
        'frontend/next.js',
        'frontend/svelte',
        'frontend/static-html',
      ],
      link: {
        type: 'doc',
        id: 'frontend/index',
      },
    },
    {
      type: 'category',
      label: 'Backend',
      items: [
        {
          type: 'category',
          label: 'Python',
          items: [
            'backend/python/python',
            'backend/python/django',
            'backend/python/flask',
            'backend/python/python-discord-bot',
            'backend/python/python-telegram-bot',
            'backend/python/whatsapp-bot',
          ],
          link: {
            type: 'doc',
            id: 'backend/python/index',
          },
        },
        {
          type: 'category',
          label: 'Node.js',
          items: [
            'backend/node.js/express.js',
            'backend/node.js/node.js-discord-bot',
            'backend/node.js/node.js-telegram-bot',
            'backend/node.js/slack-bot',
          ],
          link: {
            type: 'doc',
            id: 'backend/node.js/index',
          },
        },
        'backend/java',
        {
          type: 'category',
          label: 'Go',
          items: ['backend/go/go', 'backend/go/go-telegram-bot'],
          link: {
            type: 'doc',
            id: 'backend/go/index',
          },
        },
        {
          type: 'category',
          label: 'Docker',
          items: [
            'backend/docker/caddy-docker-site',
            'backend/docker/docker-laravel-app',
            'backend/docker/docker-php-app',
            'backend/docker/flask-docker-app',
          ],
          link: {
            type: 'doc',
            id: 'backend/docker/index',
          },
        },
      ],
      link: {
        type: 'doc',
        id: 'backend/index',
      },
    },
    {
      type: 'category',
      label: 'Database',
      items: [
        {
          type: 'category',
          label: 'MySQL',
          items: [
            'database/mysql/django-+-mysql',
            'database/mysql/flask-+-mysql',
            'database/mysql/java-+-mysql',
          ],
          link: {
            type: 'doc',
            id: 'database/mysql/index',
          },
        },
        {
          type: 'category',
          label: 'MongoDB',
          items: [
            'database/mongodb/django-+-mongodb',
            'database/mongodb/express-+-mongodb',
            'database/mongodb/flask-+-mongodb',
          ],
          link: {
            type: 'doc',
            id: 'database/mongodb/index',
          },
        },
        'database/postgres',
        'database/redis',
      ],
      link: {
        type: 'doc',
        id: 'database/index',
      },
    },
    {
      type: 'category',
      label: 'Full Stack',
      items: [
        {
          type: 'category',
          label: 'Next.js',
          items: [
            'full-stack/next.js/next.js-+-express.js',
            'full-stack/next.js/next.js-+-mongodb',
            'full-stack/next.js/static-file-share-with-flask-and-caddy',
          ],
          link: {
            type: 'doc',
            id: 'full-stack/next.js/index',
          },
        },
        'full-stack/flask-+-htmx',
        'full-stack/mean-stack',
        'full-stack/mern-stack',
      ],
      link: {
        type: 'doc',
        id: 'full-stack/index',
      },
    },
    'persistent-storage',
    'wordpress',
  ],
  platform: [
    'platform/index',
    'platform/readme',
    'platform/what-is-code-capsules',
    'platform/platform',
    {
      type: 'category',
      label: 'Account',
      items: [
        'platform/account/how-do-i-add-a-payment-method',
        'platform/account/how-do-i-reset-my-password',
        'platform/account/how-do-i-enable-2fa',
        'platform/account/connect-version-control',
      ],
    },
    {
      type: 'category',
      label: 'Billing',
      items: [
        'platform/billing/how-do-i-change-my-billing-details',
        'platform/billing/how-do-i-view-my-invoices',
        'platform/billing/how-does-the-pricing-work',
      ],
    },
    {
      type: 'category',
      label: 'Teams',
      items: [
        'platform/teams/what-is-a-team',
        'platform/teams/how-do-i-add-remove-teams',
        'platform/teams/how-do-i-add-team-members',
        'platform/teams/share-a-repo-with-a-team',
      ],
    },
    {
      type: 'category',
      label: 'Spaces',
      items: [
        'platform/spaces/what-is-a-space',
        'platform/spaces/how-do-i-add-remove-a-space',
      ],
    },
    {
      type: 'category',
      label: 'Capsules',
      items: [
        'platform/capsules/what-is-a-capsule',
        'platform/capsules/how-do-i-add-remove-stop-capsules',
        'platform/capsules/how-to-add-a-custom-domain',
      ],
    },
    {
      type: 'category',
      label: 'Regions',
      items: ['platform/regions/what-regions-does-code-capsules-support'],
    },
    {
      type: 'category',
      label: 'Security',
      items: ['platform/security/basic-auth'],
    },
  ],
  products: [
    'products/index',
    {
      type: 'category',
      label: 'Backend Capsule',
      items: [
        'products/backend-capsule/deploy',
        'products/backend-capsule/supported-runtimes',
        'products/backend-capsule/configure',
        'products/backend-capsule/scale',
        'products/backend-capsule/monitor',
        'products/backend-capsule/logs',
        'products/backend-capsule/alerting',
        'products/backend-capsule/add-procfile',
      ],
      link: {
        type: 'doc',
        id: 'products/backend-capsule/index',
      },
    },
    {
      type: 'category',
      label: 'Docker Capsule',
      items: [
        'products/docker-capsule/writing-a-dockerfile',
        'products/docker-capsule/deploy',
        'products/docker-capsule/configure',
        'products/docker-capsule/builds',
        'products/docker-capsule/scale',
        'products/docker-capsule/monitor',
        'products/docker-capsule/logs',
        'products/docker-capsule/alerting',
      ],
      link: {
        type: 'doc',
        id: 'products/docker-capsule/index',
      },
    },
    {
      type: 'category',
      label: 'Database Capsule',
      items: [
        {
          type: 'category',
          label: 'MySQL',
          items: [
            'products/database-capsule/mysql/deploy',
            'products/database-capsule/mysql/configure',
            'products/database-capsule/mysql/connect-locally',
            {
              type: 'category',
              label: 'Versions',
              key: 'mysql-versions',
              link: {
                type: 'doc',
                id: 'products/database-capsule/mysql/versions',
              },
              items: [
                {
                  type: 'category',
                  label: 'Upgrades',
                  key: 'mysql-upgrades',
                  link: {
                    type: 'doc',
                    id: 'products/database-capsule/mysql/versions/upgrades/index',
                  },
                  items: [
                    'products/database-capsule/mysql/versions/upgrades/5-7-to-8-0',
                  ],
                },
              ],
            },
            'products/database-capsule/mysql/schema-migrations',
            'products/database-capsule/mysql/scale',
            'products/database-capsule/mysql/backups',
            'products/database-capsule/mysql/monitor',
            'products/database-capsule/mysql/logs',
            'products/alerting',
          ],
        },
        {
          type: 'category',
          label: 'MongoDB',
          items: [
            'products/database-capsule/mongodb/deploy',
            'products/database-capsule/mongodb/configure',
            {
              type: 'category',
              label: 'Versions',
              key: 'mongodb-versions',
              link: {
                type: 'doc',
                id: 'products/database-capsule/mongodb/versions',
              },
              items: [
                {
                  type: 'category',
                  label: 'Upgrades',
                  key: 'mongodb-upgrades',
                  link: {
                    type: 'doc',
                    id: 'products/database-capsule/mongodb/versions/upgrades/index',
                  },
                  items: [
                    'products/database-capsule/mongodb/versions/upgrades/7-0-to-8-0',
                  ],
                },
              ],
            },
            'products/database-capsule/mongodb/scale',
            'products/database-capsule/mongodb/backups',
            'products/database-capsule/mongodb/monitor',
            'products/alerting',
          ],
        },
        {
          type: 'category',
          label: 'DocumentDB',
          items: [
            'products/database-capsule/documentdb/deploy',
            'products/database-capsule/documentdb/configure',
            'products/database-capsule/documentdb/connect-locally',
            'products/database-capsule/documentdb/scale',
            'products/database-capsule/documentdb/backups',
            'products/database-capsule/documentdb/monitor',
            'products/database-capsule/documentdb/logs',
            'products/alerting',
          ],
        },
        {
          type: 'category',
          label: 'PostgreSQL',
          items: [
            'products/database-capsule/postgresql/deploy',
            'products/database-capsule/postgresql/configure',
            'products/database-capsule/postgresql/connect-locally',
            'products/database-capsule/postgresql/scale',
            'products/database-capsule/postgresql/backups',
            'products/database-capsule/postgresql/monitor',
            'products/database-capsule/postgresql/logs',
            'products/alerting',
          ],
        },
        {
          type: 'category',
          label: 'Redis',
          items: [
            'products/database-capsule/redis/deploy',
            'products/database-capsule/redis/configure',
            'products/database-capsule/redis/connect-locally',
            'products/database-capsule/redis/scale',
            'products/database-capsule/redis/monitor',
            'products/database-capsule/redis/logs',
            'products/alerting',
          ],
        },
      ],
      link: {
        type: 'doc',
        id: 'products/database-capsule/index',
      },
    },
    {
      type: 'category',
      label: 'Frontend capsule',
      items: [
        'products/frontend-capsule/deploy',
        'products/frontend-capsule/supported-runtimes',
        'products/frontend-capsule/configure',
        'products/frontend-capsule/scale',
        'products/frontend-capsule/monitor',
        'products/frontend-capsule/logs',
        'products/alerting-1',
        'products/frontend-capsule/custom-domains',
      ],
      link: {
        type: 'doc',
        id: 'products/frontend-capsule/index',
      },
    },
    {
      type: 'category',
      label: 'Storage Capsule',
      items: [
        'products/storage-capsule/deploy',
        'products/storage-capsule/configure',
        'products/storage-capsule/scale',
        'products/storage-capsule/backups',
        'products/storage-capsule/monitor',
        'products/storage-capsule/logs',
        'products/storage-capsule/alerting',
        'products/storage-capsule/how-state-works',
      ],
    },
    {
      type: 'category',
      label: 'Wordpress Capsule',
      items: [
        'products/wordpress-capsule/deploy',
        'products/wordpress-capsule/configure',
        'products/wordpress-capsule/routing',
        'products/wordpress-capsule/caching',
        'products/wordpress-capsule/performance',
        'products/wordpress-capsule/security',
        'products/wordpress-capsule/cron',
        'products/wordpress-capsule/scale',
        'products/wordpress-capsule/backups',
        'products/wordpress-capsule/monitor',
        'products/wordpress-capsule/logs',
        'products/wordpress-capsule/alerting',
      ],
    },
    {
      type: 'category',
      label: 'Agent Capsule',
      items: [
        'products/agent-capsule/deploy',
        'products/agent-capsule/configure',
        'products/agent-capsule/scale',
        'products/agent-capsule/monitor',
        'products/agent-capsule/logs',
        'products/agent-capsule/templates',
        {
          type: 'category',
          label: 'Chat',
          items: ['products/agent-capsule/chat/agent-api-sample'],
          link: {
            type: 'doc',
            id: 'products/agent-capsule/chat/index',
          },
        },
        'products/agent-capsule/alerting',
      ],
    },
    {
      type: 'category',
      label: 'Enterprise Clusters',
      items: ['products/enterprise-clusters/overview'],
    },
  ],
  tutorials: [
    'tutorials/index',
    'tutorials/how-to-create-and-host-a-telegram-bot-on-code-capsules',
    'tutorials/create-and-host-a-telegram-bot-with-node.js-on-code-capsules',
    'tutorials/create-and-host-go-ai-telegram-bot',
    'tutorials/how-to-simply-host-a-production-wordpress-blog',
    'tutorials/build-a-personal-calendar-assistant-with-telegram-and-agent-capsules',
    'tutorials/use-codecapsules-with-an-agent',
    'tutorials/heroku-migration-guide',
    'tutorials/create-and-host-an-api-with-flask',
    'tutorials/building-a-full-stack-application-with-flask-and-htmx',
    'tutorials/nuxt3-and-nitro',
    'tutorials/optimizing-performance-in-mern-stack-tips-and-techniques',
    'tutorials/build-a-slackbot-with-node.js-to-monitor-your-applications',
    'tutorials/building-a-full-stack-application-with-express-and-htmx',
    'tutorials/getting-started-with-mean-stack-a-step-by-step-tutorial',
    'tutorials/building-a-web-file-store',
    'tutorials/building-a-book-recommendations-app-with-php-sqlite-and-docker',
    'tutorials/build-a-mern-job-board',
    'tutorials/build-a-generative-art-application-with-pillow-flask-and-htmx',
    'tutorials/white-label-your-app-with-code-capsules',
    'tutorials/building-a-game-catalogue-api',
    'tutorials/best-practices-for-structuring-mean-mern-mevn-projects',
    'tutorials/video-guides',
    'tutorials/deploy-emdash-on-code-capsules',
    'tutorials/deploy-paperclip-ai-orchestration-on-code-capsules',
  ],
  cli: [
    {
      type: 'category',
      label: 'Code Capsules CLI',
      items: [
        {
          type: 'category',
          label: 'Getting Started',
          items: [
            'cli/readme/getting-started/prerequisites',
            'cli/readme/getting-started/installation-and-usage',
            'cli/readme/getting-started/quick-start',
          ],
          link: {
            type: 'doc',
            id: 'cli/readme/getting-started/index',
          },
        },
        {
          type: 'category',
          label: 'Commands',
          items: [
            'cli/readme/commands/login',
            'cli/readme/commands/logout',
            'cli/readme/commands/proxy',
            'cli/readme/commands/whoami',
          ],
          link: {
            type: 'doc',
            id: 'cli/readme/commands/index',
          },
        },
        'cli/readme/global-options',
      ],
      link: {
        type: 'doc',
        id: 'cli/index',
      },
    },
  ],
  enterprise: [
    'enterprise/index',
    'enterprise/aws',
    'enterprise/azure',
    'enterprise/gcp',
    'enterprise/vmware',
  ],
  agenticAutomation: [
    'agentic-automation/index',
    'agentic-automation/the-problem',
    'agentic-automation/the-framework',
    'agentic-automation/designing-agents',
    'agentic-automation/deployment',
  ],
};

export default sidebars;
