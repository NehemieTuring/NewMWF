"use client";

import { useEffect, useState } from "react";
import { treasurerService } from "@/services/treasurerService";
import { useNotification } from "@/context/NotificationContext";
import styles from "../treasurer.module.css";
import { useTranslation } from "@/context/LanguageContext";
import TreasurerBilansPage from "../bilans/page";

type Tab = "caisses" | "transactions" | "bilans";

export default function TresoreriePage() {
  const { t, locale } = useTranslation();
  const { showToast, confirm: showConfirm } = useNotification();
  const [activeTab, setActiveTab] = useState<Tab>("caisses");
  const [loading, setLoading] = useState(true);

  // Data states
  const [stats, setStats] = useState<any>(null);
  const [transactions, setTransactions] = useState<any[]>([]);
  const [caisses, setCaisses] = useState<any[]>([]);

  const getCaisseDisplayName = (name: string) => {
    switch (name?.toUpperCase()) {
      case "SAVING":
        return "Caisse d'Épargne";
      case "SOLIDARITY":
        return "Caisse de Solidarité (Fond Social)";
      case "INSCRIPTION":
        return "Caisse d'Inscription (Adhésion)";
      case "MUTUAL_FUND":
        return "Caisse du Fond Mutuel";
      case "LOAN":
        return "Caisse des Emprunts & Prêts";
      default:
        return name?.replace('_', ' ') || "";
    }
  };

  const getCaisseIcon = (name: string) => {
    switch (name?.toUpperCase()) {
      case "SAVING":
        return "fas fa-piggy-bank";
      case "SOLIDARITY":
        return "fas fa-hand-holding-heart";
      case "INSCRIPTION":
        return "fas fa-id-card";
      case "MUTUAL_FUND":
        return "fas fa-coins";
      case "LOAN":
        return "fas fa-handshake";
      default:
        return "fas fa-wallet";
    }
  };

  const getCaisseColor = (name: string) => {
    switch (name?.toUpperCase()) {
      case "SAVING":
        return "#4e73df"; // Blue
      case "SOLIDARITY":
        return "#e74a3b"; // Red
      case "INSCRIPTION":
        return "#1cc88a"; // Green
      case "MUTUAL_FUND":
        return "#f6c23e"; // Yellow
      case "LOAN":
        return "#36b9cc"; // Cyan
      default:
        return "#858796"; // Grey
    }
  };

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
        setCaisses(Array.isArray(caissesData) ? caissesData : (caissesData?.cashboxes || statsData?.cashboxes || []));
      } catch (err: any) {
        showToast(err.message || t.tresorerie.chargement, "error");
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
      title: t.tresorerie.confirmerDepense,
      message: t.tresorerie.confirmDepenseMsg.replace("{amount}", amount).replace("{reason}", reason),
      type: "warning",
      confirmText: t.tresorerie.confirmerDepense,
      onConfirm: async () => {
        try {
          await treasurerService.recordExpenditure(amount, reason, "Général");
          showToast(t.tresorerie.succesDepense, "success");
          target.reset();
          // Refresh
          const caissesData = await treasurerService.getCashboxes();
          setCaisses(Array.isArray(caissesData) ? caissesData : (caissesData?.cashboxes || []));
        } catch (err: any) {
          showToast(t.superAdmin.erreur + ": " + err.message, "error");
        }
      }
    });
  };

  const handleExportPDF = () => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    const html = `
      <html>
        <head>
          <title>${t.tresorerie.rapportTitre}</title>
          <style>
            body { font-family: 'Inter', sans-serif; padding: 40px; color: #333; }
            .header { border-bottom: 2px solid #4e73df; padding-bottom: 20px; margin-bottom: 30px; display: flex; justify-content: space-between; align-items: center; }
            .logo { font-size: 24px; font-weight: 800; color: #4e73df; }
            .stats-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 30px; }
            .stat-box { padding: 20px; border: 1px solid #e3e6f0; border-radius: 10px; }
            .stat-label { font-size: 12px; color: #858796; text-transform: uppercase; font-weight: 700; }
            .stat-value { font-size: 20px; font-weight: 800; color: #2e3b4e; }
            table { width: 100%; border-collapse: collapse; margin-top: 20px; }
            th { background: #f8f9fc; padding: 12px; text-align: left; border-bottom: 2px solid #e3e6f0; }
            td { padding: 12px; border-bottom: 1px solid #e3e6f0; }
          </style>
        </head>
        <body>
          <div class="header">
            <div class="logo">${t.tresorerie.rapportTitre}</div>
            <div>${new Date().toLocaleDateString()}</div>
          </div>
          <h1>${t.tresorerie.situationGlobale}</h1>
          <div class="stats-grid">
            <div class="stat-box">
              <div class="stat-label">${t.tresorerie.totalEpargnes}</div>
              <div class="stat-value">${stats?.totalSavings?.toLocaleString()} XAF</div>
            </div>
            <div class="stat-box">
              <div class="stat-label">${t.tresorerie.empruntsEnCours}</div>
              <div class="stat-value">${stats?.totalBorrowings?.toLocaleString()} XAF</div>
            </div>
          </div>
          <h2>${t.tresorerie.etatCaisses}</h2>
          <table>
            <thead><tr><th>${t.tresorerie.etatCaisses.split(" ")[2] || "Caisse"}</th><th>${t.dashboard.solde}</th></tr></thead>
            <tbody>
              ${caisses.map(c => `<tr><td>${c.name}</td><td><strong>${c.balance?.toLocaleString()} XAF</strong></td></tr>`).join('')}
            </tbody>
          </table>
          <script>window.onload = function() { window.print(); window.close(); }</script>
        </body>
      </html>
    `;
    printWindow.document.write(html);
    printWindow.document.close();
    showToast(t.common.modifier + "...", "success");
  };

  if (loading) return <div className="fas fa-spinner fa-spin" style={{ fontSize: "2rem", color: "#4e73df", margin: "5rem auto", display: "block" }}></div>;

  return (
    <div className={styles.container}>
      <header style={{ marginBottom: "2rem" }}>
        <h1 style={{ fontSize: "1.8rem", fontWeight: 800, color: "#2e3b4e" }}>{t.tresorerie.titre}</h1>
        <p style={{ color: "#858796" }}>{t.tresorerie.sousTitre}</p>
      </header>

      <div className={styles.tabsContainer}>
        <div className={styles.tabsHeader}>
          <button
            className={`${styles.tabBtn} ${activeTab === "caisses" ? styles.tabBtnActive : ""}`}
            onClick={() => setActiveTab("caisses")}
          >
            <i className="fas fa-vault"></i> {t.tresorerie.etatCaisses}
          </button>
          <button
            className={`${styles.tabBtn} ${activeTab === "transactions" ? styles.tabBtnActive : ""}`}
            onClick={() => setActiveTab("transactions")}
          >
            <i className="fas fa-receipt"></i> {t.tresorerie.journalGlobal}
          </button>
          <button
            className={`${styles.tabBtn} ${activeTab === "bilans" ? styles.tabBtnActive : ""}`}
            onClick={() => setActiveTab("bilans")}
          >
            <i className="fas fa-file-invoice-dollar"></i> {t.tresorerie.bilansRapports}
          </button>
        </div>

        <div className={styles.tabContent}>
          {activeTab === "caisses" && (
            <div className="fade-in">
              <div className={styles.dashboardGrid}>
                {caisses.map((box) => (
                  <div key={box.id || box.name} className={styles.cashboxCard} style={{ borderLeft: `5px solid ${getCaisseColor(box.name)}` }}>
                    <div className={styles.cashboxHeader}>
                      <h3 style={{ textTransform: "none", fontWeight: 800 }}>{getCaisseDisplayName(box.name)}</h3>
                      <i className={getCaisseIcon(box.name)} style={{ color: getCaisseColor(box.name), background: `${getCaisseColor(box.name)}15` }}></i>
                    </div>
                    <div className={styles.cashboxValue}>
                      {box.balance?.toLocaleString()} <span>XAF</span>
                    </div>
                    <div className={styles.cashboxFooter}>
                      <i className="fas fa-check-circle" style={{ color: "#1cc88a" }}></i>
                      <span>{t.tresorerie.disponible}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === "transactions" && (
            <div className="fade-in">
              <div className={styles.tableCard}>
                <table className={styles.table}>
                  <thead>
                    <tr>
                      <th>{t.tresorerie.date}</th>
                      <th>{t.tresorerie.type}</th>
                      <th>{t.tresorerie.description}</th>
                      <th style={{ textAlign: "right" }}>{t.tresorerie.montant}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {transactions.map((tx) => (
                      <tr key={tx.id}>
                        <td>{new Date(tx.date).toLocaleDateString()}</td>
                        <td>
                          <span className={`${styles.badge} ${tx.amount >= 0 ? styles.badgeSuccess : styles.badgeDanger}`}>
                            {tx.amount >= 0 ? t.tresorerie.revenu : t.tresorerie.depense}
                          </span>
                        </td>
                        <td>{tx.description}</td>
                        <td style={{ textAlign: "right", fontWeight: 800, color: tx.amount >= 0 ? "#1cc88a" : "#e74a3b" }}>
                          {tx.amount >= 0 ? '+' : ''} {tx.amount.toLocaleString()} XAF
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
              <TreasurerBilansPage isEmbedded={true} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
