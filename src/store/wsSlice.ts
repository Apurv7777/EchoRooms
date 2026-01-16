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

const initialState: WSState = {
  roomId: '',
  userName: '',
  isConnected: false,
  isConnecting: false,
  connectedUsers: [],
  currentUser: '',
  messages: [],
  error: null,
  preferredLanguage: null,
  autoTranslate: false,
};

const wsSlice = createSlice({
  name: 'ws',
  initialState,
  reducers: {
    setRoomId: (state, action: PayloadAction<string>) => {
      state.roomId = action.payload;
    },

    setUserName: (state, action: PayloadAction<string>) => {
      state.userName = action.payload;
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
        }
      }
    },

    clearMessages: (state) => {
      state.messages = [];
    },

    clearMessagesIfRoomEmpty: (state) => {
      if (state.connectedUsers.length === 0 && state.roomId) {
        state.messages = [];
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
    },

    setAutoTranslate: (state, action: PayloadAction<boolean>) => {
      state.autoTranslate = action.payload;
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
