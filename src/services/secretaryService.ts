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
  importMembersCsv: (file: File) => {
    const formData = new FormData();
    formData.append("file", file);
    return fetchWithAuth("/admin/members/import-csv", { method: "POST", body: formData });
  },

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
  getMaxBorrowingAmount: (memberId: number) => fetchWithAuth(`/admin/borrowings/members/${memberId}/max-amount`),

  // Aides
  getAllHelps: () => fetchWithAuth("/admin/helps"),
  getActiveHelps: () => fetchWithAuth("/admin/helps/active"),
  createHelp: (typeId: number, beneficiaryId: number, amount: number) => fetchWithAuth(`/admin/helps?typeId=${typeId}&beneficiaryId=${beneficiaryId}&amount=${amount}`, { method: "POST" }),
  getHelpTypes: () => fetchWithAuth("/admin/helps/types"),
  createHelpType: (name: string, description: string, amount: number) => fetchWithAuth(`/admin/helps/types?name=${encodeURIComponent(name)}&description=${encodeURIComponent(description)}&amount=${amount}`, { method: "POST" }),
  updateHelpType: (id: number, data: any) => fetchWithAuth(`/admin/helps/types/${id}`, { method: "PUT", body: JSON.stringify(data) }),
  deleteHelpType: (id: number) => fetchWithAuth(`/admin/helps/types/${id}`, { method: "DELETE" }),

  // Sessions et Exercices
  getExercises: () => fetchWithAuth("/admin/exercises"),
  getSessions: () => fetchWithAuth("/admin/sessions"),
  getCurrentExercise: () => fetchWithAuth("/admin/exercises/current"),
  updateExercise: (id: number, data: any) => fetchWithAuth(`/admin/exercises/${id}`, { method: "PUT", body: JSON.stringify(data) }),
  createExercise: (data: any) => fetchWithAuth("/admin/exercises", { method: "POST", body: JSON.stringify(data) }),
  createSession: (data: any) => fetchWithAuth("/admin/sessions", { method: "POST", body: JSON.stringify(data) }),
  closeSession: (id: number) => fetchWithAuth(`/admin/sessions/${id}/close`, { method: "PUT" }),
  closeExercise: (id: number) => fetchWithAuth(`/admin/exercises/${id}/close`, { method: "PUT" }),

  // Refueling
  getRefuelingByExercise: (exerciseId: number) => fetchWithAuth(`/admin/refueling/exercises/${exerciseId}`),
  calculateRefueling: (exerciseId: number) => fetchWithAuth(`/admin/refueling/calculate/${exerciseId}`, { method: "POST" }),
  distributeRefueling: (refuelingId: number) => fetchWithAuth(`/admin/refueling/distribute/${refuelingId}`, { method: "POST" }),

  // Chat
  getConversations: () => fetchWithAuth("/admin/chat/conversations"),
  getMessages: (userId: number) => fetchWithAuth(`/admin/chat/messages/${userId}`),
  sendMessage: (receiverId: number, content: string) => fetchWithAuth(`/admin/chat/send?receiverId=${receiverId}&content=${encodeURIComponent(content)}`, { method: "POST" }),
  getUnreadCount: () => fetchWithAuth("/admin/chat/unread"),

  // Dashboard / Bilans
  getGlobalTransactions: () => fetchWithAuth("/admin/dashboard/transactions"),
  getCashboxes: () => fetchWithAuth("/admin/dashboard/cashboxes"),
  getMembersInRule: () => fetchWithAuth("/admin/dashboard/members/in-rule"),
  getMembersNotInRule: () => fetchWithAuth("/admin/dashboard/members/not-in-rule"),
  getExerciseBilan: (exerciseId: number) => fetchWithAuth(`/admin/dashboard/exercises/${exerciseId}`),
  getSessionBilan: (sessionId: number) => fetchWithAuth(`/admin/dashboard/sessions/${sessionId}`),

  // Profil propre
  getProfile: () => fetchWithAuth("/admin/profile"),
  updateProfile: (data: any) => fetchWithAuth(`/admin/profile?name=${encodeURIComponent(data.name)}&firstName=${encodeURIComponent(data.firstName)}&username=${encodeURIComponent(data.username)}`, { method: "PUT" }),
  updatePassword: (newPassword: string) => fetchWithAuth(`/admin/profile/password?newPassword=${encodeURIComponent(newPassword)}`, { method: "PUT" }),
  updateAvatar: (file: File) => {
    const formData = new FormData();
    formData.append("file", file);
    return fetchWithAuth("/admin/profile/avatar", { method: "PUT", body: formData });
  },

  // Agape
  getAgapes: () => fetchWithAuth("/admin/agapes"),
  createAgape: (data: { title: string, description: string, amount: number, date: string, sessionId: string }) =>
    fetchWithAuth(`/admin/agapes?title=${encodeURIComponent(data.title)}&description=${encodeURIComponent(data.description)}&amount=${data.amount}&date=${data.date}&sessionId=${data.sessionId}`, { method: "POST" }),
  disburseHelp: (helpId: number) => fetchWithAuth(`/admin/helps/${helpId}/disburse`, { method: "POST" }),
};
