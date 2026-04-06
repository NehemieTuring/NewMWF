"use client";

import { useEffect, useState } from "react";
import { treasurerService } from "@/services/treasurerService";
import dashboardStyles from "../admin/dashboard.module.css";

export default function TreasurerDashboard() {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchStats() {
      try {
        const data = await treasurerService.getGlobalTransactions();
        setStats(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchStats();
  }, []);

  if (loading) return <div className={dashboardStyles.loading}>Chargement des données financières...</div>;
  if (error) return <div className={dashboardStyles.error}>Erreur: {error}</div>;

  return (
    <div className={dashboardStyles.dashboard}>
      <header className={dashboardStyles.sessionBanner}>
        <div className={dashboardStyles.sessionInfo}>
          <div className={dashboardStyles.sessionBadge}>
            <i className="fas fa-chart-line"></i>
            <span>Performance Financière</span>
          </div>
          <h1 className={dashboardStyles.sessionTitle}>Tableau de Bord Trésorier</h1>
          <p className={dashboardStyles.sessionExercise}>Suivi en temps réel de la santé financière de la mutuelle</p>
        </div>
        <div className={dashboardStyles.sessionActions}>
          <button className={dashboardStyles.sessionBtn} onClick={() => window.location.href='/treasurer/caisses'}>
            <i className="fas fa-plus-circle"></i>
            Nouvelle Opération
          </button>
        </div>
      </header>

      <div className={dashboardStyles.statsGrid} style={{ gridTemplateColumns: "repeat(3, 1fr)" }}>
        <div className={dashboardStyles.statCard}>
          <div className={`${dashboardStyles.statIcon}`} style={{ background: "rgba(78, 115, 223, 0.1)", color: "#4e73df" }}>
            <i className="fas fa-money-bill-wave"></i>
          </div>
          <div className={dashboardStyles.statContent}>
            <span className={dashboardStyles.statLabel}>Solde Global</span>
            <h3 className={dashboardStyles.statValue}>{(stats?.globalBalance || 0).toLocaleString()} <span className={dashboardStyles.statUnit}>FCFA</span></h3>
          </div>
        </div>
        <div className={dashboardStyles.statCard}>
          <div className={`${dashboardStyles.statIcon}`} style={{ background: "rgba(28, 200, 138, 0.1)", color: "#1cc88a" }}>
            <i className="fas fa-hand-holding-usd"></i>
          </div>
          <div className={dashboardStyles.statContent}>
            <span className={dashboardStyles.statLabel}>Total Remboursements</span>
            <h3 className={dashboardStyles.statValue}>{(stats?.totalRefunds || 0).toLocaleString()} <span className={dashboardStyles.statUnit}>FCFA</span></h3>
          </div>
        </div>
        <div className={dashboardStyles.statCard}>
          <div className={`${dashboardStyles.statIcon}`} style={{ background: "rgba(231, 74, 59, 0.1)", color: "#e74a3b" }}>
            <i className="fas fa-exclamation-triangle"></i>
          </div>
          <div className={dashboardStyles.statContent}>
            <span className={dashboardStyles.statLabel}>Total Pénalités</span>
            <h3 className={dashboardStyles.statValue}>{(stats?.totalPenalties || 0).toLocaleString()} <span className={dashboardStyles.statUnit}>FCFA</span></h3>
          </div>
        </div>
      </div>

      <div className={dashboardStyles.mainGrid}>
        <div className={dashboardStyles.cardSection}>
          <div className={dashboardStyles.sectionHeader} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
            <h2 className={dashboardStyles.sectionTitle}>
              <i className="fas fa-history" style={{ marginRight: "0.75rem", color: "#4e73df" }}></i>
              Opérations Récentes
            </h2>
            <span className={dashboardStyles.badge} style={{ padding: "0.5rem 1rem", borderRadius: "50px" }}>
              {stats?.recentTransactions?.length || 0} Transactions
            </span>
          </div>
          
          <div className={dashboardStyles.tableWrapper}>
            <table className={dashboardStyles.table}>
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Type</th>
                  <th>Description</th>
                  <th style={{ textAlign: "right" }}>Montant</th>
                </tr>
              </thead>
              <tbody>
                {stats?.recentTransactions?.length > 0 ? (
                  stats.recentTransactions.map((tx: any) => (
                    <tr key={tx.id}>
                      <td style={{ fontWeight: 500 }}>{new Date(tx.date).toLocaleDateString("fr-FR", { day: 'numeric', month: 'short' })}</td>
                      <td>
                        <span className={`${dashboardStyles.badge} ${tx.type === 'DEPOSIT' || tx.type === 'REFUND' ? dashboardStyles.badgeGreen : dashboardStyles.badgeRed}`} style={{ minWidth: "80px", textAlign: "center" }}>
                          {tx.type === 'DEPOSIT' ? 'Dépot' : tx.type === 'REFUND' ? 'Revenu' : 'Dépense'}
                        </span>
                      </td>
                      <td style={{ color: "var(--text-muted)", fontSize: "0.9rem" }}>{tx.description}</td>
                      <td style={{ textAlign: "right", fontWeight: 700, color: tx.type === 'DEPOSIT' || tx.type === 'REFUND' ? "#1cc88a" : "#e74a3b" }}>
                        {tx.type === 'DEPOSIT' || tx.type === 'REFUND' ? '+' : '-'} {tx.amount.toLocaleString()} FCFA
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={4} style={{ textAlign: "center", padding: "4rem", color: "var(--text-muted)" }}>
                      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "1rem" }}>
                        <i className="fas fa-inbox" style={{ fontSize: "2rem", opacity: 0.3 }}></i>
                        <span>Aucune transaction récente à afficher</span>
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
