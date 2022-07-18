# [EZ Encrypt](https://ez-encrypt.herokuapp.com/)

A small and simple [Blowfish](https://www.schneier.com/academic/blowfish/) message encryption + decryption web application. Here are some technical highlights:
- The server is powered by [Actix](https://actix.rs/).
- The UI is built on React, TypeScript, and TailwindCSS.
- Cryptography computations are done purely client-side using Rust-targeted [WebAssembly](https://webassembly.org/). No user-input is sent to a remote server.
- Uses the [Gruvbox color palette](https://github.com/YV31/gruvbox-css).
- [Click here](https://github.com/solidiquis/ez_encrypt/tree/master/client/src) for the interesting WASM stuff.
- [Click here](https://github.com/solidiquis/ez_encrypt/blob/749978aa5cb96c7db5c3bc89f9443a9ab1583594/client/app/components/form/index.tsx#L6) to see how the WASM cryptography modules are being leveraged in React.

<img src="https://github.com/solidiquis/solidiquis/blob/master/assets/ez_encrypt.png?raw=true">
