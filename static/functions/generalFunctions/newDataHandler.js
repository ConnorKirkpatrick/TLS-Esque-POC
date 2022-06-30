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
            console.log("New user: " + data[1])
            addClients(data[1].split(","))
            break;
        case "newMessage":
            receiveMessage(data[1],false)
            break;
        case "messageRequest":
            console.log("New chat request")
            document.getElementById("cover").style.display = "block"; // do this to block actions taking place
            document.getElementById("cover-Text").innerText = "Received new chat request from "+data[1]
            document.getElementById("cancelNewClient").style.display = "none";
            document.getElementById("acceptDenySpan").style.display = "block";
            break
        case "requestAccept":
            console.log("Chat request accepted by: "+data[1])
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
        default:
            console.log(data.toString())
    }
}

//todo: changing recipient doesnt clear messages
//      changing recipient doesnt change previous button class