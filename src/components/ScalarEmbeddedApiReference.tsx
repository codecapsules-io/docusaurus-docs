import {useEffect, useRef, useState} from 'react';
import useBaseUrl from '@docusaurus/useBaseUrl';
import '@scalar/docusaurus/dist/theme.css';
import styles from './ScalarEmbeddedApiReference.module.css';
import {
  agentApiReferenceConfig,
  buildAgentApiReferenceSpec,
  type OpenApiSpec,
} from '../lib/agentApiReference';

declare global {
  interface Window {
    Scalar?: {
      createApiReference: (
        element: HTMLElement,
        configuration: Record<string, unknown>,
      ) => void;
    };
  }
}

const scalarScriptSrc = 'https://cdn.jsdelivr.net/npm/@scalar/api-reference';
const clientLabelMap = new Map([
  ['HTTP/1.1', 'HTTP'],
  ['Fetch', 'JavaScript'],
  ['Requests', 'Python'],
  ['Curl', 'cURL'],
]);

function loadScalarScript(): Promise<void> {
  if (window.Scalar) {
    return Promise.resolve();
  }

  const existing = document.querySelector<HTMLScriptElement>(
    `script[src="${scalarScriptSrc}"]`,
  );

  if (existing) {
    return new Promise((resolve, reject) => {
      existing.addEventListener('load', () => resolve(), {once: true});
      existing.addEventListener('error', () => reject(new Error('Failed to load Scalar.')), {
        once: true,
      });
    });
  }

  return new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.src = scalarScriptSrc;
    script.async = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error('Failed to load Scalar.'));
    document.body.appendChild(script);
  });
}

function extractOperationFromSectionId(sectionId: string | null | undefined) {
  if (!sectionId) {
    return null;
  }

  const match = /^api-\d+\/([A-Z]+)(\/.+)$/.exec(sectionId);
  if (!match) {
    return null;
  }

  return {
    method: match[1].toLowerCase(),
    path: match[2],
  };
}

function injectAuthorizationSections(root: HTMLDivElement, spec: OpenApiSpec) {
  const securitySchemes = spec.components?.securitySchemes as
    | Record<string, {name?: string; description?: string; type?: string}>
    | undefined;

  if (!securitySchemes) {
    return;
  }

  root.querySelectorAll<HTMLElement>('section.section').forEach((section) => {
    const operationRef = extractOperationFromSectionId(section.id);
    if (!operationRef) {
      return;
    }

    const operation = spec.paths?.[operationRef.path]?.[
      operationRef.method as keyof NonNullable<typeof spec.paths>[string]
    ] as Record<string, unknown> | undefined;

    const security = Array.isArray(operation?.security)
      ? (operation.security as Array<Record<string, unknown>>)
      : [];
    const availableSchemes = security.flatMap((entry) => Object.keys(entry));

    if (availableSchemes.length === 0) {
      return;
    }

    const operationDetails = section.querySelector<HTMLElement>('.operation-details');
    const requestBody = operationDetails?.querySelector<HTMLElement>('.request-body');
    if (!operationDetails || !requestBody) {
      return;
    }

    const existing = operationDetails.querySelector<HTMLElement>(`.${styles.authBlock}`);
    if (existing) {
      existing.remove();
    }

    const block = document.createElement('div');
    block.className = styles.authBlock;

    const header = document.createElement('div');
    header.className = styles.authHeader;

    const title = document.createElement('div');
    title.className = styles.authTitle;
    title.textContent = 'Authorizations';

    const select = document.createElement('select');
    select.className = styles.authSelect;

    availableSchemes.forEach((schemeName) => {
      const option = document.createElement('option');
      option.value = schemeName;
      option.textContent = schemeName;
      select.appendChild(option);
    });

    const defaultScheme = availableSchemes.includes('EmailAuth')
      ? 'EmailAuth'
      : availableSchemes[0];
    select.value = defaultScheme;

    const row = document.createElement('div');
    row.className = styles.authRow;

    const updateRow = (schemeName: string) => {
      const scheme = securitySchemes[schemeName] ?? {};
      row.innerHTML = '';

      const name = document.createElement('span');
      name.className = styles.authName;
      name.textContent = scheme.name ?? schemeName;

      const meta = document.createElement('span');
      meta.className = styles.authMeta;
      meta.textContent = scheme.type === 'apiKey' ? 'string' : scheme.type ?? 'string';

      const required = document.createElement('span');
      required.className = styles.authRequired;
      required.textContent = 'required';

      const description = document.createElement('div');
      description.className = styles.authDescription;
      description.textContent = scheme.description ?? '';

      row.append(name, meta, required, description);
    };

    select.addEventListener('change', () => updateRow(select.value));
    updateRow(defaultScheme);

    header.append(title, select);
    block.append(header, row);
    operationDetails.insertBefore(block, requestBody);
  });
}

function normalizeClientPickers(root: HTMLDivElement) {
  const apply = () => {
    root.querySelectorAll<HTMLElement>('[data-testid="client-picker"]').forEach((button) => {
      const text = button.textContent?.trim() ?? '';
      for (const [needle, label] of clientLabelMap) {
        if (text.includes(needle)) {
          button.dataset.flatLabel = label;
          break;
        }
      }
    });

    document.body
      .querySelectorAll<HTMLElement>('ul[role="listbox"] [id$="-label"]')
      .forEach((label) => {
        label.style.display = 'none';
      });

    document.body.querySelectorAll<HTMLElement>('ul[role="listbox"] li[role="option"]').forEach((item) => {
      const text = item.textContent?.trim() ?? '';
      const value = Array.from(clientLabelMap.entries()).find(([needle]) => text.includes(needle));
      const labelNode = item.querySelector<HTMLElement>('span');
      if (value && labelNode) {
        labelNode.textContent = value[1];
      }
    });
  };

  const observer = new MutationObserver(apply);
  observer.observe(root, {childList: true, subtree: true});
  observer.observe(document.body, {childList: true, subtree: true});
  apply();

  return () => observer.disconnect();
}

export default function ScalarEmbeddedApiReference() {
  const specUrl = useBaseUrl('/openapi/agent-capsule-swagger.json');
  const ref = useRef<HTMLDivElement | null>(null);
  const [status, setStatus] = useState<'loading' | 'ready' | 'error'>('loading');

  useEffect(() => {
    let cancelled = false;
    let stopClientPickerObserver: (() => void) | undefined;

    async function renderReference() {
      try {
        const [_, response] = await Promise.all([loadScalarScript(), fetch(specUrl)]);
        if (!response.ok) {
          throw new Error(`Failed to fetch OpenAPI spec: ${response.status}`);
        }

        const sourceSpec = (await response.json()) as OpenApiSpec;
        const content = buildAgentApiReferenceSpec(sourceSpec);

        if (cancelled || !ref.current || !window.Scalar) {
          return;
        }

        ref.current.innerHTML = '';
        window.Scalar.createApiReference(ref.current, {
          ...agentApiReferenceConfig,
          content,
        });
        stopClientPickerObserver = normalizeClientPickers(ref.current);

        let attempts = 0;
        const intervalId = window.setInterval(() => {
          if (!ref.current || cancelled) {
            window.clearInterval(intervalId);
            return;
          }

          if (ref.current.querySelector('section.section')) {
            injectAuthorizationSections(ref.current, content);
          }

          attempts += 1;
          if (attempts >= 20) {
            window.clearInterval(intervalId);
          }
        }, 200);
        setStatus('ready');
      } catch {
        if (!cancelled) {
          setStatus('error');
        }
      }
    }

    void renderReference();

    return () => {
      cancelled = true;
      stopClientPickerObserver?.();
      if (ref.current) {
        ref.current.innerHTML = '';
      }
    };
  }, [specUrl]);

  return (
    <div className={styles.shell}>
      {status === 'loading' ? (
        <p className={styles.loading}>Loading API reference…</p>
      ) : null}
      {status === 'error' ? (
        <p className={styles.error}>Unable to load the API reference.</p>
      ) : null}
      <div ref={ref} className={styles.surface} />
    </div>
  );
}
