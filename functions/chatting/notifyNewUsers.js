const encrypt = require("../chacha/encrypt");

function notifyNewUsers(nameMap,io, userMap){
    userMap.forEach((values,keys) => {
        let data = "newUser<SEPARATOR>"+Array.from(nameMap)
        let eData = encrypt(values[0], data)
        io.to(values[3]).emit("serverMessage", (eData))
    })

}

module.exports = notifyNewUsers