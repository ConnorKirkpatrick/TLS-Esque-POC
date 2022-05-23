const encrypt = require("../chacha/encrypt");

function getUsername(uName,username, userMap, nameMap, socket){
    if(nameMap.get(username) === 1){
        //username is in use, fail
        let data = "badUser<SEPARATOR>"+username
        let eData = encrypt(userMap.get(uName)[0], data)
        socket.emit("serverMessage", (eData))
    }
    console.log("Setting Username: "+username)
    userMap.set(uName,[userMap.get(uName)[0],userMap.get(uName)[1],username])
    nameMap.set(username, 1)
    let data = "goodUser<SEPARATOR>"+username
    let eData = encrypt(userMap.get(uName)[0], data)
    socket.emit("serverMessage", (eData))
}

module.exports = getUsername