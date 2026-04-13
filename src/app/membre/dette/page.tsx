"use client";

import { useEffect, useState } from "react";
import styles from "./dette.module.css";
import { useTranslation } from "@/context/LanguageContext";
import { memberService } from "@/services/memberService";

export default function MemberDettePage() {
  const { t, locale } = useTranslation();
  const [debts, setDebts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadDebts() {
      try {
        const data = await memberService.getDebts();
        setDebts(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Failed to load debts", err);
      } finally {
        setLoading(false);
      }
    }
    loadDebts();
  }, []);

  const totalDette = debts.reduce((sum, item) => sum + item.amount, 0);

  function formatAmount(n: number) {
    return n.toLocaleString(locale === "fr" ? "fr-FR" : "en-US");
  }

  if (loading) return <div className={styles.loading}>Chargement des dettes...</div>;

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <h1 className={styles.title}>{t.common.maDette}</h1>
        <p className={styles.subtitle}>État de vos créances vis-à-vis de la mutuelle</p>
      </div>

      <div className={styles.totalCard}>
        <div className={styles.icon}><i className="fas fa-wallet"></i></div>
        <span className={styles.label}>Montant Total Dû</span>
        <span className={styles.value}>{formatAmount(totalDette)} XAF</span>
      </div>

      <div className={styles.tableCard}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Type de Dette</th>
              <th>Montant</th>
              <th>Échéance</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {debts.length > 0 ? (
              debts.map((it) => (
                <tr key={it.id}>
                  <td className={styles.typeName}>{it.type || it.label || "Dette"}</td>
                  <td><span className={styles.amount}>{formatAmount(it.amount)} XAF</span></td>
                  <td>{it.dueDate ? new Date(it.dueDate).toLocaleDateString(locale === "fr" ? "fr-FR" : "en-US") : "N/A"}</td>
                  <td>
                    <button className={styles.payBtn}>Payer maintenant</button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={4} className={styles.empty}>Vous n'avez aucune dette en cours.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
