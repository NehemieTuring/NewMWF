"use client";

import { useEffect, useState } from "react";
import { treasurerService } from "@/services/treasurerService";
import dashboardStyles from "../../admin/dashboard.module.css";
import styles from "../treasurer.module.css";

export default function TreasurerExpenses() {
  const [expenses, setExpenses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadExpenses() {
      try {
        const data = await treasurerService.getGlobalTransactions();
        // Filter only withdrawal/expense types from recent transactions
        const filtered = data?.recentTransactions?.filter((tx: any) => tx.type === 'WITHDRAWAL' || tx.type === 'EXPENSE') || [];
        setExpenses(filtered);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    loadExpenses();
  }, []);

  if (loading) return (
    <div className={dashboardStyles.loadingContainer}>
      <div className="fas fa-file-invoice-dollar fa-spin"></div>
      <span>Chargement des dépenses...</span>
    </div>
  );

  return (
    <div className={dashboardStyles.dashboard}>
      <header className={dashboardStyles.sessionBanner} style={{ background: "linear-gradient(135deg, #f6c23e 0%, #f4b619 100%)" }}>
        <div className={dashboardStyles.sessionInfo}>
          <div className={dashboardStyles.sessionBadge} style={{ background: "rgba(0,0,0,0.1)", color: "#222" }}>
            <i className="fas fa-wallet"></i>
            <span>Flux Sortants</span>
          </div>
          <h1 className={dashboardStyles.sessionTitle} style={{ color: "#222" }}>Gestion des Dépenses</h1>
          <p className={dashboardStyles.sessionExercise} style={{ color: "#333" }}>Historique et justificatifs des dépenses de fonctionnement de la mutuelle</p>
        </div>
        <div className={dashboardStyles.sessionActions}>
          <button className={dashboardStyles.sessionBtn} style={{ background: "#222", color: "white" }} onClick={() => window.location.href='/treasurer/caisses'}>
             <i className="fas fa-plus"></i>
             Nouvelle Dépense
          </button>
        </div>
      </header>

      <div className={dashboardStyles.mainGrid}>
        <div className={dashboardStyles.cardSection}>
          <div className={dashboardStyles.sectionHeader} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "2rem" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "1.5rem" }}>
              <h2 className={dashboardStyles.sectionTitle} style={{ margin: 0 }}>Historique des Dépenses</h2>
              <span style={{ background: "rgba(246, 194, 62, 0.1)", color: "#f6c23e", padding: "0.4rem 1rem", borderRadius: "50px", fontSize: "0.85rem", fontWeight: 700 }}>
                {expenses.length} Total
              </span>
            </div>
            <div className={dashboardStyles.searchBox}>
              <i className="fas fa-search"></i>
              <input type="text" placeholder="Rechercher une dépense..." />
            </div>
          </div>

          <div className={dashboardStyles.tableWrapper}>
            <table className={dashboardStyles.table}>
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Motif / Description</th>
                  <th style={{ textAlign: "right" }}>Montant</th>
                  <th style={{ textAlign: "center" }}>Catégorie</th>
                </tr>
              </thead>
              <tbody>
                {expenses.length > 0 ? (
                  expenses.map((exp) => (
                    <tr key={exp.id}>
                      <td style={{ fontWeight: 500 }}>{new Date(exp.date).toLocaleDateString()}</td>
                      <td style={{ color: "#4b5563" }}>{exp.description}</td>
                      <td style={{ textAlign: "right", fontWeight: 700, color: "#e74a3b" }}>
                        - {exp.amount.toLocaleString()} FCFA
                      </td>
                      <td style={{ textAlign: "center" }}>
                        <span className={dashboardStyles.badge} style={{ background: "#fef3c7", color: "#92400e" }}>
                          FONCTIONNEMENT
                        </span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={4} style={{ textAlign: "center", padding: "5rem" }}>
                      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "1rem", opacity: 0.5 }}>
                        <i className="fas fa-receipt" style={{ fontSize: "3rem" }}></i>
                        <p>Aucune dépense enregistrée récemment</p>
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
