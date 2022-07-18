# [EZ Encrypt](https://ez-encrypt.herokuapp.com/)

A small and simple [Blowfish](https://www.schneier.com/academic/blowfish/) message encryption + decryption web application. Here are some technical highlights:
- The server is powered by [Actix](https://actix.rs/).
- The UI is built on React, TypeScript, and TailwindCSS.
- Cryptography computations are done purely client-side using Rust-targeted [WebAssembly](https://webassembly.org/). No user-input is sent to a remote server.

<img src="https://github.com/solidiquis/solidiquis/blob/master/assets/ez_encrypt.png?raw=true">
