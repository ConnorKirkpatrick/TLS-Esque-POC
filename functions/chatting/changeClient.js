const encrypt = require("../chacha/encrypt");

function changeClient(uName, userMap, target, io){
    console.log("New client request from "+userMap.get(uName)[2]+" for "+target)
    userMap.forEach((values,keys) => {
        if(values[2] === target){
            let data = "messageRequest<SEPARATOR>"+userMap.get(uName)[2]
            let eData = encrypt(values[0], data)
            io.to(values[3]).emit("serverMessage", (eData))
        }
    })
    console.log("Message sent")
}

module.exports = changeClient