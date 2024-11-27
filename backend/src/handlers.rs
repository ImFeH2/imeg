use axum::{extract::State, Json};
use sqlx::{PgPool, Row};
use std::sync::Arc;

use crate::models::{ApiResponse, Component, PageContent};

pub async fn save_page(
    State(pool): State<Arc<PgPool>>,
    Json(content): Json<PageContent>,
) -> Json<ApiResponse<PageContent>> {
    match sqlx::query(
        r#"
        UPDATE page
        SET elements = $1::jsonb, settings = $2::jsonb
        WHERE id = 1
        RETURNING elements, settings
        "#,
    )
    .bind(serde_json::to_value(&content.elements).unwrap())
    .bind(serde_json::to_value(&content.settings).unwrap())
    .fetch_one(pool.as_ref())
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
    match sqlx::query(
        r#"
        SELECT elements, settings
        FROM page
        WHERE id = 1
        "#,
    )
    .fetch_one(pool.as_ref())
    .await
    {
        Ok(row) => {
            let elements: serde_json::Value = row.get("elements");
            let settings: serde_json::Value = row.get("settings");

            match serde_json::from_value(serde_json::json!({
                "elements": elements,
                "settings": settings
            })) {
                Ok(content) => Json(ApiResponse {
                    success: true,
                    data: Some(content),
                    error: None,
                }),
                Err(err) => Json(ApiResponse {
                    success: false,
                    data: None,
                    error: Some(format!("Failed to parse content: {}", err)),
                }),
            }
        }
        Err(err) => Json(ApiResponse {
            success: false,
            data: None,
            error: Some(err.to_string()),
        }),
    }
}

pub async fn save_component(
    State(pool): State<Arc<PgPool>>,
    Json(component): Json<Component>,
) -> Json<ApiResponse<Component>> {
    let result = sqlx::query(
        r#"
        INSERT INTO components (
            id, name, icon, category, description,
            properties, can_contain_content, default_content, tags
        )
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
        ON CONFLICT (id) DO UPDATE
        SET
            name = EXCLUDED.name,
            icon = EXCLUDED.icon,
            category = EXCLUDED.category,
            description = EXCLUDED.description,
            properties = EXCLUDED.properties,
            can_contain_content = EXCLUDED.can_contain_content,
            default_content = EXCLUDED.default_content,
            tags = EXCLUDED.tags,
            updated_at = CURRENT_TIMESTAMP
        RETURNING id, name, icon, category, description, properties,
                  can_contain_content, default_content, tags
        "#,
    )
    .bind(&component.id)
    .bind(&component.name)
    .bind(&component.icon)
    .bind(&component.category)
    .bind(&component.description)
    .bind(serde_json::to_value(&component.properties).unwrap())
    .bind(&component.can_contain_content)
    .bind(serde_json::to_value(&component.default_content).unwrap())
    .bind(serde_json::to_value(&component.tags).unwrap())
    .fetch_one(pool.as_ref())
    .await;

    match result {
        Ok(_) => Json(ApiResponse {
            success: true,
            data: Some(component),
            error: None,
        }),
        Err(err) => Json(ApiResponse {
            success: false,
            data: None,
            error: Some(err.to_string()),
        }),
    }
}

pub async fn get_components(State(pool): State<Arc<PgPool>>) -> Json<ApiResponse<Vec<Component>>> {
    match sqlx::query(
        r#"
        SELECT
            id, name, icon, category, description,
            properties, can_contain_content, default_content, tags
        FROM components
        ORDER BY name ASC
        "#,
    )
    .fetch_all(pool.as_ref())
    .await
    {
        Ok(rows) => {
            let mut components = Vec::new();
            for row in rows {
                if let Ok(component) = serde_json::from_value(serde_json::json!({
                    "id": row.get::<i64, _>("id"),
                    "name": row.get::<String, _>("name"),
                    "icon": row.get::<String, _>("icon"),
                    "category": row.get::<String, _>("category"),
                    "description": row.get::<Option<String>, _>("description"),
                    "properties": row.get::<serde_json::Value, _>("properties"),
                    "canContainContent": row.get::<bool, _>("can_contain_content"),
                    "defaultContent": row.get::<serde_json::Value, _>("default_content"),
                    "tags": row.get::<Option<serde_json::Value>, _>("tags")
                })) {
                    components.push(component);
                }
            }

            Json(ApiResponse {
                success: true,
                data: Some(components),
                error: None,
            })
        }
        Err(err) => Json(ApiResponse {
            success: false,
            data: None,
            error: Some(err.to_string()),
        }),
    }
}

pub async fn delete_component(
    State(pool): State<Arc<PgPool>>,
    Json(id): Json<i64>,
) -> Json<ApiResponse<()>> {
    match sqlx::query("DELETE FROM components WHERE id = $1")
        .bind(id)
        .execute(pool.as_ref())
        .await
    {
        Ok(_) => Json(ApiResponse {
            success: true,
            data: Some(()),
            error: None,
        }),
        Err(err) => Json(ApiResponse {
            success: false,
            data: None,
            error: Some(err.to_string()),
        }),
    }
}
