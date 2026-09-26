# CmdVault V1 --- Definition of Done

V1 is complete when the full user journey works outside the development
environment.

## Product

A user can:

-   Install CmdVault from a GitHub Release
-   Launch the desktop application
-   Configure a supported local AI runtime
-   Add CLI commands and SQL queries
-   Analyze a snippet with local AI
-   Review and edit AI suggestions
-   Accept, reject, rename, or manually add variables
-   Save snippets locally
-   Reopen the application without losing data
-   Search and filter saved snippets
-   Organize snippets using categories, tags, and collections
-   Fill template variables
-   Preview the generated command/query
-   Copy the result
-   Edit and delete existing snippets
-   Export and import the library

## Quality

-   Core flows work without crashes
-   Invalid AI responses are handled gracefully
-   Local data persists correctly
-   Multi-line commands and SQL remain correctly formatted
-   The application remains usable when AI is unavailable, except for
    Analyze
-   Basic empty, loading, and error states exist

## Distribution

-   Source code is available on GitHub
-   README explains the project and basic usage
-   Windows installer is available through GitHub Releases
-   A fresh installation can complete the main V1 flow

## Validation

Before calling V1 complete, test it with real Cloud Engineering and Data
Engineering snippets.

After release, share V1 with other engineers and collect feedback before
defining V2.
