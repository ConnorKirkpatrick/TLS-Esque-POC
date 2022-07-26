const encrypt = require("../encrypt")
const decrypt = require("../decrypt")
const masterKey = require("../../ECDH/masterKey")
let key = masterKey("someKey", "abcdefg")
let msg = "SomeMessage"

let encrypted = encrypt(key,msg)

test("Ensure decryption returns correct value", () => {
    expect(decrypt(key,encrypted[0],encrypted[1],encrypted[2]).toString()).toBe(msg)
})

test("Ensure decryption with bad Nonce fails", () => {
    function runBadNonce(){
        decrypt(key,encrypted[0],encrypted[1],"ExxxxtrabadNonce")
    }
    expect(runBadNonce).toThrowError()
})

test("Ensure decryption with bad Tag fails", () => {
    function runBadNonce(){
        decrypt(key,encrypted[0],"Extrabadtags",encrypted[2])
    }
    expect(runBadNonce).toThrowError()
})