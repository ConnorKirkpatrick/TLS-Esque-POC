const crypto = require("crypto")

/**
 * Elliptical Curve Diffe-Hellman Exchange key generator
 * @returns {ECDH} ECDH public and private key container
 * @constructor
 */

function ECDHE(){
    let keys = crypto.createECDH('secp256k1')
    keys.generateKeys()
    return keys
}
module.exports = ECDHE

