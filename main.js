const path = require("path");
const app = require("express")();
const http = require("http").createServer(app);
const io = require("socket.io")(http);
const cookieParser = require("cookie-parser")
const express = require("express")
app.use("/static", express.static(path.join(__dirname, "./static/")));


const ECDHE = require("./functions/ECDH/ECDHE")
const masterKey = require("./functions/ECDH/masterKey")
const encrypt = require("./functions/chacha/encrypt")
const decrypt = require("./functions/chacha/decrypt")
const crypto = require("crypto");

let cookieKey = masterKey(crypto.randomBytes(12), crypto.randomBytes(12))
let keyMap = {}
app.use(cookieParser(cookieKey))

let PORT = Number(process.env.PORT || 80);
http.listen(PORT, () => {
    console.log("Listening on " + PORT);
});

app.get("/", (req, res) => {
    res.sendFile(__dirname + "/static/mainPage.html");
    console.log("Cookies: ")
    console.log(req.cookies)
    console.log(req.signedCookies)
});
let mKey = ""
io.on("connection",(socket) => {
    console.log("Client connected")
    //upon connection, derive and send client the server public key
    let Keys = ECDHE()
    socket.emit("ServKey", (Keys.getPublicKey()))

    //receive the clients public key
    socket.on("PubKey", (CKey) =>{
        //generate shared secret from client and server keys
        let sharedSecret = Keys.computeSecret(CKey)
        //generate a master password from the shared secret
        mKey = masterKey(sharedSecret, "")

        //encrypt and send handshake message
        let data = "conn-Test<SEPERATOR>"
        let eData = encrypt(mKey, data)
        socket.emit("newData", (eData))
        console.log("sent conn")
        //Once encryption is created, attempt to communicate using the "new data" socket tag
        //a second tag can be included inside the encrypted message to trigger actions in the future
    })
    //receive the second part of the handshake confirming the establishment of the secure channel
    socket.on("newData", (eData) => {
        if(decrypt(mKey, eData[0], eData[1], eData[2]).toString() === "good-Conn"){
            console.log("Secure channel constructed")
        }
    })
    //message notifying server of a failed handshake
    socket.on("Bad-Conn", () => {
        //resend data, or clear cookie and re-construct channel
    })
    //TODO Store master secret and client cookie for connection once cipher is created
})