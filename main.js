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
const messageHandler = require("./functions/messageHandler")

const SEPARATOR = "<SEPARATOR>"
let cookieKey = masterKey(crypto.randomBytes(12), crypto.randomBytes(12)).toString()
///map in style { usercookie; [key, secureCookie, username] }
///user cookie is session length, secure cookie times out every 5 mins
/// user cookie and secure are generated randomly as soon as one is missing
/// key and username are added later when needed/obtained
let userMap = new Map()
let nameMap = new Map()

app.use(cookieParser(cookieKey))
app.set("socketio", io)

let PORT = Number(process.env.PORT || 80);
server.listen(PORT, () => {
    console.log("Listening on " + PORT);
});
app.get("/login", (req,res) => {
    let sesID = req.cookies["SID"]
    let uName = req.cookies["uName"]
    let io = req.app.get("socketio");
    res.sendFile(__dirname + "/static/loginPage/login.html");
    io.once("connection", (socket) => {
        console.log("CLIENT CONNECTED LOGIN")
    })
})
app.get("/", (req, res) => {
    let sCookie = req.cookies["SID"]
    let uName = req.cookies["uName"]
    let io = req.app.get("socketio");
    let uCookie = ""
    let secCookie = ""
    let userData = userMap.get(uName)
    let flag = false
    if(userData === undefined){
        ///create a session cookie for the userData
        uCookie = randomString()
        res.cookie("uName",uCookie,{httpOnly:true})

        ///also means we dont have a secure cookie, so add that too
        secCookie = randomString()
        res.cookie("SID",secCookie,{httpOnly:true, maxAge:0.1*60*1000})
        ///make sure we flag sCookie as undefined so we perform a new handshake
        sCookie = undefined
        //add this data to the map
        userMap.set(uCookie,["",secCookie,""])
        uName = uCookie

        //make the flag true so we ask for a user name
        flag = true
    }
    else if(sCookie === undefined){
        ///sCookie has timed out, lets give it a new one and ensure that the handshake is redone
        secCookie = randomString()
        res.cookie("SID",secCookie,{httpOnly:true, maxAge:5*60*1000})
        ///lets add the new data back to the userMap, blank the key but keep the username
        userMap.set(uName,["",secCookie,userMap.get(uName)[2]])
    }
    res.sendFile(__dirname + "/static/chatRoom.html");

    ///establish socket connection
    io.once("connection", (socket) => {
        console.log("CLIENT CONNECTED MESSAGING")
        socket.emit("SERVER-HELLO")
        if(sCookie === undefined){
            ///the security cookie has timed out
            ///time to create a new handshake value
            console.log("Undefined security cookie, generating new handshake")
            handshake(socket, uName, userMap, flag)
            socket.on("Bad-Conn", () => {
                console.log("Handshake failed")
            })

        }
        else{
            console.log("Got cookie, using old key")
        }
        socket.on("clientMessage", (encrypted) => {
            messageHandler(encrypted, uName, userMap, nameMap,socket)
        })
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
    do this as an alert popup
        check usernames, do not allow duplicates
if both cookie
chat page
    current issue, the username persists between sessions, would be nice if it got cleared

    select other users on the left side to chat
    non-persistent messages (snapchat)
    message area is scrollable div (?)
    messages sent are colour coded, left/right aligned per user

 */