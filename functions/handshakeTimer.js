/**
 * Function used to incrementally request a new handshake, ensuring key rotation and tus ensuring forward secrecy
 * @param socket {Object} Socket object of the client
 * @param uName {String} Cookie of the client
 * @param userMap {Map} Map containing all connected client information
 * @param io {Object} Socket.io object
 * @param nameMap {Array} Array of all active usernames
 * @param handshake {Function} Handshake function
 * @returns {NodeJS.Timer} Timer for initiating the reset of the connection encryption key
 */
function handshakeTimer(socket, uName,userMap,io,nameMap,handshake){
    return setInterval(handshake, 5*60*1000,socket,uName,userMap,false,io,nameMap,handshake)
}

module.exports = handshakeTimer