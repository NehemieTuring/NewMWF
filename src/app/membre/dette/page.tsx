"use client";

import { useState } from "react";
import styles from "./dette.module.css";
import { useTranslation } from "@/context/LanguageContext";

export default function MemberDettePage() {
  const { t, locale } = useTranslation();

  const mockDette = {
    total: 175000,
    items: [
      { id: 1, type: "Restant de prêt L-001", amount: 175000, date: "2026-03-31" },
    ]
  };

  function formatAmount(n: number) {
    return n.toLocaleString(locale === "fr" ? "fr-FR" : "en-US");
  }

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <h1 className={styles.title}>{t.common.maDette}</h1>
        <p className={styles.subtitle}>État de vos créances vis-à-vis de la mutuelle</p>
      </div>

      <div className={styles.totalCard}>
        <div className={styles.icon}><i className="fas fa-wallet"></i></div>
        <span className={styles.label}>Montant Total Dû</span>
        <span className={styles.value}>{formatAmount(mockDette.total)} XAF</span>
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
            {mockDette.items.map((it) => (
              <tr key={it.id}>
                <td className={styles.typeName}>{it.type}</td>
                <td><span className={styles.amount}>{formatAmount(it.amount)} XAF</span></td>
                <td>{new Date(it.date).toLocaleDateString(locale === "fr" ? "fr-FR" : "en-US")}</td>
                <td>
                  <button className={styles.payBtn}>Payer maintenant</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
