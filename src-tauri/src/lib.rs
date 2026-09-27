mod database;

use tauri::Manager;

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

fn get_database_path(
    app: &tauri::AppHandle,
) -> Result<std::path::PathBuf, String> {
    let app_data_dir = app
        .path()
        .app_data_dir()
        .map_err(|error| error.to_string())?;

    Ok(app_data_dir.join("cmdvault.db"))
}

/*
 * ============================================================
 * Snippet Commands
 * ============================================================
 */

#[tauri::command]
fn create_snippet(
    app: tauri::AppHandle,
    input: CreateSnippetInput,
) -> Result<i64, String> {
    let database_path =
        get_database_path(&app)?;

    let tags =
        input.tags.join(",");

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
fn get_snippets(
    app: tauri::AppHandle,
) -> Result<Vec<database::Snippet>, String> {
    let database_path =
        get_database_path(&app)?;

    database::get_snippets(
        &database_path,
    )
    .map_err(|error| error.to_string())
}

#[tauri::command]
fn update_snippet(
    app: tauri::AppHandle,
    input: UpdateSnippetInput,
) -> Result<(), String> {
    let database_path =
        get_database_path(&app)?;

    let tags =
        input.tags.join(",");

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
fn delete_snippet(
    app: tauri::AppHandle,
    id: i64,
) -> Result<(), String> {
    let database_path =
        get_database_path(&app)?;

    database::delete_snippet(
        &database_path,
        id,
    )
    .map_err(|error| error.to_string())
}

/*
 * ============================================================
 * Collection Commands
 * ============================================================
 */

#[tauri::command]
fn create_collection(
    app: tauri::AppHandle,
    input: CreateCollectionInput,
) -> Result<i64, String> {
    let database_path =
        get_database_path(&app)?;

    let name =
        input.name.trim();

    if name.is_empty() {
        return Err(
            "Collection name cannot be empty."
                .to_string(),
        );
    }

    database::create_collection(
        &database_path,
        name,
        &input.created_at,
    )
    .map_err(|error| error.to_string())
}

#[tauri::command]
fn get_collections(
    app: tauri::AppHandle,
) -> Result<Vec<database::Collection>, String> {
    let database_path =
        get_database_path(&app)?;

    database::get_collections(
        &database_path,
    )
    .map_err(|error| error.to_string())
}

#[tauri::command]
fn rename_collection(
    app: tauri::AppHandle,
    input: RenameCollectionInput,
) -> Result<(), String> {
    let database_path =
        get_database_path(&app)?;

    let name =
        input.name.trim();

    if name.is_empty() {
        return Err(
            "Collection name cannot be empty."
                .to_string(),
        );
    }

    database::rename_collection(
        &database_path,
        input.id,
        name,
    )
    .map_err(|error| error.to_string())
}

#[tauri::command]
fn delete_collection(
    app: tauri::AppHandle,
    id: i64,
) -> Result<(), String> {
    let database_path =
        get_database_path(&app)?;

    database::delete_collection(
        &database_path,
        id,
    )
    .map_err(|error| error.to_string())
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
    let database_path =
        get_database_path(&app)?;

    database::add_snippet_to_collection(
        &database_path,
        input.snippet_id,
        input.collection_id,
    )
    .map_err(|error| error.to_string())
}

#[tauri::command]
fn remove_snippet_from_collection(
    app: tauri::AppHandle,
    input: SnippetCollectionInput,
) -> Result<(), String> {
    let database_path =
        get_database_path(&app)?;

    database::remove_snippet_from_collection(
        &database_path,
        input.snippet_id,
        input.collection_id,
    )
    .map_err(|error| error.to_string())
}

#[tauri::command]
fn get_snippet_collections(
    app: tauri::AppHandle,
    snippet_id: i64,
) -> Result<Vec<database::Collection>, String> {
    let database_path =
        get_database_path(&app)?;

    database::get_snippet_collections(
        &database_path,
        snippet_id,
    )
    .map_err(|error| error.to_string())
}

#[tauri::command]
fn get_collection_snippet_ids(
    app: tauri::AppHandle,
    collection_id: i64,
) -> Result<Vec<i64>, String> {
    let database_path =
        get_database_path(&app)?;

    database::get_collection_snippet_ids(
        &database_path,
        collection_id,
    )
    .map_err(|error| error.to_string())
}

/*
 * ============================================================
 * Application
 * ============================================================
 */

#[cfg_attr(
    mobile,
    tauri::mobile_entry_point
)]
pub fn run() {
    tauri::Builder::default()
        .setup(|app| {
            if cfg!(debug_assertions) {
                app.handle().plugin(
                    tauri_plugin_log::Builder::default()
                        .level(
                            log::LevelFilter::Info,
                        )
                        .build(),
                )?;
            }

            let app_data_dir = app
                .path()
                .app_data_dir()
                .expect(
                    "failed to get app data directory",
                );

            std::fs::create_dir_all(
                &app_data_dir,
            )
            .expect(
                "failed to create app data directory",
            );

            let database_path =
                app_data_dir.join(
                    "cmdvault.db",
                );

            database::initialize_database(
                &database_path,
            )
            .expect(
                "failed to initialize database",
            );

            Ok(())
        })
        .invoke_handler(
            tauri::generate_handler![
                /*
                 * Snippets
                 */
                create_snippet,
                get_snippets,
                update_snippet,
                delete_snippet,

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
                get_collection_snippet_ids
            ],
        )
        .run(
            tauri::generate_context!(),
        )
        .expect(
            "error while running tauri application",
        );
}