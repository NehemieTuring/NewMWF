import { fetchWithAuth } from "../lib/api";

export interface AdminData {
  id: number;
  name: string;
  firstName: string;
  email: string;
  username: string;
  password?: string;
  adminRole: string;
  role?: string;
  active: boolean;
  user: {
    name: string;
    firstName: string;
    email: string;
    tel?: string;
    [key: string]: any;
  };
}

export interface DashboardStats {
  totalMembers: number;
  totalAdmins: number;
  totalSavings: number;
  totalLoans: number;
  activeExercise?: any;
  recentTransactions?: any[];
  [key: string]: any;
}

// Profil
export const getProfile = () => fetchWithAuth("/admin/super/profile");
export const updateProfile = (data: any) => fetchWithAuth(`/admin/super/profile?name=${encodeURIComponent(data.name)}&firstName=${encodeURIComponent(data.firstName)}&username=${encodeURIComponent(data.username)}`, { method: "PUT" });
export const updatePassword = (newPassword: string) => fetchWithAuth(`/admin/super/profile/password?newPassword=${encodeURIComponent(newPassword)}`, { method: "PUT" });
export const updateAvatar = (file: File) => {
  const formData = new FormData();
  formData.append("file", file);
  return fetchWithAuth("/admin/super/profile/avatar", { method: "PUT", body: formData });
};

// Gestion des administrateurs
export const getAllAdmins = () => fetchWithAuth("/admin/super/admins");
export const getAdminById = (id: number) => fetchWithAuth(`/admin/super/admins/${id}`);
export const createAdmin = (data: any) => fetchWithAuth(`/admin/super/admins?name=${encodeURIComponent(data.name)}&firstName=${encodeURIComponent(data.firstName)}&email=${encodeURIComponent(data.email)}&username=${encodeURIComponent(data.username)}&password=${encodeURIComponent(data.password || "")}&role=${data.adminRole || data.role}`, { method: "POST" });
export const deactivateAdmin = (id: number) => fetchWithAuth(`/admin/super/admins/${id}/deactivate`, { method: "PUT" });
export const activateAdmin = (id: number) => fetchWithAuth(`/admin/super/admins/${id}/activate`, { method: "PUT" });
export const deleteAdmin = (id: number) => fetchWithAuth(`/admin/super/admins/${id}`, { method: "DELETE" });

// Gestion des membres
export const deleteMember = (id: number) => fetchWithAuth(`/admin/super/members/${id}`, { method: "DELETE" });

// Sécurité
export const changeUserPasswordByEmail = (email: string, newPassword: string) => fetchWithAuth(`/admin/super/users/password?email=${encodeURIComponent(email)}&newPassword=${encodeURIComponent(newPassword)}`, { method: "PUT" });

// Dashboard
export const getSuperDashboard = () => fetchWithAuth("/admin/super/dashboard");

export const superAdminService = {
  getProfile,
  updateProfile,
  updatePassword,
  updateAvatar,
  getAllAdmins,
  getAdminById,
  createAdmin,
  deactivateAdmin,
  activateAdmin,
  deleteAdmin,
  deleteMember,
  changeUserPasswordByEmail,
  getSuperDashboard,
};
