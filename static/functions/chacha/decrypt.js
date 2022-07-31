/**
 * Decryption function for client side ChaCha-Poly1305 encryption
 * @param {Buffer} key Symmetrical encryption key
 * @param {Buffer} msg Encrypted message buffer
 * @param {Buffer} nonce Nonce of the encrypted message
 * @param {Buffer} tag Tag of the encrypted message
 * @returns {Buffer} Decrypted message text
 */
function decrypt(key,msg,nonce, tag){
    let decipher = chacha.createDecipher(key, buffer.Buffer.from(nonce))
    let decrypted = decipher.update(buffer.Buffer.from(msg))
    decipher.setAuthTag(buffer.Buffer.from(tag))
    decipher.final()
    return decrypted
}