function setUser(){
    let username = prompt("Please enter a username: ")
    localStorage.setItem("UName",username)
    socket.emit("clientMessage", (encrypt(buffer.Buffer.from(Uint8Array.from(JSON.parse(window.localStorage.getItem("key")))),"userName<SEPERATOR>"+username)))
}