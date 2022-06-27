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
        default:
            console.log(data.toString())
    }
}