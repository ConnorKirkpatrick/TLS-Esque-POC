function decrypt(key,msg,nonce, tag){
    let decipher = chacha.createDecipher(key, buffer.Buffer.from(nonce))
    let decrypted = decipher.update(buffer.Buffer.from(msg))
    decipher.setAuthTag(buffer.Buffer.from(tag))
    decipher.final()
    return decrypted
}