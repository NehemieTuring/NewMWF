import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client";

let stompClient: Client | null = null;

export const webSocketService = {
  connect: (userId: number, onMessageReceived: (msg: any) => void) => {
    stompClient = new Client({
      brokerURL: "ws://localhost:8080/api/ws", 
      webSocketFactory: () => new SockJS("http://localhost:8080/api/ws"),
      debug: (str) => {}, // Set to console.log for debugging
      reconnectDelay: 5000,
      heartbeatIncoming: 4000,
      heartbeatOutgoing: 4000,
    });

    stompClient.onConnect = (frame) => {
      console.log("Connected to WebSocket");
      stompClient?.subscribe(`/user/${userId}/queue/messages`, (payload) => {
        const message = JSON.parse(payload.body);
        onMessageReceived(message);
      });
    };

    stompClient.onStompError = (frame) => {
      console.error("STOMP error", frame.body);
    };

    stompClient.activate();
  },

  disconnect: () => {
    if (stompClient) {
      stompClient.deactivate();
    }
  }
};

