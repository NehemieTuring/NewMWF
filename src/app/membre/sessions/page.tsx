"use client";

import { useState } from "react";
import styles from "./sessions.module.css";
import { useTranslation } from "@/context/LanguageContext";

const mockSessions = [
  { id: 1, date: "2026-03-15", status: "ACTIVE", type: "ORDINAIRE" },
  { id: 2, date: "2026-02-15", status: "CLOSED", type: "ORDINAIRE" },
  { id: 3, date: "2026-01-15", status: "CLOSED", type: "ORDINAIRE" },
];

export default function MemberSessionsPage() {
  const { t, locale } = useTranslation();

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <h1 className={styles.title}>{t.admin.sessions}</h1>
        <p className={styles.subtitle}>Liste des sessions de la mutuelle</p>
      </div>

      <div className={styles.grid}>
        {mockSessions.map((s) => (
          <div key={s.id} className={styles.card}>
            <div className={styles.cardHeader}>
              <div className={styles.icon}><i className="fas fa-calendar-check"></i></div>
              <h3>{new Date(s.date).toLocaleDateString(locale === "fr" ? "fr-FR" : "en-US", { month: "long", year: "numeric", day: "numeric" })}</h3>
            </div>
            <div className={styles.cardBody}>
              <span className={`${styles.badge} ${s.status === "ACTIVE" ? styles.badgeActive : styles.badgeClosed}`}>
                {s.status === "ACTIVE" ? t.dashboard.active.toUpperCase() : "FERMÉE"}
              </span>
            </div>
            <div className={styles.cardFooter}>
              <button className={styles.detailsBtn}>Détails de la session</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
