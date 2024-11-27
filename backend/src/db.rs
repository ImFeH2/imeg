use sqlx::postgres::PgRow;
use sqlx::Row;
use sqlx::{Error, PgPool};

pub async fn init_db(pool: &PgPool) -> Result<(), Error> {
    sqlx::query(
        r#"
        CREATE TABLE IF NOT EXISTS page (
            id INTEGER PRIMARY KEY,
            elements JSONB NOT NULL,
            settings JSONB NOT NULL DEFAULT '{}'::jsonb
        )
        "#,
    )
    .execute(pool)
    .await?;

    sqlx::query(
        r#"
        CREATE TABLE IF NOT EXISTS components (
            db_id SERIAL PRIMARY KEY,
            id BIGINT NOT NULL UNIQUE,
            name VARCHAR(255) NOT NULL,
            icon VARCHAR(255) NOT NULL,
            category VARCHAR(255) NOT NULL,
            description TEXT,
            properties JSONB NOT NULL,
            can_contain_content BOOLEAN NOT NULL,
            default_content JSONB NOT NULL,
            tags JSONB,
            created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
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
        let default_page = serde_json::json!({
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
            INSERT INTO page (id, elements, settings)
            VALUES (1, $1::jsonb, $2::jsonb)
            "#,
        )
        .bind(default_page.get("elements").unwrap())
        .bind(default_page.get("settings").unwrap())
        .execute(pool)
        .await?;
    }

    Ok(())
}
