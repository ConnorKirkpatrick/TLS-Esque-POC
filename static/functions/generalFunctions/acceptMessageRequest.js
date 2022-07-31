/**
 * Functionality for accept button upon receipt of a message request to the client
 */
function acceptMessageRequest(){
    document.getElementById('cover').style.display='none' //hide the cover
    let target = document.getElementById("cover-Text").innerText.substring(31)
    socket.emit("clientMessage", (encrypt(buffer.Buffer.from(Uint8Array.from(JSON.parse(window.localStorage.getItem("key")))),"acceptClient<SEPARATOR>"+target)))
    //set the button as active
    if(window.localStorage.getItem("targetClient") !== null){
        document.getElementById(window.localStorage.getItem("targetClient")).className = "messageClient"
        //drop the old client
        socket.emit("clientMessage", (encrypt(buffer.Buffer.from(Uint8Array.from(JSON.parse(window.localStorage.getItem("key")))),"dropClient<SEPARATOR>"+window.localStorage.getItem("targetClient"))))
    }
    document.getElementById(target).className = "messageClientSelected"
    window.localStorage.setItem("targetClient", target)
    //make sure the text area and button are enabled
    document.getElementById("input").disabled = false
    document.getElementById("send").disabled = false
}