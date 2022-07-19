use blowfish::{Blowfish, cipher::BlockDecrypt};
use generic_array::GenericArray;

pub mod error;
pub mod util;

#[cfg(test)]
mod test;

pub fn encipher(plain_text: &str, key: &str) -> Result<String, error::Error> {
    let keyb = key.as_bytes();

    validate_key(keyb)?;

    let plain_textb = util::as_padded_bytes(plain_text);

    let bf = init_blowfish(keyb);

    let mut cipher_text_bytes: Vec<u8> = vec![];

    for block in plain_textb.chunks(8) {
        let lblock: [u8; 4] = block[0..4].try_into().expect("selected four bytes");
        let rblock: [u8; 4] = block[4..8].try_into().expect("selected four bytes");

         let [lenc_block, renc_block] = bf.bc_encrypt([ 
             u32::from_be_bytes(lblock), 
             u32::from_be_bytes(rblock) 
         ]); 

        cipher_text_bytes.extend_from_slice(&u32::to_be_bytes(lenc_block));
        cipher_text_bytes.extend_from_slice(&u32::to_be_bytes(renc_block));
    }

    let cipher_text = util::to_hex_string(&cipher_text_bytes);

    Ok(cipher_text)
}

pub fn decipher(cipher_text: &str, key: &str) -> Result<String, error::Error> {
    let keyb = key.as_bytes();

    if let Err(e) = validate_key(keyb) { return Err(e) }

    let encrypted_bytes = util::to_byte_vec(cipher_text);

    let bf = init_blowfish(keyb);

    let mut plain_text_fragments: Vec<String> = vec![];

    for block in encrypted_bytes.chunks(8) {
        let mut deciphered_block = GenericArray::from_slice(block).to_owned();

        bf.decrypt_block(&mut deciphered_block);

        let plain_text_fragment = deciphered_block.iter()
            .map(|b| (b.to_owned() as char).to_string())
            .collect::<Vec<String>>()
            .join("");

        plain_text_fragments.push(plain_text_fragment);
    }

    let plain_text = plain_text_fragments.join("").trim_end().to_string();

    Ok(plain_text)
}

fn init_blowfish(keyb: &[u8]) -> Blowfish {
    let mut bf = Blowfish::bc_init_state();
    bf.bc_expand_key(keyb);
    bf
}

fn validate_key(keyb: &[u8]) -> Result<(), error::Error> {
    let key_len = keyb.len();

    if key_len < 4 || key_len > 56 {
        return Err(error::Error::InvalidKeyLength);
    }

    Ok(())
}
