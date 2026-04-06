"use client";

import { useState } from "react";
import styles from "./typesAide.module.css";
import { useTranslation } from "@/context/LanguageContext";

const mockAidTypes = [
  { id: 1, name: "Aide Médicale", description: "En cas d'hospitalisation ou chirurgie", amount: 300000 },
  { id: 2, name: "Aide Scolaire", description: "Frais de scolarité des enfants", amount: 200000 },
  { id: 3, name: "Naissance", description: "Soutien pour heureux événement", amount: 100000 },
];

export default function MemberTypesAidePage() {
  const { t, locale } = useTranslation();

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <h1 className={styles.title}>{t.admin.typesAide}</h1>
        <p className={styles.subtitle}>Consultez les différents types d'aides que vous pouvez solliciter</p>
      </div>

      <div className={styles.grid}>
        {mockAidTypes.map((type) => (
          <div key={type.id} className={styles.card}>
            <div className={styles.cardHeader}>
              <div className={styles.icon}><i className="fas fa-hand-holding-heart"></i></div>
              <h3>{type.name}</h3>
            </div>
            <div className={styles.cardBody}>
              <p className={styles.description}>{type.description}</p>
              <div className={styles.limitBox}>
                <span className={styles.limitLabel}>Montant Plafond</span>
                <span className={styles.limitValue}>{type.amount.toLocaleString()} XAF</span>
              </div>
            </div>
            <div className={styles.cardFooter}>
              <button className={styles.requestBtn}>
                <i className="fas fa-paper-plane"></i> Solliciter une aide
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
