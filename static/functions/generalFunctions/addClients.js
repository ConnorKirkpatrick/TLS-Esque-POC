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
            newButton.onclick = "participantOnClick(this)"
            newButton.innerText = username
            sidebar.appendChild(newButton)
        }
    })
}
