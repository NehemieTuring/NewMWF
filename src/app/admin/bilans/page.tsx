"use client";

import { useEffect, useState } from "react";
import styles from "./bilans.module.css";
import { useTranslation } from "@/context/LanguageContext";
import { secretaryService } from "@/services/secretaryService";

export default function AdminBilansPage() {
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
        const exData = await secretaryService.getExercises();
        setExercises(exData || []);
        if (exData && exData.length > 0) {
          const active = exData.find((e: any) => e.active);
          if (active) setSelectedExercise(active.id.toString());
        }

        const sessData = await secretaryService.getSessions();
        setSessions(sessData || []);
      } catch (err) {
        console.error("Failed to load initial data", err);
      }
    }
    loadInitialData();
  }, []);

  useEffect(() => {
    if (selectedExercise && !selectedSession) {
      loadExerciseBilan(parseInt(selectedExercise));
    }
  }, [selectedExercise]);

  async function loadExerciseBilan(id: number) {
    setLoading(true);
    try {
      const data = await secretaryService.getExerciseBilan(id);
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
      const data = await secretaryService.getSessionBilan(id);
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
        <h1 className={styles.title}>Bilans Financiers</h1>
        <p className={styles.subtitle}>Gérez et exportez les rapports financiers consolidés de votre mutuelle.</p>
      </header>

      <div className={styles.filters}>
        <div className={styles.filterGroup}>
          <label><i className="fas fa-calendar-check" style={{ marginRight: '8px' }}></i> Exercice</label>
          <select 
            value={selectedExercise} 
            onChange={(e) => { 
                setSelectedExercise(e.target.value); 
                setSelectedSession(""); 
                if (e.target.value) loadExerciseBilan(parseInt(e.target.value));
            }}
          >
            <option value="">Sélectionner un exercice</option>
            {exercises.map(ex => (
              <option key={ex.id} value={ex.id}>{ex.year} {ex.active ? '(En cours)' : '(Clôturé)'}</option>
            ))}
          </select>
        </div>
        <div className={styles.filterGroup}>
          <label><i className="fas fa-clock" style={{ marginRight: '8px' }}></i> Session Spécifique</label>
          <select 
            value={selectedSession} 
            onChange={(e) => { 
                setSelectedSession(e.target.value); 
                if (e.target.value) loadSessionBilan(parseInt(e.target.value));
            }}
          >
            <option value="">Visualiser une session particulière</option>
            {sessions.map(s => (
              <option key={s.id} value={s.id}>{new Date(s.date).toLocaleDateString()} - Session {s.id}</option>
            ))}
          </select>
        </div>
      </div>

      {loading ? (
        <div className={styles.loading}>
             <i className="fas fa-circle-notch fa-spin fa-3x"></i>
             <p style={{ marginTop: '1rem' }}>Génération du rapport en cours...</p>
        </div>
      ) : bilan ? (
        <div className={styles.bilanGrid}>
          <div className={styles.statCard}>
            <i className="fas fa-user-friends"></i>
            <div className={styles.statInfo}>
              <span>Membres Actifs</span>
              <h3>{bilan.activeMembers} <small style={{ fontSize: '1rem', color: '#94a3b8' }}>/ {bilan.totalMembers}</small></h3>
            </div>
          </div>
          <div className={styles.statCard}>
            <i className="fas fa-check-shield" style={{ backgroundColor: '#ecfdf5', color: '#10b981' }}></i>
            <div className={styles.statInfo}>
              <span>Membres en Règle</span>
              <h3>{bilan.membersInRule}</h3>
            </div>
          </div>
          <div className={styles.statCard}>
            <i className="fas fa-user-clock" style={{ backgroundColor: '#fff7ed', color: '#f59e0b' }}></i>
            <div className={styles.statInfo}>
              <span>Non en Règle</span>
              <h3>{bilan.membersNotInRule}</h3>
            </div>
          </div>

          <div className={styles.cashboxTableCard}>
            <h3><i className="fas fa-vault" style={{ color: '#3b82f6', marginRight: '10px' }}></i> Solde des Caisses de Solidarité</h3>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Intitulé de la Caisse</th>
                  <th style={{ textAlign: 'right' }}>Solde Disponible</th>
                </tr>
              </thead>
              <tbody>
                {bilan.cashboxes?.map((cb: any) => (
                  <tr key={cb.id}>
                    <td style={{ fontWeight: 600 }}>{cb.name.replace(/_/g, ' ')}</td>
                    <td className={styles.amountText}>{formatAmount(cb.balance)} XAF</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          <div className={styles.actionCard}>
             <i className="fas fa-file-invoice-dollar" style={{ fontSize: '3rem', marginBottom: '1rem' }}></i>
             <p style={{ fontWeight: 600 }}>Rapport Prêt à l'Exportation</p>
             <button className={styles.exportBtn}>
                <i className="fas fa-file-pdf"></i> Télécharger le Bilan (PDF)
             </button>
             <small style={{ opacity: 0.8 }}>Générez un document officiel pour l'assemblée.</small>
          </div>
        </div>
      ) : (
        <div className={styles.empty}>
            <i className="fas fa-chart-pie" style={{ fontSize: '4rem', marginBottom: '2rem', display: 'block' }}></i>
            <p>Veuillez sélectionner un <strong>exercice</strong> ou une <strong>session</strong> pour afficher les indicateurs financiers correspondants.</p>
        </div>
      )}
    </div>
  );
}
