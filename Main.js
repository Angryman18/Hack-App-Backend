// index.mjs
import express from "express";
import http from "http";
import { Server as SocketIOServer } from "socket.io";
import Db from "./Database.js";
import { STATUS, EVENTS } from "./const.js";

const app = express();
const server = http.createServer(app);

app.get("/", (req, res) => {
  res.status(200).json({ Name: "hello World" });
});

const io = new SocketIOServer(server, {
  cors: {
    origin: ["http://localhost:3000", "https://experimental-chat-app.netlify.app", "https://chat.engine-app.com"],
  },
});

const room = "room";

io.on("connect", (socket) => {
  socket.on("user-landed", (id) => {
    console.log("User has Landed", socket.id, id);
  });

  socket.on("peer-user", (peerid) => {
    Db.setItem(socket.id, { peerid, status: STATUS.IDLE });
    socket.emit("active-users", Db.getAll());
    socket.broadcast.emit("user-join", { [socket.id]: { peerid, status: STATUS.IDLE } });
    console.log("DATABASE USERS", Db.getAll());
  });

  socket.on(EVENTS.CALLING_USER, (callObject) => {
    io.to(callObject.socketid).emit(EVENTS.INCOMING_CALL, callObject);
  });

  socket.on(EVENTS.CALL_ANSWERED, (callObject) => {
    // console.log("Call Object is ", callObject);
    // callObject.socketid // who is receiving the call
    // callObject.caller // who is calling
    try {

      const { caller = "", socketid = "" } = callObject ?? {};
      if (!caller || !socketid) return;
      const callerObject = Db.updateStatus(caller, socketid, true, "in call");
      io.emit(EVENTS.UPDATE_USER_STATUS, callerObject);
    } catch(err) {
      console.log("error", err)
    }
  });

  socket.on(EVENTS.CALL_DISCONNECT, (object) => {
    try {
      const { callId, socketId } = object;
      const notifyuser = Db.findToBeNotifiedUser(socketId, callId);
      if (!callId || !socketId) return;
      const { socketIds = [] } = Db.getByCallId(callId);
      if (!socketIds.length) return;
      socketIds.push(false);
      socketIds.push("idle");
      const callerObject = Db.updateStatus(...socketIds);
      io.emit(EVENTS.UPDATE_USER_STATUS, callerObject);
      Db.resetCallDatabase(callId);
      io.to(notifyuser).emit(EVENTS.USER_LEFT);
    } catch (err) {
      console.log("Error Happended", err);
    }
  });

  socket.on(EVENTS.CALL_REJECTED, (socketId) => {
    io.to(socketId).emit(EVENTS.CALL_REJECTED);
  });

  socket.on("disconnect", () => {
    try {

      Db.removeBySocketId(socket.id);
      console.log("Current Users", Db.getAll());
      socket.broadcast.emit("user-exit", socket.id);
    } catch(err) {
      console.log("Error Happended", err);
    }
  });
});

// Start the server
const port = process.env.PORT || 5000;
server.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
