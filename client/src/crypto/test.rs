const PLAIN_TEXT: &'static str = "that's not dead which can eternal lie and with strange aeons even death may die..";
const KEY: &'static str = "abdul alhazred";

#[test]
fn as_padded_bytes() {
    use super::util::as_padded_bytes;

    {
        let needs_padding = "cthulhu fhtagn";
        let expected_len = needs_padding.len() + 2;
        let padded = as_padded_bytes(needs_padding);
        let actual_len = padded.len();
        assert_eq!(actual_len, expected_len);
    }

    {

        let padding_not_required = "cthulhu fhtagn!!";
        let expected_len = padding_not_required.len();
        let padded = as_padded_bytes(padding_not_required);
        let actual_len = padded.len(); 
        assert_eq!(actual_len, expected_len);
    }

}

#[test]
fn encipher() {
    use super::encipher;
    let cipher_text = encipher(PLAIN_TEXT, KEY).unwrap();
    assert!(cipher_text.len() % 8 == 0);
}

#[test]
fn decipher() {
    use super::{decipher, encipher};
    let cipher_text = encipher(PLAIN_TEXT, KEY).unwrap();
    let deciphered_text = decipher(&cipher_text, KEY).unwrap();
    assert_eq!(PLAIN_TEXT, &deciphered_text);
}
