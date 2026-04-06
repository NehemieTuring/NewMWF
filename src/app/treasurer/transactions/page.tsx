"use client";

import { useEffect, useState } from "react";
import { treasurerService } from "@/services/treasurerService";
import dashboardStyles from "../../admin/dashboard.module.css";
import styles from "../treasurer.module.css";

export default function TreasurerTransactions() {
  const [transactions, setTransactions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadTransactions() {
      try {
        const data = await treasurerService.getGlobalTransactions();
        setTransactions(data?.recentTransactions || []);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    loadTransactions();
  }, []);

  if (loading) return (
    <div className={dashboardStyles.loadingContainer}>
      <div className="fas fa-circle-notch fa-spin"></div>
      <span>Chargement des transactions...</span>
    </div>
  );

  return (
    <div className={dashboardStyles.dashboard}>
      <header className={dashboardStyles.sessionBanner}>
        <div className={dashboardStyles.sessionInfo}>
          <div className={dashboardStyles.sessionBadge}>
            <i className="fas fa-receipt"></i>
            <span>Historique</span>
          </div>
          <h1 className={dashboardStyles.sessionTitle}>Journal des Transactions</h1>
          <p className={dashboardStyles.sessionExercise}>Consultez l'ensemble des flux financiers de la mutuelle</p>
        </div>
      </header>

      <div className={dashboardStyles.mainGrid}>
        <div className={dashboardStyles.cardSection}>
          <div className={dashboardStyles.sectionHeader} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "2rem", padding: "0 0.5rem" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "1.5rem" }}>
              <h2 className={dashboardStyles.sectionTitle} style={{ margin: 0 }}>Toutes les Transactions</h2>
              <span style={{ 
                background: "rgba(78, 115, 223, 0.1)", 
                color: "#4e73df", 
                padding: "0.4rem 1rem", 
                borderRadius: "50px", 
                fontSize: "0.85rem", 
                fontWeight: 700 
              }}>
                {transactions.length} Total
              </span>
            </div>
            <div className={dashboardStyles.searchBox}>
              <i className="fas fa-search"></i>
              <input 
                type="text" 
                placeholder="Rechercher par date, type ou motif..." 
              />
            </div>
          </div>

          {error && <div className={dashboardStyles.errorAlert}>{error}</div>}

          <div className={dashboardStyles.tableWrapper}>
            <table className={dashboardStyles.table}>
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Type</th>
                  <th>Description</th>
                  <th style={{ textAlign: "right" }}>Montant</th>
                  <th style={{ textAlign: "center" }}>Statut</th>
                </tr>
              </thead>
              <tbody>
                {transactions.length > 0 ? (
                  transactions.map((tx) => (
                    <tr key={tx.id}>
                      <td style={{ fontWeight: 500 }}>{new Date(tx.date).toLocaleDateString("fr-FR", { day: 'numeric', month: 'long', year: 'numeric' })}</td>
                      <td>
                        <span className={`${dashboardStyles.badge} ${tx.type === 'DEPOSIT' || tx.type === 'REFUND' ? dashboardStyles.badgeGreen : dashboardStyles.badgeRed}`} style={{ minWidth: "100px", textAlign: "center" }}>
                          {tx.type === 'DEPOSIT' ? 'DEPÔT' : tx.type === 'REFUND' ? 'REVENU' : 'DÉPENSE'}
                        </span>
                      </td>
                      <td style={{ color: "#4b5563" }}>{tx.description}</td>
                      <td style={{ textAlign: "right", fontWeight: 700, fontSize: "1.05rem", color: tx.type === 'DEPOSIT' || tx.type === 'REFUND' ? "#059669" : "#dc2626" }}>
                        {tx.type === 'DEPOSIT' || tx.type === 'REFUND' ? '+' : '-'} {tx.amount.toLocaleString()} FCFA
                      </td>
                      <td style={{ textAlign: "center" }}>
                        <span className={dashboardStyles.statusDot} style={{ background: "#059669" }}></span>
                        <span style={{ fontSize: "0.8rem", color: "#6b7280", marginLeft: "0.5rem" }}>Confirmé</span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} style={{ textAlign: "center", padding: "5rem" }}>
                      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "1rem", opacity: 0.5 }}>
                        <i className="fas fa-file-invoice" style={{ fontSize: "3rem" }}></i>
                        <p>Aucune transaction trouvée</p>
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
