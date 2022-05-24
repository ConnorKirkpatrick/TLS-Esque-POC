const decrypt = require("./chacha/decrypt");
const getUsername = require("./username/getUsername");
const notifyNewUser = require("./chatting/notifyNewUsers");

function messageHandler(eData, uName, userMap, nameMap, socket, io){
    ///because we cannot use "socket.on" for encrypted messages without leaking data, we instead wrap the data inside of a "client message" to be unwrapped here
    /// the first argument is the opcode, the value that tells us what to do with the rest of the data
    let mKey = userMap.get(uName)[0]
    let message = decrypt(mKey, eData[0], eData[1], eData[2]).toString().split("<SEPERATOR>")
    switch(message[0]){
        case "good-Conn":
            //do nothing, this is duplicated from inside the handshake and handling it prevents any logging
            break;
        case "userName":
            //notify all users of a new user
            if(getUsername(uName,message[1], userMap, nameMap, socket)){
                notifyNewUser(nameMap,io,userMap)
            }
            break;
        default:
            console.log(message)
            break;
    }

}
module.exports = messageHandler