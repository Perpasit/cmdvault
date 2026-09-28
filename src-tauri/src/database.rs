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

#[derive(serde::Serialize)]
#[serde(rename_all = "camelCase")]
pub struct Collection {
    pub id: i64,
    pub name: String,
    pub created_at: String,
}

#[derive(Debug)]
pub struct ImportSnippet {
    pub title: String,
    pub tool: String,
    pub environment: String,
    pub category: String,
    pub description: String,
    pub template: String,
    pub tags: Vec<String>,
    pub created_at: String,
    pub collections: Vec<String>,
}

#[derive(Debug)]
pub struct ImportCollection {
    pub name: String,
    pub created_at: String,
}

#[derive(serde::Serialize)]
#[serde(rename_all = "camelCase")]
pub struct ImportResult {
    pub imported_snippets: usize,
    pub skipped_snippets: usize,
    pub created_collections: usize,
    pub reused_collections: usize,
}

pub fn initialize_database(database_path: &Path) -> Result<()> {
    let connection = Connection::open(database_path)?;

    /*
     * Foreign keys are disabled by default
     * in SQLite connections.
     */
    connection.execute_batch(
        "
        PRAGMA foreign_keys = ON;

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
        );

        CREATE TABLE IF NOT EXISTS collections (
            id           INTEGER PRIMARY KEY AUTOINCREMENT,
            name         TEXT NOT NULL COLLATE NOCASE UNIQUE,
            created_at   TEXT NOT NULL
        );

        CREATE TABLE IF NOT EXISTS snippet_collections (
            snippet_id      INTEGER NOT NULL,
            collection_id   INTEGER NOT NULL,

            PRIMARY KEY (
                snippet_id,
                collection_id
            ),

            FOREIGN KEY (snippet_id)
                REFERENCES snippets(id)
                ON DELETE CASCADE,

            FOREIGN KEY (collection_id)
                REFERENCES collections(id)
                ON DELETE CASCADE
        );

        CREATE INDEX IF NOT EXISTS idx_snippet_collections_snippet
        ON snippet_collections(snippet_id);

        CREATE INDEX IF NOT EXISTS idx_snippet_collections_collection
        ON snippet_collections(collection_id);
        ",
    )?;

    Ok(())
}

/*
 * ============================================================
 * Snippets
 * ============================================================
 */

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

pub fn get_snippets(database_path: &Path) -> Result<Vec<Snippet>> {
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
                tags.split(",").map(|tag| tag.trim().to_string()).collect()
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

pub fn delete_snippet(database_path: &Path, id: i64) -> Result<()> {
    let mut connection = Connection::open(database_path)?;

    connection.execute("PRAGMA foreign_keys = ON", [])?;

    let transaction = connection.transaction()?;

    /*
     * Explicit delete keeps this safe even if
     * the database was previously created
     * without foreign key enforcement.
     */
    transaction.execute(
        "
        DELETE FROM snippet_collections
        WHERE snippet_id = ?1
        ",
        [id],
    )?;

    transaction.execute(
        "
        DELETE FROM snippets
        WHERE id = ?1
        ",
        [id],
    )?;

    transaction.commit()?;

    Ok(())
}

/*
 * ============================================================
 * Collections
 * ============================================================
 */

/*
 * Create Collection
 */
pub fn create_collection(database_path: &Path, name: &str, created_at: &str) -> Result<i64> {
    let connection = Connection::open(database_path)?;

    connection.execute(
        "
        INSERT INTO collections (
            name,
            created_at
        )
        VALUES (?1, ?2)
        ",
        (name, created_at),
    )?;

    Ok(connection.last_insert_rowid())
}

/*
 * Get all Collections
 */
pub fn get_collections(database_path: &Path) -> Result<Vec<Collection>> {
    let connection = Connection::open(database_path)?;

    let mut statement = connection.prepare(
        "
        SELECT
            id,
            name,
            created_at
        FROM collections
        ORDER BY name COLLATE NOCASE ASC
        ",
    )?;

    let rows = statement.query_map([], |row| {
        Ok(Collection {
            id: row.get(0)?,
            name: row.get(1)?,
            created_at: row.get(2)?,
        })
    })?;

    let mut collections = Vec::new();

    for row in rows {
        collections.push(row?);
    }

    Ok(collections)
}

/*
 * Rename Collection
 */
pub fn rename_collection(database_path: &Path, id: i64, name: &str) -> Result<()> {
    let connection = Connection::open(database_path)?;

    connection.execute(
        "
        UPDATE collections
        SET name = ?1
        WHERE id = ?2
        ",
        (name, id),
    )?;

    Ok(())
}

/*
 * Delete Collection
 */
pub fn delete_collection(database_path: &Path, id: i64) -> Result<()> {
    let mut connection = Connection::open(database_path)?;

    connection.execute("PRAGMA foreign_keys = ON", [])?;

    let transaction = connection.transaction()?;

    /*
     * Remove relationships first.
     *
     * Snippets themselves are NOT deleted.
     */
    transaction.execute(
        "
        DELETE FROM snippet_collections
        WHERE collection_id = ?1
        ",
        [id],
    )?;

    transaction.execute(
        "
        DELETE FROM collections
        WHERE id = ?1
        ",
        [id],
    )?;

    transaction.commit()?;

    Ok(())
}

/*
 * ============================================================
 * Snippet <-> Collection relationships
 * ============================================================
 */

/*
 * Add a Snippet to a Collection
 *
 * INSERT OR IGNORE prevents duplicate relationships.
 */
pub fn add_snippet_to_collection(
    database_path: &Path,
    snippet_id: i64,
    collection_id: i64,
) -> Result<()> {
    let connection = Connection::open(database_path)?;

    connection.execute("PRAGMA foreign_keys = ON", [])?;

    connection.execute(
        "
        INSERT OR IGNORE INTO snippet_collections (
            snippet_id,
            collection_id
        )
        VALUES (?1, ?2)
        ",
        (snippet_id, collection_id),
    )?;

    Ok(())
}

/*
 * Remove a Snippet from a Collection
 */
pub fn remove_snippet_from_collection(
    database_path: &Path,
    snippet_id: i64,
    collection_id: i64,
) -> Result<()> {
    let connection = Connection::open(database_path)?;

    connection.execute(
        "
        DELETE FROM snippet_collections
        WHERE
            snippet_id = ?1
            AND collection_id = ?2
        ",
        (snippet_id, collection_id),
    )?;

    Ok(())
}

/*
 * Get Collections belonging to one Snippet.
 */
pub fn get_snippet_collections(database_path: &Path, snippet_id: i64) -> Result<Vec<Collection>> {
    let connection = Connection::open(database_path)?;

    let mut statement = connection.prepare(
        "
        SELECT
            collections.id,
            collections.name,
            collections.created_at
        FROM collections

        INNER JOIN snippet_collections
            ON snippet_collections.collection_id =
               collections.id

        WHERE snippet_collections.snippet_id = ?1

        ORDER BY
            collections.name COLLATE NOCASE ASC
        ",
    )?;

    let rows = statement.query_map([snippet_id], |row| {
        Ok(Collection {
            id: row.get(0)?,
            name: row.get(1)?,
            created_at: row.get(2)?,
        })
    })?;

    let mut collections = Vec::new();

    for row in rows {
        collections.push(row?);
    }

    Ok(collections)
}

/*
 * Get Snippet IDs belonging to one Collection.
 *
 * We'll use this later for Library filtering.
 */
pub fn get_collection_snippet_ids(database_path: &Path, collection_id: i64) -> Result<Vec<i64>> {
    let connection = Connection::open(database_path)?;

    let mut statement = connection.prepare(
        "
        SELECT snippet_id
        FROM snippet_collections
        WHERE collection_id = ?1
        ORDER BY snippet_id ASC
        ",
    )?;

    let rows = statement.query_map([collection_id], |row| row.get(0))?;

    let mut snippet_ids = Vec::new();

    for row in rows {
        snippet_ids.push(row?);
    }

    Ok(snippet_ids)
}

pub fn import_data(
    database_path: &Path,
    collections: Vec<ImportCollection>,
    snippets: Vec<ImportSnippet>,
) -> Result<ImportResult> {
    let mut connection =
        Connection::open(database_path)?;

    connection.execute(
        "PRAGMA foreign_keys = ON",
        [],
    )?;

    let transaction =
        connection.transaction()?;

    let mut created_collections = 0;
    let mut reused_collections = 0;
    let mut imported_snippets = 0;
    let mut skipped_snippets = 0;

    /*
     * --------------------------------------------------------
     * Collections
     * --------------------------------------------------------
     */

    for collection in &collections {
        let existing_id =
            transaction.query_row(
                "
                    SELECT id
                    FROM collections
                    WHERE name = ?1 COLLATE NOCASE
                ",
                [&collection.name],
                |row| row.get::<_, i64>(0),
            );

        match existing_id {
            Ok(_) => {
                reused_collections += 1;
            }

            Err(
                rusqlite::Error::QueryReturnedNoRows,
            ) => {
                transaction.execute(
                    "
                        INSERT INTO collections (
                            name,
                            created_at
                        )
                        VALUES (?1, ?2)
                    ",
                    (
                        &collection.name,
                        &collection.created_at,
                    ),
                )?;

                created_collections += 1;
            }

            Err(error) => {
                return Err(error);
            }
        }
    }

    /*
     * --------------------------------------------------------
     * Snippets
     * --------------------------------------------------------
     */

    for snippet in &snippets {
        /*
         * V1 duplicate rule:
         *
         * A snippet is considered the same when its
         * title + template are identical.
         */

        let existing_snippet =
            transaction.query_row(
                "
                    SELECT id
                    FROM snippets
                    WHERE title = ?1
                      AND template = ?2
                    LIMIT 1
                ",
                (
                    &snippet.title,
                    &snippet.template,
                ),
                |row| row.get::<_, i64>(0),
            );

        let snippet_id =
            match existing_snippet {
                Ok(id) => {
                    skipped_snippets += 1;
                    id
                }

                Err(
                    rusqlite::Error::QueryReturnedNoRows,
                ) => {
                    let tags =
                        snippet.tags.join(",");

                    transaction.execute(
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
                            VALUES (
                                ?1, ?2, ?3, ?4,
                                ?5, ?6, ?7, ?8
                            )
                        ",
                        (
                            &snippet.title,
                            &snippet.tool,
                            &snippet.environment,
                            &snippet.category,
                            &snippet.description,
                            &snippet.template,
                            &tags,
                            &snippet.created_at,
                        ),
                    )?;

                    imported_snippets += 1;

                    transaction.last_insert_rowid()
                }

                Err(error) => {
                    return Err(error);
                }
            };

        /*
         * ----------------------------------------------------
         * Relationships
         * ----------------------------------------------------
         *
         * This also runs for duplicate snippets.
         *
         * Example:
         * - Snippet already exists locally
         * - Backup says it belongs to "Trouble Shoot"
         *
         * We preserve/merge that relationship.
         */

        for collection_name
            in &snippet.collections
        {
            let collection_id =
                transaction.query_row(
                    "
                        SELECT id
                        FROM collections
                        WHERE name = ?1 COLLATE NOCASE
                    ",
                    [collection_name],
                    |row| row.get::<_, i64>(0),
                )?;

            transaction.execute(
                "
                    INSERT OR IGNORE
                    INTO snippet_collections (
                        snippet_id,
                        collection_id
                    )
                    VALUES (?1, ?2)
                ",
                (
                    snippet_id,
                    collection_id,
                ),
            )?;
        }
    }

    transaction.commit()?;

    Ok(ImportResult {
        imported_snippets,
        skipped_snippets,
        created_collections,
        reused_collections,
    })
}