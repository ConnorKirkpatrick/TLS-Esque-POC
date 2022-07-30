const encrypt = require("../chacha/encrypt");

/**
 * Function used to ensure that new users select a username that is not a duplicate
 * @param uName {String} Cookie of the requesting client
 * @param username {String} Username requested by user
 * @param userMap {Map} Map of all connected users information
 * @param nameMap {Array} Array of all connected users usernames
 * @param socket {Object} Socket.io object
 * @returns {boolean} Is the requested username available or not
 */
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