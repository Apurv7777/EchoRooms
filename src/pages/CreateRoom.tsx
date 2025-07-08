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
    <div className="bg-[#232323] rounded-2xl shadow-[0_0_24px_0_#00000044] py-2 px-10 w-full max-w-[400px] min-h-[300px] flex flex-col items-center justify-center mx-auto">
      <h2 className="text-white font-mono text-2xl font-bold mb-6 text-center">Create Room</h2>
      <form className="flex flex-col items-center gap-4 mt-6 w-full" onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Your Name"
          className="py-3 px-4 rounded-lg border-0 bg-[#181818] text-white text-base w-full outline-none shadow-[0_0_8px_#00000044] font-mono placeholder-gray-400"
          value={nameInput}
          onChange={e => setNameInput(e.target.value)}
        />
        <input
          type="text"
          placeholder="Room Name"
          className="py-3 px-4 rounded-lg border-0 bg-[#181818] text-white text-base w-full outline-none shadow-[0_0_8px_#00000044] font-mono placeholder-gray-400"
          value={roomIdInput}
          onChange={e => setRoomIdInput(e.target.value)}
        />
        <button 
          type="submit" 
          className="bg-white text-[#181818] border-0 rounded-lg py-2 px-3 font-bold text-base w-full cursor-pointer shadow-[0_0_16px_#00000044] transition-all duration-200 font-mono hover:bg-[#e0e0e0] hover:text-[#111]"
        >
          Create
        </button>
      </form>
      {error && <div className="text-red-500 mt-3 text-center">{error}</div>}
    </div>
  );
};

export default CreateRoom;
