use std::fs::{self, File};
use std::io::Write;
use std::path::{Path, PathBuf};

#[derive(Debug)]
enum ConversionError {
    Io(std::io::Error),
    Markdown(markdown::message::Message),
    Custom(String),
}

impl From<std::io::Error> for ConversionError {
    fn from(err: std::io::Error) -> Self {
        ConversionError::Io(err)
    }
}

impl From<markdown::message::Message> for ConversionError {
    fn from(err: markdown::message::Message) -> Self {
        ConversionError::Markdown(err)
    }
}

impl std::fmt::Display for ConversionError {
    fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
        match self {
            ConversionError::Io(e) => write!(f, "IO error: {}", e),
            ConversionError::Markdown(e) => write!(f, "Markdown error: {}", e),
            ConversionError::Custom(s) => write!(f, "Error: {}", s),
        }
    }
}

impl std::error::Error for ConversionError {}

fn main() -> Result<(), ConversionError> {
    if Path::new("html").exists() {
        fs::remove_dir_all("html")?;
    }
    fs::create_dir("html")?;

    let markdown_files = markdown_paths("markdown")?;

    if markdown_files.is_empty() {
        println!("No markdown files found in the markdown directory!");
        return Ok(());
    }

    let mut options = markdown::Options::default();
    options.compile.allow_dangerous_html = true;
    options.compile.allow_dangerous_protocol = true;

    for markdown_path in markdown_files {
        convert_file(&markdown_path, &options)?;
    }

    println!("Successfully converted all markdown files to HTML!");
    Ok(())
}

fn markdown_paths(dir: &str) -> Result<Vec<PathBuf>, ConversionError> {
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

fn convert_file(markdown_path: &Path, options: &markdown::Options) -> Result<(), ConversionError> {
    let markdown_content = fs::read_to_string(markdown_path)?;

    let html_output = markdown::to_html_with_options(&markdown_content, options)?;

    let full_html = format!(
        r#"<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{}</title>
</head>
<body>
{}
</body>
</html>"#,
        markdown_path.file_stem().unwrap().to_string_lossy(),
        html_output
    );

    let html_path = Path::new("html").join(
        markdown_path.file_stem().unwrap().to_string_lossy().to_string() + ".html"
    );

    let mut file = File::create(html_path)?;
    file.write_all(full_html.as_bytes())?;

    println!("Converted: {}", markdown_path.display());
    Ok(())
}
