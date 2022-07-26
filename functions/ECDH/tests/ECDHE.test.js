const ECDHE = require("../ECDHE")
test("Ensure ECDHE generates a valid length Public key", () =>{
    let keys = ECDHE();
    expect((keys.getPublicKey().length)).toBe(65)
})
test("Ensure ECDHE generates a valid length Private key", () =>{
    let keys = ECDHE();
    expect((keys.getPrivateKey().length)).toBe(32)
})