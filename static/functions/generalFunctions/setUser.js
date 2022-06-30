function setUser(msg){
    window.localStorage.removeItem("targetClient")
    let username = prompt(msg)
    if(username === null){
        setUser("Please enter a username: ")
    }
    else{
        socket.emit("clientMessage", (encrypt(buffer.Buffer.from(Uint8Array.from(JSON.parse(window.localStorage.getItem("key")))), "userName<SEPARATOR>" + username)))
        console.log("Sent username")
    }


}