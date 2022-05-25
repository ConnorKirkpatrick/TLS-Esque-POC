function addClients(clientList){
    let selfName = localStorage.getItem('UName')
    let sidebar = document.getElementById("participants")
    console.log(clientList)
    console.log(sidebar)
    clientList.forEach((username) => {
        console.log(username)
        if(username !== selfName){
            //add new clients to the side bar
            //sidebar += '<button class="messageClient" onclick="test(this)">username</button>"'
            let newButton = document.createElement("button")
            newButton.className = "messageClient"
            newButton.onclick = "participantOnClick(this)"
            newButton.innerText = username
            console.log(newButton)
            sidebar.appendChild(newButton)
        }
    })
}
