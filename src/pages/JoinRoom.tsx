import React, { useState } from "react";
import { useWS } from "../wsContext";
import { useNavigate } from "react-router-dom";

const JoinRoom: React.FC = () => {
  const [roomIdInput, setRoomIdInput] = useState("");
  const [error, setError] = useState("");
  const { joinRoom } = useWS();
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!roomIdInput.trim()) {
      setError("Room name is required");
      return;
    }
    joinRoom(roomIdInput, () => navigate("/chat"));
  };

  return (
    <div className="page-container">
      <h2>Join Room</h2>
      <form className="form" onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Room Name"
          className="input"
          value={roomIdInput}
          onChange={e => setRoomIdInput(e.target.value)}
        />
        <button type="submit" className="btn-neon">Join</button>
      </form>
      {error && <div style={{ color: 'red', marginTop: 12 }}>{error}</div>}
    </div>
  );
};

export default JoinRoom;
