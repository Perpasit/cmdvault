use rusqlite::{Connection, Result};
use std::path::Path;

#[derive(serde::Serialize)]
#[serde(rename_all = "camelCase")]
pub struct Snippet {
    pub id: i64,
    pub snippet_type: String,
    pub title: String,
    pub tool: String,
    pub environment: String,
    pub category: String,
    pub description: String,
    pub template: String,
    pub tags: Vec<String>,
    pub created_at: String,
}

pub fn initialize_database(database_path: &Path) -> Result<()> {
    let connection = Connection::open(database_path)?;

    connection.execute(
        "
        CREATE TABLE IF NOT EXISTS snippets (
            id           INTEGER PRIMARY KEY AUTOINCREMENT,
            snippet_type TEXT NOT NULL,
            title        TEXT NOT NULL,
            tool         TEXT NOT NULL,
            environment  TEXT NOT NULL,
            category     TEXT NOT NULL,
            description  TEXT NOT NULL,
            template     TEXT NOT NULL,
            tags         TEXT NOT NULL,
            created_at   TEXT NOT NULL
        )
        ",
        [],
    )?;

    Ok(())
}

pub fn create_snippet(
    database_path: &Path,
    snippet_type: &str,
    title: &str,
    tool: &str,
    environment: &str,
    category: &str,
    description: &str,
    template: &str,
    tags: &str,
    created_at: &str,
) -> Result<i64> {
    let connection = Connection::open(database_path)?;

    connection.execute(
        "
        INSERT INTO snippets (
            snippet_type,
            title,
            tool,
            environment,
            category,
            description,
            template,
            tags,
            created_at
        )
        VALUES (?1, ?2, ?3, ?4, ?5, ?6, ?7, ?8, ?9)
        ",
        (
            snippet_type,
            title,
            tool,
            environment,
            category,
            description,
            template,
            tags,
            created_at,
        ),
    )?;

    Ok(connection.last_insert_rowid())
}

pub fn get_snippets(database_path: &Path) -> Result<Vec<Snippet>> {
    let connection = Connection::open(database_path)?;

    let mut statement = connection.prepare(
        "
        SELECT
            id,
            snippet_type,
            title,
            tool,
            environment,
            category,
            description,
            template,
            tags,
            created_at
        FROM snippets
        ORDER BY created_at DESC
        ",
    )?;

    let rows = statement.query_map([], |row| {
        let tags: String = row.get(8)?;

        Ok(Snippet {
            id: row.get(0)?,
            snippet_type: row.get(1)?,
            title: row.get(2)?,
            tool: row.get(3)?,
            environment: row.get(4)?,
            category: row.get(5)?,
            description: row.get(6)?,
            template: row.get(7)?,
            tags: if tags.is_empty() {
                Vec::new()
            } else {
                tags.split(",")
                    .map(|tag| tag.trim().to_string())
                    .collect()
            },
            created_at: row.get(9)?,
        })
    })?;

    let mut snippets = Vec::new();

    for row in rows {
        snippets.push(row?);
    }

    Ok(snippets)
}