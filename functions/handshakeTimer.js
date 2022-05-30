function handshakeTimer(socket, uName,userMap,io,nameMap,handshake){
    return setInterval(handshake, 5*60*1000,socket,uName,userMap,false,io,nameMap,handshake)
}

module.exports = handshakeTimer