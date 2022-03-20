const socket = io();

const welcome = document.getElementById("welcome");
const form = welcome.querySelector("form");
const room = document.getElementById("room");

room.hidden = true;

let roomName;

function addMessage(message){
    const ul = room.querySelector("ul");
    const li = document.createElement("li");
    li.innerText = message;
    ul.appendChild(li);
};

function handleMessageSubmit(event){
    event.preventDefault();
    const input = room.querySelector("#msg input");
    socket.emit("new_message", input.value, roomName, () => {
        addMessage(`You: ${input.value}`);
        input.value = "";
    });
}

function showRoom(){
    welcome.hidden = true;
    room.hidden = false;
    const h3 = room.querySelector("h3");
    h3.innerText = `Room ${roomName}`;
    const msgForm = room.querySelector("#msg"); 
    msgForm.addEventListener("submit", handleMessageSubmit);
}

function handleRoomSubmit(event){
    event.preventDefault();
    const roomForm = welcome.querySelector("#roomName");
    const nameForm = welcome.querySelector("#name"); 
    socket.emit("nickname", nameForm.value);
    socket.emit("enter_room", roomForm.value, showRoom); 
    roomName = roomForm.value;
}

form.addEventListener("submit", handleRoomSubmit);

socket.on("welcome", (user) => { 
    addMessage(`${user} Joined!`); 
});
socket.on("bye", (left) => { 
    addMessage(`${left} left..`); 
});
socket.on("new_message", addMessage); 