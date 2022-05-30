function receiveMessage(msg,ownMessage){
    let msgArea = document.getElementById('messages')
    let msgBox = document.createElement("div")
    msgBox.className = "messageBox"
    let newMessage = document.createElement("div")
    if(ownMessage){
        newMessage.className = "messageSent"
    }
    else{
        newMessage.className = "messageReceived"
    }
    newMessage.innerText = msg
    msgBox.appendChild(newMessage)
    msgArea.appendChild(msgBox)
}