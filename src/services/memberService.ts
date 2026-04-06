import { fetchWithAuth } from "../lib/api";

export const memberService = {
  // Profil
  getProfile: () => fetchWithAuth("/member/profile"),
  updateProfile: (data: any) => fetchWithAuth("/member/profile", { method: "PUT", body: JSON.stringify(data) }),
  updatePassword: (newPassword: string) => fetchWithAuth(`/member/profile/password?newPassword=${encodeURIComponent(newPassword)}`, { method: "PUT" }),

  // Statut et dettes
  getStatus: () => fetchWithAuth("/member/status"),
  getDebts: () => fetchWithAuth("/member/debts"),

  // Épargne
  getMySavings: () => fetchWithAuth("/member/savings"),
  getSavingBalance: () => fetchWithAuth("/member/savings/balance"),

  // Emprunts
  getMyBorrowings: () => fetchWithAuth("/member/borrowings"),
  requestLoan: (amount: number) => fetchWithAuth(`/member/borrowings/request?amount=${amount}`, { method: "POST" }),
  getLoanDetails: (id: number) => fetchWithAuth(`/member/borrowings/${id}`),
  getLoanRefunds: (id: number) => fetchWithAuth(`/member/borrowings/${id}/refunds`),

  // Aides
  getHelpTypes: () => fetchWithAuth("/member/helps/types"),
  getActiveHelps: () => fetchWithAuth("/member/helps/active"),
  getHelpDetails: (id: number) => fetchWithAuth(`/member/helps/${id}`),
  contributeToHelp: (id: number, amount: number) => fetchWithAuth(`/member/helps/${id}/contribute?amount=${amount}`, { method: "POST" }),

  // Communication
  getOtherMembers: () => fetchWithAuth("/member/members"),
  getConversations: () => fetchWithAuth("/member/chat/conversations"),
  getMessages: (userId: number) => fetchWithAuth(`/member/chat/messages/${userId}`),
  getUnreadCount: () => fetchWithAuth("/member/chat/unread"),
  sendMessage: (receiverId: number, content: string) => fetchWithAuth(`/member/chat/send?receiverId=${receiverId}&content=${encodeURIComponent(content)}`, { method: "POST" }),
};
