import { fetchWithAuth } from "@/lib/api";

export interface ChatMessage {
  id: number;
  sender: {
    id: number;
    firstName: string;
    name: string;
    username: string;
    email: string;
  };
  receiver?: {
    id: number;
  };
  message: string;
  createdAt: string;
  edited: boolean;
  editedAt?: string;
  attachmentUrl?: string;
  attachmentType?: string;
  read: boolean;
  delivered: boolean;
  isPending?: boolean;
}

export const chatService = {
  // Common endpoints (prefix depends on user role, usually /member works for all as per controller)
  getConversations: () => fetchWithAuth("/member/chat/conversations"),
  getMembers: () => fetchWithAuth("/member/members"),
  getMessages: (userId: number, page = 0, size = 20) =>
    fetchWithAuth(`/member/chat/messages/${userId}?page=${page}&size=${size}`),

  sendMessage: (receiverId: number | null, content: string, attachmentUrl?: string, attachmentType?: string) => {
    let url = `/member/chat/send?content=${encodeURIComponent(content)}`;
    if (receiverId) url += `&receiverId=${receiverId}`;
    if (attachmentUrl) url += `&attachmentUrl=${encodeURIComponent(attachmentUrl)}`;
    if (attachmentType) url += `&attachmentType=${encodeURIComponent(attachmentType)}`;
    return fetchWithAuth(url, { method: "POST" });
  },

  getGroupMessages: (page = 0, size = 50) =>
    fetchWithAuth(`/member/chat/group/messages?page=${page}&size=${size}`),

  searchGroupMessages: (query: string) =>
    fetchWithAuth(`/member/chat/group/search?query=${encodeURIComponent(query)}`),

  editMessage: (messageId: number, content: string) =>
    fetchWithAuth(`/member/chat/messages/${messageId}?content=${encodeURIComponent(content)}`, { method: "PUT" }),

  deleteMessage: (messageId: number) =>
    fetchWithAuth(`/member/chat/messages/${messageId}`, { method: "DELETE" }),

  getUnreadCount: () => fetchWithAuth("/member/chat/unread"),

  getOnlineStatuses: () => fetchWithAuth("/member/chat/online-status"),

  acknowledgeConversation: (senderId: number) =>
    fetchWithAuth(`/member/chat/delivered/${senderId}`, { method: "PUT" }),

  markAsRead: (messageId: number) =>
    fetchWithAuth(`/member/chat/mark-read/${messageId}`, { method: "PUT" }),

  uploadFile: async (file: File) => {
    const formData = new FormData();
    formData.append("file", file);

    const auth = (await import("./authService")).getAuth();
    const token = auth?.token;

    // Using simple fetch because fetchWithAuth sets JSON Content-Type
    const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api";
    const response = await fetch(`${API_URL}/member/chat/upload`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${token}`
        // NO Content-Type here!
      },
      body: formData
    });

    if (!response.ok) {
      const err = await response.json().catch(() => ({}));
      throw new Error(err.message || "Upload failed");
    }
    return response.json();
  }
};
