import React, { useState } from "react";
import { useWS } from "../context/WSContext";
import { useNavigate } from "react-router-dom";

const CreateRoom: React.FC = () => {
  const [roomIdInput, setRoomIdInput] = useState("");
  const [nameInput, setNameInput] = useState("");
  const [error, setError] = useState("");
  const { joinRoom } = useWS();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
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
    
    try {
      await joinRoom(roomIdInput, nameInput);
      navigate("/chat");
    } catch (error) {
      setError("Failed to create room. Please try again.");
    }
  };

  return (
    <div className="bg-[#232323] rounded-2xl shadow-[0_0_24px_0_#00000044] py-4 px-4 sm:px-6 w-full max-w-[95vw] sm:max-w-[600px] min-h-[300px] flex flex-col items-center justify-center mx-auto">
      <h2 className="text-white font-mono text-xl sm:text-2xl font-bold mb-4 sm:mb-6 text-center">Create Room</h2>
      <form className="flex flex-col items-center gap-3 sm:gap-4 mt-4 sm:mt-6 w-full" onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Your Name"
          className="py-2 sm:py-3 px-3 sm:px-4 rounded-lg border-0 bg-[#181818] text-white text-sm sm:text-base w-full outline-none shadow-[0_0_8px_#00000044] font-mono placeholder-gray-400"
          value={nameInput}
          onChange={e => setNameInput(e.target.value)}
        />
        <input
          type="text"
          placeholder="Room Name"
          className="py-2 sm:py-3 px-3 sm:px-4 rounded-lg border-0 bg-[#181818] text-white text-sm sm:text-base w-full outline-none shadow-[0_0_8px_#00000044] font-mono placeholder-gray-400"
          value={roomIdInput}
          onChange={e => setRoomIdInput(e.target.value)}
        />
        <button 
          type="submit" 
          className="bg-white text-[#181818] border-0 rounded-lg py-2 sm:py-2 px-3 font-bold text-sm sm:text-base w-full cursor-pointer shadow-[0_0_16px_#00000044] transition-all duration-200 font-mono hover:bg-[#e0e0e0] hover:text-[#111]"
        >
          Create
        </button>
      </form>
      {error && <div className="text-red-500 mt-2 sm:mt-3 text-center text-sm">{error}</div>}
    </div>
  );
};

export default CreateRoom;
