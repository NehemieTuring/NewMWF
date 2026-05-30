import { fetchWithAuth } from "../lib/api";

export const treasurerService = {
  // Consultation Membres Financière
  getAllMembers: () => fetchWithAuth("/treasurer/members"),
  getMemberDebts: (id: number) => fetchWithAuth(`/treasurer/members/${id}/debts`),
  getSolidarityDebt: (memberId: number) => fetchWithAuth(`/treasurer/solidarity/members/${memberId}/debt`),
  getMemberSavings: (memberId: number) => fetchWithAuth(`/treasurer/savings/members/${memberId}`),
  getMemberBorrowings: (memberId: number) => fetchWithAuth(`/treasurer/borrowings/members/${memberId}`),

  // Opérations financières (SG / Trésorier)
  addMemberSaving: (memberId: number, amount: number) => fetchWithAuth(`/treasurer/savings/deposit?memberId=${memberId}&amount=${amount}`, { method: "POST" }),
  addRefund: (memberId: number, amount: number) => fetchWithAuth(`/treasurer/borrowings/refund?memberId=${memberId}&amount=${amount}`, { method: "POST" }),
  addLoan: (memberId: number, amount: number) => fetchWithAuth(`/treasurer/borrowings/grant?memberId=${memberId}&amount=${amount}`, { method: "POST" }),
  paySolidarity: (memberId: number, amount: number) => fetchWithAuth(`/treasurer/solidarity/pay?memberId=${memberId}&amount=${amount}`, { method: "POST" }),
  recordSolidarityPurchase: (amount: number, description: string) => fetchWithAuth(`/treasurer/solidarity/purchase?amount=${amount}&description=${encodeURIComponent(description)}`, { method: "POST" }),

  // Emprunts et Penalités
  getAllLoans: () => fetchWithAuth("/treasurer/borrowings"),
  getLoanById: (id: number) => fetchWithAuth(`/treasurer/borrowings/${id}`),
  getMemberLoans: (memberId: number) => fetchWithAuth(`/treasurer/borrowings/members/${memberId}`),
  getPenalties: () => fetchWithAuth("/treasurer/penalties"),
  getExercises: () => fetchWithAuth("/treasurer/exercises"),
  getSessions: () => fetchWithAuth("/treasurer/sessions"),

  // Dashboard et Rapports
  getRefueling: (exerciseId: number) => fetchWithAuth(`/treasurer/refueling/exercises/${exerciseId}`),
  getGlobalTransactions: () => fetchWithAuth("/treasurer/dashboard/transactions"),
  getCashboxes: () => fetchWithAuth("/treasurer/dashboard/cashboxes"),
  getExerciseBilan: (exerciseId: number) => fetchWithAuth(`/treasurer/dashboard/exercises/${exerciseId}`),
  getSessionBilan: (sessionId: number) => fetchWithAuth(`/treasurer/dashboard/sessions/${sessionId}`),
  getDailyReport: () => fetchWithAuth("/treasurer/reports/daily"),

  // Expenses
  getAllExpenses: () => fetchWithAuth("/treasurer/expenses"),
  recordExpenditure: (amount: number, reason: string, category: string, receiptUrl?: string) =>
    fetchWithAuth(`/treasurer/expenditure?amount=${amount}&reason=${encodeURIComponent(reason)}&category=${encodeURIComponent(category)}${receiptUrl ? `&receiptUrl=${encodeURIComponent(receiptUrl)}` : ""}`, { method: "POST" }),
  deleteExpense: (id: number) => fetchWithAuth(`/treasurer/expenses/${id}`, { method: "DELETE" }),

  // Profil & Chat
  getProfile: () => fetchWithAuth("/treasurer/profile"),
  updateProfile: (data: any) => fetchWithAuth(`/admin/profile?name=${encodeURIComponent(data.name)}&firstName=${encodeURIComponent(data.firstName)}&username=${encodeURIComponent(data.username)}&tel=${encodeURIComponent(data.tel || "")}&address=${encodeURIComponent(data.address || "")}`, { method: "PUT" }),
  updatePassword: (newPassword: string) => fetchWithAuth(`/treasurer/profile/password?newPassword=${encodeURIComponent(newPassword)}`, { method: "PUT" }),
  updateAvatar: (file: File) => {
    const formData = new FormData();
    formData.append("file", file);
    return fetchWithAuth("/admin/profile/avatar", { method: "PUT", body: formData });
  },
  getOtherAdmins: () => fetchWithAuth("/treasurer/admins"),
  getConversations: () => fetchWithAuth("/treasurer/chat/conversations"),
  getMessages: (userId: number) => fetchWithAuth(`/treasurer/chat/messages/${userId}`),
  getUnreadCount: () => fetchWithAuth("/treasurer/chat/unread"),
  sendMessage: (receiverId: number, content: string) => fetchWithAuth(`/treasurer/chat/send?receiverId=${receiverId}&content=${encodeURIComponent(content)}`, { method: "POST" }),
};
