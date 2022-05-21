function newDataHandler(data){
    switch (data[0]){
        case "conn-Test":
            console.log("MATCH")
            socket.emit("clientMessage", (encrypt(window.mKey,"good-Conn")))
            break
    }
}