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
            socket.on("clientMessage", (encrypted) => {
                messageHandler(encrypted, uName, userMap)
            })


        }


    })
    /*

    let mKey =  userMap.get(sCookie)

    console.log("COOKIE:" + sCookie)
    //we set the cookie in the header when we send the file with res
    if(mKey === undefined){
        rCookie = randomString()
        res.cookie("SID",rCookie,{httpOnly:true, maxAge:5*60*1000})
    }
    res.sendFile(__dirname + "/static/chatRoom.html");
    //only after the file is sent can we act on the socket object
    io.once("connection", (socket) => {
        console.log("CLIENT CONNECTED MESSAGING")
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

     */


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
    do this as an alert popup?
        else how do I keep the client side key without saving to the memory
        technically can use localStorage.set/get
        however this puts data in reach of CSS scripts
        possibly try to clear it first?
        probably best to use a prompt window
            allows all comms to be encrypted with the key
            probably simpler
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