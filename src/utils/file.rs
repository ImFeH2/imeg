use std::fs;
use std::path::{Path, PathBuf};
use crate::error::ConversionError;

pub fn markdown_paths(dir: &str) -> Result<Vec<PathBuf>, ConversionError> {
    let mut paths = Vec::new();

    if !Path::new(dir).exists() {
        return Err(ConversionError::Custom("Markdown directory does not exist!".to_string()));
    }

    for entry in fs::read_dir(dir)? {
        let path = entry?.path();

        if path.is_file() {
            if let Some(extension) = path.extension() {
                if extension == "md" {
                    paths.push(path);
                }
            }
        }
    }

    Ok(paths)
}

pub fn indent_html(html: &str, base_indent: usize) -> String {
    let mut result = String::new();
    let indent = " ".repeat(base_indent);
    let mut current_indent = indent.clone();

    for line in html.lines() {
        let trimmed = line.trim();
        if trimmed.is_empty() {
            result.push('\n');
            continue;
        }

        if trimmed.starts_with("</") {
            current_indent = " ".repeat(current_indent.len() - 4);
        }

        if !trimmed.is_empty() {
            result.push_str(&current_indent);
            result.push_str(trimmed);
            result.push('\n');
        }

        if trimmed.contains("<") && !trimmed.contains("</") && !trimmed.ends_with("/>") && !trimmed.contains("</div>") {
            current_indent = " ".repeat(current_indent.len() + 4);
        }
    }
    result
}
