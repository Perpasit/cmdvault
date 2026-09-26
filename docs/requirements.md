# CmdVault V1 --- Functional Requirements

## Goal

CmdVault V1 is a local-first desktop application that helps engineers
store, organize, search, and reuse CLI commands and SQL queries.

## Core Flow

``` text
Paste → Analyze → Review & Edit → Save → Search → Use → Fill Variables → Copy
```

## Functional Requirements

### 1. Add Snippet

Users can paste and save: - CLI commands - Multi-line CLI commands - SQL
queries

### 2. Analyze

Local AI can suggest: - Type - Shell / environment - Tool - Category -
Title - Description - Tags - Reusable variables - Reusable template

AI output is a suggestion only.

### 3. Review & Edit

Before saving, users can: - Edit title, description, tool, category, and
tags - Choose a collection - Accept or reject suggested variables -
Rename suggested variables - Add variables manually - Edit the final
template

### 4. Library

Users can: - Browse saved snippets - Search by keyword - Filter by tool,
category, tag, or collection - Mark favorites - View recent snippets -
Edit or delete saved snippets

### 5. Reuse

For templates containing variables, users can: - Enter variable values -
Preview the generated command/query - Copy the result to clipboard

CmdVault V1 does not execute commands.

### 6. Storage

-   Data persists locally
-   No account is required
-   Library can be exported and imported

### 7. Settings

Users can configure: - Local AI endpoint - Local AI model - Basic
application preferences

## Supported Content

Initial focus: - Linux / Shell - Windows CMD - PowerShell - Kubernetes -
Terraform - Azure / AWS CLI - Docker - Git - Other CLI commands - SQL

The design should allow additional tools later without redesigning the
core data model.
