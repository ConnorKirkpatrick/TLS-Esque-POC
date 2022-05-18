const crypto = require("crypto")
function masterKey(key, salt){
    return crypto.pbkdf2Sync(key,salt,5,32, 'sha512')
}
module.exports = masterKey