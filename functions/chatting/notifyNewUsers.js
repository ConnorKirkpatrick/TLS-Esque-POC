const encrypt = require("../chacha/encrypt");

/**
 * Alert active clients that a new client has joined and is available to message<br>
 * @param nameMap {Array} Array of all active usernames
 * @param io {Object} Socket.io object
 * @param userMap {Map} Map containing all client information
 */

function notifyNewUsers(nameMap,io, userMap){
    userMap.forEach((values,_) => {
        let data = "newUser<SEPARATOR>"+Array.from(nameMap)
        let eData = encrypt(values[0], data)
        io.to(values[3]).emit("serverMessage", (eData))
    })

}

module.exports = notifyNewUsers