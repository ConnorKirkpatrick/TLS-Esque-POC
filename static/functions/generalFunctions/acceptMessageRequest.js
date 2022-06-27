function acceptMessageRequest(){
    document.getElementById('cover').style.display='none' //hide the cover
    let target = document.getElementById("cover-Text").innerText.substring(31)
    socket.emit("clientMessage", (encrypt(buffer.Buffer.from(Uint8Array.from(JSON.parse(window.localStorage.getItem("key")))),"acceptClient<SEPARATOR>"+target)))
}