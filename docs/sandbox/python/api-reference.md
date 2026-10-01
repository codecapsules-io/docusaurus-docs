---
slug: "/sandbox/python/api-reference"
title: "Python Sandbox SDK Methods & Types"
description: "Full API reference for the codecapsules-sandbox Python SDK: Sandbox, AsyncSandbox, types, and exceptions."
sidebar_label: "API Reference"
---

# Python API Reference

## `Sandbox`

Synchronous sandbox client. Use as a context manager or manage the lifecycle manually.

### `Sandbox.create()`

Create a new sandbox.

```python
@classmethod
def create(
    cls,
    flavor: str = "python-3.12",
    *,
    memory: int = 512,
    cpu: int = 1,
    ttl: int = 60,
    metadata: dict[str, str] | None = None,
    api_key: str | None = None,
    base_url: str | None = None,
    timeout: float | None = None,
    max_retries: int | None = None,
) -> "Sandbox"
```

**Parameters**

| Parameter | Default | Description |
|-----------|---------|-------------|
| `flavor` | `'python-3.12'` | Environment preset |
| `memory` | `512` | Memory in MB (max 8192) |
| `cpu` | `1` | vCPU count (max 4) |
| `ttl` | `60` | Lifetime in minutes (max 480) |
| `metadata` | `None` | Arbitrary key-value tags |
| `api_key` | `None` | Falls back to `CODECAPSULES_API_KEY` env var |
| `timeout` | `None` | HTTP timeout in seconds (default 30) |
| `max_retries` | `None` | Retries on transient errors (default 2) |

```python
sb = Sandbox.create("python-3.12", memory=2048, ttl=120)
```

---

### `Sandbox.get()`

Fetch an existing sandbox by ID.

```python
@classmethod
def get(
    cls,
    sandbox_id: str,
    *,
    api_key: str | None = None,
    base_url: str | None = None,
    timeout: float | None = None,
) -> "Sandbox"
```

```python
sb = Sandbox.get("sb_01hx...")
print(sb.status)  # 'running'
```

---

### Properties

| Property | Type | Description |
|----------|------|-------------|
| `id` | `str` | Unique sandbox ID (e.g. `sb_01hx...`) |
| `flavor` | `str` | Environment flavor (e.g. `python-3.12`) |
| `status` | `SandboxStatus` | Last known status (call `refresh()` for a live value) |
| `expires_at` | `datetime` | When the sandbox will be automatically deleted |
| `info` | `SandboxInfo` | Full sandbox info snapshot |

---

### Methods

#### `sb.exec()`

Execute a shell command and wait for it to complete.

```python
def exec(
    self,
    command: str,
    *,
    stdin: str | None = None,
    timeout: int = 30,
    env: dict[str, str] | None = None,
) -> ExecResult
```

**Parameters**

| Parameter | Default | Description |
|-----------|---------|-------------|
| `command` | — | Shell command to run |
| `stdin` | `None` | Content written to stdin |
| `timeout` | `30` | Timeout in seconds (max 300) |
| `env` | `None` | Additional environment variables |

**`ExecResult`**

| Attribute | Type | Description |
|-----------|------|-------------|
| `stdout` | `str` | Standard output |
| `stderr` | `str` | Standard error |
| `exit_code` | `int` | Exit code (`0` = success) |
| `duration_ms` | `float` | Wall-clock time in milliseconds |
| `exec_id` | `str` | Unique execution ID |
| `command` | `str` | The command that was run |
| `started_at` | `datetime` | Execution start time |
| `completed_at` | `datetime` | Execution end time |

```python
result = sb.exec("python --version")
print(result.stdout)    # "Python 3.12.3\n"
print(result.exit_code) # 0

# With options
sb.exec("pip install numpy", timeout=120)
sb.exec("echo $FOO", env={"FOO": "bar"})
```

---

#### `sb.exec_stream()`

Execute a command and stream output as it arrives.

```python
def exec_stream(
    self,
    command: str,
    *,
    timeout: int = 300,
    env: dict[str, str] | None = None,
) -> Iterator[str]
```

Yields chunks of stdout and stderr as they are produced.

```python
for chunk in sb.exec_stream("python train.py"):
    print(chunk, end="", flush=True)
```

---

#### `sb.upload()`

Upload content to a path inside the sandbox.

```python
def upload(self, sandbox_path: str, content: bytes | str) -> FileInfo
```

**`FileInfo`**

| Attribute | Type | Description |
|-----------|------|-------------|
| `path` | `str` | Path inside the sandbox |
| `size_bytes` | `int` | File size in bytes |
| `created_at` | `datetime` | Upload time |

```python
sb.upload("/workspace/script.py", open("script.py", "rb").read())
sb.upload("/workspace/config.json", '{"key": "value"}')
```

---

#### `sb.download()`

Download a file from the sandbox as `bytes`.

```python
def download(self, sandbox_path: str) -> bytes
```

```python
raw = sb.download("/workspace/output.json")
result = json.loads(raw)
```

---

#### `sb.logs()`

Fetch sandbox logs.

```python
def logs(
    self,
    *,
    since: datetime | None = None,
    limit: int = 100,
) -> list[LogEntry]
```

**`LogEntry`**

| Attribute | Type | Description |
|-----------|------|-------------|
| `ts` | `datetime` | Timestamp |
| `source` | `str` | `'system'` or `'exec'` |
| `message` | `str` | Log message |
| `exec_id` | `str \| None` | Associated exec ID |

```python
entries = sb.logs(limit=50)
for e in entries:
    print(f"[{e.source}] {e.message}")
```

---

#### `sb.metrics()`

Get live resource usage for the sandbox.

```python
def metrics(self) -> SandboxMetrics
```

**`SandboxMetrics`**

| Attribute | Type | Description |
|-----------|------|-------------|
| `cpu_percent` | `float` | CPU usage percentage |
| `memory_used_mb` | `float` | Memory used in MB |
| `memory_limit_mb` | `float` | Memory limit in MB |
| `disk_used_mb` | `float` | Disk used in MB |
| `disk_limit_mb` | `float` | Disk limit in MB |
| `exec_count` | `int` | Number of exec calls |
| `uptime_seconds` | `float` | Sandbox uptime |

```python
m = sb.metrics()
print(f"CPU: {m.cpu_percent}%, RAM: {m.memory_used_mb}/{m.memory_limit_mb}MB")
```

---

#### `sb.refresh()`

Re-fetch sandbox info and update cached properties.

```python
def refresh(self) -> "Sandbox"
```

---

#### `sb.wait_until_running()`

Poll until `status == 'running'`, then return. Rarely needed; `create()` already waits.

```python
def wait_until_running(
    self,
    *,
    timeout: float = 30.0,
    interval: float = 0.25,
) -> "Sandbox"
```

---

#### `sb.stop()`

Gracefully stop the sandbox. Transitions to `'stopped'`.

```python
def stop(self) -> None
```

---

#### `sb.delete()`

Delete the sandbox and release all resources immediately.

```python
def delete(self) -> None
```

---

## `AsyncSandbox`

Async variant of `Sandbox`. All methods are coroutines. Use with `async with` or `await`.

```python
from codecapsules_sandbox import AsyncSandbox
```

### Factory

```python
@classmethod
async def create(
    cls,
    flavor: str = "python-3.12",
    *,
    memory: int = 512,
    cpu: int = 1,
    ttl: int = 60,
    metadata: dict[str, str] | None = None,
    api_key: str | None = None,
    ...
) -> "AsyncSandbox"
```

### Async context manager

```python
async with AsyncSandbox.create(flavor="python-3.12") as sb:
    result = await sb.exec("python --version")
    print(result.stdout)
```

### Methods

`AsyncSandbox` has the same methods as `Sandbox`, but all are `async`:

| Sync (`Sandbox`) | Async (`AsyncSandbox`) |
|-----------------|----------------------|
| `sb.exec()` | `await sb.exec()` |
| `sb.exec_stream()` | `async for chunk in sb.exec_stream()` |
| `sb.upload()` | `await sb.upload()` |
| `sb.download()` | `await sb.download()` |
| `sb.logs()` | `await sb.logs()` |
| `sb.metrics()` | `await sb.metrics()` |
| `sb.refresh()` | `await sb.refresh()` |
| `sb.delete()` | `await sb.delete()` |

```python
async with AsyncSandbox.create() as sb:
    # Stream output asynchronously
    async for chunk in sb.exec_stream("python train.py"):
        print(chunk, end="", flush=True)
```

---

## Exceptions

All exceptions extend `SandboxError`.

| Exception | When raised |
|-----------|-------------|
| `SandboxAuthError` | Invalid or missing API key |
| `SandboxNotFoundError` | Sandbox ID not found |
| `SandboxNotReadyError` | Sandbox in `error` state or timed out waiting to start |
| `SandboxExecTimeoutError` | `exec()` exceeded the timeout |
| `SandboxRateLimitError` | Too many requests |
| `SandboxQuotaError` | Account quota exceeded |
| `SandboxAPIError` | Unexpected API error (includes HTTP status and response body) |

```python
from codecapsules_sandbox import Sandbox, SandboxExecTimeoutError

try:
    with Sandbox.create() as sb:
        sb.exec("sleep 999", timeout=5)
except SandboxExecTimeoutError:
    print("Command timed out")
```
