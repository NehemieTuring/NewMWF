"use client";

import { useEffect, useState } from "react";
import styles from "./renflouements.module.css";
import { useTranslation } from "@/context/LanguageContext";
import { secretaryService } from "@/services/secretaryService";
import { useNotification } from "@/context/NotificationContext";

export default function AdminRenflouementsPage() {
  const { t, locale } = useTranslation();
  const { showToast } = useNotification();
  const [exercises, setExercises] = useState<any[]>([]);
  const [selectedExercise, setSelectedExercise] = useState<any>(null);
  const [refueling, setRefueling] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [calculating, setCalculating] = useState(false);

  useEffect(() => {
    async function loadInitialData() {
      try {
        const data = await secretaryService.getExercises();
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
      const data = await secretaryService.getRefuelingByExercise(exId);
      setRefueling(data);
    } catch (err) {
      console.error("No refueling found for this exercise", err);
    } finally {
      setLoading(false);
    }
  }

  async function handleCalculate() {
    if (!selectedExercise) return;
    setCalculating(true);
    try {
      const data = await secretaryService.calculateRefueling(selectedExercise.id);
      setRefueling(data);
      showToast("Calcul du renflouement terminé avec succès !", "success");
    } catch (err) {
      showToast("Erreur lors du calcul du renflouement : " + (err as any).message, "error");
    } finally {
      setCalculating(false);
    }
  }

  function formatAmount(n: number) {
    return (n || 0).toLocaleString(locale === "fr" ? "fr-FR" : "en-US");
  }

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <h1 className={styles.title}>Historique des Renflouements</h1>
        <p className={styles.subtitle}>Gérez le mécanisme de renflouement automatique après chaque exercice.</p>
      </header>

      <div className={styles.exerciseSection}>
        <h3><i className="fas fa-layer-group"></i> Sélectionnez un exercice</h3>
        <div className={styles.chips}>
          {exercises.map(ex => (
            <button
              key={ex.id}
              className={`${styles.chip} ${selectedExercise?.id === ex.id ? styles.chipActive : ""}`}
              onClick={() => { setSelectedExercise(ex); loadRefueling(ex.id); }}
            >
              <span>{ex.year}</span>
              <small>{ex.active ? "En cours" : "Clôturé"}</small>
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className={styles.loading}>
          <i className="fas fa-circle-notch fa-spin fa-2x"></i>
          <span>Chargement des données...</span>
        </div>
      ) : refueling ? (
        <div className={styles.refuelingDetails}>
          <div className={styles.summaryGrid}>
            <div className={styles.statBox}>
              <span>Dépenses Totales</span>
              <h3>{formatAmount(refueling.totalOutflows)} XAF</h3>
            </div>
            <div className={styles.statBox}>
              <span>Membres Éligibles</span>
              <h3>{refueling.eligibleMemberCount} membres</h3>
            </div>
            <div className={styles.statBox}>
              <span>Montant / Membre</span>
              <h3>{formatAmount(refueling.amountPerMember)} XAF</h3>
            </div>
          </div>

          <div className={styles.detailCard}>
            <div className={styles.statusHeader}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <i className="fas fa-info-circle" style={{ color: '#4e73df' }}></i>
                <span style={{ fontWeight: 700, color: '#1e293b' }}>Détails du Renflouement</span>
              </div>
              <span className={`${styles.statusBadge} ${styles['status' + (refueling.status || 'PENDING')]}`}>
                {refueling.status === 'DISTRIBUTED' ? 'Distribué' : 'En attente'}
              </span>
            </div>
            <div className={styles.cardBody}>
              <div className={styles.infoRow}>
                <i className="fas fa-calendar-alt"></i>
                <span>Distribué le : <strong>{new Date(refueling.distributionDate).toLocaleDateString()}</strong></span>
              </div>
              <div className={styles.infoRow}>
                <i className="fas fa-check-double"></i>
                <span>Calcul basé sur l'exercice clôturé de {selectedExercise?.year}.</span>
              </div>

              <div className={styles.actions}>
                <button className={styles.pdfBtn}>
                  <i className="fas fa-file-pdf"></i> Télécharger le rapport (PDF)
                </button>
                <button className={styles.pdfBtn}>
                  <i className="fas fa-list"></i> Liste des bénéficiaires
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : selectedExercise ? (
        <div className={styles.noRefueling}>
          <i className="fas fa-calculator"></i>
          <p style={{ fontSize: '1.2rem', color: '#475569', fontWeight: 600 }}>
            Aucun renflouement calculé pour {selectedExercise.year}
          </p>
          <p style={{ color: '#94a3b8', marginTop: '0.5rem' }}>
            Le renflouement permet de répartir les dépenses de solidarité sur l'ensemble des membres.
          </p>
          {!selectedExercise.active ? (
            <div style={{ marginTop: '2rem', padding: '1.5rem', background: '#f1f5f9', color: '#475569', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
              <i className="fas fa-info-circle"></i> Le renflouement est désormais calculé <strong>automatiquement</strong> lors de la clôture de l'exercice.
              <br />
              <small style={{ display: 'block', marginTop: '0.5rem' }}>Si aucun calcul n'apparaît ici, l'exercice a peut-être été clôturé manuellement avant la mise en place du système automatique.</small>

              {/* On garde quand même le bouton en petit "Recalculer / Réparer" au cas où, mais on change son style et nom pour montrer que c'est exceptionnel */}
              <button
                className={styles.secondaryBtn}
                style={{ marginTop: '1rem', background: '#e2e8f0', color: '#475569', border: 'none', padding: '0.5rem 1rem', borderRadius: '8px', cursor: 'pointer', fontSize: '0.85rem' }}
                disabled={calculating}
                onClick={handleCalculate}
              >
                {calculating ? "Traitement..." : "Générer manuellement (Réparation)"}
              </button>
            </div>
          ) : (
            <div style={{ marginTop: '2rem', padding: '1rem', background: '#fffbeb', color: '#92400e', borderRadius: '12px', border: '1px solid #fef3c7', display: 'inline-block' }}>
              <i className="fas fa-exclamation-triangle"></i> L'exercice doit être clôturé pour que le renflouement soit effectif.
            </div>
          )}
        </div>
      ) : (
        <div className={styles.empty}>
          <i className="fas fa-folder-open"></i>
          <p>Veuillez sélectionner un exercice dans la liste ci-dessus pour consulter ou générer son renflouement.</p>
        </div>
      )}
    </div>
  );
}
