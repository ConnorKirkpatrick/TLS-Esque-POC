const crypto = require("crypto")
function decrypt(key,msg,nonce, tag){
    let decipher = crypto.createDecipheriv('chacha20-poly1305', key, nonce, { authTagLength: 16 });
    let decrypted = decipher.update(msg)
    decipher.setAuthTag(tag)
    decipher.final()
    return decrypted
}
module.exports = decrypt