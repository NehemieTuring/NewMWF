"use client";

import { useEffect, useState, useMemo } from "react";
import { presidentService } from "@/services/presidentService";
import styles from "./president-bilans.module.css";

export default function PresidentBilans() {
  const [exercises, setExercises] = useState<any[]>([]);
  const [selectedExerciseId, setSelectedExerciseId] = useState<number | null>(null);
  const [bilanData, setBilanData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [membersCount, setMembersCount] = useState<any>({ inRule: 0, active: 0 });

  useEffect(() => {
    async function loadInitialData() {
      try {
        const [exercisesData, inRuleData, transactionsData] = await Promise.all([
          presidentService.getExercises(),
          presidentService.getMembersInRule(),
          presidentService.getGlobalTransactions()
        ]);
        
        const sortedExercises = Array.isArray(exercisesData) ? exercisesData.sort((a, b) => b.id - a.id) : [];
        setExercises(sortedExercises);
        
        if (sortedExercises.length > 0) {
          const activeExercise = sortedExercises.find(e => e.status === "ACTIVE") || sortedExercises[0];
          setSelectedExerciseId(activeExercise.id);
        }
        
        setMembersCount({
          inRule: Array.isArray(inRuleData) ? inRuleData.length : 0,
          active: transactionsData?.activeMembers || 0
        });
      } catch (err: any) {
        setError(err.message || "Erreur lors du chargement des exercices");
      } finally {
        setLoading(false);
      }
    }
    loadInitialData();
  }, []);

  useEffect(() => {
    async function loadBilan() {
      if (!selectedExerciseId) return;
      setLoading(true);
      try {
        const data = await presidentService.getExerciseBilan(selectedExerciseId);
        setBilanData(data);
      } catch (err: any) {
        setError(err.message || "Impossible de charger le bilan");
      } finally {
        setLoading(false);
      }
    }
    loadBilan();
  }, [selectedExerciseId]);

  const membersInRulePercent = useMemo(() => {
    if (membersCount.active === 0) return 0;
    return Math.round((membersCount.inRule / membersCount.active) * 100);
  }, [membersCount]);

  if (loading && !bilanData) {
    return (
      <div className={styles.loading}>
        <i className={`fas fa-circle-notch ${styles.loadingSpinner}`}></i>
        <p>Génération du rapport financier...</p>
      </div>
    );
  }

  const selectedExercise = exercises.find(e => e.id === Number(selectedExerciseId));

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1 className={styles.title}>Bilans de l'Association</h1>
        <p className={styles.subtitle}>Consultation des rapports financiers par exercice budgétaire</p>
      </header>

      <div className={styles.selectorCard}>
        <div className={styles.selectorLabel}>Détail de l'exercice :</div>
        <select 
          className={styles.selectInput}
          value={selectedExerciseId || ""}
          onChange={(e) => setSelectedExerciseId(Number(e.target.value))}
        >
          {exercises.map((ex) => (
            <option key={ex.id} value={ex.id}>
              {ex.name || `Exercice ${ex.year}`} {ex.status === "ACTIVE" ? "(Actif)" : ""}
            </option>
          ))}
          {exercises.length === 0 && <option value="">Aucun exercice trouvé</option>}
        </select>
      </div>

      <div className={styles.summaryGrid}>
        <div className={styles.summaryCard}>
          <div className={styles.cardHeader}>
            <div className={`${styles.cardIcon} ${styles.iconIn}`}><i className="fas fa-arrow-down"></i></div>
            <span className={styles.cardLabel}>Entrées Totales</span>
          </div>
          <h3 className={styles.cardValue}>{bilanData?.totalEntries?.toLocaleString() || 0} <small style={{ fontSize: '0.85rem' }}>FCFA</small></h3>
        </div>
        <div className={styles.summaryCard}>
          <div className={styles.cardHeader}>
            <div className={`${styles.cardIcon} ${styles.iconOut}`}><i className="fas fa-arrow-up"></i></div>
            <span className={styles.cardLabel}>Sorties Totales</span>
          </div>
          <h3 className={styles.cardValue}>{bilanData?.totalExits?.toLocaleString() || 0} <small style={{ fontSize: '0.85rem' }}>FCFA</small></h3>
        </div>
        <div className={styles.summaryCard}>
          <div className={styles.cardHeader}>
            <div className={`${styles.cardIcon} ${styles.iconBalance}`}><i className="fas fa-balance-scale"></i></div>
            <span className={styles.cardLabel}>Solde de l'exercice</span>
          </div>
          <h3 className={styles.cardValue}>{bilanData?.balance?.toLocaleString() || 0} <small style={{ fontSize: '0.85rem' }}>FCFA</small></h3>
        </div>
      </div>

      <div className={styles.detailsGrid}>
        <section className={styles.detailCard}>
          <h2 className={styles.sectionTitle}><i className="fas fa-chart-pie"></i> Santé des Cotisations</h2>
          <div className={styles.pieContainer}>
            <div 
              className={styles.pieChart} 
              style={{ "--percent": `${membersInRulePercent}%` } as React.CSSProperties}
            >
              <div className={styles.pieInner}>
                <span className={styles.pieValue}>{membersInRulePercent}%</span>
                <span className={styles.pieLabel}>Membres en règle</span>
              </div>
            </div>
            <div className={styles.legend}>
              <div className={styles.legendItem}>
                <div className={styles.dot} style={{ background: '#4e73df' }}></div>
                <div className={styles.legendLabel}>En règle : </div>
                <div className={styles.legendValue}>{membersCount.inRule}</div>
              </div>
              <div className={styles.legendItem}>
                <div className={styles.dot} style={{ background: '#edf2f7' }}></div>
                <div className={styles.legendLabel}>Retardataires : </div>
                <div className={styles.legendValue}>{membersCount.active - membersCount.inRule}</div>
              </div>
              <div className={styles.legendItem} style={{ marginTop: '0.5rem', borderTop: '1px solid #f1f3f9', paddingTop: '0.5rem' }}>
                <div className={styles.legendLabel}>Total Actifs : </div>
                <div className={styles.legendValue}>{membersCount.active}</div>
              </div>
            </div>
          </div>
        </section>

        <section className={styles.detailCard}>
          <h2 className={styles.sectionTitle}><i className="fas fa-file-invoice-dollar"></i> Détails de l'exercice</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1.5rem' }}>
             <div style={{ background: '#f8f9fc', padding: '1.25rem', borderRadius: '16px' }}>
                <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#a0aec0', textTransform: 'uppercase' }}>Début</span>
                <div style={{ fontSize: '1.1rem', fontWeight: 700, color: '#4a5568', marginTop: '0.25rem' }}>
                  {selectedExercise?.startDate ? new Date(selectedExercise.startDate).toLocaleDateString() : "N/A"}
                </div>
             </div>
             <div style={{ background: '#f8f9fc', padding: '1.25rem', borderRadius: '16px' }}>
                <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#a0aec0', textTransform: 'uppercase' }}>Fin prévue</span>
                <div style={{ fontSize: '1.1rem', fontWeight: 700, color: '#4a5568', marginTop: '0.25rem' }}>
                  {selectedExercise?.endDate ? new Date(selectedExercise.endDate).toLocaleDateString() : "N/A"}
                </div>
             </div>
             <div style={{ background: '#f8f9fc', padding: '1.25rem', borderRadius: '16px', gridColumn: 'span 2' }}>
                <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#a0aec0', textTransform: 'uppercase' }}>Statut</span>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.25rem' }}>
                  <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: selectedExercise?.status === "ACTIVE" ? '#38a169' : '#a0aec0' }}></div>
                  <span style={{ fontWeight: 700, color: '#2d3748' }}>{selectedExercise?.status === "ACTIVE" ? "EXERCICE EN COURS" : "EXERCICE CLÔTURÉ"}</span>
                </div>
             </div>
          </div>
        </section>
      </div>
    </div>
  );
}
