"use client";

import { useEffect, useState } from "react";
import styles from "./bilans.module.css";
import { useTranslation } from "@/context/LanguageContext";
import { treasurerService } from "@/services/treasurerService";

export default function TreasurerBilansPage() {
  const { t, locale } = useTranslation();
  const [exercises, setExercises] = useState<any[]>([]);
  const [sessions, setSessions] = useState<any[]>([]);
  const [selectedExercise, setSelectedExercise] = useState<string>("");
  const [selectedSession, setSelectedSession] = useState<string>("");
  const [bilan, setBilan] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function loadInitialData() {
      try {
        const exData = await treasurerService.getExercises();
        setExercises(exData || []);
        
        const sessData = await treasurerService.getSessions();
        setSessions(sessData || []);

        if (exData && exData.length > 0) {
           const active = exData.find((e: any) => e.active);
           if (active) setSelectedExercise(active.id.toString());
        }
      } catch (err) {
        console.error("Failed to load initial data", err);
      }
    }
    loadInitialData();
  }, []);

  useEffect(() => {
    if (selectedExercise) {
      loadExerciseBilan(parseInt(selectedExercise));
    }
  }, [selectedExercise]);

  async function loadExerciseBilan(id: number) {
    setLoading(true);
    try {
      const data = await treasurerService.getExerciseBilan(id);
      setBilan(data);
    } catch (err) {
      console.error("Failed to load bilan", err);
    } finally {
      setLoading(false);
    }
  }

  async function loadSessionBilan(id: number) {
    setLoading(true);
    try {
      const data = await treasurerService.getSessionBilan(id);
      setBilan(data);
    } catch (err) {
      console.error("Failed to load session bilan", err);
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
        <h1 className={styles.title}>Bilans Financiers du Trésorier</h1>
        <p className={styles.subtitle}>Suivi comptable rigoureux des flux de la mutuelle.</p>
      </header>

      <div className={styles.filters}>
        <div className={styles.filterGroup}>
          <label>Période (Exercice)</label>
          <select 
            value={selectedExercise} 
            onChange={(e) => { setSelectedExercise(e.target.value); setSelectedSession(""); }}
          >
            <option value="">Sélectionner</option>
            {exercises.map(ex => (
              <option key={ex.id} value={ex.id}>{ex.year}</option>
            ))}
          </select>
        </div>
        <div className={styles.filterGroup}>
          <label>OU Session</label>
          <select 
            value={selectedSession} 
            onChange={(e) => { 
                setSelectedSession(e.target.value); 
                if (e.target.value) loadSessionBilan(parseInt(e.target.value));
            }}
          >
            <option value="">Sélectionner</option>
            {sessions.map(s => (
              <option key={s.id} value={s.id}>{new Date(s.date).toLocaleDateString()} - Session {s.id}</option>
            ))}
          </select>
        </div>
      </div>

      {loading ? (
        <div className={styles.loading}>Chargement des données comptables...</div>
      ) : bilan ? (
        <div className={styles.bilanGrid}>
          <div className={styles.cardHeader}>
             <i className="fas fa-chart-line"></i> Récapitulatif des Caisses
          </div>
          
          <div className={styles.cashboxGrid}>
            {bilan.cashboxes?.map((cb: any) => (
              <div key={cb.id} className={styles.cashboxCard}>
                <div className={styles.cbName}>{cb.name.replace('_', ' ')}</div>
                <div className={styles.cbBalance}>{formatAmount(cb.balance)} <small>XAF</small></div>
                <div className={styles.cbIndicator}>
                   <div className={styles.indicatorTrack}>
                      <div className={styles.indicatorFill} style={{ width: "70%" }}></div>
                   </div>
                </div>
              </div>
            ))}
          </div>

          <div className={styles.fullWidthCard}>
             <h3>Répartition des Transactions</h3>
             <div className={styles.placeholderChart}>
                <p>[ Graphique de répartition des entrées/sorties en cours de développement ]</p>
             </div>
          </div>
          
          <div className={styles.actions}>
             <button className={styles.exportBtn}>
                <i className="fas fa-file-excel"></i> Exporter en Excel
             </button>
             <button className={styles.exportBtn}>
                <i className="fas fa-file-pdf"></i> Exporter en PDF
             </button>
          </div>
        </div>
      ) : (
        <div className={styles.empty}>Veuillez sélectionner une période pour afficher le bilan comptable.</div>
      )}
    </div>
  );
}
