const decrypt = require("./chacha/decrypt");

function messageHandler(eData, uName, userMap){
    let mKey = userMap.get(uName)[0]
    let message = decrypt(mKey, eData[0], eData[1], eData[2]).toString().split("<SEPERATOR>")
    switch(message[0]){
        case "userName":
            console.log("Setting Username: "+message[1])
            userMap.set(uName,[userMap.get(uName)[0],userMap.get(uName)[1],message[1]])
    }
}
module.exports = messageHandler