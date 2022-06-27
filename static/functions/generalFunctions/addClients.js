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
                //indicate to server we intend to change client target
                //do not change target until server acknowleges that the target has accepted
                document.getElementById("cover").style.display = "block"; // do this to block actions taking place
                document.getElementById("cover-Text").innerText = "Waiting for "+ newButton.id +" to accept message request"


                console.log("Set client")
                let oldTarget = window.localStorage.getItem("targetClient")
                if(oldTarget === newButton.id){
                    console.log("SAME OLD")
                }
                else if(document.getElementById(oldTarget) !== null){
                    //different client to last, make sure old messages are deleted
                    document.getElementById(oldTarget).className ="messageClient"
                    let messages = document.getElementById("messages")
                    while(messages.lastChild !== null){
                        messages.removeChild(messages.lastElementChild)
                    }
                }
                newButton.className = "messageClientSelected"
                window.localStorage.setItem("targetClient", newButton.id)
                document.getElementById("input").disabled = false
                document.getElementById("send").disabled = false
            })
        }
    })
    if(!flag){
        window.localStorage.removeItem("targetClient")
        document.getElementById("input").disabled = true
        document.getElementById("send").disabled = true
    }
}
