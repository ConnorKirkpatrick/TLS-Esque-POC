const encrypt = require("../chacha/encrypt");

function changeClient(uName, userMap, target, io, flag){
    userMap.forEach((values,keys) => {
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