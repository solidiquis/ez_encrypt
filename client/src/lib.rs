use js_sys::JsString;
use wasm_bindgen::prelude::wasm_bindgen;

mod crypto;

#[wasm_bindgen]
pub fn encipher(plain_text: JsString, key: JsString) -> Result<JsString, JsString> {
    match crypto::encipher(
        &String::from(plain_text),
        &String::from(key)
    ) {
        Ok(cipher_text) => return Ok(JsString::from(cipher_text)),
        Err(e) => return Err(JsString::from(e.to_string()))
    }
}

#[wasm_bindgen]
pub fn decipher(cipher_text: JsString, key: JsString) -> Result<JsString, JsString> {
    match crypto::decipher(
        &String::from(cipher_text),
        &String::from(key)
    ) {
        Ok(plain_text) => return Ok(JsString::from(plain_text)),
        Err(e) => return Err(JsString::from(e.to_string()))
    }
}

