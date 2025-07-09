import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface ChatMessage {
  name: string;
  message: string;
  id?: string;
  timestamp?: number;
  originalMessage?: string;
  translatedMessage?: string;
  detectedLanguage?: string;
  isTranslated?: boolean;
}

export interface WSState {
  roomId: string;
  userName: string;
  isConnected: boolean;
  isConnecting: boolean;
  connectedUsers: string[];
  currentUser: string;
  messages: ChatMessage[];
  error: string | null;
  preferredLanguage: string | null;
  autoTranslate: boolean;
}

const getStorageKey = (baseKey: string, userName?: string) => {
  return userName ? `${baseKey}_${userName}` : baseKey;
};

const getUserSpecificStorage = (baseKey: string, userName?: string, defaultValue?: string) => {
  if (!userName) return defaultValue || null;
  return localStorage.getItem(getStorageKey(baseKey, userName)) || defaultValue || null;
};

const setUserSpecificStorage = (baseKey: string, userName: string, value: string | null) => {
  if (value) {
    localStorage.setItem(getStorageKey(baseKey, userName), value);
  } else {
    localStorage.removeItem(getStorageKey(baseKey, userName));
  }
};

const initialState: WSState = {
  roomId: localStorage.getItem('echoroom_roomId') || '',
  userName: localStorage.getItem('echoroom_userName') || '',
  isConnected: false,
  isConnecting: false,
  connectedUsers: [],
  currentUser: '',
  messages: JSON.parse(localStorage.getItem('echoroom_messages') || '[]'),
  error: null,
  preferredLanguage: null, // Will be loaded when userName is set
  autoTranslate: false, // Will be loaded when userName is set
};

const wsSlice = createSlice({
  name: 'ws',
  initialState,
  reducers: {
    setRoomId: (state, action: PayloadAction<string>) => {
      state.roomId = action.payload;
      if (action.payload) {
        localStorage.setItem('echoroom_roomId', action.payload);
      } else {
        localStorage.removeItem('echoroom_roomId');
      }
    },
    
    setUserName: (state, action: PayloadAction<string>) => {
      state.userName = action.payload;
      if (action.payload) {
        localStorage.setItem('echoroom_userName', action.payload);
        
        // Load user-specific translation preferences
        state.preferredLanguage = getUserSpecificStorage('echoroom_preferredLanguage', action.payload);
        const autoTranslateStr = getUserSpecificStorage('echoroom_autoTranslate', action.payload, 'false') || 'false';
        state.autoTranslate = JSON.parse(autoTranslateStr);
      } else {
        localStorage.removeItem('echoroom_userName');
        state.preferredLanguage = null;
        state.autoTranslate = false;
      }
    },
    
    setConnecting: (state, action: PayloadAction<boolean>) => {
      state.isConnecting = action.payload;
      if (action.payload) {
        state.error = null;
      }
    },
    
    setConnected: (state, action: PayloadAction<boolean>) => {
      state.isConnected = action.payload;
      state.isConnecting = false;
      if (!action.payload) {
        state.connectedUsers = [];
        state.currentUser = '';
      }
    },
    
    setConnectedUsers: (state, action: PayloadAction<{ users: string[]; currentUser?: string }>) => {
      state.connectedUsers = action.payload.users;
      if (action.payload.currentUser) {
        state.currentUser = action.payload.currentUser;
      }
    },
    
    addMessage: (state, action: PayloadAction<ChatMessage>) => {
      const message = {
        ...action.payload,
        id: action.payload.id || Date.now().toString(),
        timestamp: action.payload.timestamp || Date.now()
      };
      state.messages.push(message);
      localStorage.setItem('echoroom_messages', JSON.stringify(state.messages));
    },
    
    updateMessageTranslation: (state, action: PayloadAction<{
      messageId: string;
      translatedText: string;
      detectedLanguage: string;
      isTranslated: boolean;
    }>) => {
      const { messageId, translatedText, detectedLanguage, isTranslated } = action.payload;
      const messageIndex = state.messages.findIndex(msg => msg.id === messageId);
      
      if (messageIndex !== -1) {
        const message = state.messages[messageIndex];
        if (!message.originalMessage) {
          message.originalMessage = message.message;
        }
        message.translatedMessage = translatedText;
        message.detectedLanguage = detectedLanguage;
        message.isTranslated = isTranslated;
        message.message = isTranslated ? translatedText : message.originalMessage;
        localStorage.setItem('echoroom_messages', JSON.stringify(state.messages));
      }
    },
    
    toggleMessageTranslation: (state, action: PayloadAction<string>) => {
      const messageId = action.payload;
      const messageIndex = state.messages.findIndex(msg => msg.id === messageId);
      
      if (messageIndex !== -1) {
        const message = state.messages[messageIndex];
        if (message.originalMessage && message.translatedMessage) {
          message.isTranslated = !message.isTranslated;
          message.message = message.isTranslated ? message.translatedMessage : message.originalMessage;
          localStorage.setItem('echoroom_messages', JSON.stringify(state.messages));
        }
      }
    },
    
    clearMessages: (state) => {
      state.messages = [];
      localStorage.removeItem('echoroom_messages');
    },
    
    clearMessagesIfRoomEmpty: (state) => {
      // Clear messages when no users are connected (room is empty)
      if (state.connectedUsers.length === 0 && state.roomId) {
        state.messages = [];
        localStorage.removeItem('echoroom_messages');
      }
    },
    
    setError: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
      state.isConnecting = false;
    },
    
    clearError: (state) => {
      state.error = null;
    },

    setPreferredLanguage: (state, action: PayloadAction<string | null>) => {
      state.preferredLanguage = action.payload;
      if (state.userName) {
        setUserSpecificStorage('echoroom_preferredLanguage', state.userName, action.payload);
      }
    },

    setAutoTranslate: (state, action: PayloadAction<boolean>) => {
      state.autoTranslate = action.payload;
      if (state.userName) {
        setUserSpecificStorage('echoroom_autoTranslate', state.userName, JSON.stringify(action.payload));
      }
    },
    
    disconnect: (state) => {
      state.roomId = '';
      state.userName = '';
      state.isConnected = false;
      state.isConnecting = false;
      state.connectedUsers = [];
      state.currentUser = '';
      state.messages = [];
      state.error = null;
      
      // Clear localStorage
      localStorage.removeItem('echoroom_messages');
      localStorage.removeItem('echoroom_roomId');
      localStorage.removeItem('echoroom_userName');
    },
  },
});

export const {
  setRoomId,
  setUserName,
  setConnecting,
  setConnected,
  setConnectedUsers,
  addMessage,
  updateMessageTranslation,
  toggleMessageTranslation,
  clearMessages,
  clearMessagesIfRoomEmpty,
  setError,
  clearError,
  setPreferredLanguage,
  setAutoTranslate,
  disconnect,
} = wsSlice.actions;

export default wsSlice.reducer;
