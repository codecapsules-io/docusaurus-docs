import type {SidebarsConfig} from '@docusaurus/plugin-content-docs';

const sidebars: SidebarsConfig = {
  "getStarted": [
    "index",
    {
      "type": "category",
      "label": "Frontend",
      "items": [
        "frontend/angular",
        "frontend/react",
        "frontend/vue",
        "frontend/next.js",
        "frontend/svelte",
        "frontend/static-html"
      ],
      "link": {
        "type": "doc",
        "id": "frontend/index"
      }
    },
    {
      "type": "category",
      "label": "Backend",
      "items": [
        {
          "type": "category",
          "label": "Python",
          "items": [
            "backend/python/python",
            "backend/python/django",
            "backend/python/flask",
            "backend/python/python-discord-bot",
            "backend/python/python-telegram-bot",
            "backend/python/whatsapp-bot"
          ],
          "link": {
            "type": "doc",
            "id": "backend/python/index"
          }
        },
        {
          "type": "category",
          "label": "Node.js",
          "items": [
            "backend/node.js/express.js",
            "backend/node.js/node.js-discord-bot",
            "backend/node.js/node.js-telegram-bot",
            "backend/node.js/slack-bot"
          ],
          "link": {
            "type": "doc",
            "id": "backend/node.js/index"
          }
        },
        "backend/java",
        {
          "type": "category",
          "label": "Go",
          "items": [
            "backend/go/go",
            "backend/go/go-telegram-bot"
          ],
          "link": {
            "type": "doc",
            "id": "backend/go/index"
          }
        },
        {
          "type": "category",
          "label": "Docker",
          "items": [
            "backend/docker/caddy-docker-site",
            "backend/docker/docker-laravel-app",
            "backend/docker/docker-php-app",
            "backend/docker/flask-docker-app"
          ],
          "link": {
            "type": "doc",
            "id": "backend/docker/index"
          }
        }
      ],
      "link": {
        "type": "doc",
        "id": "backend/index"
      }
    },
    {
      "type": "category",
      "label": "Database",
      "items": [
        {
          "type": "category",
          "label": "MySQL",
          "items": [
            "database/mysql/django-+-mysql",
            "database/mysql/flask-+-mysql",
            "database/mysql/java-+-mysql"
          ],
          "link": {
            "type": "doc",
            "id": "database/mysql/index"
          }
        },
        {
          "type": "category",
          "label": "MongoDB",
          "items": [
            "database/mongodb/django-+-mongodb",
            "database/mongodb/express-+-mongodb",
            "database/mongodb/flask-+-mongodb"
          ],
          "link": {
            "type": "doc",
            "id": "database/mongodb/index"
          }
        },
        "database/postgres",
        "database/redis"
      ],
      "link": {
        "type": "doc",
        "id": "database/index"
      }
    },
    {
      "type": "category",
      "label": "Full Stack",
      "items": [
        {
          "type": "category",
          "label": "Next.js",
          "items": [
            "full-stack/next.js/next.js-+-express.js",
            "full-stack/next.js/next.js-+-mongodb",
            "full-stack/next.js/static-file-share-with-flask-and-caddy"
          ],
          "link": {
            "type": "doc",
            "id": "full-stack/next.js/index"
          }
        },
        "full-stack/flask-+-htmx",
        "full-stack/mean-stack",
        "full-stack/mern-stack"
      ],
      "link": {
        "type": "doc",
        "id": "full-stack/index"
      }
    },
    "persistent-storage",
    "wordpress"
  ],
  "platform": [
    "platform/index",
    "platform/readme",
    "platform/what-is-code-capsules",
    "platform/platform",
    {
      "type": "category",
      "label": "Account",
      "items": [
        "platform/account/how-do-i-add-a-payment-method",
        "platform/account/how-do-i-reset-my-password",
        "platform/account/how-do-i-enable-2fa",
        "platform/account/connect-version-control"
      ]
    },
    {
      "type": "category",
      "label": "Billing",
      "items": [
        "platform/billing/how-do-i-change-my-billing-details",
        "platform/billing/how-do-i-view-my-invoices",
        "platform/billing/how-does-the-pricing-work"
      ]
    },
    {
      "type": "category",
      "label": "Teams",
      "items": [
        "platform/teams/what-is-a-team",
        "platform/teams/how-do-i-add-remove-teams",
        "platform/teams/how-do-i-add-team-members",
        "platform/teams/share-a-repo-with-a-team"
      ]
    },
    {
      "type": "category",
      "label": "Spaces",
      "items": [
        "platform/spaces/what-is-a-space",
        "platform/spaces/how-do-i-add-remove-a-space"
      ]
    },
    {
      "type": "category",
      "label": "Capsules",
      "items": [
        "platform/capsules/what-is-a-capsule",
        "platform/capsules/how-do-i-add-remove-stop-capsules",
        "platform/capsules/how-to-add-a-custom-domain"
      ]
    },
    {
      "type": "category",
      "label": "Regions",
      "items": [
        "platform/regions/what-regions-does-code-capsules-support"
      ]
    },
    {
      "type": "category",
      "label": "Security",
      "items": [
        "platform/security/basic-auth"
      ]
    }
  ],
  "products": [
    "products/index",
    {
      "type": "category",
      "label": "Backend Capsule",
      "items": [
        "products/backend-capsule/deploy",
        "products/backend-capsule/configure",
        "products/backend-capsule/scale",
        "products/backend-capsule/monitor",
        "products/backend-capsule/logs",
        "products/backend-capsule/alerting",
        "products/backend-capsule/add-procfile"
      ]
    },
    {
      "type": "category",
      "label": "Database Capsule",
      "items": [
        "products/database-capsule/overview",
        "products/database-capsule/configure",
        "products/database-capsule/scale",
        "products/database-capsule/backups",
        "products/database-capsule/monitor",
        "products/database-capsule/logs",
        "products/alerting",
        "products/database-capsule/migrations"
      ]
    },
    {
      "type": "category",
      "label": "Frontend capsule",
      "items": [
        "products/frontend-capsule/deploy",
        "products/frontend-capsule/configure",
        "products/frontend-capsule/scale",
        "products/frontend-capsule/monitor",
        "products/frontend-capsule/logs",
        "products/alerting-1",
        "products/frontend-capsule/custom-domains"
      ]
    },
    {
      "type": "category",
      "label": "Storage Capsule",
      "items": [
        "products/storage-capsule/deploy",
        "products/storage-capsule/configure",
        "products/storage-capsule/scale",
        "products/storage-capsule/backups",
        "products/storage-capsule/monitor",
        "products/storage-capsule/logs",
        "products/storage-capsule/alerting",
        "products/storage-capsule/how-state-works"
      ]
    },
    {
      "type": "category",
      "label": "Wordpress Capsule",
      "items": [
        "products/wordpress-capsule/deploy",
        "products/wordpress-capsule/configure",
        "products/wordpress-capsule/scale",
        "products/wordpress-capsule/backups",
        "products/wordpress-capsule/monitor",
        "products/wordpress-capsule/logs",
        "products/wordpress-capsule/alerting"
      ]
    },
    {
      "type": "category",
      "label": "Agent Capsule",
      "items": [
        "products/agent-capsule/deploy",
        "products/agent-capsule/configure",
        "products/agent-capsule/scale",
        "products/agent-capsule/monitor",
        "products/agent-capsule/logs",
        "products/agent-capsule/templates",
        {
          "type": "category",
          "label": "Chat",
          "items": [
            "products/agent-capsule/chat/agent-api-sample"
          ],
          "link": {
            "type": "doc",
            "id": "products/agent-capsule/chat/index"
          }
        },
        "products/agent-capsule/alerting"
      ]
    },
    {
      "type": "category",
      "label": "Enterprise Clusters",
      "items": [
        "products/enterprise-clusters/overview"
      ]
    }
  ],
  "tutorials": [
    "tutorials/index",
    "tutorials/how-to-create-and-host-a-telegram-bot-on-code-capsules",
    "tutorials/create-and-host-a-telegram-bot-with-node.js-on-code-capsules",
    "tutorials/create-and-host-go-ai-telegram-bot",
    "tutorials/how-to-simply-host-a-production-wordpress-blog",
    "tutorials/build-a-personal-calendar-assistant-with-telegram-and-agent-capsules",
    "tutorials/heroku-migration-guide",
    "tutorials/create-and-host-an-api-with-flask",
    "tutorials/building-a-full-stack-application-with-flask-and-htmx",
    "tutorials/nuxt3-and-nitro",
    "tutorials/optimizing-performance-in-mern-stack-tips-and-techniques",
    "tutorials/build-a-slackbot-with-node.js-to-monitor-your-applications",
    "tutorials/building-a-full-stack-application-with-express-and-htmx",
    "tutorials/getting-started-with-mean-stack-a-step-by-step-tutorial",
    "tutorials/building-a-web-file-store",
    "tutorials/building-a-book-recommendations-app-with-php-sqlite-and-docker",
    "tutorials/build-a-mern-job-board",
    "tutorials/build-a-generative-art-application-with-pillow-flask-and-htmx",
    "tutorials/white-label-your-app-with-code-capsules",
    "tutorials/building-a-game-catalogue-api",
    "tutorials/best-practices-for-structuring-mean-mern-mevn-projects",
    "tutorials/video-guides"
  ],
  "cli": [
    {
      "type": "category",
      "label": "Code Capsules CLI",
      "items": [
        {
          "type": "category",
          "label": "Getting Started",
          "items": [
            "cli/readme/getting-started/prerequisites",
            "cli/readme/getting-started/installation-and-usage",
            "cli/readme/getting-started/quick-start"
          ],
          "link": {
            "type": "doc",
            "id": "cli/readme/getting-started/index"
          }
        },
        {
          "type": "category",
          "label": "Commands",
          "items": [
            "cli/readme/commands/login",
            "cli/readme/commands/logout",
            "cli/readme/commands/proxy",
            "cli/readme/commands/whoami"
          ],
          "link": {
            "type": "doc",
            "id": "cli/readme/commands/index"
          }
        },
        "cli/readme/global-options"
      ],
      "link": {
        "type": "doc",
        "id": "cli/index"
      }
    }
  ],
  "enterprise": [
    "enterprise/index",
    "enterprise/aws",
    "enterprise/azure",
    "enterprise/gcp",
    "enterprise/vmware"
  ]
};

export default sidebars;
