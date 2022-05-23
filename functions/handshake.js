const ECDHE = require("./ECDH/ECDHE");
const masterKey = require("./ECDH/masterKey");
const encrypt = require("./chacha/encrypt");
const decrypt = require("./chacha/decrypt");
function handshake(socket, uCookie, userMap){
    let mKey = ""
    let Keys = ECDHE()
    socket.emit("ServKey", (Keys.getPublicKey()))
    socket.on("PubKey", (CKey) =>{
        //generate shared secret from client and server keys
        let sharedSecret = Keys.computeSecret(CKey)
        //generate a master password from the shared secret
        mKey = masterKey(sharedSecret, "")

        //encrypt and send handshake message
        let data = "conn-Test<SEPERATOR>"
        let eData = encrypt(mKey, data)
        socket.emit("serverMessage", (eData))
    })
    socket.on("clientMessage", (eData) => {
        if(decrypt(mKey, eData[0], eData[1], eData[2]).toString() === "good-Conn"){
            //add the key to the map
            //copy over the values of the secCookie and username
            userMap.set(uCookie,[mKey,userMap.get(uCookie)[1],userMap.get(uCookie)[2]])
            console.log("New UserData set: ")
            console.log(userMap.get(uCookie))
        }
    })
    socket.on("Bad-Conn", () => {
        //resend data, or clear cookie and re-construct channel
        //console.log("Failed to construct new channel")
    })
}

module.exports = handshake
