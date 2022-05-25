const ECDHE = require("./ECDH/ECDHE");
const masterKey = require("./ECDH/masterKey");
const encrypt = require("./chacha/encrypt");
const decrypt = require("./chacha/decrypt");
const notifyNewUser = require("./chatting/notifyNewUsers");

function handshake(socket, uName, userMap, flag, io, nameMap){
    let mKey = ""
    let Keys = ECDHE()
    socket.emit("ServKey", (Keys.getPublicKey()))
    socket.on("PubKey", (CKey) =>{
        //generate shared secret from client and server keys
        let sharedSecret = Keys.computeSecret(CKey)
        //generate a master password from the shared secret
        mKey = masterKey(sharedSecret, "")

        //encrypt and send handshake message
        let data = "conn-Test<SEPARATOR>"
        let eData = encrypt(mKey, data)
        socket.emit("serverMessage", (eData))
    })
    socket.once("clientMessage", (eData) => {
        if(decrypt(mKey, eData[0], eData[1], eData[2]).toString() === "good-Conn"){
            //add the key to the map
            //copy over the values of the secCookie and username
            userMap.set(uName,[mKey,userMap.get(uName)[1],userMap.get(uName)[2],socket.id])
            console.log("New UserData set: ")
            console.log(userMap.get(uName))
            //if the flag is true, this is a brand new user and thus needs a username to be picked
            if(flag){
                let data = "setUser<SEPARATOR>"
                let eData = encrypt(userMap.get(uName)[0], data)
                socket.emit("serverMessage", (eData))
            }
        //if not a new users, we should update their userMap
            else{
                notifyNewUser(nameMap, io, userMap)
            }
        }
    })
    socket.on("Bad-Conn", () => {
        //resend data, or clear cookie and re-construct channel
        console.log("Failed to construct new channel")
    })
}

module.exports = handshake
