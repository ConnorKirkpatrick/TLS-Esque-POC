/**
 * Function used to add other clients to our client. Other clients added as buttons on the left flank of the page,
 * containing the name of the client. The client list will include our own username, so we check for that to ensure we
 * do not see ourselves as another client we can message. As this message happens any time a new client is added, we
 * maintain a record of our current messaging partner so that they appear as our messaging target
 * @param {Array} clientList Array of all client usernames
 */
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
