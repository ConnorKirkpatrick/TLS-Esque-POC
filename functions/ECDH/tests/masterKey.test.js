const masterKey = require("../masterKey")

test("Test masterKey generates correct type of data", () =>{
    expect((masterKey("SomeKey","aaaaaaaaaaaa"))).toBeInstanceOf(Buffer)
})

test("Test masterKey generates correct length key", () =>{
    expect((masterKey("SomeKey","aaaaaaaaaaaa").length)).toBe(32)
})

test("Test masterKey generates correct key from fixed data", () =>{
    expect((masterKey("SomeKey","aaaaaaaaaaaa").toString("hex") )).toEqual("6e08c24d68c531106833bd3d676999364ce440fa21f2c387faf34c40623f8534")
})

test("Test masterKey does not generates matching key from changed data", () =>{
    expect((masterKey("SomeKey","aaaaaaaaaddd").toString("hex") )).not.toEqual("6e08c24d68c531106833bd3d676999364ce440fa21f2c387faf34c40623f8534")
})