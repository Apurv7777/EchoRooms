import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface ChatMessage {
  name: string;
  message: string;
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
}

const initialState: WSState = {
  roomId: localStorage.getItem('echoroom_roomId') || '',
  userName: localStorage.getItem('echoroom_userName') || '',
  isConnected: false,
  isConnecting: false,
  connectedUsers: [],
  currentUser: '',
  messages: JSON.parse(localStorage.getItem('echoroom_messages') || '[]'),
  error: null,
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
      } else {
        localStorage.removeItem('echoroom_userName');
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
      state.messages.push(action.payload);
      localStorage.setItem('echoroom_messages', JSON.stringify(state.messages));
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
  clearMessages,
  clearMessagesIfRoomEmpty,
  setError,
  clearError,
  disconnect,
} = wsSlice.actions;

export default wsSlice.reducer;
