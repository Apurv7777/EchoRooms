import React, { useState } from "react";
import { useWS } from "../wsContext";
import { useNavigate } from "react-router-dom";

const CreateRoom: React.FC = () => {
  const [roomIdInput, setRoomIdInput] = useState("");
  const [nameInput, setNameInput] = useState("");
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
    if (!nameInput.trim()) {
      setError("Name is required");
      return;
    }
    joinRoom(roomIdInput, nameInput, () => navigate("/chat"));
  };

  return (
    <div className="page-container single-page">
      <h2>Create Room</h2>
      <form className="form" style={{display:'flex',alignItems:'center',flexDirection:'column'}} onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Your Name"
          className="input"
          value={nameInput}
          onChange={e => setNameInput(e.target.value)}
        />
        <input
          type="text"
          placeholder="Room Name"
          className="input"
          value={roomIdInput}
          onChange={e => setRoomIdInput(e.target.value)}
        />
        <button type="submit" className="btn-neon">Create</button>
      </form>
      {error && <div style={{ color: 'red', marginTop: 12 }}>{error}</div>}
    </div>
  );
};

export default CreateRoom;
