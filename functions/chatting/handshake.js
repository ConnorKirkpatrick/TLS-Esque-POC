const ECDHE = require("../ECDH/ECDHE");
const masterKey = require("../ECDH/masterKey");
const encrypt = require("../chacha/encrypt");
const decrypt = require("../chacha/decrypt");
const notifyNewUser = require("./notifyNewUsers");
const messageHandler = require("../messageHandler");

/**
 * Handshake function used to establish a shared secret with a client <br>
 * Use ECDH to establish a pre-master secret, use PMS to generate a master secret <br>
 * Send confirmation message using master secret, confirm receipt of correct response encrypted with MS to authenticate
 * connection
 * @param socket {Object} Socket.io socket object for the current connection
 * @param uName {String} Cookie of the client establishing connection
 * @param userMap {Map} Map containing all user information
 * @param flag {Boolean} Flag used to determine if we need to ask for a username or not
 * @param io {Object} Socket.io object
 * @param nameMap {Array} Array containing all usernames in active use
 * @param handShake {Function} Handshake function for use in recursive case if connection fails
 */

function handshake(socket, uName, userMap, flag, io, nameMap, handShake) {
    console.log("Handshake start")
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
        handshake(socket, uName, userMap, flag, io, nameMap, handShake);
    })
}

module.exports = handshake
