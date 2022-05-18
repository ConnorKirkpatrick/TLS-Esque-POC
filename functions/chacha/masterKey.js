const crypto = require("crypto")
function masterKey(key, salt){
    let x = crypto.pbkdf2Sync(key,salt,20,256, 'sha512')
    console.log(x.length)
    console.log(x.toString())
}
module.exports = masterKey