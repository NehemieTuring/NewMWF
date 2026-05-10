"use client";

import { useEffect, useState } from "react";
import { treasurerService } from "@/services/treasurerService";
import { useNotification } from "@/context/NotificationContext";
import styles from "../treasurer.module.css";

type Tab = "caisses" | "transactions" | "bilans";

export default function TresoreriePage() {
  const { showToast, confirm: showConfirm } = useNotification();
  const [activeTab, setActiveTab] = useState<Tab>("caisses");
  const [loading, setLoading] = useState(true);
  
  // Data states
  const [stats, setStats] = useState<any>(null);
  const [transactions, setTransactions] = useState<any[]>([]);
  const [caisses, setCaisses] = useState<any[]>([]);

  useEffect(() => {
    async function loadTreasury() {
      setLoading(true);
      try {
        const [statsData, caissesData] = await Promise.all([
          treasurerService.getGlobalTransactions(),
          treasurerService.getCashboxes()
        ]);
        setStats(statsData);
        setTransactions(statsData?.recentTransactions || []);
        setCaisses(caissesData?.cashboxes || []);
      } catch (err: any) {
        showToast("Erreur lors du chargement des données de trésorerie", "error");
      } finally {
        setLoading(false);
      }
    }
    loadTreasury();
  }, []);

  const handleExpenditure = (e: React.FormEvent) => {
    e.preventDefault();
    const target = e.target as any;
    const amount = target.amount.value;
    const reason = target.reason.value;

    showConfirm({
      title: "Confirmer la dépense",
      message: `Voulez-vous enregistrer une dépense de ${amount} XAF pour : ${reason} ?`,
      type: "warning",
      confirmText: "Confirmer la dépense",
      onConfirm: async () => {
        try {
          await treasurerService.recordExpenditure(amount, reason, "Général");
          showToast("Dépense enregistrée !", "success");
          target.reset();
          // Refresh
          const caissesData = await treasurerService.getCashboxes();
          setCaisses(caissesData?.cashboxes || []);
        } catch (err: any) {
          showToast("Erreur: " + err.message, "error");
        }
      }
    });
  };

  if (loading) return <div className="fas fa-spinner fa-spin" style={{ fontSize: "2rem", color: "#4e73df", margin: "5rem auto", display: "block" }}></div>;

  return (
    <div className={styles.container}>
      <header style={{ marginBottom: "2rem" }}>
        <h1 style={{ fontSize: "1.8rem", fontWeight: 800, color: "#2e3b4e" }}>Comptabilité & Trésorerie</h1>
        <p style={{ color: "#858796" }}>Interface analytique et gestion globale des flux financiers.</p>
      </header>

      <div className={styles.tabsContainer}>
        <div className={styles.tabsHeader}>
          <button 
            className={`${styles.tabBtn} ${activeTab === "caisses" ? styles.tabBtnActive : ""}`}
            onClick={() => setActiveTab("caisses")}
          >
            <i className="fas fa-vault"></i> État des Caisses
          </button>
          <button 
            className={`${styles.tabBtn} ${activeTab === "transactions" ? styles.tabBtnActive : ""}`}
            onClick={() => setActiveTab("transactions")}
          >
            <i className="fas fa-receipt"></i> Journal Global
          </button>
          <button 
            className={`${styles.tabBtn} ${activeTab === "bilans" ? styles.tabBtnActive : ""}`}
            onClick={() => setActiveTab("bilans")}
          >
            <i className="fas fa-file-invoice-dollar"></i> Bilans & Rapports
          </button>
        </div>

        <div className={styles.tabContent}>
          {activeTab === "caisses" && (
            <div className="fade-in">
              <div className={styles.dashboardGrid}>
                {caisses.map((box) => (
                  <div key={box.name} className={styles.cashboxCard}>
                    <div className={styles.cashboxHeader}>
                      <h3>{box.name}</h3>
                      <i className="fas fa-briefcase"></i>
                    </div>
                    <div className={styles.cashboxValue}>
                      {box.balance?.toLocaleString()} <span>XAF</span>
                    </div>
                    <div className={styles.cashboxFooter}>
                      <i className="fas fa-check-circle" style={{ color: "#1cc88a" }}></i>
                      <span>Disponible immédiatement</span>
                    </div>
                  </div>
                ))}
              </div>

              <div className={styles.tableCard} style={{ padding: "2rem" }}>
                 <h3 style={{ marginBottom: "1.5rem", fontSize: "1.1rem", fontWeight: 700 }}>Enregistrer une opération de caisse</h3>
                 <form onSubmit={handleExpenditure} style={{ display: "grid", gridTemplateColumns: "1fr 2fr auto", gap: "1.5rem", alignItems: "flex-end" }}>
                    <div className={styles.inputGroup}>
                       <label style={{ fontSize: "0.85rem", fontWeight: 700, color: "#4e73df" }}>Montant (XAF)</label>
                       <input type="number" name="amount" className={styles.formInput} placeholder="Ex: 10000" required />
                    </div>
                    <div className={styles.inputGroup}>
                       <label style={{ fontSize: "0.85rem", fontWeight: 700, color: "#4e73df" }}>Motif / Description</label>
                       <input type="text" name="reason" className={styles.formInput} placeholder="Achat de fournitures..." required />
                    </div>
                    <button type="submit" className={styles.submitBtn} style={{ height: "48px" }}>
                       Enregistrer
                    </button>
                 </form>
              </div>
            </div>
          )}

          {activeTab === "transactions" && (
            <div className="fade-in">
              <div className={styles.tableCard}>
                <table className={styles.table}>
                  <thead>
                    <tr>
                      <th>Date</th>
                      <th>Type</th>
                      <th>Description</th>
                      <th style={{ textAlign: "right" }}>Montant</th>
                    </tr>
                  </thead>
                  <tbody>
                    {transactions.map((tx) => (
                      <tr key={tx.id}>
                        <td>{new Date(tx.date).toLocaleDateString()}</td>
                        <td>
                          <span className={`${styles.badge} ${tx.type === 'DEPOSIT' || tx.type === 'REFUND' ? styles.badgeSuccess : styles.badgeDanger}`}>
                            {tx.type === 'DEPOSIT' ? 'DEPÔT' : tx.type === 'REFUND' ? 'REVENU' : 'DÉPENSE'}
                          </span>
                        </td>
                        <td>{tx.description}</td>
                        <td style={{ textAlign: "right", fontWeight: 800, color: tx.type === 'DEPOSIT' || tx.type === 'REFUND' ? "#1cc88a" : "#e74a3b" }}>
                          {tx.type === 'DEPOSIT' || tx.type === 'REFUND' ? '+' : '-'} {tx.amount.toLocaleString()} XAF
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === "bilans" && (
            <div className="fade-in">
               <div className={styles.dashboardGrid}>
                  <div className={styles.statCard}>
                    <div className={styles.statIcon} style={{ background: "rgba(28,200,138,0.1)", color: "#1cc88a" }}>
                      <i className="fas fa-file-medical"></i>
                    </div>
                    <div className={styles.statInfo}>
                      <span className={styles.statLabel}>Total Épargnes</span>
                      <span className={styles.statValue}>{stats?.totalSavings?.toLocaleString()} XAF</span>
                    </div>
                  </div>
                  <div className={styles.statCard}>
                    <div className={styles.statIcon} style={{ background: "rgba(78,115,223,0.1)", color: "#4e73df" }}>
                      <i className="fas fa-hand-holding-usd"></i>
                    </div>
                    <div className={styles.statInfo}>
                      <span className={styles.statLabel}>Emprunts Actifs</span>
                      <span className={styles.statValue}>{stats?.totalBorrowings?.toLocaleString()} XAF</span>
                    </div>
                  </div>
               </div>
               <div style={{ padding: "4rem", textAlign: "center", background: "white", borderRadius: "20px", border: "1px dashed #e3e6f0" }}>
                  <i className="fas fa-chart-bar" style={{ fontSize: "3rem", color: "#4e73df", opacity: 0.2, marginBottom: "1rem" }}></i>
                  <h3>Génération de Rapports</h3>
                  <p style={{ color: "#858796" }}>Les bilans de fin d'exercice et de session sont générés automatiquement ici.</p>
                  <button className={styles.confirmBtn} style={{ marginTop: "1rem", background: "white", color: "#4e73df", border: "1px solid #4e73df" }}>
                     Exporter en PDF
                  </button>
               </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
