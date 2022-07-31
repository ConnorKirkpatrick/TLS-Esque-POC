/**
 * Main function used to handle all incoming encrypted messages from the server. We view the opcode of the decrypted
 * message data, position 0, and evaluate which option to pass the remainder of the message to.<br>
 * conn-Test: initial handshake with the server. Data = setUsername flag<br>
 * setUSer: Server requests for client to be prompted to set username<br>
 * badUser: Provided username is invalid, server requests a new username. Data = old Username<br>
 * goodUser: Provided username is valid, assign session variable for the username. Data = username<br>
 * newUser: Notification of new users, refresh user list. Data = username list<br>
 * newMessage: Receipt of message from chat partner. Data = message contents<br>
 * messageRequest: Receipt of a message request from another client. Data = requesting client username<br>
 * requestAccept: Notification that client has accepted our message request. Data = accepting clients' username<br>
 * requestDeny: Notification that client has denied our message request. Data = denying clients' username<br>
 * clientLeft: Notification from the server that the messaging client has gone offline. Data = clients' username<br>
 * cancelRequest: Notification from the server that the request to chat has been cancelled.<br>
 * @param {Array} data Decrypted server message data
 */
function newDataHandler(data){
    switch (data[0]){
        case "conn-Test":
            socket.emit("clientMessage", (encrypt(buffer.Buffer.from(Uint8Array.from(JSON.parse(window.localStorage.getItem("key")))),"good-Conn<SEPARATOR>"+data[1])))
            break
        case "setUser":
            setUser("Please enter a username: ")
            break;
        case "badUser":
            setUser("Username " +data[1]+ " was already in use. Please enter a different username: ")
            break;
        case "goodUser":
            localStorage.setItem("UName",data[1])
            document.title = data[1]+"'s chat room"
            break
        case "newUser":
            addClients(data[1].split(","))
            break;
        case "newMessage":
            receiveMessage(data[1],false)
            break;
        case "messageRequest":
            document.getElementById("cover").style.display = "block"; // do this to block actions taking place
            document.getElementById("cover-Text").innerText = "Received new chat request from "+data[1]
            document.getElementById("cancelNewClient").style.display = "none";
            document.getElementById("acceptDenySpan").style.display = "block";
            break
        case "requestAccept":
            //hide the cover
            document.getElementById("cover").style.display = "none";
            //clear old messages
            let messages = document.getElementById("messages")
            while(messages.lastChild !== null){
                messages.removeChild(messages.lastElementChild)
            }
            //mark old button as not selected
            if(window.localStorage.getItem("targetClient") !== null){
                document.getElementById(window.localStorage.getItem("targetClient")).className = "messageClient"
                //send message to drop old client
                socket.emit("clientMessage", (encrypt(buffer.Buffer.from(Uint8Array.from(JSON.parse(window.localStorage.getItem("key")))),"dropClient<SEPARATOR>"+window.localStorage.getItem("targetClient"))))
            }
            //mark the button as the current selected
            document.getElementById(data[1]).className = "messageClientSelected"
            //update stored target value
            window.localStorage.setItem("targetClient", data[1])
            console.log("Stored: "+window.localStorage.getItem("targetClient"))
            //enable the send button and text box
            document.getElementById("input").disabled = false
            document.getElementById("send").disabled = false
            break
        case "requestDeny":
            console.log("Chat request denied by: "+data[1])
            document.getElementById("cover").style.display = "none"; //hide the cover
            alert(data[1]+" refused your request to chat")
            break;
        case "clientLeft":
            console.log(data[1]+" has stopped chatting")
            //disable text box and button
            document.getElementById("input").disabled = true
            document.getElementById("send").disabled = true
            //display alert
            alert(data[1]+" has stopped chatting with you")
            //set client button back to default
            document.getElementById(data[1]).className = "messageClient"
            //clear stored value
            window.localStorage.removeItem("targetClient")
            break;
        case "cancelRequest":
            //hide the cover
            document.getElementById("cover").style.display = "none";
            break;
        default:
            console.log(data.toString())
    }
}