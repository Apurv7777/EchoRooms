import React, { useEffect, useRef, useState } from "react";
import { useWS } from "../wsContext";
import closeIcon from '../icons/close.svg';

interface ChatMessage {
  name: string;
  message: string;
}

const ChatRoom: React.FC = () => {
  const { ws, roomId, disconnectRoom, userName } = useWS();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const chatBoxRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ws.current) return;
    ws.current.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        if (data && data.name && data.message) {
          setMessages((prev) => [...prev, { name: data.name, message: data.message }]);
        }
      } catch {
        // fallback for plain string messages
        setMessages((prev) => [...prev, { name: "Unknown", message: event.data }]);
      }
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

  useEffect(() => {
    if (chatBoxRef.current) {
      chatBoxRef.current.scrollTop = chatBoxRef.current.scrollHeight;
    }
  }, [messages]);

  const sendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (ws.current && input.trim() && roomId) {
      ws.current.send(
        JSON.stringify({ type: "chat", payload: { message: input, name: userName } })
      );
      setInput("");
    }
  };

  return (
    <div className="page-container">
      <h2>Chat Room</h2>
      {roomId ? (
        <div style={{display:'flex', justifyContent:'center', width:"100%"}}>
          <div style={{ color: "#fff",   marginBottom: 12 }}>
            Connected to room: <b>{roomId}</b>
          </div>
          <button
            className="close-icon"
            style={{ marginBottom: 16, display: 'flex', backgroundColor:'transparent', border:"0", color:'red', alignItems: 'center', gap: 4 }}
            onClick={disconnectRoom}
            title="Disconnect"
          >
            <img src={closeIcon} alt="Disconnect" style={{ cursor:'pointer', width: 18, height: 18, marginRight: 4 }} />
          </button>
        </div>
      ) : (
        <div style={{ color: "red", marginBottom: 12 }}>
          Not connected to any room.
        </div>
      )}
      <div className="chat-box" ref={chatBoxRef}>
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className="chat-message"
            style={{
              alignSelf: msg.name === userName ? "flex-end" : "flex-start",
              background: msg.name === userName ? "#dcf8c6" : "#232323",
              color: msg.name === userName ? "#222" : "#fff",
              marginLeft: msg.name === userName ? "auto" : 0,
              marginRight: msg.name === userName ? 0 : "auto",
              textAlign: msg.name === userName ? "right" : "left",
              maxWidth: "80%"
            }}
          >
            <div style={{ fontSize: 12, color: msg.name === userName ? "#888" : "#aaa", marginBottom: 2 }}>
              {msg.name}
            </div>
            {msg.message}
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
