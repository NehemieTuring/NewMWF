"use client";

import React from "react";
import Link from "next/link";
import { ShieldAlert, ArrowLeft } from "lucide-react";

const AccessDenied = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-950 text-white p-6">
      <div className="bg-red-500/10 p-4 rounded-full mb-6">
        <ShieldAlert size={64} className="text-red-500 animate-pulse" />
      </div>
      <h1 className="text-4xl font-bold mb-2">Accès Refusé</h1>
      <p className="text-gray-400 text-center max-w-md mb-8">
        Désolé, vous ne possédez pas les autorisations nécessaires pour accéder à cette page. 
        Veuillez contacter l'administrateur si vous pensez qu'il s'agit d'une erreur.
      </p>
      <Link 
        href="/" 
        className="flex items-center gap-2 bg-white text-black px-6 py-3 rounded-lg font-semibold hover:bg-gray-200 transition-colors"
      >
        <ArrowLeft size={20} />
        Retour à l'accueil
      </Link>
    </div>
  );
};

export default AccessDenied;
