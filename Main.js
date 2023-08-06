// index.mjs
import express from "express";
import http from "http";
import { Server as SocketIOServer } from "socket.io";
import Db from "./Database.js";

const app = express();
const server = http.createServer(app);

app.get("/", (req, res) => {
  res.status(200).json({ Name: "hello World" });
});

const io = new SocketIOServer(server, {
  cors: {
    origin: "http://localhost:3000",
  },
});

const room = "room";

io.on("connect", (socket) => {
  socket.on("user-landed", (id) => {
    console.log("User has Landed", socket.id, id);
  });

  socket.on("peer-user", (peerid) => {
    Db.setItem(socket.id, { peerid });
    io.emit("active-users", Db.getAll());
    console.log("DATABASE USERS", Db.getAll());
  });

  socket.on("disconnect", () => {
    Db.removeBySocketId(socket.id);
    console.log("Current Users", Db.getAll());
    io.emit("active-users", Db.getAll());
  });
});

// Start the server
const port = process.env.PORT || 5000;
server.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
