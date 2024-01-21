"use-client";
import React, { useEffect, useState } from "react";
import ScrollToBottom from "react-scroll-to-bottom";
import { X } from "lucide-react";
import { useRouter } from "next/navigation";
const Chat = ({
  socket,
  user,
  room,
}: {
  socket: any;
  user: string;
  room: string;
}) => {
  const [currentMessage, setCurrentMessage] = useState<string>("");
  const [messageList, setMessageList] = useState<any>([]);
  const router = useRouter();
  const sendMessage = async () => {
    if (currentMessage) {
      const messageData = {
        user,
        room,
        message: currentMessage,
        date: `${new Date(Date.now()).getHours()}:${new Date(
          Date.now()
        ).getMinutes()}`,
      };
      await socket.emit("send_message", messageData);
      setMessageList((item: any) => [...item, messageData]);
    }
  };

  useEffect(() => {
    socket.on(
      "receive_message",
      (data: { user: string; room: string; message: string; date: string }) =>
        setMessageList([...messageList, data])
    );
  }, [socket, messageList]);

  return (
    <div
      className=""
      style={{
        height: "100vh",
        width: "100%",
        display: "flex",
        justifyContent: "center",
      }}
    >
      <div className="chat-window" style={{ marginTop: "3px" }}>
        <div
          className="chat-header"
          style={{
            display: "flex",
            justifyContent: "space-between",
            padding: "0px 2px",
          }}
        >
          <div>
            <p style={{ textAlign: "center" }}>Chit Chat</p>
          </div>
          <div style={{ paddingTop: "5px" }}>
            <X
              onClick={() => {
                router.push("/users");
              }}
            />
          </div>
        </div>
        <div className="chat-body">
          <ScrollToBottom className="message-container">
            {messageList.map((messageContent: any, i: number) => (
              <div
                key={i}
                className="message"
                id={user === messageContent.user ? "you" : "other"}
              >
                <div>
                  <div className="message-content">
                    <p>{messageContent.message}</p>
                  </div>
                  <div className="message-meta">
                    <p id="time">{messageContent.date}</p>
                    <p id="author">
                      {user === messageContent.user
                        ? "you"
                        : messageContent.user}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </ScrollToBottom>
        </div>
        <div className="chat-footer">
          <input
            type="text"
            value={currentMessage}
            placeholder="Hey..."
            onChange={(event) => {
              setCurrentMessage(event.target.value);
            }}
            onKeyPress={(event) => {
              event.key === "Enter" && sendMessage();
            }}
          />
          <button onClick={sendMessage}>&#9658;</button>
        </div>
      </div>
    </div>
  );
};

export default Chat;
