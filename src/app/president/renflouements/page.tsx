"use client";

import { useEffect, useState } from "react";
import styles from "./renflouements.module.css";
import { useTranslation } from "@/context/LanguageContext";
import { presidentService } from "@/services/presidentService";

export default function PresidentRenflouementsPage() {
  const { locale } = useTranslation();
  const [exercises, setExercises] = useState<any[]>([]);
  const [selectedExercise, setSelectedExercise] = useState<any>(null);
  const [refueling, setRefueling] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadInitialData() {
      try {
        const data = await presidentService.getExercises();
        setExercises(data || []);
      } catch (err) {
        console.error("Failed to load exercises", err);
      } finally {
        setLoading(false);
      }
    }
    loadInitialData();
  }, []);

  async function loadRefueling(exId: number) {
    setLoading(true);
    setRefueling(null);
    try {
      const data = await presidentService.getRefueling(exId);
      setRefueling(data);
    } catch (err) {
      console.error("No refueling record found", err);
    } finally {
      setLoading(false);
    }
  }

  function formatAmount(n: number) {
    return (n || 0).toLocaleString(locale === "fr" ? "fr-FR" : "en-US");
  }

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <h1 className={styles.title}>Consultation des Renflouements</h1>
        <p className={styles.subtitle}>Historique des distributions automatiques après clôture d'exercice.</p>
      </header>

      <div className={styles.exerciseSelector}>
        <h3><i className="fas fa-history"></i> Exercices financiers</h3>
        <div className={styles.chips}>
          {exercises.map(ex => (
            <button
              key={ex.id}
              className={`${styles.chip} ${selectedExercise?.id === ex.id ? styles.chipActive : ""}`}
              onClick={() => { setSelectedExercise(ex); loadRefueling(ex.id); }}
            >
              {ex.year}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className={styles.loading}>Chargement des détails...</div>
      ) : refueling ? (
        <div className={styles.detailsCard}>
          <div className={styles.detailsHeader}>
            <div className={styles.dStat}>
              <span>Cible du Fonds</span>
              <strong>{formatAmount(refueling.fundTarget)} XAF</strong>
            </div>
            <div className={styles.dStat}>
              <span>Solde Réel</span>
              <strong>{formatAmount(refueling.currentBalance)} XAF</strong>
            </div>
            <div className={styles.dStat}>
              <span>Déficit Réparti</span>
              <strong>{formatAmount(refueling.totalOutflows)} XAF</strong>
            </div>
            <div className={styles.dStat}>
              <span>Montant / Membre</span>
              <strong>{formatAmount(refueling.amountPerMember)} XAF</strong>
            </div>
          </div>

          <div className={styles.infoBox}>
            <i className="fas fa-info-circle"></i>
            <p>
              Ce renflouement a été distribué à <strong>{refueling.eligibleMemberCount}</strong> membres en règle.
              Les surplus ont été reversés à la caisse Inscription.
            </p>
          </div>

          <div className={styles.statusBadge}>Statut final : {refueling.status}</div>
        </div>
      ) : selectedExercise ? (
        <div className={styles.noRefueling}>
          <p>Aucun renflouement enregistré pour l'exercice {selectedExercise.year}.</p>
        </div>
      ) : (
        <div className={styles.empty}>Sélectionnez un exercice pour consulter les archives du renflouement.</div>
      )}
    </div>
  );
}
