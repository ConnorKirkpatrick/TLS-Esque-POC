const decrypt = require("./chacha/decrypt");
const getUsername = require("./username/getUsername");

function messageHandler(eData, uName, userMap, nameMap, socket){
    let mKey = userMap.get(uName)[0]
    let message = decrypt(mKey, eData[0], eData[1], eData[2]).toString().split("<SEPERATOR>")
    switch(message[0]){
        case "good-Conn":
            break;
        case "userName":
            getUsername(uName,message[1], userMap, nameMap, socket)
            break;
        default:
            console.log(message)
            break;
    }

}
module.exports = messageHandler