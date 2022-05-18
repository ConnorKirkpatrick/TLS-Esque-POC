function encrypt(key,msg){
    let nonce = cryptob.randomBytes(12)
    let cipher = chacha.createCipher(key, buffer.Buffer.from(nonce))
    let encrypted = cipher.update(buffer.Buffer.from(msg))
    cipher.final()
    let tag = cipher.getAuthTag()
    return [encrypted,nonce,tag]
}
