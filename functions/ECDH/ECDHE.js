const crypto = require("crypto")
function ECDHE(){
    let keys = crypto.createECDH('secp256k1')
    keys.generateKeys()
    return keys
}
module.exports = ECDHE

