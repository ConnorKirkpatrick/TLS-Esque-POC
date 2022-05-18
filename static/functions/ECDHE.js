function ECDHE(){
    window.keys = cryptob.createECDH('secp256k1')
    return keys.generateKeys()
}

///browserify .\ECDHE.js -o -s module > bundle.js
