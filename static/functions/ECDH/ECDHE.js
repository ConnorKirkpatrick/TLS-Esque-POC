/**
 * Small ECDH function used to produce the client side asymmetrical keys
 * @returns {Object} Crypto object containing the keys, use getter to obtain
 * @constructor
 */
function ECDHE(){
    window.keys = cryptob.createECDH('secp256k1')
    return keys.generateKeys()
}
