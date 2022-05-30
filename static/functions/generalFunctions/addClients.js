function addClients(clientList){
    let selfName = localStorage.getItem('UName')
    let sidebar = document.getElementById("participants")
    while(sidebar.lastChild !== null){
        sidebar.removeChild(sidebar.lastElementChild)
    }
    clientList.forEach((username) => {
        if(username !== selfName && username !== ""){
            let newButton = document.createElement("button")
            if(username === window.localStorage.getItem("targetClient")){
                newButton.className = "messageClientSelected"
            }
            else{
                newButton.className = "messageClient"
            }
            newButton.id = username
            newButton.innerText = username
            sidebar.appendChild(newButton)
            newButton.addEventListener("click", () =>{
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
            })
        }
    })
}
