# CmdVault

> **Capture. Organize. Reuse.**

CmdVault is a **local-first desktop application for engineers** to capture, organize, and reuse CLI commands and SQL queries across projects and everyday engineering tasks.

Instead of searching through terminal history, notes, old repositories, documentation, and chat messages, CmdVault turns useful commands and queries into a structured personal knowledge library.

## Core Idea

```text
Capture -> Organize -> Generalize -> Reuse -> Save Time
```

For example, a command such as:

```bash
kubectl get pods -n payment-dev
```

can be stored as a reusable template:

```text
kubectl get pods -n {{namespace}}
```

When needed again, the variable can be filled with a new value and the generated command copied for use in an existing terminal or tool.

## Features

CmdVault V1 includes:

- CLI command and SQL query storage
- Local persistent storage with SQLite
- Search, filtering, and sorting
- Tools, environments, categories, and tags
- Collections for organizing related snippets
- Reusable template variables
- Local AI-assisted snippet analysis
- Editable AI suggestions before saving
- Import and export of CmdVault backups
- Copy-ready generated commands and queries

CmdVault V1 does **not** execute commands or queries directly.

## Local AI

CmdVault can optionally use a locally running LLM to analyze pasted commands and suggest:

- Title
- Tool
- Environment
- Category
- Description
- Template variables
- Tags

AI follows a simple principle:

> **AI Suggests. User Controls.**

All suggestions can be reviewed and edited before saving.

CmdVault currently supports an Ollama-compatible local API.

Local AI is optional. Snippets can also be added manually when AI is unavailable or disabled.

## Local First

CmdVault is designed around local usage:

- No CmdVault account required
- No central CmdVault database
- Snippet library stored locally
- SQLite persistence
- Local AI processing
- Import/export for portable backups

Local-first does not mean that stored commands are automatically safe to share. Users remain responsible for the content they save and export.

## Tech Stack

### Frontend

- React
- TypeScript
- Vite

### Desktop / Backend

- Tauri 2
- Rust
- SQLite

### Local AI

- Ollama-compatible local API

## Developer Requirements

CmdVault currently targets **Windows** for development and V1 distribution.

Before setting up the project, install:

- Git
- Node.js
- npm
- Rust / Cargo
- Microsoft C++ Build Tools required by Tauri on Windows

Ollama is optional and only required for Local AI features.

## Developer Quick Start

Clone the repository and enter the project directory:

```cmd
git clone https://github.com/Perpasit/cmdvault.git
```

Run the developer setup:

```cmd
setup.cmd
```

This checks the required Node.js, npm, and Rust/Cargo tools and installs the project's npm dependencies.

Then start CmdVault:

```cmd
dev.cmd
```

`dev.cmd` starts the Tauri development environment, including the Vite frontend and Rust backend.

For manual startup, you can also use:

```cmd
npx tauri dev
```

## Local AI Setup

To use Local AI, run an Ollama-compatible server locally.

The default CmdVault configuration is:

```text
Server URL: http://127.0.0.1:11434
Model: llama3.1:latest
```

The server URL and model can be changed from CmdVault Settings.

If Local AI is unavailable, CmdVault remains usable through manual snippet creation.

## Useful Development Commands

Run the frontend only:

```cmd
npm run dev
```

Run the full desktop application:

```cmd
npx tauri dev
```

Build the frontend:

```cmd
npm run build
```

Run ESLint:

```cmd
npm run lint
```

## Data Import and Export

CmdVault can export its local library to a JSON backup file.

A backup contains:

- Snippets
- Metadata
- Tags
- Collections
- Snippet-to-collection relationships

Import uses **merge behavior** rather than replacing the existing library.

Existing data is preserved, duplicate snippets are skipped, and missing collections or relationships can be restored from the backup.

## Project Structure

```text
cmdvault/
|-- docs/
|-- public/
|-- src/
|   |-- components/
|   `-- data/
|-- src-tauri/
|-- setup.cmd
|-- dev.cmd
|-- package.json
`-- README.md
```

## Project Status

CmdVault V1 is currently under active development.

Implemented areas include:

- Core snippet management
- Search, filtering, and sorting
- Dynamic metadata
- Reusable templates and variables
- Collections
- Local AI integration
- Import and export
- Developer bootstrap scripts

Remaining work focuses on first-run setup, final UX polish, testing, and Windows packaging/release.

## Documentation

Detailed requirements, architecture, development decisions, and other technical documentation are maintained under [`docs/`](./docs/).

---

**Goal:** Spend less time searching for commands you have already used, and more time reusing engineering knowledge you already have.