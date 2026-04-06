"use client";

import { useState } from "react";
import styles from "./typesTontine.module.css";
import { useTranslation } from "@/context/LanguageContext";

const mockTontineTypes = [
  { id: 1, name: "Tontine Hebdomadaire", period: "SEM", amount: 10000 },
  { id: 2, name: "Tontine Mensuelle", period: "MEN", amount: 50000 },
  { id: 3, name: "Tontine de Solidarité", period: "MEN", amount: 5000 },
];

export default function TypesTontinePage() {
  const { t, locale } = useTranslation();

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>{t.admin.typesTontine}</h1>
          <p className={styles.subtitle}>Définition des fréquences et montants des tontines</p>
        </div>
        <button className={styles.addBtn}>
          <i className="fas fa-plus"></i> Nouveau type
        </button>
      </div>

      <div className={styles.grid}>
        {mockTontineTypes.map((type) => (
          <div key={type.id} className={styles.card}>
            <div className={styles.cardHeader}>
              <div className={styles.icon}><i className="fas fa-coins"></i></div>
              <h3>{type.name}</h3>
            </div>
            <div className={styles.cardBody}>
              <div className={styles.stat}>
                <span>Périodicité</span>
                <strong>{type.period === "SEM" ? "Hebdomadaire" : "Mensuelle"}</strong>
              </div>
              <div className={styles.stat}>
                <span>Cotisation</span>
                <strong>{type.amount.toLocaleString()} XAF</strong>
              </div>
            </div>
            <div className={styles.cardFooter}>
              <button className={styles.actionBtn}><i className="fas fa-edit"></i></button>
              <button className={styles.actionBtn}><i className="fas fa-trash text-danger"></i></button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
