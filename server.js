const express=require("express");
const path=require("path");
const http=require("http");
const socketio=require('socket.io')
const formatmessage=require('./utils/messages')
const {userjoin,getcurrentuser,userleave,getroomusers}=require('./utils/users')

const app=express();
const server=http.createServer(app)
const io=socketio(server)

//set static folder
app.use(express.static(path.join(__dirname,'public')))

const botname="chatBot";

//run when a client connects
io.on('connection',socket=>{

    socket.on('joinroom',({username,room})=>{
        const user=userjoin(socket.id,username,room)
        socket.join(user.room)

         // welcome new user
    socket.emit('message',formatmessage(botname,'Welcome To LetsTalk'))
    // broadcast when a user connects
    socket.broadcast.to(user.room).emit("message",formatmessage(botname,`${user.username} has join the chat`));

      // send users and room info
      io.to(user.room).emit('roomUsers',{
        room: user.room,
        users: getroomusers(user.room)
    })
    })
  
   
    // listen for chat message
    socket.on('chatMessage',msg=>{
        const user=getcurrentuser(socket.id)
        io.to(user.room).emit('message',formatmessage(user.username,msg))
        console.log(msg)
    })

    // runs when client disconnects
    socket.on('disconnect', () => {
        const user = userleave(socket.id);
    
        if (user) {
          io.to(user.room).emit('message',
            formatmessage(botname,`${user.username} has left the chat`)
          );
    
          // Send users and room info
          io.to(user.room).emit('roomUsers', {
            room: user.room,
            users: getroomusers(user.room)
          });
        }
      });
    });

const PORT=3000||process.env.PORT;
server.listen(PORT,()=>console.log(`Server running on port ${PORT}`));
