import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client";

let stompClient: Client | null = null;
let pingInterval: any = null;

export const webSocketService = {
  connect: (userId: number, onPrivateMessage: (msg: any) => void, onGroupMessage: (msg: any) => void, onUpdate: (data: any) => void, onStatusUpdate: (data: any) => void, onUnreadUpdate: (count: number) => void, onMessageStatus: (data: any) => void) => {
    const token = localStorage.getItem("auth_token");

    stompClient = new Client({
      brokerURL: `${process.env.NEXT_PUBLIC_WS_URL || "ws://localhost:8080/api"}/ws`,
      webSocketFactory: () => new SockJS(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api"}/ws`),
      connectHeaders: {
        Authorization: token ? `Bearer ${token}` : ""
      },
      debug: (str) => { /* console.log(str); */ },
      reconnectDelay: 5000,
      heartbeatIncoming: 10000,
      heartbeatOutgoing: 10000,
    });

    stompClient.onConnect = (frame) => {
      console.log("Connected to WebSocket");

      if (pingInterval) clearInterval(pingInterval);
      pingInterval = setInterval(() => {
        if (stompClient?.connected) {
          stompClient.publish({ destination: "/app/chat.ping" });
        }
      }, 20000); // 20s as per backend preference

      // Subscriptions
      stompClient?.subscribe("/user/queue/messages", (p) => onPrivateMessage(JSON.parse(p.body)));
      stompClient?.subscribe("/user/queue/messages/updates", (p) => onUpdate(JSON.parse(p.body)));
      stompClient?.subscribe("/user/queue/messages/status", (p) => onMessageStatus(JSON.parse(p.body)));
      stompClient?.subscribe("/topic/group.messages", (p) => onGroupMessage(JSON.parse(p.body)));
      stompClient?.subscribe("/topic/group.messages.updates", (p) => onUpdate(JSON.parse(p.body)));
      stompClient?.subscribe("/topic/user.status", (p) => onStatusUpdate(JSON.parse(p.body)));
      stompClient?.subscribe("/user/queue/unread", (p) => onUnreadUpdate(JSON.parse(p.body)));
    };

    stompClient.onStompError = (f) => console.error("STOMP error", f.body);
    stompClient.activate();
  },

  publish: (destination: string, body: any) => {
    if (stompClient?.connected) {
      stompClient.publish({ destination, body: JSON.stringify(body) });
    }
  },

  disconnect: () => {
    if (pingInterval) clearInterval(pingInterval);
    if (stompClient) stompClient.deactivate();
  }
};
