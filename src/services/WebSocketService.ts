import { AppDispatch } from '../store/store';
import {
  setConnecting,
  setConnected,
  setConnectedUsers,
  addMessage,
  setError,
  clearMessagesIfRoomEmpty,
} from '../store/wsSlice';

// const WS_URL = "wss://echorooms-backend.onrender.com";
const WS_URL = "ws://localhost:8080";

export class WebSocketService {
  private ws: WebSocket | null = null;
  private dispatch: AppDispatch;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;

  constructor(dispatch: AppDispatch) {
    this.dispatch = dispatch;
  }

  connect(roomId: string, userName: string): Promise<void> {
    return new Promise((resolve, reject) => {
      // Close existing connection if any
      if (this.ws && this.ws.readyState === WebSocket.OPEN) {
        this.ws.close();
      }

      this.dispatch(setConnecting(true));

      try {
        this.ws = new WebSocket(WS_URL);

        this.ws.onopen = () => {
          console.log('WebSocket connected');
          this.dispatch(setConnected(true));
          this.reconnectAttempts = 0;

          // Send join message with delay to ensure connection is stable
          setTimeout(() => {
            this.sendMessage({
              type: "join",
              payload: { roomId, name: userName }
            });

            // Request user list after joining
            setTimeout(() => {
              this.sendMessage({ type: "requestUsers" });
            }, 200);

            resolve();
          }, 100);
        };

        this.ws.onmessage = (event) => {
          this.handleMessage(event);
        };

        this.ws.onerror = (error) => {
          console.error('WebSocket error:', error);
          this.dispatch(setError('Connection error occurred'));
          reject(error);
        };

        this.ws.onclose = (event) => {
          console.log('WebSocket closed:', event.code, event.reason);
          this.dispatch(setConnected(false));
          
          // Auto-reconnect logic (optional)
          if (event.code !== 1000 && this.reconnectAttempts < this.maxReconnectAttempts) {
            this.reconnectAttempts++;
            setTimeout(() => {
              console.log(`Reconnection attempt ${this.reconnectAttempts}`);
              this.connect(roomId, userName);
            }, 2000 * this.reconnectAttempts);
          }
        };

      } catch (error) {
        this.dispatch(setError('Failed to create WebSocket connection'));
        reject(error);
      }
    });
  }

  private handleMessage(event: MessageEvent) {
    try {
      const data = JSON.parse(event.data);
      console.log('Received message:', data);

      switch (data.type) {
        case 'chat':
          if (data.name && data.message) {
            this.dispatch(addMessage({
              name: data.name,
              message: data.message
            }));
          }
          break;

        case 'users':
          this.dispatch(setConnectedUsers({
            users: data.users || [],
            currentUser: data.currentUser
          }));
          
          // Clear messages if room becomes empty
          if ((data.users || []).length === 0) {
            this.dispatch(clearMessagesIfRoomEmpty());
          }
          break;

        default:
          // Handle unknown message types
          console.warn('Unknown message type:', data.type);
      }
    } catch (error) {
      // Fallback for plain string messages
      console.error('Error parsing message:', error);
      this.dispatch(addMessage({
        name: "Unknown",
        message: event.data
      }));
    }
  }

  sendMessage(message: any) {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify(message));
    } else {
      console.warn('WebSocket not connected');
      this.dispatch(setError('Not connected to server'));
    }
  }

  sendChatMessage(message: string, userName: string) {
    this.sendMessage({
      type: "chat",
      payload: { message, name: userName }
    });
  }

  disconnect() {
    if (this.ws) {
      this.ws.close(1000, 'User disconnected');
      this.ws = null;
    }
    this.dispatch(setConnected(false));
  }

  isConnected(): boolean {
    return this.ws?.readyState === WebSocket.OPEN;
  }
}
