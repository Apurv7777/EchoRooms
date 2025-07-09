import React, { useEffect, useRef, useState } from "react";
import { useWS } from "../context/WSContext";
import { useAppSelector, useAppDispatch } from "../store/hooks";
import { clearMessagesIfRoomEmpty } from "../store/wsSlice";
import closeIcon from '../icons/close.svg';

const ChatRoom: React.FC = () => {
  const { disconnectRoom, sendMessage } = useWS();
  const dispatch = useAppDispatch();
  const { 
    roomId, 
    userName, 
    messages, 
    connectedUsers, 
    currentUser, 
    isConnected, 
    isConnecting, 
    error 
  } = useAppSelector(state => state.ws);
  
  const [input, setInput] = useState("");
  const [showUsers, setShowUsers] = useState(false);
  const chatBoxRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (chatBoxRef.current) {
      chatBoxRef.current.scrollTop = chatBoxRef.current.scrollHeight;
    }
  }, [messages]);

  // Clear messages if user is alone in the room and then disconnects
  useEffect(() => {
    if (roomId && connectedUsers.length === 1 && connectedUsers[0] === currentUser) {
      // This user is alone in the room - messages will be cleared when they disconnect
      console.log('User is alone in room, messages will be cleared on disconnect');
    } else if (roomId && connectedUsers.length === 0) {
      // Room is empty, clear messages
      dispatch(clearMessagesIfRoomEmpty());
    }
  }, [connectedUsers, currentUser, roomId, dispatch]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim() && roomId && isConnected) {
      sendMessage(input);
      setInput("");
    }
  };

  return (
    <div className="bg-[#232323] rounded-2xl shadow-[0_0_24px_0_#00000044] py-2 px-10 w-full max-w-[400px] min-h-[300px] flex flex-col items-center justify-center mx-auto">
      <h1 className="text-white font-mono text-2xl font-bold mb-6 text-center">Chat Room</h1>
      
      {/* Connection Status */}
      {isConnecting && (
        <div className="text-yellow-500 mb-3 text-center">
          Connecting...
        </div>
      )}
      
      {error && (
        <div className="text-red-500 mb-3 text-center">
          {error}
        </div>
      )}
      
      {roomId ? (
        <div className="w-full mb-4">
          <div className="flex justify-center w-full mb-2">
            <div className="text-white mb-3">
              Connected to room: <b>{roomId}</b>
              {isConnected && <span className="text-green-500 ml-2">●</span>}
              {!isConnected && <span className="text-red-500 ml-2">●</span>}
            </div>
            <button
              className="mb-4 flex bg-transparent border-0 text-red-500 items-center gap-1"
              onClick={disconnectRoom}
              title="Disconnect"
            >
              <img src={closeIcon} alt="Disconnect" className="cursor-pointer w-[18px] h-[18px] m-1" />
            </button>
          </div>
          
          {/* Users Accordion */}
          <div className="w-full bg-[#1a1a1a] rounded-lg shadow-[0_0_8px_#00000044] relative z-50">
            <button
              onClick={() => setShowUsers(!showUsers)}
              className="w-full flex justify-between items-center p-3 text-white font-mono text-sm hover:bg-[#2a2a2a] transition-colors duration-200 rounded-lg relative z-50"
            >
              <span>Connected Users ({connectedUsers.length})</span>
              <span className={`transform transition-transform duration-200 ${showUsers ? 'rotate-180' : ''}`}>
                ▼
              </span>
            </button>
            
            {showUsers && (
              <>
                {/* Backdrop blur overlay - positioned behind the accordion button */}
                <div className="fixed inset-0 bg-black/20 backdrop-blur-sm z-30" onClick={() => setShowUsers(false)}></div>
                
                {/* Accordion content */}
                <div className="absolute top-full left-0 right-0 z-50 bg-[#1a1a1a] rounded-b-lg shadow-[0_8px_24px_#00000066] border-t border-[#333]">
                  <div className="px-3 pb-3 pt-2">
                    {connectedUsers.length > 0 ? (
                      <div className="space-y-1 max-h-32 overflow-y-auto">
                        {connectedUsers.map((user, index) => (
                          <div
                            key={index}
                            className="flex items-center p-2 rounded text-xs font-mono bg-[#2a2a2a] text-[#cccccc]"
                          >
                            <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                            {user}{user === currentUser ? " (You)" : ""}
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-[#888] text-xs font-mono p-2">
                        No users connected
                      </div>
                    )}
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      ) : (
        <div className="text-red-500 mb-3">
          Not connected to any room.
        </div>
      )}
      <div className="bg-[#0f0f0f] rounded-lg min-h-[240px] max-h-[240px] overflow-y-auto p-4 shadow-[0_0_8px_#00000044] w-full flex flex-col chat-scrollbar" ref={chatBoxRef}>
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`p-3 rounded-lg mb-3 shadow-[0_0_8px_#00000044] break-words font-mono max-w-[80%] ${
              msg.name === userName 
                ? "self-end bg-[#2d5016] text-white ml-auto mr-0 text-right" 
                : "self-start bg-[#1a1a1a] text-white mr-auto ml-0 text-left"
            }`}
          >
            <div className={`text-xs mb-1 font-bold ${msg.name === userName ? "text-[#90ee90]" : "text-[#cccccc]"}`}>
              {msg.name}
            </div>
            <div className="text-white">
              {msg.message}
            </div>
          </div>
        ))}
      </div>
      <form className="flex pb-1.5 gap-2 w-full mt-6" onSubmit={handleSendMessage}>
        <input
          type="text"
          className="flex-1 py-3 px-4 rounded-lg border-0 bg-[#181818] text-white text-base w-full outline-none shadow-[0_0_8px_#00000044] font-mono placeholder-gray-400"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type your message..."
          disabled={!roomId}
        />
        <button 
          type="submit" 
          className="bg-white text-[#181818] border-0 rounded-lg py-2 px-3 font-bold text-base w-auto cursor-pointer shadow-[0_0_16px_#00000044] transition-all duration-200 font-mono hover:bg-[#e0e0e0] hover:text-[#111]" 
          disabled={!roomId}
        >
          Send
        </button>
      </form>
    </div>
  );
};

export default ChatRoom;
