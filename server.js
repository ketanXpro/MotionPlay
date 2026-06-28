const express = require("express");
const http = require("http");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(express.static("public"));
app.use("/controller", express.static("controller"));

io.on("connection", (socket) => {
  console.log("CONNECTED:", socket.id);

  socket.onAny((event, ...args) => {
    console.log("EVENT:", event, args);
  });

  socket.on("controller-connected", () => {
    io.emit("controller-connected");
  });

  socket.on("motion", (data) => {
    console.log("SERVER RECEIVED:", data);
    io.emit("motion", data);
  });

  socket.on("disconnect", () => {
    io.emit("controller-disconnected");
  });

  socket.on("slash", (data) => {
    io.emit("slash", data);
  });
});

const PORT = 3000;

server.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
