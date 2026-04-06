import { fetchWithAuth } from "../lib/api";

export const treasurerService = {
  // Consultation Membres Financière
  getAllMembers: () => fetchWithAuth("/treasurer/members"),
  getMemberDebts: (id: number) => fetchWithAuth(`/treasurer/members/${id}/debts`),
  getSolidarityDebt: (memberId: number) => fetchWithAuth(`/treasurer/solidarity/members/${memberId}/debt`),
  getMemberSavings: (memberId: number) => fetchWithAuth(`/treasurer/savings/members/${memberId}`),

  // Emprunts et Penalités
  getAllLoans: () => fetchWithAuth("/treasurer/borrowings"),
  getLoanById: (id: number) => fetchWithAuth(`/treasurer/borrowings/${id}`),
  getMemberLoans: (memberId: number) => fetchWithAuth(`/treasurer/borrowings/members/${memberId}`),
  getPenalties: () => fetchWithAuth("/treasurer/penalties"),

  // Dashboard et Rapports
  getRefueling: (exerciseId: number) => fetchWithAuth(`/treasurer/refueling/exercises/${exerciseId}`),
  getGlobalTransactions: () => fetchWithAuth("/treasurer/dashboard/transactions"),
  getCashboxes: () => fetchWithAuth("/treasurer/dashboard/cashboxes"),
  getExerciseBilan: (exerciseId: number) => fetchWithAuth(`/treasurer/dashboard/exercises/${exerciseId}`),
  getDailyReport: () => fetchWithAuth("/treasurer/reports/daily"),
  recordExpenditure: (amount: number, reason: string) => fetchWithAuth(`/treasurer/expenditure?amount=${amount}&reason=${encodeURIComponent(reason)}`, { method: "POST" }),

  // Profil & Chat
  getProfile: () => fetchWithAuth("/treasurer/profile"),
  updatePassword: (newPassword: string) => fetchWithAuth(`/treasurer/profile/password?newPassword=${encodeURIComponent(newPassword)}`, { method: "PUT" }),
  getOtherAdmins: () => fetchWithAuth("/treasurer/admins"),
  getConversations: () => fetchWithAuth("/treasurer/chat/conversations"),
  getMessages: (userId: number) => fetchWithAuth(`/treasurer/chat/messages/${userId}`),
  getUnreadCount: () => fetchWithAuth("/treasurer/chat/unread"),
  sendMessage: (receiverId: number, content: string) => fetchWithAuth(`/treasurer/chat/send?receiverId=${receiverId}&content=${encodeURIComponent(content)}`, { method: "POST" }),
};
