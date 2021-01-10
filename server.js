const express = require("express")
const http = require("http")
const path = require("path")
const port = 3000 || process.env.port;
const socketio = require("socket.io")
const formatMessage = require("./utils/messages")
const { userJoin, getCurrentUser, userLeave, getRoomUsers } = require("./utils/users")
const app = express();
const server = http.createServer(app)
const io = socketio(server)


//set static folder
app.use(express.static(path.join(__dirname, 'public')))

const Admin = 'Admin'
//run when client connect
io.on("connection", socket => {
    socket.on("joinRoom", ({ username, room }) => {

        const user = userJoin(socket.id, username, room)
        socket.join(user.room);

        //socket.emit will emit the message to the user joined the server
        socket.emit("message", formatMessage(Admin, "welcome to chat app"))


        //broadcast when a user connect(broadcast.emit will emit the message to everyone except the person who is connecting) 
        socket.broadcast.to(user.room).emit("message", formatMessage(Admin, `${user.username} has joined the chat`));

        //send user and room info
        io.to(user.room).emit("roomUsers", {
            room: user.room,
            users: getRoomUsers(user.room)
        })

    })


    //listen for chat message
    socket.on("chatMessage", msg => {

        const user = getCurrentUser(socket.id);
        io.to(user.room).emit("message", formatMessage(user.username, msg))
    })

    socket.on("disconnect", () => {
        //io.emit will emit to each user connected with the server
        const user = userLeave(socket.id)
        if (user) {
            io.to(user.room).emit("message", formatMessage(Admin, `${user.username} has left the chat`))

        }
        io.to(user.room).emit("roomUsers", {
            room: user.room,
            users: getRoomUsers(user.room)
        })
    })

})




server.listen(port, () => {
    console.log("app is runninng")
})