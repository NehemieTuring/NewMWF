"use client";

import { useState } from "react";
import styles from "./contributions.module.css";
import { useTranslation } from "@/context/LanguageContext";

const mockContributions = [
  { id: 1, type: "Fond Social", amount: 5000, date: "2026-03-15", session: "Session Mars 2026" },
  { id: 2, type: "Fond Social", amount: 5000, date: "2026-02-15", session: "Session Février 2026" },
  { id: 3, type: "Fond Social", amount: 5000, date: "2026-01-15", session: "Session Janvier 2026" },
];

export default function MemberContributionsPage() {
  const { t, locale } = useTranslation();

  function formatAmount(n: number) {
    return n.toLocaleString(locale === "fr" ? "fr-FR" : "en-US");
  }

  const total = mockContributions.reduce((acc, curr) => acc + curr.amount, 0);

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <div className={styles.headerInfo}>
          <h1 className={styles.title}>{t.common.mesContributions}</h1>
          <p className={styles.subtitle}>Liste de vos participations au fond social</p>
        </div>
        <div className={styles.totalCard}>
          <span className={styles.totalLabel}>Cumul des fonds</span>
          <span className={styles.totalValue}>{formatAmount(total)} XAF</span>
        </div>
      </div>

      <div className={styles.tableCard}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Session / Mois</th>
              <th>Type</th>
              <th>Montant</th>
              <th>Date de paiement</th>
              <th>Statut</th>
            </tr>
          </thead>
          <tbody>
            {mockContributions.map((c) => (
              <tr key={c.id}>
                <td className={styles.sessionName}>{c.session}</td>
                <td>{c.type}</td>
                <td className={styles.amount}>+{formatAmount(c.amount)} XAF</td>
                <td>{new Date(c.date).toLocaleDateString(locale === "fr" ? "fr-FR" : "en-US")}</td>
                <td>
                  <span className={styles.badge}>AQUITTÉ</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
