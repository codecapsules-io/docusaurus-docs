---
slug: "/products/storage-capsule/how-state-works"
---

# How State Works

A Capsule can write to a local file system, but those files will not persist after the Capsule is restarted. 

A Capsule can be thought of as a computational process that can be started and restarted. When a Capsule is started, it receives a fresh copy of the code from a GitHub repository. You can write to a Capsule in a local file system, but that file system will also start afresh when the code restarts and pulls from the GitHub repository again, so any files written to that file system will not persist when the Capsule is restarted automatically.

Instead, to have the data persist, we recommend using an external database.

Take a look at our guide to [setting up file persistence with a Data Capsule](/products/storage-capsule/deploy) for more information.
