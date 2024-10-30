mod error;
mod converter;
mod utils {
    pub mod file;
}

use std::fs;
use std::path::Path;
use error::ConversionError;
use converter::convert_file;
use utils::file::markdown_paths;

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

    let mut options = markdown::Options::gfm();
    options.compile.allow_dangerous_html = true;
    options.compile.allow_dangerous_protocol = true;

    for markdown_path in markdown_files {
        convert_file(&markdown_path, &options)?;
    }

    println!("Successfully converted all markdown files to HTML!");
    Ok(())
}
