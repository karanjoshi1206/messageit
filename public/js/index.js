const chatform = document.getElementById("chat-form")
const chatMessages = document.getElementById("message-container")
const roomName = document.getElementById("room");
const userList = document.getElementById("user")
// Get USERNAME and ROOM from URL
const { username, room } = Qs.parse(location.search, {
    ignoreQueryPrefix: true
})


const socket = io();
//Join chat room
socket.emit("joinRoom", { username, room })

//Get room and users

socket.on("roomUsers", ({ room, users }) => {
    outputuserroom(room)
    outputuser(users)
})


//message from server
socket.on("message", message => {
    console.log(message);
    outputMessage(message)

    //scrolldown
    chatMessages.scrollTop = chatMessages.scrollHeight
})

//output message to DOM

function outputMessage(message) {
    const div = document.createElement("li")
    div.classList.add("message")
    div.innerHTML = `<span class="username" id="username">${message.username}</span>
    <span class="time" id="time"></span>

    <p> ${message.text}</p>`
    document.getElementById("message-container").appendChild(div)

}

//Add room name to DOM
function outputuserroom(room) {
    roomName.innerText = room
}
function outputuser(users) {
    userList.innerHTML = `${users.map(user => `<li>${user.username}</li>`).join()}`;
}

//message submit
chatform.addEventListener("submit", e => {

    e.preventDefault();
    let msg = document.getElementById("messagesent").value;

    //emitting the message to the server
    socket.emit("chatMessage", msg)

    //clear the form after submit
    chatform.reset()
})

function show() {
    let people = document.getElementById("people");
    people.classList.toggle("toggle");
}

