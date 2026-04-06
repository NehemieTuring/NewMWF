import { fetchWithAuth } from "../lib/api";

export const presidentService = {
  // Consultation Membres
  getAllMembers: () => fetchWithAuth("/president/members"),
  getMemberById: (id: number) => fetchWithAuth(`/president/members/${id}`),
  getMemberStatus: (id: number) => fetchWithAuth(`/president/members/${id}/status`),
  getMemberDebts: (id: number) => fetchWithAuth(`/president/members/${id}/debts`),

  // Consultation Financière
  getSolidarityDebt: (memberId: number) => fetchWithAuth(`/president/solidarity/members/${memberId}/debt`),
  getMemberSavings: (memberId: number) => fetchWithAuth(`/president/savings/members/${memberId}`),
  getAllLoans: () => fetchWithAuth("/president/borrowings"),
  getLoanById: (id: number) => fetchWithAuth(`/president/borrowings/${id}`),

  // Consultation Operationnelle
  getAllHelps: () => fetchWithAuth("/president/helps"),
  getActiveHelps: () => fetchWithAuth("/president/helps/active"),
  getExercises: () => fetchWithAuth("/president/exercises"),
  getSessions: () => fetchWithAuth("/president/sessions"),
  getRefueling: (exerciseId: number) => fetchWithAuth(`/president/refueling/exercises/${exerciseId}`),

  // Dashboard
  getExerciseBilan: (exerciseId: number) => fetchWithAuth(`/president/dashboard/exercises/${exerciseId}`),
  getSessionBilan: (sessionId: number) => fetchWithAuth(`/president/dashboard/sessions/${sessionId}`),
  getGlobalTransactions: () => fetchWithAuth("/president/dashboard/transactions"),
  getCashboxes: () => fetchWithAuth("/president/dashboard/cashboxes"),
  getMembersInRule: () => fetchWithAuth("/president/dashboard/members/in-rule"),
  getMembersNotInRule: () => fetchWithAuth("/president/dashboard/members/not-in-rule"),

  // Profil & Chat
  getProfile: () => fetchWithAuth("/president/profile"),
  updatePassword: (newPassword: string) => fetchWithAuth(`/president/profile/password?newPassword=${encodeURIComponent(newPassword)}`, { method: "PUT" }),
  getOtherAdmins: () => fetchWithAuth("/president/admins"),
  getConversations: () => fetchWithAuth("/president/chat/conversations"),
  getMessages: (userId: number) => fetchWithAuth(`/president/chat/messages/${userId}`),
  getUnreadCount: () => fetchWithAuth("/president/chat/unread"),
  sendMessage: (receiverId: number, content: string) => fetchWithAuth(`/president/chat/send?receiverId=${receiverId}&content=${encodeURIComponent(content)}`, { method: "POST" }),
};
