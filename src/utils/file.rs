use crate::error::ConversionError;
use std::fs::{self, File};
use std::io::Write;
use std::path::{Path, PathBuf};

pub fn markdown_paths(dir: &str) -> Result<Vec<PathBuf>, ConversionError> {
    let mut paths = Vec::new();

    if !Path::new(dir).exists() {
        fs::create_dir(dir)?;
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

pub fn save_html(filepath: &Path, content: &String) -> std::io::Result<()> {
    let html_path = filepath.with_extension("html");

    let mut file = File::create(html_path)?;
    file.write_all(content.as_bytes())
}
