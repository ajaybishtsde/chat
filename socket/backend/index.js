const express = require("express");
const { Server } = require("socket.io");
const app = express();
const http = require("http");
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
  },
});
const dotenv = require("dotenv");
const port = process.env.PORT || "8080";
const { connectDB } = require("./dbConnect");
dotenv.config();
connectDB();
// Socket
let users = 0;
io.on("connection", (socket) => {
  console.log("User connected", socket.id);
  users++;
  socket.on("join_room", (room_id) => {
    console.log("Room Id : ", room_id);
    socket.join(room_id);
  });
  io.sockets.emit("broadcast", { message: users + " Users connected" });
  socket.on("send_message", (messageData) => {
    console.log(messageData);
    socket.to(messageData.room).emit("receive_message", messageData);
  });
  socket.on("disconnect", () => {
    console.log("user disconnected", socket.id);
    users--;
    io.sockets.emit("broadcast", { message: users + " Users connected" });
  });
});

app.get("/", (req, res) => {
  res.sendFile("homepage");
});

server.listen(port, () => {
  console.log("app listening at port http://localhost:" + port);
});
