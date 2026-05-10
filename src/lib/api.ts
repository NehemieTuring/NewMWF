import { getAuth, clearAuth } from "../services/authService";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api";

export async function fetchWithAuth(endpoint: string, options: RequestInit = {}) {
  const auth = typeof window !== 'undefined' ? getAuth() : null;
  const token = auth?.token;
  
  const headers: any = {
    ...options.headers,
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };

  // Only set application/json if not already set and not FormData
  if (!headers["Content-Type"] && !(options.body instanceof FormData)) {
    headers["Content-Type"] = "application/json";
  }

  console.log(`🌐 Calling API: ${options.method || 'GET'} ${API_BASE_URL}${endpoint}`);

  let res;
  try {
    res = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers,
    });
  } catch (err) {
    console.error("❌ API Fetch Error:", err);
    if (err instanceof Error && (err.message.includes("Failed to fetch") || err.name === "TypeError")) {
      throw new Error("Impossible de se connecter au serveur. Veuillez vérifier votre connexion internet ou contacter l'administrateur.");
    }
    throw err;
  }

  if (res.status === 401) {
    if (typeof window !== 'undefined') {
      clearAuth();
      window.location.href = "/connexion";
    }
    throw new Error("Session expirée. Veuillez vous reconnecter.");
  }

  if (!res.ok) {
    const errorData = await res.json().catch(() => null);
    let message = errorData?.message || `Erreur ${res.status}`;
    
    // Check for common internal server errors or SQL errors
    if (res.status === 500) {
      if (message.includes("JDBC") || message.includes("SQL") || message.includes("column")) {
        message = "Le serveur rencontre une erreur de synchronisation avec la base de données. Veuillez redémarrer l'application backend.";
      } else {
        message = "Une erreur interne du serveur est survenue. Veuillez réessayer plus tard.";
      }
    }
    
    throw new Error(message);
  }

  if (res.status === 204) return null;
  
  const text = await res.text();
  return text ? JSON.parse(text) : null;
}
