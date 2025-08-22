// WebSocketClient.js
// Usage: import WebSocketClient from '../utils/WebSocketClient';
// const ws = new WebSocketClient(onMessage, onOpen, onClose, onError);

const WS_URL = process.env.REACT_APP_WEBSOCKET_URL || 'ws://localhost:3000/ws';
const MAX_RECONNECT_ATTEMPTS = 5;
const RECONNECT_DELAY = 2000; // ms

class WebSocketClient {
  constructor(onMessage, onOpen, onClose, onError) {
    this.url = WS_URL;
    this.onMessage = onMessage;
    this.onOpen = onOpen;
    this.onClose = onClose;
    this.onError = onError;
    this.reconnectAttempts = 0;
    this.connect();
  }

  connect() {
    this.ws = new window.WebSocket(this.url);
    this.ws.onopen = (event) => {
      this.reconnectAttempts = 0;
      if (this.onOpen) this.onOpen(event);
    };
    this.ws.onmessage = (event) => {
      if (this.onMessage) this.onMessage(event.data);
    };
    this.ws.onclose = (event) => {
      if (this.onClose) this.onClose(event);
      this.tryReconnect();
    };
    this.ws.onerror = (event) => {
      if (this.onError) this.onError(event);
      this.ws.close();
    };
  }

  tryReconnect() {
    if (this.reconnectAttempts < MAX_RECONNECT_ATTEMPTS) {
      setTimeout(() => {
        this.reconnectAttempts++;
        this.connect();
      }, RECONNECT_DELAY);
    }
  }

  send(data) {
    if (this.ws && this.ws.readyState === window.WebSocket.OPEN) {
      this.ws.send(JSON.stringify(data));
    }
  }

  close() {
    if (this.ws) this.ws.close();
  }
}

export default WebSocketClient;
