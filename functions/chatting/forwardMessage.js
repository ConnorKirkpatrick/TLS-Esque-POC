const encrypt = require("../chacha/encrypt");

function forwardMessage(target, msg, userMap, io){
    //identify which socket the target is on
    //encrypt the message with the users key, send the message privately
    userMap.forEach((values,keys) => {
        if(values[2] === target){
            let data = "newMessage<SEPARATOR>"+msg
            let eData = encrypt(values[0], data)
            io.to(values[3]).emit("serverMessage", (eData))
        }
    })
}

module.exports = forwardMessage