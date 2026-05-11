"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from "react";
import {
  loginApi,
  saveAuth,
  getAuth,
  clearAuth,
  AuthUser,
  LoginResponse,
} from "@/services/authService";

interface AuthContextType {
  user: AuthUser | null;
  loading: boolean;
  error: string;
  login: (email: string, password: string) => Promise<LoginResponse>;
  logout: () => void;
  isAuthenticated: boolean;
  isLogged: boolean;
  userRole: string | null;
  hasRole: (role: string | string[]) => boolean;
  refreshUser: () => void;
  updateUser: (data: Partial<AuthUser>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Restore auth from localStorage on mount and verify it
  useEffect(() => {
    const initAuth = async () => {
      const stored = getAuth();
      if (stored) {
        // We have a stored user, but we should verify the token
        try {
          const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api";
          // Try to fetch profile to verify token
          const res = await fetch(`${API_BASE_URL}/member/profile`, {
            headers: { Authorization: `Bearer ${stored.token}` }
          });
          
          if (res.ok) {
            setUser(stored);
          } else if (res.status === 401 || res.status === 403) {
            // Token is invalid or unauthorized, clear it
            console.warn("🔐 Session invalid or unauthorized (Status: " + res.status + "), clearing auth...");
            clearAuth();
            setUser(null);
          } else {
            // Server error or other issue (500, etc.), keep local data for now but set loading false
            setUser(stored);
          }
        } catch (e) {
          // Network error, trust localStorage but expect errors later
          setUser(stored);
        }
      }
      setLoading(false);
    };
    
    initAuth();
  }, []);

  // Auto-sync avatar from backend if missing
  useEffect(() => {
    if (user && !user.avatar) {
      const syncProfile = async () => {
        const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api";
        try {
          // Try member profile first
          let res = await fetch(`${API_BASE_URL}/member/profile`, {
            headers: { Authorization: `Bearer ${user.token}` }
          });
          
          if (!res.ok) {
            // Try admin profile if member fails
            res = await fetch(`${API_BASE_URL}/admin/profile`, {
              headers: { Authorization: `Bearer ${user.token}` }
            });
          }

          if (res.ok) {
            const data = await res.json();
            const avatar = data?.avatar || data?.photoUrl || data?.user?.avatar || data?.user?.photoUrl;
            if (avatar) {
              updateUser({ avatar });
            }
          }
        } catch (e) {
          console.error("AuthContext sync failed", e);
        }
      };
      syncProfile();
    }
  }, [user?.id, user?.token]);

  const login = useCallback(async (email: string, password: string): Promise<LoginResponse> => {
    setLoading(true);
    setError("");
    try {
      const data = await loginApi(email, password);
      saveAuth(data);
      setUser({ 
        id: data.id || 0, 
        token: data.token, 
        email: data.email, 
        username: data.username, 
        role: data.role, 
        subRole: data.subRole,
        avatar: data.avatar
      });
      return data;
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Erreur inconnue";
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const logout = useCallback(() => {
    clearAuth();
    setUser(null);
    setError("");
  }, []);

  const hasRole = useCallback((role: string | string[]): boolean => {
    if (!user || !user.role) return false;
    
    const normalize = (r: string) => r.toUpperCase().replace(/^ROLE_/, "");
    const userRole = normalize(user.role);
    
    if (Array.isArray(role)) {
      return role.some(r => normalize(r) === userRole);
    }
    return normalize(role) === userRole;
  }, [user]);

  const refreshUser = useCallback(() => {
    const stored = getAuth();
    if (stored) {
      setUser(stored);
    }
  }, []);

  const updateUser = useCallback((data: Partial<AuthUser>) => {
    setUser(prev => {
      if (!prev) return null;
      const newUser = { ...prev, ...data };
      // Also update localStorage
      if (data.avatar) localStorage.setItem("auth_avatar", data.avatar);
      if (data.username) localStorage.setItem("auth_username", data.username);
      // add other fields if needed
      return newUser;
    });
  }, []);

  const isLogged = !!user;
  const userRole = user ? user.role : null;

  return (
    <AuthContext.Provider value={{ 
      user, 
      loading, 
      error, 
      login, 
      logout, 
      isAuthenticated: isLogged, 
      isLogged, 
      userRole, 
      hasRole,
      refreshUser,
      updateUser
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
