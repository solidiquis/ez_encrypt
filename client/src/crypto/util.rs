pub(super) fn as_padded_bytes(plain_text: &str) -> Vec<u8> {
    let mut plain_textb = plain_text.as_bytes().to_owned();

    let num_padding = 8 - plain_textb.len() % 8;

    if num_padding > 0 && num_padding < 8 {
        for _ in 0..num_padding {
            plain_textb.push(32);
        }
    }
    
    plain_textb
}

pub(super) fn to_u8_array(s: u32) -> [u8; 4] {
    let b1 = ((s >> 24) & 0xff) as u8;
    let b2 = ((s >> 16) & 0xff) as u8;
    let b3 = ((s >> 8) & 0xff) as u8;
    let b4 = (s & 0xff) as u8;

    [b1, b2, b3, b4]
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
