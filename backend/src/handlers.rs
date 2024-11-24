use axum::{extract::State, Json};
use sqlx::PgPool;
use sqlx::Row;
use std::sync::Arc;

use crate::models::{ApiResponse, PageContent};

pub async fn save_page(
    State(pool): State<Arc<PgPool>>,
    Json(content): Json<PageContent>,
) -> Json<ApiResponse<PageContent>> {
    match sqlx::query(
        r#"
        UPDATE page
        SET elements = $1
        WHERE id = 1
        "#,
    )
    .bind(serde_json::to_value(&content.elements).unwrap())
    .execute(pool.as_ref())
    .await
    {
        Ok(_) => Json(ApiResponse {
            success: true,
            data: Some(content),
            error: None,
        }),
        Err(err) => Json(ApiResponse {
            success: false,
            data: None,
            error: Some(err.to_string()),
        }),
    }
}

pub async fn get_page(State(pool): State<Arc<PgPool>>) -> Json<ApiResponse<PageContent>> {
    match sqlx::query("SELECT elements FROM page WHERE id = 1")
        .map(|row: sqlx::postgres::PgRow| row.get::<serde_json::Value, _>("elements"))
        .fetch_one(pool.as_ref())
        .await
    {
        Ok(elements) => match serde_json::from_value(elements) {
            Ok(elements) => Json(ApiResponse {
                success: true,
                data: Some(PageContent { elements }),
                error: None,
            }),
            Err(err) => Json(ApiResponse {
                success: false,
                data: None,
                error: Some(format!("Failed to parse elements: {}", err)),
            }),
        },
        Err(err) => Json(ApiResponse {
            success: false,
            data: None,
            error: Some(err.to_string()),
        }),
    }
}
