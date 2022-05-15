# TLS-Esque-POC
A small proof of concept project for implementing TLS-like security to a web-program
This will be making use of a key exchange/negotiation protocol to exchange a pre-master secret before construction of a secure channel via a cipher algorithm
We will use Epehmural ECDH for the key exchange protocol and AES-GCM or ChaCha20-Poly1305 for the cipher
If successful and efficient, this project may be ported into other personal web-based projects for security

https://www.npmjs.com/package/node-aes-gcm
https://www.npmjs.com/package/chacha
https://www.npmjs.com/package/eccrypto
https://nodejs.org/docs/latest/api/crypto.html
