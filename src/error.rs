use std::fmt;

#[derive(Debug)]
#[allow(dead_code)]
pub enum ConversionError {
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

impl fmt::Display for ConversionError {
    fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
        match self {
            ConversionError::Io(e) => write!(f, "IO error: {}", e),
            ConversionError::Markdown(e) => write!(f, "Markdown error: {}", e),
            ConversionError::Custom(s) => write!(f, "Error: {}", s),
        }
    }
}

impl std::error::Error for ConversionError {}
