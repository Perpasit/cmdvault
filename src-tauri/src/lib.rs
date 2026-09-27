mod database;

use tauri::Manager;

#[derive(serde::Deserialize)]
#[serde(rename_all = "camelCase")]
struct CreateSnippetInput {
    snippet_type: String,
    title: String,
    tool: String,
    environment: String,
    category: String,
    description: String,
    template: String,
    tags: Vec<String>,
    created_at: String,
}

#[tauri::command]
fn create_snippet(
    app: tauri::AppHandle,
    input: CreateSnippetInput,
) -> Result<i64, String> {
    let app_data_dir = app
        .path()
        .app_data_dir()
        .map_err(|error| error.to_string())?;

    let database_path = app_data_dir.join("cmdvault.db");

    let tags = input.tags.join(",");

    database::create_snippet(
        &database_path,
        &input.snippet_type,
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
    let app_data_dir = app
        .path()
        .app_data_dir()
        .map_err(|error| error.to_string())?;

    let database_path = app_data_dir.join("cmdvault.db");

    database::get_snippets(&database_path)
        .map_err(|error| error.to_string())
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
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

            std::fs::create_dir_all(&app_data_dir)
                .expect("failed to create app data directory");

            let database_path = app_data_dir.join("cmdvault.db");

            database::initialize_database(&database_path)
                .expect("failed to initialize database");

            Ok(())
        })
        .invoke_handler(tauri::generate_handler![
            create_snippet,
            get_snippets
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}