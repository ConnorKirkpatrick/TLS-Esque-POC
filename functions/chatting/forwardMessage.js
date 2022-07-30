const encrypt = require("../chacha/encrypt");

/**
 * Server side function used to take message from a current client and send it to a targeted client <br>
 * Requires locating target symmetrical key, re-encrypting the message  with target keys and then sending the message
 * to the target
 * @param {string} target Targeted client username
 * @param {string} msg The plaintext message to send to the target client
 * @param {Map} userMap The Map of all active client information
 * @param {Object} io Socket.io Object
 */

function forwardMessage(target, msg, userMap, io){
    //identify which socket the target is on
    //encrypt the message with the users key, send the message privately
    userMap.forEach((values,_) => {
        if(values[2] === target){
            let data = "newMessage<SEPARATOR>"+msg
            let eData = encrypt(values[0], data)
            io.to(values[3]).emit("serverMessage", (eData))
        }
    })
}

module.exports = forwardMessage