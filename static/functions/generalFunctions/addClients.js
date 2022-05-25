function addClients(clientList){
    let selfName = localStorage.getItem('UName')
    let sidebar = document.getElementById("participants")
    while(sidebar.lastChild !== null){
        sidebar.removeChild(sidebar.lastElementChild)
    }
    clientList.forEach((username) => {
        if(username !== selfName){
            //add new clients to the side bar
            //sidebar += '<button class="messageClient" onclick="test(this)">username</button>"'
            let newButton = document.createElement("button")
            newButton.className = "messageClient"
            newButton.id = username
            newButton.innerText = username
            sidebar.appendChild(newButton)
            newButton.addEventListener("click", () =>{
                let oldTarget = (window.localStorage.getItem("targetClient"))
                if(oldTarget !== null){
                    console.log(oldTarget)
                    document.getElementById(oldTarget).className ="messageClient"
                }
                newButton.className = "messageClientSelected"
                window.localStorage.setItem("targetClient", newButton.id)
            })
        }
    })
}
