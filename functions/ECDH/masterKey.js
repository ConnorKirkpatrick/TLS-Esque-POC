const crypto = require("crypto")

/**
 * Master Key Generator
 * @param key {String/Buffer} Pre-master key material used to generate master key
 * @param salt {String/Buffer} Salt for master key generation
 * @returns {Buffer} Master key data contained inside a buffer
 */


function masterKey(key, salt){
    return crypto.pbkdf2Sync(key,salt,5,32, 'sha512')
}
module.exports = masterKey