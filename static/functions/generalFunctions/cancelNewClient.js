function cancelNewClient(){
    document.getElementById('cover').style.display = 'none'
    //send message to socket to terminate the new client request
    let target = document.getElementById("cover-Text").innerText.substring(12,document.getElementById("cover-Text").innerText.indexOf(" to accept"))
    socket.emit("clientMessage", (encrypt(buffer.Buffer.from(Uint8Array.from(JSON.parse(window.localStorage.getItem("key")))),"cancelRequest<SEPARATOR>"+target)))
}