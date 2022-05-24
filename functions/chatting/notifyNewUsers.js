const encrypt = require("../chacha/encrypt");

function notifyNewUsers(nameMap,io, userMap){
    ///when a new user comes onto the network, notify all other sockets that they exist
    //possibly this should be run for every user? else how will person 2 ever see person 1
        //only person 1 will be notified of person 2, 2 will never be notified of person 1
    //run this every time a new user joins, it will refresh every users list
    //we simply send them the namesMap, they can then pull all username values out to generate their list
    userMap.forEach((values,keys) => {
        let data = "newUser<SEPARATOR>"+Array.from(nameMap)
        let eData = encrypt(values[0], data)
        io.to(values[3]).emit("serverMessage", (eData))
    })

}

module.exports = notifyNewUsers