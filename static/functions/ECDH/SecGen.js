/**
 * Tiny function used to generate pre-master secret from ECDH exchanged keys
 * @returns {Buffer} Pre-Master secret
 * @constructor
 */
function SecGen(){
    return window.Secret = window.keys.computeSecret(window.ServKey)
}