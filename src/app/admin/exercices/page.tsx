"use client";

import { useState, useEffect } from "react";
import styles from "./exercices.module.css";
import { useTranslation } from "@/context/LanguageContext";
import { secretaryService } from "@/services/secretaryService";
import { useNotification } from "@/context/NotificationContext";
import ConfirmModal from "@/components/ConfirmModal";

export default function ExercicesPage() {
  const { t } = useTranslation();
  const { showToast } = useNotification();
  const [exercises, setExercises] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // States for Creation Modal
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newExercise, setNewExercise] = useState({
    year: new Date().getFullYear().toString(),
    interestRate: 5,
    solidarityAmount: 150000,
    agapeAmount: 45000,
    penaltyAmount: 15000
  });
  const [creating, setCreating] = useState(false);

  // States for Closure Confirmation
  const [exerciseToClose, setExerciseToClose] = useState<any>(null);
  const [closing, setClosing] = useState(false);

  useEffect(() => {
    loadExercises();
  }, []);

  async function loadExercises() {
    setLoading(true);
    try {
      const data = await secretaryService.getExercises();
      setExercises(data || []);
    } catch (err) {
      console.error("Failed to load exercises", err);
      setError("Erreur lors du chargement des exercices");
    } finally {
      setLoading(false);
    }
  }

  async function handleCreate() {
    setCreating(true);
    try {
      await secretaryService.createExercise(newExercise);
      showToast("L'exercice " + newExercise.year + " a été créé avec succès !", "success");
      setShowCreateModal(false);
      loadExercises();
    } catch (err) {
      showToast("Erreur lors de la création : " + (err as any).message, "error");
    } finally {
      setCreating(false);
    }
  }

  async function handleClose() {
    if (!exerciseToClose) return;
    setClosing(true);
    try {
      await secretaryService.closeExercise(exerciseToClose.id);
      showToast("L'exercice a été clôturé. Le renflouement a été généré automatiquement.", "success");
      setExerciseToClose(null);
      loadExercises();
    } catch (err) {
      showToast("Erreur lors de la clôture : " + (err as any).message, "error");
    } finally {
      setClosing(false);
    }
  }

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
        <button className={styles.addBtn} onClick={() => setShowCreateModal(true)}>
          <i className="fas fa-plus-circle"></i> {t.exercices.creer}
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
                        <button
                          className={styles.cloturerBtn}
                          title="Clôturer l'exercice"
                          onClick={() => setExerciseToClose(ex)}
                        >
                          <i className="fas fa-lock"></i>
                        </button>
                      )}
                      <button
                        className={styles.detailsBtn}
                        title="Voir détails"
                        onClick={() => window.location.href = `/admin/renflouements?ex=${ex.id}`}
                      >
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

      {/* Creation Modal */}
      {showCreateModal && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ maxWidth: '600px' }}>
            <header className="modal-header">
              <h3>{t.exercices.creer}</h3>
              <button className="modal-close" onClick={() => setShowCreateModal(false)}>&times;</button>
            </header>
            <div className="modal-body" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
              <div className={styles.formGroup}>
                <label className="form-label">{t.exercices.annee}</label>
                <input
                  type="text"
                  className="form-input"
                  value={newExercise.year}
                  onChange={(e) => setNewExercise({ ...newExercise, year: e.target.value })}
                />
              </div>
              <div className={styles.formGroup}>
                <label className="form-label">{t.exercices.taux}</label>
                <input
                  type="number"
                  className="form-input"
                  value={newExercise.interestRate}
                  onChange={(e) => setNewExercise({ ...newExercise, interestRate: parseInt(e.target.value) })}
                />
              </div>
              <div className={styles.formGroup}>
                <label className="form-label">Montant Solidarité</label>
                <input
                  type="number"
                  className="form-input"
                  value={newExercise.solidarityAmount}
                  onChange={(e) => setNewExercise({ ...newExercise, solidarityAmount: parseInt(e.target.value) })}
                />
              </div>
              <div className={styles.formGroup}>
                <label className="form-label">Montant Agape</label>
                <input
                  type="number"
                  className="form-input"
                  value={newExercise.agapeAmount}
                  onChange={(e) => setNewExercise({ ...newExercise, agapeAmount: parseInt(e.target.value) })}
                />
              </div>
              <div className={styles.formGroup}>
                <label className="form-label">Pénalité Assemblée</label>
                <input
                  type="number"
                  className="form-input"
                  value={newExercise.penaltyAmount}
                  onChange={(e) => setNewExercise({ ...newExercise, penaltyAmount: parseInt(e.target.value) })}
                />
              </div>
            </div>
            <footer className="modal-footer">
              <button className="btn btn-outline" onClick={() => setShowCreateModal(false)}>{t.dashboard.annuler}</button>
              <button className="btn btn-primary" onClick={handleCreate} disabled={creating}>
                {creating ? "Création..." : t.dashboard.enregistrer}
              </button>
            </footer>
          </div>
        </div>
      )}

      {/* Closure Confirmation */}
      <ConfirmModal
        isOpen={!!exerciseToClose}
        title="Clôturer l'exercice"
        message={`Êtes-vous sûr de vouloir clôturer l'exercice ${exerciseToClose?.year} ? Cette action générera automatiquement le renflouement et figera la liste des membres.`}
        confirmText="Clôturer l'exercice"
        cancelText="Annuler"
        onConfirm={handleClose}
        onCancel={() => setExerciseToClose(null)}
        isLoading={closing}
        type="danger"
      />
    </div>
  );
}
