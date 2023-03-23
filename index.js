const express = require("express");
const app = express();

var cors = require("cors");
app.use(cors());
const io = require("socket.io")(process.env.PORT, { cors: { origin: "*" } });
const users = {};

io.on("connection", (socket) => {
  socket.on("new-user-joined", (name) => {
    console.log("new user", name);
    users[socket.id] = name;
    socket.broadcast.emit("user-joined", name);
  });

  socket.on("send", (message) => {
    socket.broadcast.emit("receive", {
      message: message,
      name: users[socket.id],
    });
    socket.on("disconnect", (message) => {
      socket.broadcast.emit("left", users[socket.id]);
      delete users[socket.id];
    });
  });
});
