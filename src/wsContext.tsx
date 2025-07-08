import React, { createContext, useContext, useRef, useState } from "react";

const WS_URL = "wss://echorooms-backend.onrender.com";

type WSContextType = {
  ws: React.MutableRefObject<WebSocket | null>;
  roomId: string;
  setRoomId: (id: string) => void;
  joinRoom: (id: string, name: string, cb?: () => void) => void;
  disconnectRoom: () => void;
  userName: string;
  setUserName: (name: string) => void;
};

const WSContext = createContext<WSContextType | null>(null);

export const useWS = () => useContext(WSContext)!;

export const WSProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const ws = useRef<WebSocket | null>(null);
  
  // Initialize from localStorage
  const [roomId, setRoomIdState] = useState(() => {
    return localStorage.getItem('echoroom_roomId') || "";
  });
  const [userName, setUserNameState] = useState(() => {
    return localStorage.getItem('echoroom_userName') || "";
  });

  // Custom setters that also update localStorage
  const setRoomId = (id: string) => {
    setRoomIdState(id);
    if (id) {
      localStorage.setItem('echoroom_roomId', id);
    } else {
      localStorage.removeItem('echoroom_roomId');
    }
  };

  const setUserName = (name: string) => {
    setUserNameState(name);
    if (name) {
      localStorage.setItem('echoroom_userName', name);
    } else {
      localStorage.removeItem('echoroom_userName');
    }
  };

  // Auto-reconnect on component mount if we have stored room data
  React.useEffect(() => {
    const storedRoomId = localStorage.getItem('echoroom_roomId');
    const storedUserName = localStorage.getItem('echoroom_userName');
    
    console.log('Auto-reconnect check:', { storedRoomId, storedUserName });
    
    if (storedRoomId && storedUserName) {
      console.log('Auto-reconnecting to room:', storedRoomId, 'as:', storedUserName);
      joinRoom(storedRoomId, storedUserName);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Only run on mount

  const joinRoom = (id: string, name: string, cb?: () => void) => {
    console.log('Attempting to join room:', id, 'with name:', name);
    
    // Close existing connection if any
    if (ws.current && ws.current.readyState === 1) {
      ws.current.close();
    }
    
    // Create new connection
    ws.current = new WebSocket(WS_URL);
    ws.current.onopen = () => {
      console.log('WebSocket connected, sending join message');
      // Add a small delay to ensure connection is fully established
      setTimeout(() => {
        const joinMessage = { type: "join", payload: { roomId: id, name: name } };
        console.log('Sending join message:', joinMessage);
        ws.current?.send(JSON.stringify(joinMessage));
        
        // Request current user list after joining
        setTimeout(() => {
          if (ws.current && ws.current.readyState === WebSocket.OPEN) {
            ws.current.send(JSON.stringify({ type: "requestUsers" }));
          }
        }, 200);
        
        setRoomId(id);
        setUserName(name);
        cb && cb();
      }, 100);
    };
    ws.current.onerror = (error) => {
      console.error('WebSocket error:', error);
    };
    ws.current.onclose = (event) => {
      console.log('WebSocket closed:', event.code, event.reason);
      // Don't auto-reconnect, let user manually reconnect
    };
  };

  const disconnectRoom = () => {
    if (ws.current) {
      ws.current.close();
      ws.current = null;
    }
    setRoomId("");
    setUserName("");
    // Clear all localStorage data when disconnecting
    localStorage.removeItem('echoroom_messages');
    localStorage.removeItem('echoroom_roomId');
    localStorage.removeItem('echoroom_userName');
  };

  return (
    <WSContext.Provider value={{ ws, roomId, setRoomId, joinRoom, disconnectRoom, userName, setUserName }}>
      {children}
    </WSContext.Provider>
  );
};
