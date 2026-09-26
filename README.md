# CmdVault

> **Capture. Organize. Reuse.**

CmdVault is a **local-first desktop application for engineers** to
store, organize, and reuse CLI commands and SQL queries across different
tasks and projects.

## Why CmdVault?

Engineers often reuse commands and queries they have already used
before, but over time they become scattered across terminal history,
notes, old repositories, documentation, and chat messages.

Even when the code already exists, finding it again --- and adapting it
for another environment or project --- can waste time.

CmdVault aims to turn those useful commands and queries into a
structured personal library that is easy to search and reuse.

## How It Works

``` text
Paste
  ↓
Analyze with Local AI
  ↓
Review & Edit
  ↓
Save
  ↓
Search & Organize
  ↓
Fill Variables
  ↓
Copy & Reuse
```

Example:

``` bash
kubectl get pods -n payment-dev
```

CmdVault may suggest:

``` text
Tool:      Kubernetes
Category:  Pods
Tags:      kubernetes, troubleshooting

Template:
kubectl get pods -n {{namespace}}
```

AI suggestions are fully editable. Users can change metadata, accept or
reject suggested variables, or add variables manually before saving.

## V1 Scope

CmdVault V1 focuses on:

-   CLI commands, including Linux/Shell, PowerShell, Windows CMD,
    Kubernetes, Terraform, cloud CLIs, Docker, Git, and other
    engineering tools
-   SQL queries
-   Local AI-assisted analysis and categorization
-   Editable titles, descriptions, categories, tags, and collections
-   Suggested and manually defined reusable variables
-   Search and filtering
-   Local persistent storage
-   Import and export
-   Copying generated commands/queries for use in existing tools

CmdVault V1 does **not** execute commands directly.

## Local First

The project is designed around local usage:

-   No CmdVault account required
-   No central CmdVault database
-   Personal library stored locally
-   Local AI processing

## Project Status

🚧 **CmdVault V1 is currently in the planning and development stage.**

Current direction:

``` text
Scope
  ↓
Functional Requirements
  ↓
Architecture
  ↓
UI / UX
  ↓
Development
  ↓
Testing
  ↓
GitHub Release
  ↓
Real-world Usage & Feedback
```

After V1 is released, it will be tested in real engineering workflows
and shared with other engineers. Feedback from actual usage will be used
to determine the direction of V2.

## Documentation

Detailed requirements, Definition of Done, architecture, development
tools, AI/model decisions, and other technical documentation will be
maintained under [`docs/`](./docs/).

------------------------------------------------------------------------

**Goal:** Spend less time searching for commands you have already used,
and more time reusing engineering knowledge you already have.
