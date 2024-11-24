use sqlx::postgres::PgRow;
use sqlx::Row;
use sqlx::{Error, PgPool};

pub async fn init_db(pool: &PgPool) -> Result<(), Error> {
    sqlx::query(
        r#"
        CREATE TABLE IF NOT EXISTS page (
            id INTEGER PRIMARY KEY,
            elements JSONB NOT NULL
        )
        "#,
    )
    .execute(pool)
    .await?;

    let exists: bool = sqlx::query("SELECT EXISTS(SELECT 1 FROM page WHERE id = 1)")
        .map(|row: PgRow| row.get(0))
        .fetch_one(pool)
        .await?;

    if !exists {
        sqlx::query(
            r#"
            INSERT INTO page (id, elements)
            VALUES (1, '[]'::jsonb)
            "#,
        )
        .execute(pool)
        .await?;
    }

    Ok(())
}
