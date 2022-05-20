const path = require("path");
const app = require("express")();
const http = require("http").createServer(app);
const io = require("socket.io")(http);
const cookieParser = require("cookie-parser")
const express = require("express")
app.use("/static", express.static(path.join(__dirname, "./static/")));

const Crypto = require("crypto")
const ECDHE = require("./functions/ECDH/ECDHE")
const masterKey = require("./functions/ECDH/masterKey")
const encrypt = require("./functions/chacha/encrypt")
const decrypt = require("./functions/chacha/decrypt")
const crypto = require("crypto");

let cookieKey = masterKey(crypto.randomBytes(12), crypto.randomBytes(12)).toString()
let keyMap = new Map()
app.use(cookieParser(cookieKey))
app.set("socketio", io)

let PORT = Number(process.env.PORT || 80);
http.listen(PORT, () => {
    console.log("Listening on " + PORT);
});

app.get("/", (req, res) => {
    let cookie = req.cookies["SID"]
    let io = req.app.get("socketio");
    let mKey =  keyMap.get(cookie)
    let rCookie = ""
    if(mKey === undefined){
        rCookie = randomString()
        res.cookie("SID",rCookie,{httpOnly:true, maxAge:10000})
    }
    res.sendFile(__dirname + "/static/mainPage.html");
    io.on("connection", (socket) => {
        console.log("CLIENT CONNECTED")
        if(mKey === undefined){
            console.log("NO COOKIE, HANDSHAKE")
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
                socket.emit("newData", (eData))
                //Once encryption is created, attempt to communicate using the "new data" socket tag
                //a second tag can be included inside the encrypted message to trigger actions in the future
            })
            //receive the second part of the handshake confirming the establishment of the secure channel
            socket.on("newData", (eData) => {
                if(decrypt(mKey, eData[0], eData[1], eData[2]).toString() === "good-Conn"){
                    console.log("Secure channel constructed")
                    //generate cookie, send new cookie
                    keyMap.set(rCookie,mKey)
                    console.log(rCookie+" set for key: "+mKey)
                }
            })
            //message notifying server of a failed handshake
            socket.on("Bad-Conn", () => {
                //resend data, or clear cookie and re-construct channel
                console.log("Failed to construct new channel")
            })
        }
        else{
            console.log("FOUND COOKIE, USE OLD KEY")
            console.log(mKey)
        }
    })


});

    /*
    //upon connection, derive and send client the server public key


    //receive the clients public key
     */
    //TODO Store master secret and client cookie for connection once cipher is created


function randomString(size = 21) {
    return Crypto
        .randomBytes(size)
        .toString('base64')
        .slice(0, size)
}