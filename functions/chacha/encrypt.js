const crypto = require("crypto")
function encrypt(key,msg){
    let nonce = crypto.randomBytes(10)
    let cipher = crypto.createCipheriv('chacha20-poly1305', key, nonce, { authTagLength: 16 });
    let encrypted = cipher.update(msg)
    cipher.final()
    let tag = cipher.getAuthTag()
    return [encrypted,nonce,tag]
}
module.exports = encrypt