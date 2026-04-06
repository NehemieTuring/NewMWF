"use client";

import { useState } from "react";
import styles from "./paiements.module.css";
import { useTranslation } from "@/context/LanguageContext";

const mockPaiements = [
  { id: 1, type: "Épargne Mars", amount: 50000, date: "2026-03-15", method: "OM/MOMO" },
  { id: 2, type: "Remboursement Prêt L-001", amount: 25000, date: "2026-03-15", method: "OM/MOMO" },
  { id: 3, type: "Épargne Février", amount: 50000, date: "2026-02-15", method: "Virement" },
];

export default function MemberPaiementsPage() {
  const { t, locale } = useTranslation();

  function formatAmount(n: number) {
    return n.toLocaleString(locale === "fr" ? "fr-FR" : "en-US");
  }

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <h1 className={styles.title}>{t.common.mesPaiements}</h1>
        <p className={styles.subtitle}>Historique complet de vos transactions financières</p>
      </div>

      <div className={styles.tableCard}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Type de Transaction</th>
              <th>Montant</th>
              <th>Date</th>
              <th>Méthode</th>
              <th>Statut</th>
            </tr>
          </thead>
          <tbody>
            {mockPaiements.map((p) => (
              <tr key={p.id}>
                <td className={styles.typeName}>{p.type}</td>
                <td><span className={styles.amount}>{formatAmount(p.amount)} XAF</span></td>
                <td>{new Date(p.date).toLocaleDateString(locale === "fr" ? "fr-FR" : "en-US")}</td>
                <td>{p.method}</td>
                <td>
                  <span className={styles.badge}>CONFIRMÉ</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
