const crypto = require("crypto")

/**
 * Cryptographical function to decrypt a chacha-poly1305 message
 * @param {Buffer} key The symmetrical key for the encryption
 * @param {String} msg The encrypted message
 * @param {Buffer} nonce The Nonce of the encrypted message
 * @param {Buffer} tag The tag of the encrypted message
 * @returns {Buffer} A buffer containing the decrypted message information
 */

function decrypt(key,msg,nonce, tag){
    let decipher = crypto.createDecipheriv('chacha20-poly1305', key, nonce, { authTagLength: 16 });
    let decrypted = decipher.update(msg)
    decipher.setAuthTag(tag)
    decipher.final()
    return decrypted
}
module.exports = decrypt