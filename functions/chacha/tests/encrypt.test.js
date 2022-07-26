const encrypt = require("../encrypt")
const masterKey = require("../../ECDH/masterKey")
let key = masterKey("someKey", "abcdefg")
let msg = "SomeMessage"

let encrypted = encrypt(key,msg)

test("Ensure encrypted data does not match original data", () =>{
    expect(encrypted[0]).not.toEqual(msg)
})

test("Ensure encryped Data is correct type", () =>{
    expect(encrypted[0]).toBeInstanceOf(Buffer)
})
test("Ensure encryped Data is correct length", () =>{
    expect(encrypted[0].length).toBe(msg.length)
})

test("Ensure tag is correct type", () =>{
    expect(encrypted[1]).toBeInstanceOf(Buffer)
})
test("Ensure tag is correct size", () =>{
    expect(encrypted[1].length).toBe(12)
})
test("Ensure nonce is correct type", () =>{
    expect(encrypted[1]).toBeInstanceOf(Buffer)
})
test("Ensure nonce is correct size", () =>{
    expect(encrypted[2].length).toBe(16)
})