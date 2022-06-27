const decrypt = require("./chacha/decrypt");
const getUsername = require("./username/getUsername");
const notifyNewUser = require("./chatting/notifyNewUsers");
const handshakeTimer = require("./handshakeTimer");
const forwardMessage = require("./chatting/forwardMessage");
const changeClient = require("./chatting/changeClient");

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
            //message from client to receiver
            //messageTarget, message contents
            forwardMessage(message[1],message[2],userMap,io)
            break;
        case "changeClient":
            changeClient(uName, userMap, message[1], io)
            break;
        default:
            console.log("Default: "+message)
            break;
    }
}

module.exports = messageHandler