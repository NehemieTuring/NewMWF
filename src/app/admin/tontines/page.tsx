"use client";

import { useState } from "react";
import styles from "./tontines.module.css";
import { useTranslation } from "@/context/LanguageContext";

const mockTontines = [
  { id: 1, name: "Tontine A", total: 1000000, current: 500000, members: 20 },
  { id: 2, name: "Tontine B", total: 500000, current: 200000, members: 15 },
];

export default function TontinesPage() {
  const { t, locale } = useTranslation();

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>{t.admin.typesTontine}</h1>
          <p className={styles.subtitle}>Gestion des tontines actives et types de tontines</p>
        </div>
        <button className={styles.addBtn}>
          <i className="fas fa-plus"></i> Créer une tontine
        </button>
      </div>

      <div className={styles.grid}>
        {mockTontines.map((t) => (
          <div key={t.id} className={styles.card}>
            <div className={styles.cardHeader}>
              <div className={styles.icon}><i className="fas fa-coins"></i></div>
              <h3>{t.name}</h3>
            </div>
            <div className={styles.cardBody}>
              <div className={styles.stat}>
                <span>Membres</span>
                <strong>{t.members}</strong>
              </div>
              <div className={styles.stat}>
                <span>Total</span>
                <strong>{t.total.toLocaleString()} XAF</strong>
              </div>
            </div>
            <div className={styles.cardFooter}>
              <button className={styles.detailsBtn}>Détails</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
