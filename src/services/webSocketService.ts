import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client";

let stompClient: Client | null = null;
let pingInterval: any = null;

export const webSocketService = {
  connect: (userId: number, onPrivateMessage: (msg: any) => void, onGroupMessage: (msg: any) => void, onUpdate: (data: any) => void, onStatusUpdate: (data: any) => void, onUnreadUpdate: (count: number) => void) => {
    const token = localStorage.getItem("auth_token");

    stompClient = new Client({
      brokerURL: "ws://localhost:8080/api/ws", 
      webSocketFactory: () => new SockJS("http://localhost:8080/api/ws"),
      connectHeaders: {
        userId: userId.toString(),
        Authorization: token ? `Bearer ${token}` : ""
      },
      debug: (str) => { console.log(str); },
      reconnectDelay: 5000,
      heartbeatIncoming: 10000,
      heartbeatOutgoing: 10000,
    });
    
    // Fallback if websocket fails (for some proxies)
    stompClient.onWebSocketError = (error) => {
      console.error("WebSocket Error:", error);
    };

    stompClient.onConnect = (frame) => {
      console.log("Connected to WebSocket:", frame);
      
      if (pingInterval) clearInterval(pingInterval);
      pingInterval = setInterval(() => {
        if (stompClient?.connected) {
           stompClient.publish({ 
             destination: "/app/chat/ping", 
             headers: { userId: userId.toString() } 
           });
        }
      }, 30000);

      // Subscriptions (Using standard Spring user destinations)
      stompClient?.subscribe("/user/queue/messages", (p) => onPrivateMessage(JSON.parse(p.body)));
      stompClient?.subscribe("/user/queue/messages/updates", (p) => onUpdate(JSON.parse(p.body)));
      stompClient?.subscribe("/topic/group.messages", (p) => onGroupMessage(JSON.parse(p.body)));
      stompClient?.subscribe("/topic/group.messages.updates", (p) => onUpdate(JSON.parse(p.body)));
      stompClient?.subscribe("/topic/user.status", (p) => onStatusUpdate(JSON.parse(p.body)));
      stompClient?.subscribe("/user/queue/unread", (p) => onUnreadUpdate(JSON.parse(p.body)));
    };

    stompClient.onStompError = (f) => console.error("STOMP error", f.body);
    stompClient.activate();
  },

  disconnect: () => {
    if (pingInterval) clearInterval(pingInterval);
    if (stompClient) stompClient.deactivate();
  }
};
