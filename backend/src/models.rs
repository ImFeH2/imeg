use serde::{Deserialize, Serialize};
use sqlx::types::JsonValue;

#[derive(Serialize, Deserialize, Debug)]
pub struct Position {
    pub x: f64,
    pub y: f64,
}

#[derive(Serialize, Deserialize, Debug)]
pub struct Size {
    pub width: f64,
    pub height: f64,
}

#[derive(Serialize, Deserialize, Debug)]
pub struct Element {
    pub id: i64,
    pub r#type: String,
    pub position: Position,
    pub size: Size,
    pub props: JsonValue,
}

#[derive(Serialize, Deserialize)]
pub struct PageContent {
    pub elements: Vec<Element>,
}

#[derive(Serialize, Deserialize)]
pub struct ApiResponse<T> {
    pub success: bool,
    pub data: Option<T>,
    pub error: Option<String>,
}
