"use client";

import { useState, useEffect } from "react";
import styles from "./exercices.module.css";
import { useTranslation } from "@/context/LanguageContext";
import { secretaryService } from "@/services/secretaryService";

export default function ExercicesPage() {
  const { t } = useTranslation();
  const [exercises, setExercises] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadExercises() {
      try {
        const data = await secretaryService.getExercises();
        setExercises(data);
      } catch (err) {
        console.error("Failed to load exercises", err);
        setError("Erreur lors du chargement des exercices");
      } finally {
        setLoading(false);
      }
    }
    loadExercises();
  }, []);

  if (loading) {
    return (
      <div className={styles.loading}>
        <i className="fas fa-spinner fa-spin"></i>
        <span>Chargement des exercices...</span>
      </div>
    );
  }

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <div className={styles.titleSection}>
          <h1 className={styles.title}>{t.exercices.titre}</h1>
          <p className={styles.subtitle}>{exercises.length} exercices financiers enregistrés</p>
        </div>
        <button className={styles.addBtn}>
          <i className="fas fa-plus-circle"></i> Créer un nouvel exercice
        </button>
      </header>

      {error ? (
        <div className={styles.errorAlert}>{error}</div>
      ) : (
        <div className={styles.tableCard}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>{t.exercices.annee}</th>
                <th>{t.exercices.taux}</th>
                <th>{t.exercices.statut}</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {exercises.length > 0 ? exercises.map((ex) => (
                <tr key={ex.id}>
                  <td className={styles.annee}>{ex.year}</td>
                  <td className={styles.taux}>{ex.interestRate}%</td>
                  <td>
                    <span className={`${styles.badge} ${ex.active ? styles.badgeActive : styles.badgeInactive}`}>
                      {ex.active ? "En cours" : "Clôturé"}
                    </span>
                  </td>
                  <td>
                    <div className={styles.actions}>
                      {ex.active && (
                        <button className={styles.cloturerBtn} title="Clôturer l'exercice">
                          <i className="fas fa-lock"></i>
                        </button>
                      )}
                      <button className={styles.detailsBtn} title="Voir détails">
                        <i className="fas fa-eye"></i>
                      </button>
                    </div>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan={4} className={styles.emptyRow}>
                    <div className={styles.nothingFound}>
                      <i className="fas fa-folder-open"></i>
                      <p>Aucun exercice enregistré pour le moment.</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
