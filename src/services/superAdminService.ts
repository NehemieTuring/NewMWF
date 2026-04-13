import { fetchWithAuth } from "../lib/api";

export interface AdminData {
  id: number;
  username: string;
  adminRole: string;
  active: boolean;
  createdAt: string;
  user: {
    id: number;
    name: string;
    firstName: string;
    email: string;
    tel: string;
    address: string;
    type: string;
    avatar: string | null;
    createdAt: string;
    updatedAt: string;
  };
}

export interface DashboardStats {
  totalMembers: number;
  activeMembers: number;
  membersInRule: number;
  membersNotInRule: number;
  cashboxes: Array<{ id: number; name: string; balance: number }>;
}

// GET /admin/super/dashboard
export async function getSuperDashboard(): Promise<DashboardStats> {
  return fetchWithAuth("/admin/super/dashboard");
}

// GET /admin/super/admins
export async function getAllAdmins(): Promise<AdminData[]> {
  return fetchWithAuth("/admin/super/admins");
}

// GET /admin/super/admins/:id
export async function getAdminById(id: number): Promise<AdminData> {
  return fetchWithAuth(`/admin/super/admins/${id}`);
}

// POST /admin/super/admins
export async function createAdmin(data: {
  name: string;
  firstName: string;
  email: string;
  username: string;
  password: string;
  role: string;
}): Promise<AdminData> {
  const params = new URLSearchParams({
    name: data.name,
    firstName: data.firstName,
    email: data.email,
    username: data.username,
    password: data.password,
    role: data.role,
  });
  return fetchWithAuth(`/admin/super/admins?${params.toString()}`, {
    method: "POST",
  });
}

// PUT /admin/super/admins/:id/deactivate
export async function deactivateAdmin(id: number): Promise<void> {
  return fetchWithAuth(`/admin/super/admins/${id}/deactivate`, {
    method: "PUT",
  });
}

// PUT /admin/super/admins/:id/activate
export async function activateAdmin(id: number): Promise<void> {
  return fetchWithAuth(`/admin/super/admins/${id}/activate`, {
    method: "PUT",
  });
}

// DELETE /admin/super/admins/:id
export async function deleteAdmin(id: number): Promise<void> {
  return fetchWithAuth(`/admin/super/admins/${id}`, {
    method: "DELETE",
  });
}

// DELETE /admin/super/members/:id
export async function deleteMember(id: number): Promise<void> {
  return fetchWithAuth(`/admin/super/members/${id}`, {
    method: "DELETE",
  });
}

// PUT /admin/super/users/password
export async function changeUserPasswordByEmail(email: string, newPassword: string): Promise<void> {
  const params = new URLSearchParams({ email, newPassword });
  return fetchWithAuth(`/admin/super/users/password?${params.toString()}`, {
    method: "PUT",
  });
}

