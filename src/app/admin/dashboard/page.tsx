"use client";

import React from "react";
import ProtectedRoute from "@/components/auth/ProtectedRoute";

const AdminDashboard = () => {
  return (
    <ProtectedRoute requiredRole={["ROLE_ADMIN", "ROLE_SUPER_ADMIN"]}>
      <div className="p-8">
        <h1 className="text-3xl font-bold mb-6">Tableau de Bord Administrateur</h1>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-700">
            <h3 className="text-gray-400 text-sm font-medium">Membres Totaux</h3>
            <p className="text-3xl font-bold text-blue-400 mt-2">1,284</p>
          </div>
          <div className="bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-700">
            <h3 className="text-gray-400 text-sm font-medium">Épargne Globale</h3>
            <p className="text-3xl font-bold text-green-400 mt-2">45,000,000 FCFA</p>
          </div>
          <div className="bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-700">
            <h3 className="text-gray-400 text-sm font-medium">Prêts Actifs</h3>
            <p className="text-3xl font-bold text-purple-400 mt-2">12,500,000 FCFA</p>
          </div>
        </div>
        
        <div className="mt-8 bg-gray-800 rounded-xl border border-gray-700 overflow-hidden">
          <div className="p-4 border-b border-gray-700 bg-gray-900/50">
            <h2 className="font-semibold">Dernières Activités</h2>
          </div>
          <div className="p-4">
            <p className="text-gray-400 italic">Chargement des données administratives sensibles...</p>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
};

export default AdminDashboard;
