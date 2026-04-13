"use client";

import { useEffect, useState } from "react";
import styles from "./aides.module.css";
import { useTranslation } from "@/context/LanguageContext";
import { presidentService } from "@/services/presidentService";

export default function PresidentAidesPage() {
  const { locale } = useTranslation();
  const [aides, setAides] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadAides() {
      try {
        const data = await presidentService.getAllHelps();
        setAides(data || []);
      } catch (err) {
        console.error("Failed to load helps", err);
      } finally {
        setLoading(false);
      }
    }
    loadAides();
  }, []);

  function formatAmount(n: number) {
    return (n || 0).toLocaleString(locale === "fr" ? "fr-FR" : "en-US");
  }

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <h1 className={styles.title}>Consultation des Aides & Secours</h1>
        <p className={styles.subtitle}>Suivi de toutes les actions de solidarité envers les membres.</p>
      </header>

      <div className={styles.tableCard}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Bénéficiaire</th>
              <th>Type d'Aide</th>
              <th style={{ textAlign: "right" }}>Montant Cible</th>
              <th style={{ textAlign: "right" }}>Collecté</th>
              <th>Statut</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
                <tr><td colSpan={5} style={{ textAlign: "center", padding: "2rem" }}>Chargement...</td></tr>
            ) : aides.length > 0 ? (
                aides.map((a) => (
                <tr key={a.id}>
                  <td style={{ fontWeight: 600 }}>{a.member?.user?.name} {a.member?.user?.firstName}</td>
                  <td>{a.helpType?.name}</td>
                  <td style={{ textAlign: "right" }}>{formatAmount(a.targetAmount)} XAF</td>
                  <td style={{ textAlign: "right", fontWeight: 700 }}>{formatAmount(a.collectedAmount)} XAF</td>
                  <td>
                    <span className={styles.badge}>{a.status}</span>
                  </td>
                </tr>
              ))
            ) : (
                <tr><td colSpan={5} className={styles.empty}>Aucune aide enregistrée.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
