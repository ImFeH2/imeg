mod converter;
mod error;
mod utils {
    pub mod file;
}

use converter::convert_file;
use error::ConversionError;
use std::fs;
use std::path::Path;
use utils::file::markdown_paths;

fn main() -> Result<(), ConversionError> {
    if Path::new("../../html").exists() {
        fs::remove_dir_all("../../html")?;
    }
    fs::create_dir("../../html")?;

    let markdown_files = markdown_paths("markdown")?;

    let mut options = markdown::Options::gfm();
    options.compile.allow_dangerous_html = true;
    options.compile.allow_dangerous_protocol = true;

    for markdown_path in markdown_files {
        convert_file(&markdown_path, Some(Path::new("../../html")), &options)?;
    }

    let readme = Path::new("../../README.md");
    convert_file(readme, Some(Path::new("../../html")), &options)?;

    println!("Successfully converted all markdown files to HTML!");
    Ok(())
}
