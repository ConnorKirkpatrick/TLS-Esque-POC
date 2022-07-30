const crypto = require("crypto")

/**
 * Cryptographical function used to encrypt a message using Chacha-poly1305
 * @param key The symmetrical key for the encryption algorithm
 * @param msg The message to be encrypted
 * @returns {Buffer[]} The buffer containing the encrypted message information: The encrypted data, the Nonce and the tag
 */
function encrypt(key,msg){
    let nonce = crypto.randomBytes(12)
    let cipher = crypto.createCipheriv('chacha20-poly1305', key, nonce, { authTagLength: 16 });
    let encrypted = cipher.update(msg)
    cipher.final()
    let tag = cipher.getAuthTag()
    return [encrypted,nonce,tag]
}
module.exports = encrypt