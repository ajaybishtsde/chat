"use client";
import "./global.css";
import { useState } from "react";
import { io } from "socket.io-client";
import Chat from "./components/chat";
export const socket = io("http://localhost:8080");
export default function App() {
  const [user, setUser] = useState("");
  const [room, setRoom] = useState("");
  const [showChat, setShowChat] = useState(false);
  // for jouining room
  const joinRoom = () => {
    if (!user && !room) {
      alert("User and Room cannot be empty");
    } else {
      socket.emit("join_room", room);
      setShowChat(true);
    }
  };
  socket.on("broadcast", (message) => {
    console.log(message);
  });
  return (
    <>
      {!showChat ? (
        <div>
          <h2>Lets Talk</h2>
          <input
            type="text"
            name=""
            id=""
            placeholder="Name..."
            onChange={(e) => {
              setUser(e.target.value);
            }}
          />
          <br />
          <input
            type="text"
            name=""
            placeholder="Room Id..."
            onChange={(e) => {
              setRoom(e.target.value);
            }}
          />
          <br />
          <button onClick={joinRoom}>Create Room</button>
        </div>
      ) : (
        <div>
          <Chat socket={socket} user={user} room={room} />
        </div>
      )}
    </>
  );
}
