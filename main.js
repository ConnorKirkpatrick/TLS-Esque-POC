const path = require("path");
const app = require("express")();
const http = require("http").createServer(app);
const io = require("socket.io")(http);
const express = require("express")
app.use("/static", express.static(path.join(__dirname, "./static/")));

const ECDHE = require("./functions/ECDH/ECDHE")
const encrypt = require("./functions/chacha/encrypt")
const decrypt = require("./functions/chacha/decrypt")
const masterKey = require("./functions/chacha/masterKey")

let PORT = Number(process.env.PORT || 80);
http.listen(PORT, () => {
    console.log("Listening on " + PORT);
});

app.get("/", (req, res) => {
    res.sendFile(__dirname + "/static/mainPage.html");
});
let Keys = ECDHE()
console.log(Keys.getPublicKey())
io.on("connection",(socket) => {
    console.log("Client connected")
    socket.emit("ServKey", (Keys.getPublicKey()))

    socket.on("Test", () => {
        console.log("Button clicked")
    })

    socket.on("PubKey", (CKey) =>{
        console.log("Client key: ");
        console.log(CKey)
        let sharedSecret = Keys.computeSecret(CKey)
        console.log(sharedSecret)
        let data = "somedata"
        let eData = encrypt(sharedSecret, data, data)
        let encrypted = eData[0]
        let nonce = eData[1]
        let tag = eData[2]
        console.log(encrypted)
        console.log(decrypt(sharedSecret, encrypted, nonce, tag).toString())
        //masterKey(sharedSecret, "")
    })
})