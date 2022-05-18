const path = require("path");
const app = require("express")();
const http = require("http").createServer(app);
const io = require("socket.io")(http);
const express = require("express")
app.use("/static", express.static(path.join(__dirname, "./static/")));

const ECDHE = require("./functions/ECDH/ECDHE")
const masterKey = require("./functions/ECDH/masterKey")
const encrypt = require("./functions/chacha/encrypt")
const decrypt = require("./functions/chacha/decrypt")


let PORT = Number(process.env.PORT || 80);
http.listen(PORT, () => {
    console.log("Listening on " + PORT);
});

app.get("/", (req, res) => {
    res.sendFile(__dirname + "/static/mainPage.html");
});
let mKey = ""
io.on("connection",(socket) => {
    console.log("Client connected")
    //upon connection, derive and send client the server public key
    let Keys = ECDHE()
    socket.emit("ServKey", (Keys.getPublicKey()))

    socket.on("Test", () => {
        console.log("Button clicked")
    })
    //receive the clients public key
    socket.on("PubKey", (CKey) =>{
        //generate shared secret from client and server keys
        let sharedSecret = Keys.computeSecret(CKey)
        //generate a master password from the shared secret
        mKey = masterKey(sharedSecret, "")


        let data = "conn-Test"
        let eData = encrypt(mKey, data)
        let encrypted = eData[0]
        let nonce = eData[1]
        let tag = eData[2]
        socket.emit("newData", (eData))
        //console.log(decrypt(mKey, encrypted, nonce, tag).toString())
        
        //Once encryption is created, attempt to communicate using the "new data" socket tag
        //a second tag will be included inside the encrypted message to trigger actions
    })
    socket.on("newData", (eData) => {
        if(decrypt(mKey, eData[0], eData[1], eData[2]).toString() === "good-Conn"){
            console.log("Secure channel constructed")
        }
    })
    socket.on("Bad-Conn", () => {
        //resend data, or clear cookie and re-construct channel
    })
    //TODO Store ephemural key object, client cookie and master secret for connection once cipher is created
})