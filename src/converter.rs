use markdown::Options;
use std::fs::{self};
use std::path::Path;

use crate::error::ConversionError;
use crate::utils::file::{indent_html, save_html};

pub fn convert_file(markdown_path: &Path, output_dir: Option<&Path>, options: &Options) -> Result<(), ConversionError> {
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

    let html_path = match output_dir {
        Some(dir) => {
            if !dir.exists() {
                fs::create_dir_all(dir)?;
            }
            dir.join(markdown_path.file_stem().unwrap().to_string_lossy().to_string() + ".html")
        }
        None => {
            markdown_path.with_extension("html")
        }
    };

    save_html(html_path.as_path(), &full_html)?;

    println!("Converted: {}", markdown_path.display());
    Ok(())
}
