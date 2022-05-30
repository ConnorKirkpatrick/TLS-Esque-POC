# TLS-Esque-POC
A small proof of concept project for implementing TLS-like security to a web-program
This will be making use of a key exchange/negotiation protocol to exchange a pre-master secret before construction of a secure channel via a cipher algorithm
We will use Epehmural ECDH for the key exchange protocol and AES-GCM or ChaCha20-Poly1305 for the cipher
If successful and efficient, this project may be ported into other personal web-based projects for security

flow:
* server start
* client connect
* server queries for cookie
  * if no cookie
  * server generates new ECDH keys
  * commands client to create new ECDH keys
  * exchange of public keys to generate secret
  * create entry with the master key
  * server set cookie (timeout of 5 mins)
  * all future messages to host are sent with this master key
* if cookie
  * find cookie entry that contains the master key for the connection
  * decrypt message with master key

Vulnerabilities;
* MITM attack, prevent by using signing on initial public key exchange
