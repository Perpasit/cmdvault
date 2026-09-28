mod database;

use tauri::Manager;

/*
 * ============================================================
 * Local AI
 * ============================================================
 */

// const OLLAMA_GENERATE_URL: &str =
//     "http://127.0.0.1:11434/api/generate";

// const OLLAMA_MODEL: &str =
//     "llama3.1:latest";

#[derive(serde::Serialize)]
struct OllamaGenerateRequest {
    model: String,
    prompt: String,
    stream: bool,
}

#[derive(serde::Deserialize)]
struct OllamaGenerateResponse {
    response: String,
    done: bool,
}

/*
 * ============================================================
 * AI Analyze Schema
 * ============================================================
 */

#[derive(Debug, serde::Serialize, serde::Deserialize)]
#[serde(rename_all = "camelCase")]
struct AnalyzeVariable {
    name: String,
    value: String,
}

#[derive(Debug, serde::Serialize, serde::Deserialize)]
#[serde(rename_all = "camelCase")]
struct AnalyzeResult {
    title: String,
    tool: String,
    environment: String,
    category: String,
    description: String,
    template: String,
    variables: Vec<AnalyzeVariable>,
    tags: Vec<String>,
}

/*
 * ============================================================
 * Export Schema
 * ============================================================
 */

#[derive(
    serde::Serialize,
    serde::Deserialize,
)]
#[serde(rename_all = "camelCase")]
struct ExportSnippet {
    title: String,
    tool: String,
    environment: String,
    category: String,
    description: String,
    template: String,
    tags: Vec<String>,
    created_at: String,
    collections: Vec<String>,
}

#[derive(
    serde::Serialize,
    serde::Deserialize,
)]
#[serde(rename_all = "camelCase")]
struct ExportCollection {
    name: String,
    created_at: String,
}

#[derive(
    serde::Serialize,
    serde::Deserialize,
)]
#[serde(rename_all = "camelCase")]
struct ExportData {
    version: u32,
    exported_at: String,
    collections: Vec<ExportCollection>,
    snippets: Vec<ExportSnippet>,
}

#[derive(serde::Serialize)]
#[serde(rename_all = "camelCase")]
struct ImportPreview {
    version: u32,
    exported_at: String,
    snippet_count: usize,
    collection_count: usize,
}

#[derive(serde::Serialize)]
#[serde(rename_all = "camelCase")]
struct ImportResult {
    imported_snippets: usize,
    skipped_snippets: usize,
    created_collections: usize,
    reused_collections: usize,
}

fn build_analyze_prompt(content: &str) -> String {
    format!(
        r#"
You are the local AI analyzer inside CmdVault.

CmdVault is a developer tool for capturing and reusing engineering
commands and SQL queries.

Analyze the input and return ONLY valid JSON.
Do not include markdown.
Do not include ```json.
Do not include explanations before or after the JSON.

Return exactly this structure:

{{
  "title": "short descriptive title",
  "tool": "tool name",
  "environment": "execution environment",
  "category": "short category",
  "description": "short description of what the command or query does",
  "template": "reusable version of the input using {{{{variable_name}}}} placeholders",
  "variables": [
    {{
      "name": "variable_name",
      "value": "original value"
    }}
  ],
  "tags": [
    "tag1",
    "tag2"
  ]
}}

Rules:

1. Preserve the behavior and intent of the original input.

2. The template must remain executable after all placeholders
   are replaced with values.

3. Replace values that are likely to change between uses with
   {{{{variable_name}}}} placeholders.

4. Good variable candidates include:
   - Kubernetes pod names
   - namespaces
   - resource names
   - subscription names
   - resource groups
   - file paths
   - URLs
   - host names
   - ports
   - IDs
   - query values
   - limits
   - dates

5. Do not replace command keywords, flags, SQL keywords,
   operators, or other structural syntax with variables.

6. Variable names must:
   - use snake_case
   - be descriptive
   - contain no spaces
   - not include the curly braces

7. Every placeholder used in "template" must have exactly one
   matching entry in "variables".

8. Every variable value must be copied from the original input.
   Do not invent values.

9. Prefer these tool names when applicable:
   Kubernetes
   Terraform
   Azure CLI
   Azure PowerShell
   AWS CLI
   Docker
   Git
   SQL

10. Prefer these environments when applicable:
    Bash / Shell
    PowerShell
    Windows CMD
    SQL
    Generic CLI

11. Keep the title concise.

12. Keep the description concise and factual.

13. Tags should be short, useful search terms.

14. If no useful variables exist, return:
    "variables": []

15. Never execute the input.
    Only analyze it.

Input:

---BEGIN INPUT---
{}
---END INPUT---
"#,
        content
    )
}

/*
 * ============================================================
 * Inputs
 * ============================================================
 */

#[derive(serde::Deserialize)]
#[serde(rename_all = "camelCase")]
struct CreateSnippetInput {
    title: String,
    tool: String,
    environment: String,
    category: String,
    description: String,
    template: String,
    tags: Vec<String>,
    created_at: String,
}

#[derive(serde::Deserialize)]
#[serde(rename_all = "camelCase")]
struct UpdateSnippetInput {
    id: i64,
    title: String,
    tool: String,
    environment: String,
    category: String,
    description: String,
    template: String,
    tags: Vec<String>,
}

#[derive(serde::Deserialize)]
#[serde(rename_all = "camelCase")]
struct CreateCollectionInput {
    name: String,
    created_at: String,
}

#[derive(serde::Deserialize)]
#[serde(rename_all = "camelCase")]
struct RenameCollectionInput {
    id: i64,
    name: String,
}

#[derive(serde::Deserialize)]
#[serde(rename_all = "camelCase")]
struct SnippetCollectionInput {
    snippet_id: i64,
    collection_id: i64,
}

/*
 * ============================================================
 * Helper
 * ============================================================
 */

fn get_database_path(app: &tauri::AppHandle) -> Result<std::path::PathBuf, String> {
    let app_data_dir = app
        .path()
        .app_data_dir()
        .map_err(|error| error.to_string())?;

    Ok(app_data_dir.join("cmdvault.db"))
}

/*
 * ============================================================
 * Local AI Commands
 * ============================================================
 */

#[tauri::command]
fn check_ai_health(server_url: String, model: String) -> Result<(), String> {
    let server_url = server_url.trim().trim_end_matches('/');

    let model = model.trim();

    if server_url.is_empty() {
        return Err("Server URL is required.".to_string());
    }

    if model.is_empty() {
        return Err("Model is required.".to_string());
    }

    let client = reqwest::blocking::Client::builder()
        .timeout(std::time::Duration::from_secs(3))
        .build()
        .map_err(|error| format!("Failed to create HTTP client: {}", error))?;

    let url = format!("{}/api/tags", server_url);

    let response = client
        .get(url)
        .send()
        .map_err(|_| "Local AI is unavailable.".to_string())?;

    if !response.status().is_success() {
        return Err("Local AI is unavailable.".to_string());
    }

    let body: serde_json::Value = response
        .json()
        .map_err(|_| "Failed to read Ollama models.".to_string())?;

    let model_exists = body["models"]
        .as_array()
        .map(|models| {
            models.iter().any(|item| {
                item["name"]
                    .as_str()
                    .map(|name| name == model)
                    .unwrap_or(false)
            })
        })
        .unwrap_or(false);

    if !model_exists {
        return Err(format!("Model '{}' is not installed.", model));
    }

    Ok(())
}

#[tauri::command]
fn analyze_snippet(
    content: String,
    server_url: String,
    model: String,
) -> Result<AnalyzeResult, String> {
    let trimmed_content = content.trim();

    let server_url = server_url.trim().trim_end_matches('/');

    let model = model.trim();

    if server_url.is_empty() {
        return Err("Server URL is required.".to_string());
    }

    if model.is_empty() {
        return Err("Model is required.".to_string());
    }

    let generate_url = format!("{}/api/generate", server_url);

    /*
     * Build prompt
     */
    let prompt = build_analyze_prompt(trimmed_content);

    /*
     * Prepare Ollama request
     */
    let request = OllamaGenerateRequest {
        model: model.to_string(),
        prompt,
        stream: false,
    };

    /*
     * Send request to local Ollama
     */
    let client = reqwest::blocking::Client::builder()
        .timeout(std::time::Duration::from_secs(120))
        .build()
        .map_err(|error| format!("Failed to create HTTP client: {}", error))?;

    let response = client
        .post(&generate_url)
        .json(&request)
        .send()
        .map_err(|error| format!("Failed to connect to local AI:\n{:#?}", error))?;

    /*
     * Check HTTP status
     */
    if !response.status().is_success() {
        return Err(format!("Local AI returned HTTP {}", response.status()));
    }

    /*
     * Read Ollama response
     */
    let ollama_result = response
        .json::<OllamaGenerateResponse>()
        .map_err(|error| format!("Failed to read local AI response: {}", error))?;

    if !ollama_result.done {
        return Err("Local AI response did not complete.".to_string());
    }

    /*
     * Ollama returns the generated JSON
     * inside the "response" field.
     */
    let ai_output = ollama_result.response.trim();

    /*
     * Parse generated JSON into
     * our AnalyzeResult schema.
     */
    let result = serde_json::from_str::<AnalyzeResult>(ai_output).map_err(|error| {
        format!(
            "Failed to parse AI response as JSON: {}\n\nAI response:\n{}",
            error, ai_output
        )
    })?;

    Ok(result)
}

/*
 * ============================================================
 * Snippet Commands
 * ============================================================
 */

#[tauri::command]
fn create_snippet(app: tauri::AppHandle, input: CreateSnippetInput) -> Result<i64, String> {
    let database_path = get_database_path(&app)?;

    let tags = input.tags.join(",");

    database::create_snippet(
        &database_path,
        &input.title,
        &input.tool,
        &input.environment,
        &input.category,
        &input.description,
        &input.template,
        &tags,
        &input.created_at,
    )
    .map_err(|error| error.to_string())
}

#[tauri::command]
fn get_snippets(app: tauri::AppHandle) -> Result<Vec<database::Snippet>, String> {
    let database_path = get_database_path(&app)?;

    database::get_snippets(&database_path).map_err(|error| error.to_string())
}

#[tauri::command]
fn update_snippet(app: tauri::AppHandle, input: UpdateSnippetInput) -> Result<(), String> {
    let database_path = get_database_path(&app)?;

    let tags = input.tags.join(",");

    database::update_snippet(
        &database_path,
        input.id,
        &input.title,
        &input.tool,
        &input.environment,
        &input.category,
        &input.description,
        &input.template,
        &tags,
    )
    .map_err(|error| error.to_string())
}

#[tauri::command]
fn delete_snippet(app: tauri::AppHandle, id: i64) -> Result<(), String> {
    let database_path = get_database_path(&app)?;

    database::delete_snippet(&database_path, id).map_err(|error| error.to_string())
}

/*
 * ============================================================
 * Collection Commands
 * ============================================================
 */

#[tauri::command]
fn create_collection(app: tauri::AppHandle, input: CreateCollectionInput) -> Result<i64, String> {
    let database_path = get_database_path(&app)?;

    let name = input.name.trim();

    if name.is_empty() {
        return Err("Collection name cannot be empty.".to_string());
    }

    database::create_collection(&database_path, name, &input.created_at)
        .map_err(|error| error.to_string())
}

#[tauri::command]
fn get_collections(app: tauri::AppHandle) -> Result<Vec<database::Collection>, String> {
    let database_path = get_database_path(&app)?;

    database::get_collections(&database_path).map_err(|error| error.to_string())
}

#[tauri::command]
fn rename_collection(app: tauri::AppHandle, input: RenameCollectionInput) -> Result<(), String> {
    let database_path = get_database_path(&app)?;

    let name = input.name.trim();

    if name.is_empty() {
        return Err("Collection name cannot be empty.".to_string());
    }

    database::rename_collection(&database_path, input.id, name).map_err(|error| error.to_string())
}

#[tauri::command]
fn delete_collection(app: tauri::AppHandle, id: i64) -> Result<(), String> {
    let database_path = get_database_path(&app)?;

    database::delete_collection(&database_path, id).map_err(|error| error.to_string())
}

/*
 * ============================================================
 * Snippet <-> Collection Commands
 * ============================================================
 */

#[tauri::command]
fn add_snippet_to_collection(
    app: tauri::AppHandle,
    input: SnippetCollectionInput,
) -> Result<(), String> {
    let database_path = get_database_path(&app)?;

    database::add_snippet_to_collection(&database_path, input.snippet_id, input.collection_id)
        .map_err(|error| error.to_string())
}

#[tauri::command]
fn remove_snippet_from_collection(
    app: tauri::AppHandle,
    input: SnippetCollectionInput,
) -> Result<(), String> {
    let database_path = get_database_path(&app)?;

    database::remove_snippet_from_collection(&database_path, input.snippet_id, input.collection_id)
        .map_err(|error| error.to_string())
}

#[tauri::command]
fn get_snippet_collections(
    app: tauri::AppHandle,
    snippet_id: i64,
) -> Result<Vec<database::Collection>, String> {
    let database_path = get_database_path(&app)?;

    database::get_snippet_collections(&database_path, snippet_id).map_err(|error| error.to_string())
}

#[tauri::command]
fn get_collection_snippet_ids(
    app: tauri::AppHandle,
    collection_id: i64,
) -> Result<Vec<i64>, String> {
    let database_path = get_database_path(&app)?;

    database::get_collection_snippet_ids(&database_path, collection_id)
        .map_err(|error| error.to_string())
}

/*
 * ============================================================
 * Import / Export Commands
 * ============================================================
 */

#[tauri::command]
fn export_data(app: tauri::AppHandle) -> Result<String, String> {
    let database_path = get_database_path(&app)?;

    let snippets = database::get_snippets(&database_path).map_err(|error| error.to_string())?;

    let collections =
        database::get_collections(&database_path).map_err(|error| error.to_string())?;

    let export_collections = collections
        .into_iter()
        .map(|collection| ExportCollection {
            name: collection.name,
            created_at: collection.created_at,
        })
        .collect();

    let mut export_snippets = Vec::new();

    for snippet in snippets {
        let snippet_collections = database::get_snippet_collections(&database_path, snippet.id)
            .map_err(|error| error.to_string())?;

        let collection_names = snippet_collections
            .into_iter()
            .map(|collection| collection.name)
            .collect();

        export_snippets.push(ExportSnippet {
            title: snippet.title,
            tool: snippet.tool,
            environment: snippet.environment,
            category: snippet.category,
            description: snippet.description,
            template: snippet.template,
            tags: snippet.tags,
            created_at: snippet.created_at,
            collections: collection_names,
        });
    }

    let export = ExportData {
        version: 1,

        exported_at:
        chrono::Utc::now().to_rfc3339(),

        collections: export_collections,

        snippets: export_snippets,
    };

    serde_json::to_string_pretty(&export)
        .map_err(|error| format!("Failed to create export: {}", error))
}

#[tauri::command]
fn validate_import_data(
    data: String,
) -> Result<ImportPreview, String> {
    let import_data:
        ExportData =
        serde_json::from_str(&data)
            .map_err(|error| {
                format!(
                    "Invalid CmdVault backup file: {}",
                    error
                )
            })?;

    if import_data.version != 1 {
        return Err(format!(
            "Unsupported backup version: {}",
            import_data.version
        ));
    }

    Ok(ImportPreview {
        version:
            import_data.version,

        exported_at:
            import_data.exported_at,

        snippet_count:
            import_data.snippets.len(),

        collection_count:
            import_data.collections.len(),
    })
}

#[tauri::command]
fn import_data(
    app: tauri::AppHandle,
    data: String,
) -> Result<ImportResult, String> {
    /*
     * Parse backup
     */
    let import_data:
        ExportData =
        serde_json::from_str(&data)
            .map_err(|error| {
                format!(
                    "Invalid CmdVault backup file: {}",
                    error
                )
            })?;

    /*
     * Validate backup version
     */
    if import_data.version != 1 {
        return Err(format!(
            "Unsupported backup version: {}",
            import_data.version
        ));
    }

    let database_path =
        get_database_path(&app)?;

    /*
     * Convert backup collections
     * into database import models.
     */
    let collections =
        import_data
            .collections
            .into_iter()
            .map(|collection| {
                database::ImportCollection {
                    name:
                        collection.name,

                    created_at:
                        collection.created_at,
                }
            })
            .collect();

    /*
     * Convert backup snippets
     * into database import models.
     */
    let snippets =
        import_data
            .snippets
            .into_iter()
            .map(|snippet| {
                database::ImportSnippet {
                    title:
                        snippet.title,

                    tool:
                        snippet.tool,

                    environment:
                        snippet.environment,

                    category:
                        snippet.category,

                    description:
                        snippet.description,

                    template:
                        snippet.template,

                    tags:
                        snippet.tags,

                    created_at:
                        snippet.created_at,

                    collections:
                        snippet.collections,
                }
            })
            .collect();

    /*
     * Everything below this point is handled
     * inside one SQLite transaction.
     */
    let result =
        database::import_data(
            &database_path,
            collections,
            snippets,
        )
        .map_err(|error| {
            format!(
                "Failed to import backup: {}",
                error
            )
        })?;

    Ok(ImportResult {
        imported_snippets:
            result.imported_snippets,

        skipped_snippets:
            result.skipped_snippets,

        created_collections:
            result.created_collections,

        reused_collections:
            result.reused_collections,
    })
}

/*
 * ============================================================
 * Application
 * ============================================================
 */

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_fs::init())
        .plugin(tauri_plugin_dialog::init())
        .setup(|app| {
            if cfg!(debug_assertions) {
                app.handle().plugin(
                    tauri_plugin_log::Builder::default()
                        .level(log::LevelFilter::Info)
                        .build(),
                )?;
            }

            let app_data_dir = app
                .path()
                .app_data_dir()
                .expect("failed to get app data directory");

            std::fs::create_dir_all(&app_data_dir).expect("failed to create app data directory");

            let database_path = app_data_dir.join("cmdvault.db");

            database::initialize_database(&database_path).expect("failed to initialize database");

            Ok(())
        })
        .invoke_handler(tauri::generate_handler![
            /*
             * Snippets
             */
            create_snippet,
            get_snippets,
            update_snippet,
            delete_snippet,
            check_ai_health,
            /*
             * Collections
             */
            create_collection,
            get_collections,
            rename_collection,
            delete_collection,
            /*
             * Relationships
             */
            add_snippet_to_collection,
            remove_snippet_from_collection,
            get_snippet_collections,
            get_collection_snippet_ids,
            /*
             * Local AI
             */
            analyze_snippet,
            /*
             * Import / Export
             */
            export_data,
            validate_import_data,
            import_data   
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
