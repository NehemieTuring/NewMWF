"use client";

import { useEffect, useState } from "react";
import { treasurerService } from "@/services/treasurerService";
import dashboardStyles from "../../admin/dashboard.module.css";
import styles from "../treasurer.module.css";

export default function TreasurerPenalties() {
  const [penalties, setPenalties] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadPenalties() {
      try {
        const data = await treasurerService.getPenalties();
        setPenalties(data || []);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    loadPenalties();
  }, []);

  if (loading) return (
    <div className={dashboardStyles.loadingContainer}>
      <div className="fas fa-exclamation-triangle fa-spin"></div>
      <span>Chargement des pénalités...</span>
    </div>
  );

  return (
    <div className={dashboardStyles.dashboard}>
      <header className={dashboardStyles.sessionBanner} style={{ background: "linear-gradient(135deg, #e74a3b 0%, #be2617 100%)" }}>
        <div className={dashboardStyles.sessionInfo}>
          <div className={dashboardStyles.sessionBadge} style={{ background: "rgba(255,255,255,0.2)" }}>
            <i className="fas fa-exclamation-circle"></i>
            <span>Retards et Manquements</span>
          </div>
          <h1 className={dashboardStyles.sessionTitle}>Gestion des Pénalités</h1>
          <p className={dashboardStyles.sessionExercise}>Suivez et gérez les pénalités appliquées aux membres de la mutuelle</p>
        </div>
      </header>

      <div className={dashboardStyles.mainGrid}>
        <div className={dashboardStyles.cardSection}>
          <div className={dashboardStyles.sectionHeader} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "2rem" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "1.5rem" }}>
              <h2 className={dashboardStyles.sectionTitle} style={{ margin: 0 }}>Liste des Pénalités</h2>
              <span style={{ background: "rgba(231, 74, 59, 0.1)", color: "#e74a3b", padding: "0.4rem 1rem", borderRadius: "50px", fontSize: "0.85rem", fontWeight: 700 }}>
                {penalties.length} En attente
              </span>
            </div>
            <div className={dashboardStyles.searchBox}>
              <i className="fas fa-search"></i>
              <input type="text" placeholder="Rechercher par membre ou motif..." />
            </div>
          </div>

          {error && <div className={dashboardStyles.errorAlert}>{error}</div>}

          <div className={dashboardStyles.tableWrapper}>
            <table className={dashboardStyles.table}>
              <thead>
                <tr>
                  <th>Membre</th>
                  <th>Motif</th>
                  <th>Date d'échéance</th>
                  <th style={{ textAlign: "right" }}>Montant</th>
                  <th style={{ textAlign: "center" }}>Statut</th>
                </tr>
              </thead>
              <tbody>
                {penalties.length > 0 ? (
                  penalties.map((penalty) => (
                    <tr key={penalty.id}>
                      <td style={{ fontWeight: 600 }}>{penalty.memberName}</td>
                      <td style={{ color: "#4b5563" }}>{penalty.reason}</td>
                      <td>{new Date(penalty.dueDate).toLocaleDateString()}</td>
                      <td style={{ textAlign: "right", fontWeight: 700, color: "#dc2626" }}>
                        {penalty.amount.toLocaleString()} FCFA
                      </td>
                      <td style={{ textAlign: "center" }}>
                        <span className={`${dashboardStyles.badge} ${penalty.paid ? dashboardStyles.badgeGreen : dashboardStyles.badgeRed}`} style={{ minWidth: "100px", textAlign: "center" }}>
                          {penalty.paid ? "PAYÉE" : "IMPAYÉE"}
                        </span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} style={{ textAlign: "center", padding: "6rem" }}>
                      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "1rem", opacity: 0.5 }}>
                        <i className="fas fa-check-circle" style={{ fontSize: "3.5rem", color: "#10b981" }}></i>
                        <p style={{ fontWeight: 600 }}>Félicitations ! Aucune pénalité en attente.</p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
