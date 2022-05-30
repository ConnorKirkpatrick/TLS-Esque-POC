const ECDHE = require("../ECDH/ECDHE");
const masterKey = require("../ECDH/masterKey");
const encrypt = require("../chacha/encrypt");
const decrypt = require("../chacha/decrypt");
const notifyNewUser = require("./notifyNewUsers");
const messageHandler = require("../messageHandler");
const handshakeTimer = require("../handshakeTimer")

function handshake(socket, uName, userMap, flag, io, nameMap, handShake) {
    console.log("Handshake start")
    console.log(handShake)
    console.log(socket.id)
    let mKey = ""
    let Keys = ECDHE()
    socket.removeAllListeners("clientMessage")
    socket.removeAllListeners("Bad-Conn")
    socket.emit("ServKey", (Keys.getPublicKey()))
    socket.once("PubKey", (CKey) => {
        //generate shared secret from client and server keys
        let sharedSecret = Keys.computeSecret(CKey)
        //generate a master password from the shared secret and add it to the map
        mKey = masterKey(sharedSecret, "")
        //encrypt and send handshake message
        let data = "conn-Test<SEPARATOR>" + flag
        let eData = encrypt(mKey, data)
        socket.emit("serverMessage", (eData))
        ///NOTE: client cannot accept new data until the username is set, possibly wait until after username is set to start the timeout?
    })
    socket.once("clientMessage", (eData) => {
        //console.log((Uint8Array.from(mKey)))
        let message = decrypt(mKey, eData[0], eData[1], eData[2]).toString().split("<SEPARATOR>")
        //the secure channel is now created
        if (message[0] === "good-Conn") {
            console.log("Secure channel created")
            let userData = userMap.get(uName)
            userMap.set(uName, [mKey, userData[1], userData[2], socket.id, userData[4]])
            //for every encrypted message, pass it to the message handler function, needed for all users
            socket.on("clientMessage", (encrypted) => {
                messageHandler(encrypted, uName, userMap, nameMap,socket, io, handShake)
            })
            //if the additional data is a true flag, we must ask the client for a username
            if(message[1] === "true"){
                let data = "setUser<SEPARATOR>"
                let eData = encrypt(userMap.get(uName)[0], data)
                socket.emit("serverMessage", (eData))
            }
            //if not a new users, we should update their userMap
            //also re-establish the timeout on the current key set
            else{
                notifyNewUser(nameMap, io, userMap)
            }

        }
    })

    socket.once("Bad-Conn", () => {
        //resend data, or clear cookie and re-construct channel
        console.log("Failed to read clients data, possibly corrupt or with the wrong key")
    })
}

module.exports = handshake
