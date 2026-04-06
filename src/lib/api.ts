import { getAuth, clearAuth } from "../services/authService";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api";

export async function fetchWithAuth(endpoint: string, options: RequestInit = {}) {
  const auth = typeof window !== 'undefined' ? getAuth() : null;
  const token = auth?.token;
  
  const headers = {
    "Content-Type": "application/json",
    ...options.headers,
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };

  console.log(`🌐 Calling API: ${options.method || 'GET'} ${API_BASE_URL}${endpoint}`);

  const res = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (res.status === 401) {
    if (typeof window !== 'undefined') {
      clearAuth();
      window.location.href = "/connexion";
    }
    throw new Error("Session expirée. Veuillez vous reconnecter.");
  }

  if (!res.ok) {
    const errorData = await res.json().catch(() => null);
    throw new Error(errorData?.message || `Erreur ${res.status}`);
  }

  if (res.status === 204) return null;
  return res.json();
}
