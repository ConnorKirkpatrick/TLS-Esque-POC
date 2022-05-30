function sendMessage(){
    let message = document.getElementById("input").value
    let target = window.localStorage.getItem("targetClient")
    console.log("sentMessage: "+"MESSAGE<SEPARATOR>"+target+"<SEPARATOR>"+message)
    socket.emit("clientMessage", (encrypt(buffer.Buffer.from(Uint8Array.from(JSON.parse(window.localStorage.getItem("key")))),"MESSAGE<SEPARATOR>"+target+"<SEPARATOR>"+message)))
    document.getElementById("input").value = ""
}