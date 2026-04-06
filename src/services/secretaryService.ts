import { fetchWithAuth } from "../lib/api";

export const secretaryService = {
  // Membres
  getAllMembers: () => fetchWithAuth("/admin/members"),
  getMemberById: (id: number) => fetchWithAuth(`/admin/members/${id}`),
  registerMember: (data: any) => fetchWithAuth("/admin/members", { method: "POST", body: JSON.stringify(data) }),
  updateMember: (id: number, data: any) => fetchWithAuth(`/admin/members/${id}`, { method: "PUT", body: JSON.stringify(data) }),
  deactivateMember: (id: number) => fetchWithAuth(`/admin/members/${id}/deactivate`, { method: "PUT" }),
  activateMember: (id: number) => fetchWithAuth(`/admin/members/${id}/activate`, { method: "PUT" }),
  getMemberStatus: (id: number) => fetchWithAuth(`/admin/members/${id}/status`),
  getMemberDebts: (id: number) => fetchWithAuth(`/admin/members/${id}/debts`),

  // Solidarité
  paySolidarity: (memberId: number, amount: number) => fetchWithAuth(`/admin/solidarity/payments?memberId=${memberId}&amount=${amount}`, { method: "POST" }),
  getSolidarityDebt: (memberId: number) => fetchWithAuth(`/admin/solidarity/members/${memberId}/debt`),
  getSolidarityHistory: (memberId: number) => fetchWithAuth(`/admin/solidarity/members/${memberId}/history`),

  // Épargne
  depositSaving: (memberId: number, amount: number) => fetchWithAuth(`/admin/savings/deposit?memberId=${memberId}&amount=${amount}`, { method: "POST" }),
  withdrawSaving: (memberId: number, amount: number) => fetchWithAuth(`/admin/savings/withdrawal?memberId=${memberId}&amount=${amount}`, { method: "POST" }),
  getMemberSavings: (memberId: number) => fetchWithAuth(`/admin/savings/members/${memberId}`),
  getSavingBalance: (memberId: number) => fetchWithAuth(`/admin/savings/members/${memberId}/balance`),

  // Emprunts
  getAllLoans: () => fetchWithAuth("/admin/borrowings"),
  getLoanById: (id: number) => fetchWithAuth(`/admin/borrowings/${id}`),
  requestLoan: (memberId: number, amount: number) => fetchWithAuth(`/admin/borrowings/request?memberId=${memberId}&amount=${amount}`, { method: "POST" }),
  refundLoan: (id: number, amount: number) => fetchWithAuth(`/admin/borrowings/${id}/refund?amount=${amount}`, { method: "POST" }),

  // Aides
  getAllHelps: () => fetchWithAuth("/admin/helps"),
  getActiveHelps: () => fetchWithAuth("/admin/helps/active"),
  createHelp: (typeId: number, beneficiaryId: number, amount: number) => fetchWithAuth(`/admin/helps?typeId=${typeId}&beneficiaryId=${beneficiaryId}&amount=${amount}`, { method: "POST" }),
  getHelpTypes: () => fetchWithAuth("/admin/helps/types"),

  // Sessions et Exercices
  getExercises: () => fetchWithAuth("/admin/exercises"),
  getSessions: () => fetchWithAuth("/admin/sessions"),
  createExercise: (data: any) => fetchWithAuth("/admin/exercises", { method: "POST", body: JSON.stringify(data) }),
  createSession: (data: any) => fetchWithAuth("/admin/sessions", { method: "POST", body: JSON.stringify(data) }),
  closeSession: (id: number) => fetchWithAuth(`/admin/sessions/${id}/close`, { method: "PUT" }),
  closeExercise: (id: number) => fetchWithAuth(`/admin/exercises/${id}/close`, { method: "PUT" }),

  // Chat
  getConversations: () => fetchWithAuth("/admin/chat/conversations"),
  getMessages: (userId: number) => fetchWithAuth(`/admin/chat/messages/${userId}`),
  sendMessage: (receiverId: number, content: string) => fetchWithAuth(`/admin/chat/send?receiverId=${receiverId}&content=${encodeURIComponent(content)}`, { method: "POST" }),
  getUnreadCount: () => fetchWithAuth("/admin/chat/unread"),

  // Dashboard
  getGlobalTransactions: () => fetchWithAuth("/admin/dashboard/transactions"),
  getCashboxes: () => fetchWithAuth("/admin/dashboard/cashboxes"),
  getMembersInRule: () => fetchWithAuth("/admin/dashboard/members/in-rule"),
  getMembersNotInRule: () => fetchWithAuth("/admin/dashboard/members/not-in-rule"),

  // Profil propre
  getProfile: () => fetchWithAuth("/admin/profile"),
  updateProfile: (data: any) => fetchWithAuth("/admin/profile", { method: "PUT", body: JSON.stringify(data) }),
  updatePassword: (data: any) => fetchWithAuth("/admin/profile/password", { method: "PUT", body: JSON.stringify(data) }),
};
