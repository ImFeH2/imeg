use std::fs::{self, File};
use std::io::Write;
use std::path::Path;
use markdown::Options;

use crate::error::ConversionError;
use crate::utils::file::indent_html;

pub fn convert_file(markdown_path: &Path, options: &Options) -> Result<(), ConversionError> {
    let markdown_content = fs::read_to_string(markdown_path)?;
    let html_output = markdown::to_html_with_options(&markdown_content, options)?;

    let head_content = format!(
        "    <meta charset=\"UTF-8\">\n    <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\">\n    <title>{}</title>",
        markdown_path.file_stem().unwrap().to_string_lossy()
    );

    let body_content = indent_html(&html_output, 4);

    let full_html = format!(
        "<!DOCTYPE html>\n<html lang=\"en\">\n<head>\n{}\n</head>\n<body>\n{}</body>\n</html>",
        head_content,
        body_content
    );

    let html_path = Path::new("html").join(
        markdown_path.file_stem().unwrap().to_string_lossy().to_string() + ".html"
    );

    let mut file = File::create(html_path)?;
    file.write_all(full_html.as_bytes())?;

    println!("Converted: {}", markdown_path.display());
    Ok(())
}
