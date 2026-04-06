"use client";

import { useState } from "react";
import styles from "./exercices.module.css";
import { useTranslation } from "@/context/LanguageContext";

const mockExercices = [
  { id: 1, year: 2026, status: "ACTIVE", start: "2026-01-01", end: "2026-12-31" },
  { id: 2, year: 2025, status: "CLOSED", start: "2025-01-01", end: "2025-12-31" },
];

export default function MemberExercicesPage() {
  const { t, locale } = useTranslation();

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <h1 className={styles.title}>{t.admin.exercices}</h1>
        <p className={styles.subtitle}>Consultez l'historique des exercices de la mutuelle</p>
      </div>

      <div className={styles.grid}>
        {mockExercices.map((ex) => (
          <div key={ex.id} className={styles.card}>
            <div className={styles.cardHeader}>
              <div className={styles.icon}><i className="fas fa-history"></i></div>
              <h3>Exercice {ex.year}</h3>
            </div>
            <div className={styles.cardBody}>
              <div className={styles.dates}>
                <div>
                  <span>Du</span>
                  <strong>{new Date(ex.start).toLocaleDateString(locale === "fr" ? "fr-FR" : "en-US")}</strong>
                </div>
                <div>
                  <span>Au</span>
                  <strong>{new Date(ex.end).toLocaleDateString(locale === "fr" ? "fr-FR" : "en-US")}</strong>
                </div>
              </div>
              <span className={`${styles.badge} ${ex.status === "ACTIVE" ? styles.badgeActive : styles.badgeClosed}`}>
                {ex.status === "ACTIVE" ? t.dashboard.active.toUpperCase() : "FERMÉ"}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
