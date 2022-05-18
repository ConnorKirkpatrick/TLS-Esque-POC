function masterKey(key, salt){
    return cryptob.pbkdf2Sync(key,salt,5,32,'sha512')
}