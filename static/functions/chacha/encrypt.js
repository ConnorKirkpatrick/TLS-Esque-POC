/**
 * Client side encryption function for ChaCha-poly1305 encryption
 * @param {Buffer} key Symmetrical key used to encrypt the message
 * @param {String} msg Message to encrypt
 * @returns {Buffer[]} Array of Buffers containing: The encrypted message, the message Nonce, the message tag
 */
function encrypt(key,msg){
    let nonce = cryptob.randomBytes(12)
    let cipher = chacha.createCipher(key, buffer.Buffer.from(nonce))
    let encrypted = cipher.update(buffer.Buffer.from(msg))
    cipher.final()
    let tag = cipher.getAuthTag()
    return [encrypted,nonce,tag]
}
