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
        let default_content = serde_json::json!({
            "elements": [],
            "settings": {
                "responsive": true,
                "width": 1200,
                "height": 800,
                "maxWidth": "none",
                "bgColor": "#ffffff"
            }
        });

        sqlx::query(
            r#"
            INSERT INTO page (id, elements)
            VALUES (1, $1)
            "#,
        )
        .bind(default_content)
        .execute(pool)
        .await?;
    }

    Ok(())
}
