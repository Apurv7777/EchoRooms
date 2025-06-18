import React, { createContext, useContext, useRef, useState } from "react";

const WS_URL = "wss://echorooms-backend.onrender.com";

type WSContextType = {
  ws: React.MutableRefObject<WebSocket | null>;
  roomId: string;
  setRoomId: (id: string) => void;
  joinRoom: (id: string, cb?: () => void) => void;
  disconnectRoom: () => void;
};

const WSContext = createContext<WSContextType | null>(null);

export const useWS = () => useContext(WSContext)!;

export const WSProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const ws = useRef<WebSocket | null>(null);
  const [roomId, setRoomId] = useState("");

  const joinRoom = (id: string, cb?: () => void) => {
    if (!ws.current || ws.current.readyState !== 1) {
      ws.current = new WebSocket(WS_URL);
      ws.current.onopen = () => {
        ws.current?.send(JSON.stringify({ type: "join", payload: { roomId: id } }));
        setRoomId(id);
        cb && cb();
      };
    } else {
      ws.current.send(JSON.stringify({ type: "join", payload: { roomId: id } }));
      setRoomId(id);
      cb && cb();
    }
  };

  const disconnectRoom = () => {
    if (ws.current) {
      ws.current.close();
      ws.current = null;
    }
    setRoomId("");
  };

  return (
    <WSContext.Provider value={{ ws, roomId, setRoomId, joinRoom, disconnectRoom }}>
      {children}
    </WSContext.Provider>
  );
};
