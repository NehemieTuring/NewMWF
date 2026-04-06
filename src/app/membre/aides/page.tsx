"use client";

import { useState } from "react";
import styles from "./aides.module.css";
import { useTranslation } from "@/context/LanguageContext";

const mockAllAides = [
  { id: 1, type: "Aide médicale", member: "Jean Dupont", amount: 300000, collected: 150000, status: "ACTIVE", date: "2026-03-10" },
  { id: 2, type: "Aide scolaire", member: "Marie Kamga", amount: 200000, collected: 80000, status: "ACTIVE", date: "2026-03-12" },
  { id: 3, type: "Naissance", member: "Moi", amount: 100000, collected: 100000, status: "COMPLETED", date: "2026-02-15" },
];

export default function MyAidesPage() {
  const { t, locale } = useTranslation();

  function formatAmount(n: number) {
    return n.toLocaleString(locale === "fr" ? "fr-FR" : "en-US");
  }

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <h1 className={styles.title}>{t.admin.aides}</h1>
        <p className={styles.subtitle}>Consultez les aides en cours au sein de la mutuelle</p>
      </div>

      <div className={styles.grid}>
        {mockAllAides.map((a) => {
          const progress = Math.round((a.collected / a.amount) * 100);
          return (
            <div key={a.id} className={styles.card}>
              <div className={styles.cardHeader}>
                <div className={styles.aidIcon}><i className="fas fa-hand-holding-heart"></i></div>
                <div className={styles.aidMeta}>
                  <h3>{a.type}</h3>
                  <span className={styles.memberName}>{a.member === "Moi" ? "Ma demande" : a.member}</span>
                </div>
                <span className={`${styles.badge} ${a.status === "ACTIVE" ? styles.badgeActive : styles.badgeCompleted}`}>
                  {a.status === "ACTIVE" ? t.dashboard.active.toUpperCase() : t.dashboard.termine.toUpperCase()}
                </span>
              </div>
              <div className={styles.cardBody}>
                <div className={styles.progressLabel}>
                  <span>Progress</span>
                  <span>{progress}%</span>
                </div>
                <div className={styles.progressBar}>
                  <div className={styles.progressFill} style={{ width: `${progress}%` }}></div>
                </div>
                <div className={styles.statsPanel}>
                  <div className={styles.statCell}>
                    <span>Objectif</span>
                    <strong>{formatAmount(a.amount)} XAF</strong>
                  </div>
                  <div className={styles.statCell}>
                    <span>Reçu</span>
                    <strong style={{ color: "var(--primary)" }}>{formatAmount(a.collected)} XAF</strong>
                  </div>
                </div>
              </div>
              <div className={styles.cardFooter}>
                <button className={styles.detailsBtn}>
                  <i className="fas fa-eye"></i> Détails
                </button>
                {a.member !== "Moi" && a.status === "ACTIVE" && (
                  <button className={styles.donateBtn}>
                    <i className="fas fa-hand-holding-usd"></i> Participer
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
