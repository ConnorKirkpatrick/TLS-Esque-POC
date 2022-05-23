const path = require("path");
const express = require("express");
const app = express();
const http = require("http");
const server = http.createServer(app)
const { Server } = require("socket.io")
const io = new Server(server)

const cookieParser = require("cookie-parser")
app.use("/static", express.static(path.join(__dirname, "./static/")));

const Crypto = require("crypto")
const ECDHE = require("./functions/ECDH/ECDHE")
const masterKey = require("./functions/ECDH/masterKey")
const encrypt = require("./functions/chacha/encrypt")
const decrypt = require("./functions/chacha/decrypt")
const crypto = require("crypto");

const handshake = require("./functions/handshake")

let cookieKey = masterKey(crypto.randomBytes(12), crypto.randomBytes(12)).toString()
let userMap = new Map()  ///map in style { cookie; [key, socket] }
app.use(cookieParser(cookieKey))
app.set("socketio", io)

let PORT = Number(process.env.PORT || 80);
server.listen(PORT, () => {
    console.log("Listening on " + PORT);
});

app.get("/", (req, res) => {
    let cookie = req.cookies["SID"]
    let io = req.app.get("socketio");
    let mKey =  userMap.get(cookie)
    let rCookie = ""
    console.log("COOKIE:" + cookie)
    //we set the cookie in the header when we send the file with res
    if(mKey === undefined){
        rCookie = randomString()
        res.cookie("SID",rCookie,{httpOnly:true, maxAge:5*60*1000})
    }
    res.sendFile(__dirname + "/static/chatRoom.html");
    //only after the file is sent can we act on the socket object
    io.once("connection", (socket) => {
        console.log("CLIENT CONNECTED")
        socket.emit("SERVER-HELLO")
        if(mKey === undefined){
            console.log("Undefined key")
            handshake(socket, rCookie, userMap)
        }
        else{
            console.log("Got cookie, using old key: ")
            console.log(mKey)
        }

    })


});

function randomString(size = 21) {
    return Crypto
        .randomBytes(size)
        .toString('base64')
        .slice(0, size)
}

/*
TODO:
2 cookies, user cookie and security cookie
user cookie is session cookie
security cookie times out

client opens page
if no cookie
    add cookie (security)
    ask user to pick and account name
    save account name to cookie with key
    redirect to chat page
if account cookie but no secure cookie
    re-do handshake
if security cookie but no account cookie
    ask for username
    redirect to chat page

if both cookie
chat page
    select other users on the left side to chat
    non-persistent messages (snapchat)
    message area is scrollable div (?)
    messages sent are colour coded, left/right aligned per user

 */