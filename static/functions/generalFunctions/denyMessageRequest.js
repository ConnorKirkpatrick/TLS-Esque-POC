/**
 * Small function used to reset user interface upon denying a message request. Hides the blocking cover and optional
 * buttons along with sending notice to the server
 */
function denyMessageRequest(){
    document.getElementById('cover').style.display='none' //hide the cover
    let target = document.getElementById("cover-Text").innerText.substring(31)
    socket.emit("clientMessage", (encrypt(buffer.Buffer.from(Uint8Array.from(JSON.parse(window.localStorage.getItem("key")))),"denyClient<SEPARATOR>"+target)))
}