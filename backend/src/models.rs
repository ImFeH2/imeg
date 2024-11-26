use serde::{Deserialize, Serialize};
use sqlx::types::JsonValue;

#[derive(Serialize, Deserialize, Debug)]
pub struct ContentItem {
    pub r#type: String,
    pub content: String,
}

#[derive(Serialize, Deserialize, Debug)]
pub struct Element {
    pub id: i64,
    pub r#type: String,
    pub properties: JsonValue,
    pub content: Vec<ContentItem>,
}

#[derive(Serialize, Deserialize, Debug)]
pub struct PageSettings {
    pub responsive: bool,
    pub width: i32,
    pub height: i32,
    #[serde(rename = "maxWidth")]
    pub max_width: String,
    #[serde(rename = "bgColor")]
    pub bg_color: String,
}

#[derive(Serialize, Deserialize, Debug)]
pub struct PageContent {
    pub elements: Vec<Element>,
    pub settings: PageSettings,
}

#[derive(Serialize, Deserialize, Debug)]
pub struct ApiResponse<T> {
    pub success: bool,
    pub data: Option<T>,
    pub error: Option<String>,
}
