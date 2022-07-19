pub(super) fn as_padded_bytes(plain_text: &str) -> Vec<u8> {
    let mut plain_textb = plain_text.as_bytes().to_owned();

    let num_padding = 8 - plain_textb.len() % 8;

    if num_padding > 0 && num_padding < 8 {
        plain_textb.resize(plain_textb.len() + num_padding, 32)
    }
    
    plain_textb
}

pub(super) fn to_hex_string(bytes: &[u8]) -> String {
    bytes.into_iter()
        .map(|b| format!("{:02x}", b))
        .collect::<Vec<String>>()
        .join("")
}

pub(super) fn to_byte_vec(hex_string: &str) -> Vec<u8> {
    let mut bytes: Vec<u8> = vec![];

    for chunk in hex_string.as_bytes().chunks(2) {
        let hex = chunk.iter()
            .map(|i| (i.to_owned() as char).to_string())
            .collect::<Vec<String>>()
            .join("");

        let byte = u8::from_str_radix(&hex, 16).unwrap();

        bytes.push(byte);
    }

    bytes
}
