const crypto = require("crypto");

const path = require("path");
const app = require("express")();
const http = require("http").createServer(app);
const io = require("socket.io")(http);
const express = require("express")
app.use("/static", express.static(path.join(__dirname, "./static/")));

const fs = require("fs")

let PORT = Number(process.env.PORT || 80);
http.listen(PORT, () => {
    console.log("Listening on " + PORT);
});

app.get("/", (req, res) => {
    res.sendFile(__dirname + "/static/mainPage.html");
});