/**
 * Client side master key generator, generates key from pre-master secret material
 * @param {Buffer} key Buffer containing pre-master key material
 * @param {String} salt Salt used in generation of the master secret
 * @returns {Buffer} Master key material
 */
function masterKey(key, salt){
    return cryptob.pbkdf2Sync(key,salt,5,32,'sha512')
}