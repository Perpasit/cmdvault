# CmdVault V1 --- Development

> Development choices are provisional until validated during
> implementation.

## Proposed Stack

  Area               Technology
  ------------------ -----------------------------------
  Desktop            Tauri
  Frontend           React
  Language           TypeScript
  Desktop Backend    Rust / Tauri
  Local Database     SQLite
  Local AI Runtime   Ollama-compatible endpoint
  AI Model           TBD
  Search             SQLite keyword / full-text search
  Source Control     Git + GitHub
  Distribution       GitHub Releases
  Initial Platform   Windows

## Development Priorities

Build the product in vertical slices rather than completing every
backend component first.

### Phase 1 --- Foundation

-   Initialize Tauri + React + TypeScript
-   Establish application structure
-   Connect SQLite
-   Create basic snippet model

### Phase 2 --- Library

-   Add snippet
-   Save / edit / delete
-   Browse library
-   Search and filters

### Phase 3 --- Templates

-   Define variables
-   Generate template
-   Fill variables
-   Preview and copy

### Phase 4 --- Local AI

-   Configure local endpoint/model
-   Analyze command/SQL
-   Return structured suggestions
-   Review and edit suggestions
-   Handle unavailable/invalid AI responses

### Phase 5 --- Product Completion

-   Collections, tags, favorites, recent
-   Import / export
-   Settings
-   Empty/loading/error states
-   Real-world testing

### Phase 6 --- Release

-   Build Windows installer
-   Test fresh installation
-   Publish GitHub Release
-   Let other engineers test V1

## Development Rule

Avoid adding V2 features while building V1.

New ideas should be recorded for later unless they are required to
complete the V1 user journey.

## Next Step

With V1 scope and technical direction defined, the next step is to draft
the UI/UX around the core flow:

``` text
Library → Add → Analyze → Review & Edit → Save → Search → Use
```
