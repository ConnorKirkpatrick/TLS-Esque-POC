function newDataHandler(data){
    switch (data[0]){
        case "conn-Test":
            socket.emit("clientMessage", (encrypt(buffer.Buffer.from(Uint8Array.from(JSON.parse(window.localStorage.getItem("key")))),"good-Conn")))
            break
        case "setUser":
            setUser("Please enter a username: ")
            break;
        case "badUser":
            setUser("Username " +data[1]+ " was already in use. Please enter a different username: ")
            break;
        case "goodUser":
            localStorage.setItem("UName",data[1])
            break
        case "newUser":
            console.log("New user: " + data[1])
            break;
        default:
            console.log(data.toString())
    }
}