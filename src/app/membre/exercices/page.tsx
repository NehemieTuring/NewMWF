"use client";

import { useEffect, useState } from "react";
import styles from "./exercices.module.css";
import { useTranslation } from "@/context/LanguageContext";
import { memberService } from "@/services/memberService";

export default function MemberExercicesPage() {
  const { t, locale } = useTranslation();
  const [exercices, setExercices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadExercices() {
      try {
        const data = await memberService.getExercises();
        setExercices(data || []);
      } catch (err) {
        console.error("Failed to load exercises", err);
      } finally {
        setLoading(false);
      }
    }
    loadExercices();
  }, []);

  if (loading) return <div className={styles.loading}>Chargement des exercices...</div>;

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <h1 className={styles.title}>{t.admin.exercices}</h1>
        <p className={styles.subtitle}>Consultez l'historique des exercices de la mutuelle</p>
      </div>

      <div className={styles.grid}>
        {exercices.length > 0 ? (
          exercices.map((ex) => (
            <div key={ex.id} className={styles.card}>
              <div className={styles.cardHeader}>
                <div className={styles.icon}><i className="fas fa-history"></i></div>
                <h3>Exercice {ex.year || ex.label}</h3>
              </div>
              <div className={styles.cardBody}>
                <div className={styles.dates}>
                  <div>
                    <span>Du</span>
                    <strong>{ex.startDate ? new Date(ex.startDate).toLocaleDateString(locale === "fr" ? "fr-FR" : "en-US") : "N/A"}</strong>
                  </div>
                  <div>
                    <span>Au</span>
                    <strong>{ex.endDate ? new Date(ex.endDate).toLocaleDateString(locale === "fr" ? "fr-FR" : "en-US") : "N/A"}</strong>
                  </div>
                </div>
                <span className={`${styles.badge} ${ex.status === "ACTIVE" ? styles.badgeActive : styles.badgeClosed}`}>
                  {ex.status === "ACTIVE" ? t.dashboard.active.toUpperCase() : "FERMÉ"}
                </span>
              </div>
            </div>
          ))
        ) : (
          <div className={styles.empty}>
            <i className="fas fa-box-open" style={{ display: 'block', fontSize: '3rem', marginBottom: '1rem', opacity: 0.3 }}></i>
            Aucun exercice enregistré.
          </div>
        )}
      </div>
    </div>
  );
}
