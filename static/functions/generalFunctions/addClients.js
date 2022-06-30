function addClients(clientList){
    let selfName = localStorage.getItem('UName')
    let sidebar = document.getElementById("participants")
    while(sidebar.lastChild !== null){
        sidebar.removeChild(sidebar.lastElementChild)
    }
    let flag = false
    clientList.forEach((username) => {
        if(username !== selfName && username !== ""){
            let newButton = document.createElement("button")
            if(username === window.localStorage.getItem("targetClient")){
                newButton.className = "messageClientSelected"
                document.getElementById("input").disabled = false
                document.getElementById("send").disabled = false
                flag = true
            }
            else{
                newButton.className = "messageClient"
            }
            newButton.id = username
            newButton.innerText = username
            sidebar.appendChild(newButton)
            newButton.addEventListener("click", () =>{
                //check that the target is different to the current one
                let oldTarget = window.localStorage.getItem("targetClient")
                if(oldTarget === newButton.id){
                    console.log("SAME OLD")
                    return
                }
                //indicate to server we intend to change client target
                //do not change target until server acknowleges that the target has accepted
                document.getElementById("cover").style.display = "block"; // do this to block actions taking place
                document.getElementById("cover-Text").innerText = "Waiting for "+ newButton.id +" to accept message request"
                document.getElementById("cancelNewClient").style.display = "block";
                document.getElementById("acceptDenySpan").style.display = "none";

                socket.emit("clientMessage", (encrypt(buffer.Buffer.from(Uint8Array.from(JSON.parse(window.localStorage.getItem("key")))),"changeClient<SEPARATOR>"+newButton.id)))
            })
        }
    })
    if(!flag){
        window.localStorage.removeItem("targetClient")
        document.getElementById("input").disabled = true
        document.getElementById("send").disabled = true
    }
}
