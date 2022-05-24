const encrypt = require("../chacha/encrypt");

function getUsername(uName,username, userMap, nameMap, socket){
    if(nameMap.includes(username)){
        //username is in use, fail
        let data = "badUser<SEPARATOR>"+username
        let eData = encrypt(userMap.get(uName)[0], data)
        socket.emit("serverMessage", (eData))
        return false
    }
    console.log("Setting Username: "+username)
    userMap.set(uName,[userMap.get(uName)[0],userMap.get(uName)[1],username,userMap.get(uName)[3]])
    nameMap.push(username)
    let data = "goodUser<SEPARATOR>"+username
    let eData = encrypt(userMap.get(uName)[0], data)
    socket.emit("serverMessage", (eData))
    return true
}

module.exports = getUsername