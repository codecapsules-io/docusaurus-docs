type HttpMethod =
  | 'get'
  | 'post'
  | 'put'
  | 'patch'
  | 'delete'
  | 'options'
  | 'head';

type OpenApiSchema = Record<string, unknown>;
type OpenApiOperation = Record<string, unknown>;
export type OpenApiSpec = {
  openapi: string;
  info?: Record<string, unknown>;
  security?: unknown[];
  servers?: unknown[];
  paths?: Record<string, Partial<Record<HttpMethod, OpenApiOperation>>>;
  components?: {
    schemas?: Record<string, OpenApiSchema>;
    securitySchemes?: Record<string, unknown>;
    [key: string]: unknown;
  };
  [key: string]: unknown;
};

const agentApiEndpoints: Array<{path: string; method: HttpMethod}> = [
  {path: '/api/chat/message', method: 'post'},
  {path: '/api/chat/message/stream', method: 'post'},
  {path: '/api/chat/history', method: 'get'},
  {path: '/api/context/text', method: 'post'},
  {path: '/api/context/url', method: 'post'},
];

const agentApiSchemas = [
  'ChatPrompt',
  'ChatPromptContentText',
  'ChatPromptContentImage',
  'ChatPromptContentFile',
  'SendMessageResponse',
  'AgentMessage',
  'AgentMessageContentText',
  'AgentMessageContentImage',
  'AgentMessageContentFile',
  'GetChatHistoryResponse',
  'ContextText',
  'AddContextTextResponse',
  'ContextUrl',
  'AddContextFromUrlResponse',
  'Error',
];

export const agentApiReferenceConfig = {
  layout: 'modern',
  theme: 'default',
  withDefaultFonts: false,
  showSidebar: false,
  hideSearch: true,
  hideClientButton: true,
  hideTestRequestButton: true,
  showDeveloperTools: 'never',
  showToolbar: 'never',
  documentDownloadType: 'none',
  hiddenClients: {
    c: true,
    clojure: true,
    csharp: true,
    dart: true,
    fsharp: true,
    go: true,
    java: true,
    kotlin: true,
    node: true,
    objc: true,
    ocaml: true,
    php: true,
    powershell: true,
    r: true,
    ruby: true,
    rust: true,
    swift: true,
    shell: ['httpie', 'wget'],
    js: ['axios', 'jquery', 'ofetch', 'undici', 'xhr'],
    python: ['httpx_async', 'httpx_sync', 'python3'],
  },
  defaultHttpClient: {
    targetKey: 'http',
    clientKey: 'http1.1',
  },
  authentication: {
    preferredSecurityScheme: 'ApiKeyAuth',
  },
  customCss: `
    .scalar-mcp-layer,
    a[href="https://www.scalar.com"] {
      display: none !important;
    }

    button[data-testid="client-picker"][data-flat-label] {
      font-size: 0 !important;
    }

    button[data-testid="client-picker"][data-flat-label]::before {
      color: inherit;
      content: attr(data-flat-label);
      font-size: 1rem;
      line-height: 1;
    }
  `,
  agent: {
    disabled: true,
    hideAddApi: true,
  },
} as const;

function collectSchemaRefs(input: unknown, refs = new Set<string>()): Set<string> {
  if (!input || typeof input !== 'object') {
    return refs;
  }

  if (Array.isArray(input)) {
    input.forEach((value) => collectSchemaRefs(value, refs));
    return refs;
  }

  const record = input as Record<string, unknown>;
  const ref = record.$ref;

  if (typeof ref === 'string' && ref.startsWith('#/components/schemas/')) {
    refs.add(ref.replace('#/components/schemas/', ''));
  }

  Object.values(record).forEach((value) => collectSchemaRefs(value, refs));
  return refs;
}

function orderedSchemaSubset(
  allSchemas: Record<string, OpenApiSchema> | undefined,
  seedNames: string[],
): Record<string, OpenApiSchema> {
  if (!allSchemas) {
    return {};
  }

  const queue = [...seedNames];
  const seen = new Set<string>();
  const orderedNames: string[] = [];

  while (queue.length > 0) {
    const current = queue.shift();
    if (!current || seen.has(current) || !allSchemas[current]) {
      continue;
    }

    seen.add(current);
    orderedNames.push(current);

    for (const refName of collectSchemaRefs(allSchemas[current])) {
      if (!seen.has(refName)) {
        queue.push(refName);
      }
    }
  }

  return Object.fromEntries(orderedNames.map((name) => [name, allSchemas[name]]));
}

export function buildAgentApiReferenceSpec(source: OpenApiSpec): OpenApiSpec {
  const filteredPaths = Object.fromEntries(
    agentApiEndpoints.flatMap(({path, method}) => {
      const operation = source.paths?.[path]?.[method];
      if (!operation) {
        return [];
      }

      const nextOperation: OpenApiOperation = {...operation};
      delete nextOperation.tags;

      return [[path, {[method]: nextOperation}]];
    }),
  ) as OpenApiSpec['paths'];

  const referencedSchemas = new Set<string>(agentApiSchemas);
  collectSchemaRefs(filteredPaths, referencedSchemas);

  return {
    openapi: source.openapi,
    info: {
      ...(source.info ?? {}),
      title: 'Agent API (Sample)',
      description:
        'The following specifications describe a standard API used by the Code Capsules chat window to communicate with the agent.',
    },
    security: source.security,
    servers: source.servers,
    paths: filteredPaths,
    components: {
      ...source.components,
      schemas: orderedSchemaSubset(source.components?.schemas, [...referencedSchemas]),
      securitySchemes: source.components?.securitySchemes,
    },
  };
}
