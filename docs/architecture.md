# CmdVault V1 --- Architecture

> Initial architecture. Update this document as technical decisions are
> validated.

## High-Level Architecture

``` text
┌──────────────── CmdVault Desktop ────────────────┐
│                                                  │
│  React + TypeScript UI                           │
│          │                                       │
│          ▼                                       │
│  Tauri Application Layer                         │
│      │               │                           │
│      ▼               ▼                           │
│   SQLite        Analysis Service                 │
│                      │                           │
│                      ▼                           │
│                Local LLM Runtime                 │
│                                                  │
└──────────────────────────────────────────────────┘
```

## Components

### Desktop

**Tauri**

Responsible for packaging the application as a desktop app and exposing
native functionality where required.

### Frontend

**React + TypeScript**

Responsible for: - Library UI - Add / Analyze flow - Review & Edit -
Search and filters - Template variable input - Settings

### Local Database

**SQLite**

Stores: - Snippets - Templates - Variables - Categories - Tags -
Collections - Basic application metadata

### Analysis Layer

Responsible for converting raw input into structured suggestions.

``` text
Raw Snippet
    ↓
Basic Detection / Parsing
    ↓
Local LLM
    ↓
Structured Suggestion
    ↓
User Review
```

The application should not depend entirely on AI for normal library
operations.

### Local AI

Current direction: connect to a local LLM through an Ollama-compatible
local endpoint.

Exact model is not selected yet.

## Data Flow

``` text
Input
  ↓
Analyze
  ↓
Structured AI Result
  ↓
User Edits / Approves
  ↓
SQLite
  ↓
Search / Open
  ↓
Template Engine
  ↓
Preview
  ↓
Clipboard
```

## Architecture Principles

-   Local-first
-   No central CmdVault database
-   No account required
-   AI is optional for normal library usage
-   User-approved data is the source of truth
-   Components should allow AI runtime/model changes later
