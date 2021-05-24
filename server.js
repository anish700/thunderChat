const express = require("express");
const app = express();
const path = require("path");
const http = require("http");
const socketio = require("socket.io");
const formatMessage = require("./utils/messages");
const {
  joinUser,
  getCurrentUser,
  userLeaves,
  getRoomUsers,
} = require("./utils/users");

const server = http.createServer(app);
const io = socketio(server);

// set static folder
app.use(express.static(path.join(__dirname, "public")));

const botName = "Lightning Bot";

//run when a client connects
io.on("connection", (socket) => {
  socket.on("joinRoom", ({ username, room }) => {
    const user = joinUser(socket.id, username, room);

    socket.join(user.room);

    //welcome current user
    socket.emit("message", formatMessage(botName, " welcome to ThunderChat")); //emit only to single client connecting

    //broadcast when a user connects
    // (socket.broadcast = emit to everyone except client connecting)
    socket.broadcast
      .to(user.room)
      .emit(
        "message",
        formatMessage(botName, ` ${user.username} has joined the chat`)
      );

    //SEND USERS AND ROOM INFO
    io.to(user.room).emit("roomUsers", {
      room: user.room,
      users: getRoomUsers(user.room),
    });
  });

  //listen for chat msg
  socket.on("chatMessage", (msg) => {
    const user = getCurrentUser(socket.id);

    io.to(user.room).emit("message", formatMessage(user.username, msg)); //to everyone
  });

  //runs when a client disconnects
  socket.on("disconnect", () => {
    const user_leaving = userLeaves(socket.id);

    if (user_leaving) {
      io.to(user_leaving.room).emit(
        "message",
        formatMessage(botName, `${user_leaving.username} has left the chat`)
      ); //io.emit : emit to all: ;

      //SEND USERS AND ROOM INFO
      io.to(user_leaving.room).emit("roomUsers", {
        room: user_leaving.room,
        users: getRoomUsers(user_leaving.room),
      });
    }
  });
});

const PORT = 8000 || process.env.PORT;
server.listen(PORT, () => {
  console.log(`server running on port : ${PORT}`);
});
