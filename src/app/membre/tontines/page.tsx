"use client";

import { useState } from "react";
import styles from "./tontines.module.css";
import { useTranslation } from "@/context/LanguageContext";

const mockTontines = [
  { id: 1, name: "Tontine Hebdomadaire", total: 1000000, current: 500000, members: 20 },
  { id: 2, name: "Tontine Mensuelle", total: 500000, current: 200000, members: 15 },
];

export default function MemberTontinesPage() {
  const { t } = useTranslation();

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <h1 className={styles.title}>Les Tontines</h1>
        <p className={styles.subtitle}>Suivez les tontines auxquelles vous participez</p>
      </div>

      <div className={styles.grid}>
        {mockTontines.map((t) => (
          <div key={t.id} className={styles.card}>
            <div className={styles.cardHeader}>
              <div className={styles.icon}><i className="fas fa-coins"></i></div>
              <h3>{t.name}</h3>
            </div>
            <div className={styles.cardBody}>
              <div className={styles.statLine}>
                <span>Membres</span>
                <strong>{t.members}</strong>
              </div>
              <div className={styles.statLine}>
                <span>Ma participation</span>
                <strong>Active</strong>
              </div>
            </div>
            <div className={styles.cardFooter}>
              <button className={styles.detailsBtn}>Consulter</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
