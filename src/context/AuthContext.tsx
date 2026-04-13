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
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Restore auth from localStorage on mount
  useEffect(() => {
    const stored = getAuth();
    if (stored) {
      setUser(stored);
    }
    setLoading(false);
  }, []);

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
        subRole: data.subRole 
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

  const isAuthenticated = !!user;

  return (
    <AuthContext.Provider value={{ user, loading, error, login, logout, isAuthenticated }}>
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
