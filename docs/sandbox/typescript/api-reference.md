---
slug: "/sandbox/typescript/api-reference"
title: "TypeScript Sandbox SDK Methods & Types"
description: "Full API reference for the @codecapsules/sandbox TypeScript SDK: Sandbox class, methods, types, and error classes."
sidebar_label: "API Reference"
---

# TypeScript API Reference

## `Sandbox` class

### Static methods

#### `Sandbox.create(options?, config?)`

Creates a new sandbox and waits until it is `running`.

```typescript
static async create(
  options?: SandboxCreateOptions,
  config?: SandboxConfig
): Promise<Sandbox>
```

**`SandboxCreateOptions`**

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `flavor` | `SandboxFlavor` | `'python-3.12'` | Environment preset |
| `memory` | `number` | `512` | Memory in MB (max 8192) |
| `cpu` | `number` | `1` | vCPU count (max 4) |
| `ttl` | `number` | `60` | Lifetime in minutes (max 480) |
| `metadata` | `Record<string, string>` | — | Arbitrary key-value tags |

**`SandboxConfig`**

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `apiKey` | `string` | `CODECAPSULES_API_KEY` env var | API key |
| `baseUrl` | `string` | `https://sandbox.codecapsules.io/v1` | API base URL |
| `timeout` | `number` | `30_000` | Request timeout in ms |
| `maxRetries` | `number` | `2` | Retries on transient errors |

```typescript
const sb = await Sandbox.create({ flavor: 'node-20', memory: 1024 });
```

---

#### `Sandbox.using(fn, options?, config?)`

Creates a sandbox, passes it to `fn`, and deletes it when done, even if `fn` throws.

```typescript
static async using<T>(
  fn: (sb: Sandbox) => Promise<T>,
  options?: SandboxCreateOptions,
  config?: SandboxConfig
): Promise<T>
```

```typescript
const result = await Sandbox.using(async (sb) => {
  const r = await sb.exec('python -c "print(42)"');
  return r.stdout.trim(); // "42"
}, { flavor: 'python-3.12' });
```

---

#### `Sandbox.get(id, config?)`

Fetch an existing sandbox by ID.

```typescript
static async get(id: string, config?: SandboxConfig): Promise<Sandbox>
```

```typescript
const sb = await Sandbox.get('sb_01hx...');
console.log(sb.status); // 'running'
```

---

### Instance properties

| Property | Type | Description |
|----------|------|-------------|
| `id` | `string` | Unique sandbox ID (e.g. `sb_01hx...`) |
| `flavor` | `string` | Environment flavor (e.g. `python-3.12`) |
| `status` | `SandboxStatus` | Last known status (call `refresh()` for a live value) |
| `expiresAt` | `Date` | When the sandbox will be automatically deleted |
| `info` | `Readonly<SandboxInfo>` | Full sandbox info snapshot |

---

### Instance methods

#### `sb.exec(command, options?)`

Execute a shell command and wait for it to complete.

```typescript
async exec(command: string, options?: ExecOptions): Promise<ExecResult>
```

**`ExecOptions`**

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `stdin` | `string` | — | Content written to stdin |
| `timeout` | `number` | `30` | Timeout in seconds (max 300) |
| `env` | `Record<string, string>` | — | Additional environment variables |

**`ExecResult`**

| Property | Type | Description |
|----------|------|-------------|
| `stdout` | `string` | Standard output |
| `stderr` | `string` | Standard error |
| `exitCode` | `number` | Exit code (`0` = success) |
| `durationMs` | `number` | Wall-clock time in milliseconds |
| `execId` | `string` | Unique execution ID |
| `command` | `string` | The command that was run |
| `startedAt` | `Date` | Execution start time |
| `completedAt` | `Date` | Execution end time |

```typescript
const r = await sb.exec('python --version');
console.log(r.stdout);   // "Python 3.12.3\n"
console.log(r.exitCode); // 0

// With options
const r2 = await sb.exec('pip install numpy', { timeout: 120 });
const r3 = await sb.exec('echo $FOO', { env: { FOO: 'bar' } });
```

---

#### `sb.execStream(command, options?)`

Execute a command and stream output as it arrives. Yields chunks of stdout and stderr interleaved.

```typescript
execStream(command: string, options?: ExecOptions): AsyncIterable<string>
```

The default timeout for streaming is 300 seconds.

```typescript
for await (const chunk of sb.execStream('python train.py')) {
  process.stdout.write(chunk);
}
```

---

#### `sb.upload(sandboxPath, content)`

Upload content to a path inside the sandbox.

```typescript
async upload(
  sandboxPath: string,
  content: Buffer | Uint8Array | string
): Promise<FileInfo>
```

**`FileInfo`**

| Property | Type | Description |
|----------|------|-------------|
| `path` | `string` | Path inside the sandbox |
| `sizeBytes` | `number` | File size in bytes |
| `createdAt` | `Date` | Upload time |

```typescript
import { readFileSync } from 'fs';

await sb.upload('/workspace/script.py', readFileSync('./script.py'));
await sb.upload('/workspace/config.json', JSON.stringify({ key: 'value' }));
```

---

#### `sb.download(sandboxPath)`

Download a file from the sandbox as a `Uint8Array`.

```typescript
async download(sandboxPath: string): Promise<Uint8Array>
```

```typescript
const bytes = await sb.download('/workspace/output.json');
const result = JSON.parse(Buffer.from(bytes).toString());
```

---

#### `sb.logs(options?)`

Fetch sandbox logs: system events and exec output.

```typescript
async logs(options?: LogsOptions): Promise<LogEntry[]>
```

**`LogsOptions`**

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `since` | `Date` | — | Only return entries after this timestamp |
| `limit` | `number` | `100` | Max entries (max 1000) |

**`LogEntry`**

| Property | Type | Description |
|----------|------|-------------|
| `ts` | `Date` | Timestamp |
| `source` | `'system' \| 'exec'` | Log source |
| `message` | `string` | Log message |
| `execId` | `string \| undefined` | Associated exec ID |

```typescript
const entries = await sb.logs({ limit: 50 });
entries.forEach(e => console.log(`[${e.source}] ${e.message}`));
```

---

#### `sb.metrics()`

Get live resource usage for the sandbox.

```typescript
async metrics(): Promise<SandboxMetrics>
```

**`SandboxMetrics`**

| Property | Type | Description |
|----------|------|-------------|
| `cpuPercent` | `number` | CPU usage percentage |
| `memoryUsedMb` | `number` | Memory used in MB |
| `memoryLimitMb` | `number` | Memory limit in MB |
| `diskUsedMb` | `number` | Disk used in MB |
| `diskLimitMb` | `number` | Disk limit in MB |
| `execCount` | `number` | Number of exec calls |
| `uptimeSeconds` | `number` | Sandbox uptime |

```typescript
const m = await sb.metrics();
console.log(`CPU: ${m.cpuPercent}%, RAM: ${m.memoryUsedMb}/${m.memoryLimitMb}MB`);
```

---

#### `sb.refresh()`

Re-fetch sandbox info from the API and update `status` and other cached properties.

```typescript
async refresh(): Promise<this>
```

---

#### `sb.waitUntilRunning(options?)`

Poll until `status === 'running'`, then return. Rarely needed; `create()` already waits.

```typescript
async waitUntilRunning(options?: { timeout?: number; interval?: number }): Promise<this>
```

---

#### `sb.stop()`

Gracefully stop the sandbox. Transitions to `'stopped'`. The sandbox can no longer accept exec calls but is not deleted; it still counts against your quota until deleted.

```typescript
async stop(): Promise<void>
```

---

#### `sb.delete()`

Delete the sandbox and release all resources immediately.

```typescript
async delete(): Promise<void>
```

---

## Types

### `SandboxFlavor`

```typescript
type SandboxFlavor = 'python-3.12' | 'node-20' | 'browser' | 'full' | (string & {});
```

The `(string & {})` union allows arbitrary flavor strings for future environments while preserving autocomplete for the built-in values.

### `SandboxStatus`

```typescript
type SandboxStatus = 'starting' | 'running' | 'stopping' | 'stopped' | 'error';
```

---

## Error classes

All errors extend `SandboxError`.

| Class | When thrown |
|-------|-------------|
| `SandboxAuthError` | Invalid or missing API key |
| `SandboxNotFoundError` | Sandbox ID not found |
| `SandboxNotReadyError` | Sandbox is in `error` state or timed out waiting to start |
| `SandboxExecTimeoutError` | `exec()` exceeded the timeout |
| `SandboxRateLimitError` | Too many requests |
| `SandboxQuotaError` | Account quota exceeded |
| `SandboxAPIError` | Unexpected API error (includes HTTP status and response body) |
| `SandboxRequestTimeoutError` | HTTP request timed out |

```typescript
import { Sandbox, SandboxExecTimeoutError, SandboxAuthError } from '@codecapsules/sandbox';

try {
  await Sandbox.using(async (sb) => {
    await sb.exec('sleep 999', { timeout: 5 });
  });
} catch (err) {
  if (err instanceof SandboxExecTimeoutError) {
    console.log('Command timed out');
  }
}
```
