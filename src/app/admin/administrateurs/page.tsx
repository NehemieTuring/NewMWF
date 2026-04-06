"use client";

import { useState } from "react";
import styles from "./administrateurs.module.css";
import { useTranslation } from "@/context/LanguageContext";

const mockAdmins: any[] = [];

export default function AdministrateursPage() {
  const { t, locale } = useTranslation();

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>{t.admin.administrateurs}</h1>
          <p className={styles.subtitle}>{t.admin.gestionAcces}</p>
        </div>
        <button className={styles.addBtn}>
          <i className="fas fa-robot"></i> {t.admin.ajouterAdmin}
        </button>
      </div>

      <div className={styles.grid}>
        {mockAdmins.map((admin) => (
          <div key={admin.id} className={styles.card}>
            <div className={styles.cardHeader}>
              <div className={styles.avatar}><i className="fas fa-user-shield"></i></div>
              <h3>{admin.name}</h3>
            </div>
            <div className={styles.cardBody}>
              <div className={styles.roleTag}>{admin.role}</div>
              <p className={styles.email}>{admin.email}</p>
            </div>
            <div className={styles.cardFooter}>
              <button className={styles.actionBtn}><i className="fas fa-edit text-primary"></i></button>
              <button className={styles.actionBtn}><i className="fas fa-trash text-danger"></i></button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
