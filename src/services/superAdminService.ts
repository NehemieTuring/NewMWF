import { getAuthHeaders } from "./authService";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api";

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
  const res = await fetch(`${API_BASE_URL}/admin/super/dashboard`, {
    headers: getAuthHeaders(),
  });
  if (!res.ok) throw new Error(`Erreur serveur (${res.status})`);
  return res.json();
}

// GET /admin/super/admins
export async function getAllAdmins(): Promise<AdminData[]> {
  const res = await fetch(`${API_BASE_URL}/admin/super/admins`, {
    headers: getAuthHeaders(),
  });
  if (!res.ok) throw new Error(`Erreur serveur (${res.status})`);
  return res.json();
}

// GET /admin/super/admins/:id
export async function getAdminById(id: number): Promise<AdminData> {
  const res = await fetch(`${API_BASE_URL}/admin/super/admins/${id}`, {
    headers: getAuthHeaders(),
  });
  if (!res.ok) throw new Error(`Erreur serveur (${res.status})`);
  return res.json();
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
  const res = await fetch(`${API_BASE_URL}/admin/super/admins?${params.toString()}`, {
    method: "POST",
    headers: getAuthHeaders(),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => null);
    throw new Error(err?.message || `Erreur serveur (${res.status})`);
  }
  return res.json();
}

// PUT /admin/super/admins/:id/deactivate
export async function deactivateAdmin(id: number): Promise<void> {
  const res = await fetch(`${API_BASE_URL}/admin/super/admins/${id}/deactivate`, {
    method: "PUT",
    headers: getAuthHeaders(),
  });
  if (!res.ok) throw new Error(`Erreur serveur (${res.status})`);
}

// PUT /admin/super/admins/:id/activate
export async function activateAdmin(id: number): Promise<void> {
  const res = await fetch(`${API_BASE_URL}/admin/super/admins/${id}/activate`, {
    method: "PUT",
    headers: getAuthHeaders(),
  });
  if (!res.ok) throw new Error(`Erreur serveur (${res.status})`);
}

// DELETE /admin/super/admins/:id
export async function deleteAdmin(id: number): Promise<void> {
  const res = await fetch(`${API_BASE_URL}/admin/super/admins/${id}`, {
    method: "DELETE",
    headers: getAuthHeaders(),
  });
  if (!res.ok) throw new Error(`Erreur serveur (${res.status})`);
}

// DELETE /admin/super/members/:id
export async function deleteMember(id: number): Promise<void> {
  const res = await fetch(`${API_BASE_URL}/admin/super/members/${id}`, {
    method: "DELETE",
    headers: getAuthHeaders(),
  });
  if (!res.ok) throw new Error(`Erreur serveur (${res.status})`);
}

// PUT /admin/super/users/password
export async function changeUserPasswordByEmail(email: string, newPassword: string): Promise<void> {
  const params = new URLSearchParams({ email, newPassword });
  const res = await fetch(`${API_BASE_URL}/admin/super/users/password?${params.toString()}`, {
    method: "PUT",
    headers: getAuthHeaders(),
  });
  if (!res.ok) throw new Error(`Erreur serveur (${res.status})`);
}
