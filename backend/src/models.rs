use serde::{Deserialize, Serialize};
use sqlx::types::JsonValue;

#[derive(Serialize, Deserialize, Debug)]
#[serde(tag = "type")]
pub enum Content {
    #[serde(rename = "text")]
    Text { content: String },
    #[serde(rename = "element")]
    Element { content: ComponentElement },
}

#[derive(Serialize, Deserialize, Debug)]
pub struct Property {
    pub name: String,
    pub value: JsonValue,
    pub label: String,
    #[serde(rename = "type")]
    pub property_type: String, // 'string' | 'number' | 'boolean' | 'color' | 'select' | 'text' | 'file'
    pub category: String, // 'layout' | 'typography' | 'decoration' | 'basic' | 'advanced'
    pub options: Option<Vec<String>>,
    pub required: Option<bool>,
    pub description: Option<String>,
}

#[derive(Serialize, Deserialize, Debug)]
pub struct Component {
    pub id: i64,
    pub name: String,
    pub icon: String,
    pub category: String, // 'text' | 'container' | 'media' | 'input' | 'layout' | 'custom'
    pub description: Option<String>,
    pub properties: Vec<Property>,
    #[serde(rename = "canContainContent")]
    pub can_contain_content: bool,
    #[serde(rename = "defaultContent")]
    pub default_content: Vec<Content>,
    pub tags: Option<Vec<String>>,
}

#[derive(Serialize, Deserialize, Debug)]
pub struct ComponentElement {
    pub id: i64,
    pub properties: Vec<Property>,
    pub content: Vec<Content>,
    #[serde(rename = "type")]
    pub element_type: Component,
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
    pub elements: Vec<ComponentElement>,
    pub settings: PageSettings,
}

#[derive(Serialize, Deserialize, Debug)]
pub struct ApiResponse<T> {
    pub success: bool,
    pub data: Option<T>,
    pub error: Option<String>,
}
