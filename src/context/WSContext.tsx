import React, { createContext, useContext, useEffect, useRef } from 'react';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { setRoomId, setUserName, disconnect } from '../store/wsSlice';
import { WebSocketService } from '../services/WebSocketService';
import { store } from '../store/store';

interface WSContextType {
  joinRoom: (roomId: string, userName: string) => Promise<void>;
  disconnectRoom: () => void;
  sendMessage: (message: string) => void;
  translateMessage: (messageId: string, text: string, targetLanguage: string) => void;
  wsService: WebSocketService | null;
}

const WSContext = createContext<WSContextType | null>(null);

export const useWS = () => {
  const context = useContext(WSContext);
  if (!context) {
    throw new Error('useWS must be used within WSProvider');
  }
  return context;
};

export const WSProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const dispatch = useAppDispatch();
  const { userName } = useAppSelector(state => state.ws);
  const wsServiceRef = useRef<WebSocketService | null>(null);

  // Initialize WebSocket service
  useEffect(() => {
    wsServiceRef.current = new WebSocketService(dispatch, () => store.getState());
  }, [dispatch]);

  // Auto-reconnect effect - REMOVED for multi-user support
  useEffect(() => {
    // Intentionally empty logic to prevent session persistence
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (wsServiceRef.current) {
        wsServiceRef.current.disconnect();
      }
    };
  }, []);

  const joinRoom = async (roomId: string, userName: string): Promise<void> => {
    if (!wsServiceRef.current) return;

    try {
      dispatch(setRoomId(roomId));
      dispatch(setUserName(userName));
      await wsServiceRef.current.connect(roomId, userName);
    } catch (error) {
      console.error('Failed to join room:', error);
      throw error;
    }
  };

  const disconnectRoom = () => {
    if (wsServiceRef.current) {
      wsServiceRef.current.disconnect();
    }
    dispatch(disconnect());
  };

  const sendMessage = (message: string) => {
    if (wsServiceRef.current && userName) {
      wsServiceRef.current.sendChatMessage(message, userName);
    }
  };

  const translateMessage = (messageId: string, text: string, targetLanguage: string) => {
    if (wsServiceRef.current) {
      wsServiceRef.current.translateMessage(messageId, text, targetLanguage);
    }
  };

  const contextValue: WSContextType = {
    joinRoom,
    disconnectRoom,
    sendMessage,
    translateMessage,
    wsService: wsServiceRef.current,
  };

  return (
    <WSContext.Provider value={contextValue}>
      {children}
    </WSContext.Provider>
  );
};
