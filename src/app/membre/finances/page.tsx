"use client";

import { useEffect, useState } from "react";
import styles from "../membre.module.css";
import { useTranslation } from "@/context/LanguageContext";
import { memberService } from "@/services/memberService";
import { useNotification } from "@/context/NotificationContext";

type Tab = "epargne" | "dettes";

export default function FinancesPage() {
  const { t, locale } = useTranslation();
  const { showToast } = useNotification();
  const [activeTab, setActiveTab] = useState<Tab>("epargne");
  const [loading, setLoading] = useState(true);
  
  // Data states
  const [savings, setSavings] = useState<any[]>([]);
  const [savingBalance, setSavingBalance] = useState(0);
  const [debts, setDebts] = useState<any[]>([]);

  useEffect(() => {
    async function loadFinances() {
      setLoading(true);
      try {
        const [savData, balData, debtData] = await Promise.all([
          memberService.getMySavings(),
          memberService.getSavingBalance(),
          memberService.getDebts(),
        ]);
        setSavings(savData || []);
        setSavingBalance(balData?.balance || 0);
        setDebts(debtData || []);
      } catch (err: any) {
        showToast("Erreur lors du chargement des données financières", "error");
      } finally {
        setLoading(false);
      }
    }
    loadFinances();
  }, []);

  function formatAmount(n: number) {
    return (n || 0).toLocaleString(locale === "fr" ? "fr-FR" : "en-US");
  }

  const totalDebt = Array.isArray(debts) ? debts.reduce((sum, d) => sum + (d.amount || 0), 0) : 0;

  if (loading) return (
    <div className={styles.container}>
      <div className={styles.loadingContainer}>
        <div className={styles.loadingSpinner}></div>
        <span className={styles.loadingText}>Chargement de vos finances...</span>
      </div>
    </div>
  );

  return (
    <div className={styles.container}>
      <header className="fade-in-up" style={{ marginBottom: "2rem" }}>
        <h1 style={{ fontSize: "1.8rem", fontWeight: 800, color: "#2e3b4e", letterSpacing: "-0.02em" }}>
          Mes <span className="text-gradient">Finances</span>
        </h1>
        <p style={{ color: "#858796", fontSize: "0.95rem" }}>Consultez votre épargne et suivez vos dettes en un seul endroit.</p>
      </header>

      {/* Summary KPI Cards */}
      <div className={`${styles.dashboardGrid} stagger-children`} style={{ marginBottom: "2rem" }}>
        <div className={styles.statCard}>
          <div className={styles.statIcon} style={{ background: "rgba(28,200,138,0.1)", color: "#1cc88a" }}>
            <i className="fas fa-piggy-bank"></i>
          </div>
          <div className={styles.statInfo}>
            <span className={styles.statLabel}>Solde Épargne</span>
            <span className={styles.statValue} style={{ color: "#1cc88a" }}>{formatAmount(savingBalance)} <small>XAF</small></span>
          </div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statIcon} style={{ background: "rgba(78,115,223,0.1)", color: "#4e73df" }}>
            <i className="fas fa-arrow-up"></i>
          </div>
          <div className={styles.statInfo}>
            <span className={styles.statLabel}>Versements</span>
            <span className={styles.statValue}>{savings.filter(s => s.type === "DEPOSIT").length}</span>
          </div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statIcon} style={{ background: totalDebt > 0 ? "rgba(231,74,59,0.1)" : "rgba(28,200,138,0.1)", color: totalDebt > 0 ? "#e74a3b" : "#1cc88a" }}>
            <i className={`fas ${totalDebt > 0 ? "fa-exclamation-triangle" : "fa-check-circle"}`}></i>
          </div>
          <div className={styles.statInfo}>
            <span className={styles.statLabel}>Dettes Totales</span>
            <span className={styles.statValue} style={{ color: totalDebt > 0 ? "#e74a3b" : "#1cc88a" }}>{formatAmount(totalDebt)} <small>XAF</small></span>
          </div>
        </div>
      </div>

      <div className={styles.tabsContainer}>
        <div className={styles.tabsHeader}>
          <button 
            className={`${styles.tabBtn} ${activeTab === "epargne" ? styles.tabBtnActive : ""}`}
            onClick={() => setActiveTab("epargne")}
          >
            <i className="fas fa-piggy-bank"></i> Épargne
          </button>
          <button 
            className={`${styles.tabBtn} ${activeTab === "dettes" ? styles.tabBtnActive : ""}`}
            onClick={() => setActiveTab("dettes")}
          >
            <i className="fas fa-exclamation-circle"></i> Mes Dettes
          </button>
        </div>

        <div className={styles.tabContent}>
          {activeTab === "epargne" && (
            <div className="fade-in">
              <div className={styles.tableWrapper}>
                <table className={styles.dataTable}>
                  <thead>
                    <tr>
                      <th>Type</th>
                      <th>Montant</th>
                      <th>Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {savings.map((s) => (
                      <tr key={s.id}>
                        <td>
                           <span className={styles.statusBadge} style={{ background: s.type === "DEPOSIT" ? "rgba(28,200,138,0.1)" : "rgba(231,74,59,0.1)", color: s.type === "DEPOSIT" ? "#1cc88a" : "#e74a3b" }}>
                             {s.type === "DEPOSIT" ? "VERSEMENT" : "RETRAIT"}
                           </span>
                        </td>
                        <td style={{ fontWeight: 700 }}>{formatAmount(s.amount)} XAF</td>
                        <td style={{ color: "#858796", fontSize: "0.85rem" }}>{new Date(s.createdAt).toLocaleDateString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {savings.length === 0 && (
                  <div className="empty-state" style={{ border: "none", borderRadius: 0 }}>
                    <i className="fas fa-piggy-bank"></i>
                    <p>Aucun historique d&apos;épargne.</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === "dettes" && (
            <div className="fade-in">
              <div className={styles.tableWrapper}>
                <table className={styles.dataTable}>
                  <thead>
                    <tr>
                      <th>Catégorie</th>
                      <th>Description</th>
                      <th>Montant dû</th>
                      <th>Session</th>
                    </tr>
                  </thead>
                  <tbody>
                    {Array.isArray(debts) && debts.map((d, i) => (
                      <tr key={i}>
                        <td>
                          <span className={styles.statusBadge} style={{ background: "rgba(246,194,62,0.1)", color: "#f6c23e" }}>
                            {d.type || "DETTE"}
                          </span>
                        </td>
                        <td style={{ fontWeight: 600 }}>{d.description || d.type || "Dette Divers"}</td>
                        <td style={{ color: "#e74a3b", fontWeight: 700 }}>{formatAmount(d.amount)} XAF</td>
                        <td style={{ color: "#858796", fontSize: "0.85rem" }}>{d.sessionName || "N/A"}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {(!debts || debts.length === 0) && (
                  <div className="empty-state" style={{ border: "none", borderRadius: 0 }}>
                    <i className="fas fa-check-circle"></i>
                    <p>Aucune dette enregistrée.</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
