/**
 * We update the message area with the new message
 * @param {String} msg The message to add to the interface
 * @param {Boolean} ownMessage Flag indicating whether this message is send by us or by the other client
 */
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