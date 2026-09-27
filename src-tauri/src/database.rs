use rusqlite::{Connection, Result};
use std::path::Path;

#[derive(serde::Serialize)]
#[serde(rename_all = "camelCase")]
pub struct Snippet {
    pub id: i64,
    pub title: String,
    pub tool: String,
    pub environment: String,
    pub category: String,
    pub description: String,
    pub template: String,
    pub tags: Vec<String>,
    pub created_at: String,
}

pub fn initialize_database(
    database_path: &Path,
) -> Result<()> {
    let connection = Connection::open(database_path)?;

    connection.execute(
        "
        CREATE TABLE IF NOT EXISTS snippets (
            id           INTEGER PRIMARY KEY AUTOINCREMENT,
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
            title,
            tool,
            environment,
            category,
            description,
            template,
            tags,
            created_at
        )
        VALUES (?1, ?2, ?3, ?4, ?5, ?6, ?7, ?8)
        ",
        (
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

pub fn get_snippets(
    database_path: &Path,
) -> Result<Vec<Snippet>> {
    let connection = Connection::open(database_path)?;

    let mut statement = connection.prepare(
        "
        SELECT
            id,
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
        let tags: String = row.get(7)?;

        Ok(Snippet {
            id: row.get(0)?,
            title: row.get(1)?,
            tool: row.get(2)?,
            environment: row.get(3)?,
            category: row.get(4)?,
            description: row.get(5)?,
            template: row.get(6)?,
            tags: if tags.is_empty() {
                Vec::new()
            } else {
                tags.split(",")
                    .map(|tag| tag.trim().to_string())
                    .collect()
            },
            created_at: row.get(8)?,
        })
    })?;

    let mut snippets = Vec::new();

    for row in rows {
        snippets.push(row?);
    }

    Ok(snippets)
}

pub fn update_snippet(
    database_path: &Path,
    id: i64,
    title: &str,
    tool: &str,
    environment: &str,
    category: &str,
    description: &str,
    template: &str,
    tags: &str,
) -> Result<()> {
    let connection = Connection::open(database_path)?;

    connection.execute(
        "
        UPDATE snippets
        SET
            title = ?1,
            tool = ?2,
            environment = ?3,
            category = ?4,
            description = ?5,
            template = ?6,
            tags = ?7
        WHERE id = ?8
        ",
        (
            title,
            tool,
            environment,
            category,
            description,
            template,
            tags,
            id,
        ),
    )?;

    Ok(())
}

pub fn delete_snippet(
    database_path: &Path,
    id: i64,
) -> Result<()> {
    let connection = Connection::open(database_path)?;

    connection.execute(
        "DELETE FROM snippets WHERE id = ?1",
        [id],
    )?;

    Ok(())
}