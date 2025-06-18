import React, { useEffect, useState } from "react";
import { useWS } from "../wsContext";

const ChatRoom: React.FC = () => {
  const { ws, roomId, disconnectRoom } = useWS();
  const [messages, setMessages] = useState<string[]>([]);
  const [input, setInput] = useState("");

  useEffect(() => {
    if (!ws.current) return;
    ws.current.onmessage = (event) => {
      setMessages((prev) => [...prev, event.data]);
    };
    // If not connected, try to reconnect
    if (ws.current.readyState !== 1 && roomId) {
      ws.current = new WebSocket("ws://localhost:8080");
      ws.current.onopen = () => {
        ws.current?.send(JSON.stringify({ type: "join", payload: { roomId } }));
      };
      ws.current.onmessage = (event) => {
        setMessages((prev) => [...prev, event.data]);
      };
    }
    // eslint-disable-next-line
  }, [roomId]);

  const sendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (ws.current && input.trim() && roomId) {
      ws.current.send(
        JSON.stringify({ type: "chat", payload: { message: input } })
      );
      setInput("");
    }
  };

  return (
    <div className="page-container">
      <h2>Chat Room</h2>
      {roomId ? (
        <>
          <div style={{ color: "#fff",   marginBottom: 12 }}>
            Connected to room: <b>{roomId}</b>
          </div>
          <button
            className="btn-neon"
            style={{ marginBottom: 16, color:'red' }}
            onClick={disconnectRoom}
          >
            Disconnect
          </button>
        </>
      ) : (
        <div style={{ color: "red", marginBottom: 12 }}>
          Not connected to any room.
        </div>
      )}
      <div className="chat-box">
        {messages.map((msg, idx) => (
          <div key={idx} className="chat-message">
            {msg}
          </div>
        ))}
      </div>
      <form className="form chat-form" onSubmit={sendMessage}>
        <input
          type="text"
          className="input"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type your message..."
          disabled={!roomId}
        />
        <button type="submit" className="btn-neon" disabled={!roomId}>
          Send
        </button>
      </form>
    </div>
  );
};

export default ChatRoom;
