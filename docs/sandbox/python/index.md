---
slug: "/sandbox/python"
title: "Sandbox SDK for Python"
description: "The codecapsules-sandbox Python SDK for creating and managing Firecracker microVM sandboxes."
sidebar_label: "Python SDK"
---

# Python SDK

`codecapsules-sandbox` is the official Python client for the Sandbox API.

The API is in private beta. [Join the waitlist](https://www.codecapsules.io/sandbox/waitlist/) to get an API key.

```bash
pip install codecapsules-sandbox
```

Requires Python 3.9+.

## Basic usage

```python
from codecapsules_sandbox import Sandbox

with Sandbox.create() as sb:
    result = sb.exec("python --version")
    print(result.stdout)  # "Python 3.12.3\n"
```

## Lifecycle patterns

### Context manager (recommended for most cases)

```python
from codecapsules_sandbox import Sandbox

with Sandbox.create(flavor="python-3.12") as sb:
    result = sb.exec('python -c "print(1+1)"')
    print(result.stdout)  # "2\n"
# sandbox deleted when the block exits, even on exception
```

### Manual lifecycle

```python
sb = Sandbox.create(flavor="node-20")
try:
    result = sb.exec("node --version")
    print(result.stdout)
finally:
    sb.delete()
```

### Async with `AsyncSandbox`

For asyncio-based code, use `AsyncSandbox`. All methods are coroutines.

```python
import asyncio
from codecapsules_sandbox import AsyncSandbox

async def main():
    async with AsyncSandbox.create() as sb:
        result = await sb.exec("python --version")
        print(result.stdout)

asyncio.run(main())
```

## Configuration

Set `CODECAPSULES_API_KEY` in your environment, or pass it explicitly:

```python
sb = Sandbox.create(
    "python-3.12",
    api_key="your_api_key",
    timeout=60.0,
    max_retries=3,
)
```

## SDK reference

- [API Reference](/sandbox/python/api-reference/): `Sandbox`, `AsyncSandbox`, types, and exceptions

## Links

- [PyPI · codecapsules-sandbox](https://pypi.org/project/codecapsules-sandbox/)
- [GitHub · codecapsules-io/sandbox-python](https://github.com/codecapsules-io/sandbox-python)
