const decrypt = require("./chacha/decrypt");
const getUsername = require("./username/getUsername");
const notifyNewUser = require("./chatting/notifyNewUsers");
const handshakeTimer = require("./handshakeTimer");
const forwardMessage = require("./chatting/forwardMessage");
const changeClient = require("./chatting/changeClient");

/**
 * The messageHandler manages all encrypted messages from the client including handshakes, messages, and message requests
 * @param eData {Buffer} Encrypted data received from the client
 * @param uName {String} Cookie of the connected client
 * @param userMap {Map} Map containing all current client information
 * @param nameMap {Array} Array containing all active usernames
 * @param socket {Object} client socket object
 * @param io {Object} Socket.io object
 * @param handshake {Function} Handshake function
 */

function messageHandler(eData, uName, userMap, nameMap, socket, io, handshake){
    ///because we cannot use "socket.on" for encrypted messages without leaking data, we instead wrap the data inside of a "client message" to be unwrapped here
    /// the first argument is the opcode, the value that tells us what to do with the rest of the data
    let mKey = userMap.get(uName)[0]
    let message = decrypt(mKey, eData[0], eData[1], eData[2]).toString().split("<SEPARATOR>")
    switch(message[0]){
        case "good-Conn":
            break;
        case "userName":
            //notify all users of a new user
            if(getUsername(uName,message[1], userMap, nameMap, socket)){
                notifyNewUser(nameMap,io,userMap)
                //with new cookie and key set along with a valid username, set a 5 min timer to redo the handshake.
                let userData = userMap.get(uName)
                let timer = handshakeTimer(socket, uName, userMap, io, nameMap, handshake)
                userMap.set(uName,[userData[0],userData[1],userData[2],userData[3],timer])
            }
            break;
        case "MESSAGE":
            forwardMessage(message[1],message[2],userMap,io)
            break;
        case "changeClient":
            changeClient(uName, userMap, message[1], io, 0)
            break;
        case "acceptClient":
            console.log("Accepted message request from: "+message[1])
            console.log("Old client was: "+ message[2])
            changeClient(uName, userMap, message[1], io, 1)
            break;
        case "denyClient":
            console.log("Denied Request from: "+message[1])
            changeClient(uName, userMap, message[1], io, 2)
            break;
        case "dropClient":
            console.log("Dropping client: "+message[1]+" By: "+userMap.get(uName)[2])
            changeClient(uName, userMap, message[1], io, 3)
            break;
        case "cancelRequest":
            console.log("Cancelling client request: "+message[1])
            changeClient(uName, userMap, message[1], io, 4)
            break;
        default:
            console.log("Default: "+message)
            break;
    }
}

module.exports = messageHandler