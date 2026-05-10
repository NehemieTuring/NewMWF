"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: string | string[];
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, requiredRole }) => {
  const { isLogged, userRole, loading, hasRole } = useAuth();
  const router = useRouter();
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    // 1. Wait for auth initialization from localStorage
    if (loading) return;

    // 2. Check Authentication
    if (!isLogged) {
      router.replace("/connexion");
      return;
    }

    // 3. Check Role Authorization
    if (requiredRole) {
      if (!hasRole(requiredRole)) {
        router.replace("/access-denied");
        return;
      }
    }

    setIsAuthorized(true);
  }, [isLogged, userRole, loading, requiredRole, router, hasRole]);

  // Display Loading state during initial verification
  if (loading || (!isAuthorized && isLogged)) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-900">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        <p className="ml-4 text-white font-medium">Vérification de la sécurité...</p>
      </div>
    );
  }

  return isAuthorized ? <>{children}</> : null;
};

export default ProtectedRoute;
