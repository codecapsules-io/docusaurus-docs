---
slug: "/products/storage-capsule/retry-stale-file-handles"
description: "Persistent Storage Capsules are backed by NFS, so a workload that starts before its Storage Capsule can see stale file handle errors. Here's how to retry them in your application code."
title: "How to Retry Stale File Handle Errors"
sidebar_label: "Retry Stale File Handles"
---

# Retry Stale File Handle Errors

Persistent Storage Capsules are backed by NFS. If the Storage Capsule's pod isn't ready yet when the workload Capsule that's bound to it starts, or if the Storage Capsule's pod restarts or is rescheduled later on, any file handle your application already holds for that mount becomes invalid. The next read or write against it fails with a stale file handle error — `ESTALE` (errno 116) on Linux.

This doesn't mean any data was lost. The files are still intact on the Storage Capsule; only the client's cached handle to them is stale. Code Capsules' capsule-api operator detects this and reconciles the mount automatically, but there's a short window, usually a few seconds during startup or after a reschedule, where your application can hit the error before the remount finishes.

Because the failure is transient, the most reliable fix is to handle it in your application: catch the stale handle error and retry the operation with backoff, instead of letting the request fail or the process crash.

## Why Retrying the Same Handle Doesn't Work

`ESTALE` means the specific file handle is invalid, not that the operation itself failed. Retrying the exact same open file descriptor or stream will keep failing. Your retry has to re-resolve the file by its path, which opens a fresh handle against the now-current mount.

This matters most if your app keeps a file open for a while, such as a log file, an append-only write stream, or a SQLite connection. For those, catch `ESTALE` at the point you read or write, then close the existing handle and reopen the path before retrying. If you open the file fresh for every operation, as in the examples below, this already happens naturally.

## Node.js

```js
const fs = require('fs/promises');

async function withRetry(fn, { retries = 5, baseDelayMs = 200 } = {}) {
  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      return await fn();
    } catch (err) {
      const isStale = err.code === 'ESTALE';
      if (!isStale || attempt === retries) throw err;
      await new Promise((resolve) => setTimeout(resolve, baseDelayMs * 2 ** attempt));
    }
  }
}

// Each attempt re-opens the file by path, so a stale handle never gets reused
const filePath = `${process.env.PERSISTENT_STORAGE_DIR}/test.txt`;
await withRetry(() => fs.writeFile(filePath, 'File writing test'));
```

If you're using a long-lived `fs.createWriteStream`, listen for an `error` with `err.code === 'ESTALE'`, close the stream, and open a new one against the same path before writing again.

## Python

```python
import errno
import os
import time

def with_retry(fn, retries=5, base_delay=0.2):
    for attempt in range(retries + 1):
        try:
            return fn()
        except OSError as err:
            if err.errno != errno.ESTALE or attempt == retries:
                raise
            time.sleep(base_delay * (2 ** attempt))

# The lambda opens the file fresh on every attempt
file_path = os.path.join(os.getenv('PERSISTENT_STORAGE_DIR'), 'test.txt')

def write_test_file():
    with open(file_path, 'w') as f:
        f.write('File writing test')

with_retry(write_test_file)
```

## Other Languages

The same pattern applies regardless of language: catch the OS-level error that corresponds to errno 116, and retry by re-opening the path rather than the handle.

- **Go** — a failed syscall wraps a `syscall.Errno`; check `errors.Is(err, syscall.ESTALE)`.
- **Java** — the JVM surfaces this as an `IOException`; check the message for `Stale file handle`, since Java doesn't expose the raw errno.
- **PHP** — file functions don't throw by default, so register a warning handler (or check `error_get_last()`) and match on `Stale file handle` in the message.
- **Ruby** — rescue `Errno::ESTALE` directly, since Ruby maps common errnos to exception classes.

## Choosing a Retry Budget

Code Capsules' operator-driven remount typically resolves within a few seconds, so a short exponential backoff is enough: start at 100-200ms, double each attempt, and cap at around 5 attempts (roughly 3-6 seconds total). This absorbs the ordinary startup race without masking a real problem.

If `ESTALE` persists after your retry budget is exhausted, that's no longer an ordinary startup race. Let the error propagate, fail your readiness or health check, and let Kubernetes restart the Capsule. Retrying forever just hides an issue that needs the mount itself fixed.

## Absorbing the Startup Race in Your Readiness Check

If your application opens files on the Storage Capsule during startup, wrap that first read or write in the same retry helper and run it before your Capsule reports itself ready. That keeps the startup-ordering race from ever reaching real request traffic, since Kubernetes won't route to the Capsule until the check passes.
