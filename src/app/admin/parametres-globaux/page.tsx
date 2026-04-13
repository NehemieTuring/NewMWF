"use client";

import { useState } from "react";
import styles from "../admin.module.css";
import { useNotification } from "@/context/NotificationContext";

export default function ParametresGlobauxPage() {
  const { showToast } = useNotification();
  const [loading, setLoading] = useState(false);

  const handleSave = () => {
    setLoading(true);
    // Simulation d'une sauvegarde
    setTimeout(() => {
      setLoading(false);
      showToast("La configuration globale a été mise à jour avec succès.", "success");
    }, 1000);
  };

  return (
    <div className={styles.container}>
      <header className="fade-in-up" style={{ marginBottom: "2.5rem" }}>
        <h1 style={{ fontSize: "2.2rem", fontWeight: 900, color: "#1a365d", marginBottom: "0.5rem", letterSpacing: "-0.03em" }}>
          Paramètres <span className="text-gradient">Globaux</span>
        </h1>
        <p style={{ color: "#718096", fontSize: "1.05rem", fontWeight: 500 }}>
          Configurez les règles de gestion par défaut de la mutuelle.
        </p>
      </header>

      <div className="fade-in" style={{ maxWidth: "850px" }}>
        <div className={styles.glassCard} style={{ border: "1px solid #e2e8f0", padding: "2.5rem" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "1.25rem", marginBottom: "3rem" }}>
            <div style={{ width: "64px", height: "64px", borderRadius: "20px", background: "linear-gradient(135deg, #4e73df, #224abe)", display: "flex", alignItems: "center", justifyContent: "center", color: "white", fontSize: "1.8rem" }}>
              <i className="fas fa-tools"></i>
            </div>
            <div>
              <h3 style={{ margin: 0, fontSize: "1.6rem", fontWeight: 800, color: "#2d3748" }}>Configuration du Système</h3>
              <p style={{ color: "#718096", fontSize: "0.95rem", margin: 0 }}>Ces paramètres s'appliquent à tous les nouveaux exercices et membres.</p>
            </div>
          </div>
          
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "2.5rem" }}>
            <div className="stagger-delayed">
              <label style={{ display: "block", fontSize: "0.9rem", fontWeight: 800, color: "#4a5568", marginBottom: "0.75rem", textTransform: "uppercase", letterSpacing: "0.5px" }}>
                Taux d'intérêt (%)
              </label>
              <div style={{ position: "relative" }}>
                <input type="number" className={styles.formInput} defaultValue="3.0" step="0.5" style={{ paddingRight: "3rem" }} />
                <span style={{ position: "absolute", right: "1.25rem", top: "50%", transform: "translateY(-50%)", color: "#a0aec0", fontWeight: 700 }}>%</span>
              </div>
              <small style={{ color: "#a0aec0", marginTop: "0.5rem", display: "block" }}>Appliqué par défaut aux nouveaux emprunts.</small>
            </div>
            
            <div className="stagger-delayed">
              <label style={{ display: "block", fontSize: "0.9rem", fontWeight: 800, color: "#4a5568", marginBottom: "0.75rem", textTransform: "uppercase", letterSpacing: "0.5px" }}>
                Fonds Social Mensuel (Défaut)
              </label>
              <div style={{ position: "relative" }}>
                <input type="number" className={styles.formInput} defaultValue="150000" style={{ paddingRight: "4rem" }} />
                <span style={{ position: "absolute", right: "1.25rem", top: "50%", transform: "translateY(-50%)", color: "#a0aec0", fontWeight: 700 }}>XAF</span>
              </div>
              <small style={{ color: "#a0aec0", marginTop: "0.5rem", display: "block" }}>Montant suggéré pour les nouveaux exercices.</small>
            </div>
            
            <div className="stagger-delayed">
              <label style={{ display: "block", fontSize: "0.9rem", fontWeight: 800, color: "#4a5568", marginBottom: "0.75rem", textTransform: "uppercase", letterSpacing: "0.5px" }}>
                Limite d'Emprunts Simultanés
              </label>
              <div style={{ position: "relative" }}>
                <input type="number" className={styles.formInput} defaultValue="2" />
                <div style={{ position: "absolute", right: "1.25rem", top: "50%", transform: "translateY(-50%)", color: "#a0aec0" }}>
                  <i className="fas fa-hand-holding-usd"></i>
                </div>
              </div>
              <small style={{ color: "#a0aec0", marginTop: "0.5rem", display: "block" }}>Nombre maximum de prêts actifs par membre.</small>
            </div>

            <div className="stagger-delayed">
              <label style={{ display: "block", fontSize: "0.9rem", fontWeight: 800, color: "#4a5568", marginBottom: "0.75rem", textTransform: "uppercase", letterSpacing: "0.5px" }}>
                Délai de Remboursement Max
              </label>
              <div style={{ position: "relative" }}>
                <input type="number" className={styles.formInput} defaultValue="10" style={{ paddingRight: "4rem" }} />
                <span style={{ position: "absolute", right: "1.25rem", top: "50%", transform: "translateY(-50%)", color: "#a0aec0", fontWeight: 700 }}>Mois</span>
              </div>
              <small style={{ color: "#a0aec0", marginTop: "0.5rem", display: "block" }}>Durée maximale pour rembourser un prêt.</small>
            </div>

            <div className="stagger-delayed" style={{ gridColumn: "span 2" }}>
              <label style={{ display: "block", fontSize: "0.9rem", fontWeight: 800, color: "#4a5568", marginBottom: "0.75rem", textTransform: "uppercase", letterSpacing: "0.5px" }}>
                Notification de Rappel (Jours avant échéance)
              </label>
              <input type="number" className={styles.formInput} defaultValue="7" />
              <small style={{ color: "#a0aec0", marginTop: "0.5rem", display: "block" }}>Envoie une notification automatique aux membres.</small>
            </div>
          </div>
          
          <div style={{ marginTop: "4rem", paddingTop: "2rem", borderTop: "1px solid #edf2f7", display: "flex", justifyContent: "flex-end" }}>
            <button 
              className={styles.confirmBtn} 
              onClick={handleSave}
              disabled={loading}
              style={{ 
                background: "linear-gradient(135deg, #4e73df, #224abe)", 
                padding: "1.1rem 2.5rem", 
                borderRadius: "16px", 
                boxShadow: "0 10px 20px rgba(78, 115, 223, 0.2)",
                fontSize: "1rem",
                fontWeight: 700
              }}
            >
              {loading ? <i className="fas fa-spinner fa-spin"></i> : "Enregistrer la configuration"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
