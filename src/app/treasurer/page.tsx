"use client";

import { useEffect, useState } from "react";
import { treasurerService } from "@/services/treasurerService";
import styles from "./treasurer.module.css";
import Link from "next/link";
import ServerDateTime from "@/components/ServerDateTime";

export default function TreasurerDashboard() {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchStats() {
      try {
        const data = await treasurerService.getGlobalTransactions();
        setStats(data);
      } catch (err: any) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchStats();
  }, []);

  if (loading) return <div className="fas fa-spinner fa-spin" style={{ fontSize: "2rem", color: "#4e73df", margin: "5rem auto", display: "block" }}></div>;

  const quickActions = [
    { label: "Trésorerie Globale", icon: "fas fa-vault", href: "/treasurer/tresorerie", color: "#4e73df" },
    { label: "Membres & Comptes", icon: "fas fa-users", href: "/treasurer/membres", color: "#1cc88a" },
    { label: "Messagerie", icon: "fas fa-comments", href: "/membre/messages", color: "#f6c23e" },
    { label: "Mon Profil", icon: "fas fa-user-cog", href: "/membre/profil", color: "#36b9cc" },
  ];

  return (
    <div className={styles.container}>
      <header style={{ marginBottom: "2.5rem", display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "1rem" }}>
        <div>
          <h1 style={{ fontSize: "1.8rem", fontWeight: 800, color: "#2e3b4e" }}>Tableau de Bord Trésorier</h1>
          <p style={{ color: "#858796" }}>Aperçu de la santé financière et outils de gestion globale.</p>
        </div>
        <ServerDateTime />
      </header>

      {/* Primary Stats Grid */}
      <div className={styles.dashboardGrid}>
        <div className={styles.statCard}>
          <div className={styles.statIcon} style={{ background: "rgba(78,115,223,0.1)", color: "#4e73df" }}>
            <i className="fas fa-university"></i>
          </div>
          <div className={styles.statInfo}>
            <span className={styles.statLabel}>Solde Global (XAF)</span>
            <span className={styles.statValue}>{(stats?.globalBalance || 0).toLocaleString()}</span>
          </div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statIcon} style={{ background: "rgba(28,200,138,0.1)", color: "#1cc88a" }}>
            <i className="fas fa-hand-holding-usd"></i>
          </div>
          <div className={styles.statInfo}>
            <span className={styles.statLabel}>Total Remboursements</span>
            <span className={styles.statValue}>{(stats?.totalRefunds || 0).toLocaleString()}</span>
          </div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statIcon} style={{ background: "rgba(231,74,59,0.1)", color: "#e74a3b" }}>
            <i className="fas fa-exclamation-triangle"></i>
          </div>
          <div className={styles.statInfo}>
            <span className={styles.statLabel}>Total Pénalités</span>
            <span className={styles.statValue}>{(stats?.totalPenalties || 0).toLocaleString()}</span>
          </div>
        </div>
      </div>

      {/* Quick Actions Sections */}
      <section style={{ marginBottom: "3rem" }}>
        <h2 style={{ fontSize: "1.1rem", fontWeight: 700, marginBottom: "1.5rem", color: "#4e4f5d" }}>Outils de Management</h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))", gap: "1rem" }}>
           {quickActions.map((action) => (
             <Link key={action.label} href={action.href} style={{ background: "white", padding: "1.5rem", borderRadius: "20px", border: "1px solid #e3e6f0", display: "flex", flexDirection: "column", gap: "1rem", transition: "all 0.2s", textDecoration: "none" }}>
                <div style={{ width: "40px", height: "40px", borderRadius: "10px", background: `${action.color}15`, color: action.color, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.2rem" }}>
                   <i className={action.icon}></i>
                </div>
                <div>
                   <span style={{ display: "block", color: "#2e3b4e", fontWeight: 700, fontSize: "0.95rem" }}>{action.label}</span>
                   <span style={{ display: "block", color: "#858796", fontSize: "0.75rem", marginTop: "0.25rem" }}>Accéder au module</span>
                </div>
             </Link>
           ))}
        </div>
      </section>

      {/* Recent Transactions Table */}
      <section>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
           <h2 style={{ fontSize: "1.1rem", fontWeight: 700, margin: 0, color: "#4e4f5d" }}>Dernières Opérations Globales</h2>
           <Link href="/treasurer/tresorerie" style={{ fontSize: "0.8rem", fontWeight: 700, color: "#4e73df" }}>Voir tout le journal</Link>
        </div>
        <div className={styles.tableCard}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Date</th>
                <th>Type</th>
                <th>Motif</th>
                <th style={{ textAlign: "right" }}>Montant</th>
              </tr>
            </thead>
            <tbody>
              {stats?.recentTransactions?.map((tx: any) => (
                <tr key={tx.id}>
                  <td>{new Date(tx.date).toLocaleDateString()}</td>
                  <td>
                    <span className={`${styles.badge} ${tx.type === 'DEPOSIT' || tx.type === 'REFUND' ? styles.badgeSuccess : styles.badgeDanger}`}>
                       {tx.type}
                    </span>
                  </td>
                  <td style={{ color: "#858796" }}>{tx.description}</td>
                  <td style={{ textAlign: "right", fontWeight: 800, color: tx.type === 'DEPOSIT' || tx.type === 'REFUND' ? "#1cc88a" : "#e74a3b" }}>
                    {tx.amount.toLocaleString()} XAF
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
