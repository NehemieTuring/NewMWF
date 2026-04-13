"use client";

import { useEffect, useState } from "react";
import styles from "./epargnes.module.css";
import { useTranslation } from "@/context/LanguageContext";
import { memberService } from "@/services/memberService";

export default function MyEpargnesPage() {
  const { t, locale } = useTranslation();
  const [savings, setSavings] = useState<any[]>([]);
  const [balance, setBalance] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadSavings() {
      try {
        const [historyData, balanceData] = await Promise.all([
          memberService.getMySavings(),
          memberService.getSavingBalance(),
        ]);
        setSavings(historyData);
        setBalance(balanceData);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    loadSavings();
  }, []);

  function formatAmount(n: number) {
    return (n || 0).toLocaleString(locale === "fr" ? "fr-FR" : "en-US");
  }

  if (loading) return <div className={styles.loading}>Chargement de vos épargnes...</div>;
  if (error) return <div className={styles.errorBanner}>{error}</div>;

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <div className={styles.headerInfo}>
          <h1 className={styles.title}>{t.common.mesEpargnes}</h1>
          <p className={styles.subtitle}>Consultez l'historique de vos dépôts d'épargne</p>
        </div>
        <div className={styles.totalCard}>
          <span className={styles.totalLabel}>{t.epargnes.balance}</span>
          <span className={styles.totalValue}>{formatAmount(balance)} XAF</span>
        </div>
      </div>

      <div className={styles.tableCard}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Session / Exercice</th>
              <th>{t.epargnes.depot}</th>
              <th>Date</th>
              <th>Statut</th>
            </tr>
          </thead>
          <tbody>
            {savings.map((e) => (
              <tr key={e.id}>
                <td className={styles.sessionName}>{e.sessionName || `Exercice ${e.exerciseYear}`}</td>
                <td className={styles.amount}>
                   {e.type === "DEPOSIT" ? "+" : "-"} {formatAmount(e.amount)} XAF
                </td>
                <td>{new Date(e.createdAt).toLocaleDateString(locale === "fr" ? "fr-FR" : "en-US")}</td>
                <td>
                  <span className={`${styles.badge} ${e.type === "DEPOSIT" ? styles.badgeDeposit : styles.badgeWithdrawal}`}>
                    {e.type === "DEPOSIT" ? "DÉPÔT" : "RETRAIT"}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {savings.length === 0 && <div className={styles.empty}>Aucun historique d'épargne trouvé.</div>}
      </div>

      <div className={styles.actions}>
        <button className={styles.actionBtn}>
          <i className="fas fa-plus"></i> Nouveau dépôt
        </button>
      </div>
    </div>
  );
}

