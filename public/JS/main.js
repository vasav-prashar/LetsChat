const chatform=document.getElementById('chat-form');
const chatmessages=document.querySelector('.chat-messages');
const roomName=document.getElementById('room-name');
const userList=document.getElementById('users')

// get username and room from url
const {username,room}=Qs.parse(location.search,{
    ignoreQueryPrefix: true
})
const socket=io();
// join chat room
socket.emit('joinroom',{username,room})

// message from server
socket.on('message',message=>{
    console.log(message);
    outputmessage(message)
    // scroll down
    chatmessages.scrollTop=chatmessages.scrollHeight
})
//get room and users
socket.on('roomUsers',({room,users})=>{
    roomoutput(room);
    outputusers(users);
})
//message submit
chatform.addEventListener('submit',(e)=>{
    e.preventDefault()
    // get message text
    const msg=e.target.elements.msg.value;
    // Emit message to server
    socket.emit('chatMessage',msg);
    //clear input
    e.target.elements.msg.value='';
    e.target.elements.msg.focus();
})

//output message to dom
function outputmessage(message){
    const div=document.createElement('div');
    div.classList.add("message")
    div.innerHTML=`<p class="meta">${message.username} <span>${message.time}</span></p>
    <p class="text">
        ${message.text}
    </p>`;
    document.querySelector('.chat-messages').appendChild(div);
}
//add room name to dom
function roomoutput(room){
    roomName.innerText=room;
}
//add users to dom
function outputusers(users){
    userList.innerHTML='';
    users.forEach((user) => {
        const li=document.createElement('li');
        li.innerText=user.username;
        userList.appendChild(li);
    });
}
document.getElementById('leave-btn').addEventListener('click',()=>{
    const leaveRoom=confirm('Are you sure ');
    if(leaveRoom){
        window.location='../index.html';
    }
    else{
        
    }
})