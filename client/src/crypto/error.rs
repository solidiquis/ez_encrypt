use std::error;
use std::fmt;

#[derive(Debug)]
pub enum Error {
    InvalidKeyLength
}

impl fmt::Display for Error {
    fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
        match self {
            Error::InvalidKeyLength => write!(f, "Key must have a minimum byte length of 4 and a maximum of 56."),
        }
        
    }
}

impl error::Error for Error {}
