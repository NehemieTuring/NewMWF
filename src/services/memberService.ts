import { fetchWithAuth } from "../lib/api";

export const memberService = {
  // Profil
  getProfile: () => fetchWithAuth("/member/profile"),
  updateProfile: (data: any) => fetchWithAuth(`/member/profile?name=${encodeURIComponent(data.name)}&firstName=${encodeURIComponent(data.firstName)}&username=${encodeURIComponent(data.username)}&tel=${encodeURIComponent(data.tel)}&address=${encodeURIComponent(data.address)}`, { method: "PUT" }),
  updatePassword: (newPassword: string) => fetchWithAuth(`/member/profile/password?newPassword=${encodeURIComponent(newPassword)}`, { method: "PUT" }),
  updateAvatar: (file: File) => {
    const formData = new FormData();
    formData.append("file", file);
    return fetchWithAuth("/member/profile/avatar", { method: "PUT", body: formData });
  },

  // Statut et dettes
  getStatus: () => fetchWithAuth("/member/status"),
  getDebts: () => fetchWithAuth("/member/debts"),
  getMyPayments: () => fetchWithAuth("/member/payments"),

  // Épargne
  getMySavings: () => fetchWithAuth("/member/savings"),
  getSavingBalance: () => fetchWithAuth("/member/savings/balance"),

  // Emprunts
  getMyBorrowings: () => fetchWithAuth("/member/borrowings"),
  getMaxBorrowingAmount: () => fetchWithAuth("/member/borrowings/max-amount"),
  requestLoan: (amount: number) => fetchWithAuth(`/member/borrowings/request?amount=${amount}`, { method: "POST" }),
  getLoanDetails: (id: number) => fetchWithAuth(`/member/borrowings/${id}`),
  getLoanRefunds: (id: number) => fetchWithAuth(`/member/borrowings/${id}/refunds`),

  // Aides
  getHelpTypes: () => fetchWithAuth("/member/helps/types"),
  getActiveHelps: () => fetchWithAuth("/member/helps/active"),
  getAllHelps: () => fetchWithAuth("/member/helps"),
  getHelpDetails: (id: number) => fetchWithAuth(`/member/helps/${id}`),
  requestHelp: (typeId: number, amount: number | null, motive: string) =>
    fetchWithAuth(`/member/helps?typeId=${typeId}${amount ? `&amount=${amount}` : ""}&motive=${encodeURIComponent(motive)}`, { method: "POST" }),
  checkEligibility: () => fetchWithAuth("/member/helps/eligibility"),
  contributeToHelp: (id: number, amount: number) => fetchWithAuth(`/member/helps/${id}/contribute?amount=${amount}`, { method: "POST" }),

  // Communication
  getOtherMembers: () => fetchWithAuth("/member/members"),
  getConversations: () => fetchWithAuth("/member/chat/conversations"),
  getMessages: (userId: number) => fetchWithAuth(`/member/chat/messages/${userId}`),
  getUnreadCount: () => fetchWithAuth("/member/chat/unread"),
  sendMessage: (receiverId: number, content: string) => fetchWithAuth(`/member/chat/send?receiverId=${receiverId}&content=${encodeURIComponent(content)}`, { method: "POST" }),

  // Sessions et exercices (consultation)
  getSessions: () => fetchWithAuth("/member/sessions"),
  getExercises: () => fetchWithAuth("/member/exercises"),
};
