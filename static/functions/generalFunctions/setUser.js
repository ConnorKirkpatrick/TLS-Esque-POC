/**
 * Client prompt using a prompt box to ask the user for a unique username
 * @param {String} msg The message to display during the prompt
 */
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