const encrypt = require("../chacha/encrypt");

/**
 * Function used manage requesting, accepting and denying message requests between users
 * @param {String} uName The cookie of the client sending the message
 * @param {Map} userMap The usermap containing information on all clients
 * @param {String} target The target username for the message request information
 * @param {Object} io Socket.io object
 * @param {number} flag Flag identifying which kind of message the user wishes to send the target
 */

function changeClient(uName, userMap, target, io, flag){
    userMap.forEach((values,_) => {
        if(values[2] === target){
            let data = ""
            switch (flag){
                case 0:
                    data = "messageRequest<SEPARATOR>"+userMap.get(uName)[2]
                    break
                case 1:
                    data = "requestAccept<SEPARATOR>"+userMap.get(uName)[2]
                    break
                case 2:
                    data = "requestDeny<SEPARATOR>"+userMap.get(uName)[2]
                    break
                case 3:
                    data = "clientLeft<SEPARATOR>"+userMap.get(uName)[2]
                    break;
                case 4:
                    data = "cancelRequest<SEPARATOR>"+userMap.get(uName)[2]
            }
            let eData = encrypt(values[0], data)
            io.to(values[3]).emit("serverMessage", (eData))
        }
    })
}

module.exports = changeClient