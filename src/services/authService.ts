const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api";

export interface LoginResponse {
  token: string;
  email: string;
  username?: string;
  role: string;
  subRole?: string;
}

export interface AuthUser {
  token: string;
  email: string;
  username?: string;
  role: string;
  subRole?: string;
}

export async function loginApi(
  identifier: string,
  password: string
): Promise<LoginResponse> {
  const res = await fetch(`${API_BASE_URL}/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ 
      identifier, 
      email: identifier, 
      username: identifier, 
      password 
    }),
  });

  if (!res.ok) {
    if (res.status === 401 || res.status === 403) {
      throw new Error("Nom d'utilisateur ou mot de passe incorrect");
    }
    
    const errorData = await res.json().catch(() => null);
    
    if (res.status === 400) {
      throw new Error(errorData?.message || "Veuillez remplir tous les champs correctement");
    }
    
    if (res.status === 404) {
      throw new Error("Le serveur d'authentification est indisponible actuellement");
    }

    throw new Error(
      errorData?.message || `Désolé, une erreur est survenue lors de la connexion (Code: ${res.status})`
    );
  }

  return res.json();
}

export function saveAuth(data: LoginResponse): void {
  localStorage.setItem("auth_token", data.token);
  localStorage.setItem("auth_email", data.email);
  if (data.username) localStorage.setItem("auth_username", data.username);
  localStorage.setItem("auth_role", data.role);
  if (data.subRole) localStorage.setItem("auth_sub_role", data.subRole);
}

export function getAuth(): AuthUser | null {
  if (typeof window === "undefined") return null;
  const token = localStorage.getItem("auth_token");
  const email = localStorage.getItem("auth_email");
  const username = localStorage.getItem("auth_username") || undefined;
  const role = localStorage.getItem("auth_role");
  const subRole = localStorage.getItem("auth_sub_role") || undefined;
  if (token && email && role) {
    return { token, email, username, role, subRole };
  }
  return null;
}

export function clearAuth(): void {
  localStorage.removeItem("auth_token");
  localStorage.removeItem("auth_email");
  localStorage.removeItem("auth_username");
  localStorage.removeItem("auth_role");
  localStorage.removeItem("auth_sub_role");
}

export function getAuthHeaders(): Record<string, string> {
  const auth = getAuth();
  if (auth) {
    return {
      Authorization: `Bearer ${auth.token}`,
      "Content-Type": "application/json",
    };
  }
  return { "Content-Type": "application/json" };
}
