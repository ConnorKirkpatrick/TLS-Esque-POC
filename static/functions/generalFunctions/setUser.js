function setUser(msg){
    let username = prompt(msg)
    socket.emit("clientMessage", (encrypt(buffer.Buffer.from(Uint8Array.from(JSON.parse(window.localStorage.getItem("key")))),"userName<SEPERATOR>"+username)))
    console.log("Sent username")
}