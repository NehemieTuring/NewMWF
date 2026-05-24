"use client";

import { useEffect, useState } from "react";
import styles from "./admin-dashboard.module.css";
import { useTranslation } from "@/context/LanguageContext";
import { secretaryService } from "@/services/secretaryService";
import { useAuth } from "@/context/AuthContext";
import { useNotification } from "@/context/NotificationContext";
import ServerDateTime from "@/components/ServerDateTime";

export default function AdminDashboard() {
  const { locale } = useTranslation();
  const { user } = useAuth();
  const { showToast, confirm } = useNotification();
  const subRole = user?.subRole?.toUpperCase();
  const isSG = subRole === "SECRETAIRE_GENERALE";
  const isTreasurer = subRole === "TRESORIER";
  const [stats, setStats] = useState<any>(null);
  const [exercises, setExercises] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showSessionModal, setShowSessionModal] = useState(false);
  const [showExerciseModal, setShowExerciseModal] = useState(false);

  const [sessionForm, setSessionForm] = useState({
    name: "",
    date: new Date().toISOString().split("T")[0],
    exercise: { id: "" }
  });

  const [exerciseForm, setExerciseForm] = useState({
    id: null as number | null,
    year: new Date().getFullYear().toString(),
    name: `Exercice ${new Date().getFullYear()}`,
    startDate: `${new Date().getFullYear()}-01-01`,
    endDate: `${new Date().getFullYear()}-12-31`,
    interestRate: 3.0,
    solidarityAmount: 150000,
    agapeAmount: 45000,
    penaltyAmount: 15000
  });

  const [error, setErrorState] = useState<string | null>(null);

  async function loadDashboardData() {
    setLoading(true);
    setErrorState(null);
    try {
      const [statsData, exercisesData] = await Promise.all([
        secretaryService.getGlobalTransactions(),
        secretaryService.getExercises()
      ]);
      setStats(statsData);
      setExercises(exercisesData || []);

      // Auto-select active exercise in form if possible
      const activeEx = (exercisesData || []).find((e: any) => e.active);
      if (activeEx) {
        setSessionForm(prev => ({ ...prev, exercise: { id: activeEx.id } }));
        setExerciseForm({
          id: activeEx.id,
          year: activeEx.year,
          name: activeEx.name || `Exercice ${activeEx.year}`,
          startDate: activeEx.startDate,
          endDate: activeEx.endDate,
          interestRate: activeEx.interestRate,
          solidarityAmount: activeEx.solidarityAmount,
          agapeAmount: activeEx.agapeAmount,
          penaltyAmount: activeEx.penaltyAmount
        });
      }
    } catch (err: any) {
      console.error(err);
      setErrorState(err.message || "Une erreur est survenue lors du chargement des données.");
    } finally {
      setLoading(false);
    }
  }
  useEffect(() => {
    loadDashboardData();
  }, []);

  const handleCreateExercise = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (exerciseForm.id) {
        await secretaryService.updateExercise(exerciseForm.id, exerciseForm as any);
        showToast("L'exercice financier a été mis à jour avec succès !", "success");
      } else {
        await secretaryService.createExercise(exerciseForm);
        showToast("L'exercice financier a été créé avec succès !", "success");
      }
      setShowExerciseModal(false);
      loadDashboardData();
    } catch (err: any) {
      console.error(err);
      const msg = err.message || "";
      if (msg.includes("déjà été créé") || msg.includes("existe déjà")) {
        showToast(`Conflit : L'année ${exerciseForm.year} est déjà associée à un exercice existant.`, "error");
      } else {
        showToast("Erreur lors de l'enregistrement : " + (err.message || "Veuillez vérifier les informations."), "error");
      }
    }
  };

  const handleCreateSession = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!sessionForm.exercise.id) {
      alert("Veuillez choisir un exercice pour cette session.");
      return;
    }
    try {
      // Ensure we send the data the backend expects
      await secretaryService.createSession(sessionForm);
      setShowSessionModal(false);
      loadDashboardData();
      showToast("La séance a été ouverte et est prête à enregistrer des opérations.", "success");
    } catch (err: any) {
      console.error(err);
      if (err.message?.includes("active exercise") || err.message?.includes("Exercice spécifié introuvable")) {
        showToast("Impossible d'ouvrir la séance : aucun exercice financier n'est actuellement actif.", "error");
      } else {
        showToast("Une erreur est survenue lors de l'ouverture de la séance. Veuillez réessayer.", "error");
      }
    }
  };

  const handleCloseSession = async (id: number, sessionName: string) => {
    confirm({
      title: "Clôturer la séance",
      message: `Voulez-vous clôturer la séance "${sessionName}" en cours ? Cette action mettra fin à toutes les opérations de cette session.`,
      type: "warning",
      confirmText: "Clôturer maintenant",
      requiredConfirmValue: sessionName,
      onConfirm: async () => {
        try {
          await secretaryService.closeSession(id);
          showToast("Séance clôturée avec succès !", "success");
          loadDashboardData();
        } catch (err: any) {
          showToast("Erreur: " + (err.message || "Impossible de clôturer la séance"), "error");
        }
      }
    });
  };

  function formatAmount(n: number) {
    return (n || 0).toLocaleString(locale === "fr" ? "fr-FR" : "en-US");
  }

  if (loading) return <div className="fas fa-spinner fa-spin" style={{ fontSize: "2rem", color: "#4e73df", margin: "5rem auto", display: "block" }}></div>;

  if (error) {
    return (
      <div style={{ textAlign: 'center', padding: '3rem', background: 'rgba(231, 74, 59, 0.05)', borderRadius: '1rem', margin: '2rem' }}>
        <i className="fas fa-exclamation-triangle" style={{ fontSize: '3rem', color: '#e74a3b', marginBottom: '1rem' }}></i>
        <h2 style={{ color: '#2e3b4e' }}>Erreur de connexion</h2>
        <p style={{ color: '#858796', marginBottom: '1.5rem' }}>{error}</p>
        <button
          onClick={() => loadDashboardData()}
          style={{ padding: '0.8rem 2rem', background: '#4e73df', color: 'white', border: 'none', borderRadius: '0.5rem', cursor: 'pointer' }}
        >
          Réessayer
        </button>
      </div>
    );
  }

  return (
    <div className={styles.dashboard}>
      <header style={{ marginBottom: "2rem", display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "1rem" }}>
        <div>
          <h1 style={{ fontSize: "1.8rem", fontWeight: 800, color: "#2e3b4e" }}>
            Tableau de Bord {isSG ? "Secrétaire G." : isTreasurer ? "Trésorier" : "Président"}
          </h1>
          <p style={{ color: "#858796" }}>
            {isSG ? "Gestion opérationnelle et suivi des activités récentes." :
              isTreasurer ? "Surveillance financière et état des fonds." :
                "Supervision globale et indicateurs de performance."}
          </p>
        </div>
      </header>

      {/* Primary KPI Grid */}
      <div className={styles.statsGrid}>
        <div className={styles.statCard}>
          <div className={styles.statIcon} style={{ background: "rgba(28,200,138,0.1)", color: "#1cc88a" }}>
            <i className="fas fa-users-cog"></i>
          </div>
          <div className={styles.statContent}>
            <span className={styles.statLabel}>Adhésions Totales</span>
            <div className={styles.statValueContainer}>
              <span className={styles.statValue}>{formatAmount(stats?.totalEnrollments)}</span>
              <span className={styles.statUnit}>XAF</span>
            </div>
          </div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statIcon} style={{ background: "rgba(78,115,223,0.1)", color: "#4e73df" }}>
            <i className="fas fa-shield-alt"></i>
          </div>
          <div className={styles.statContent}>
            <span className={styles.statLabel}>Fond social</span>
            <div className={styles.statValueContainer}>
              <span className={styles.statValue}>{formatAmount(stats?.totalSocialFunds)}</span>
              <span className={styles.statUnit}>XAF</span>
            </div>
          </div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statIcon} style={{ background: "rgba(33, 147, 176, 0.1)", color: "#2193b0" }}>
            <i className="fas fa-piggy-bank"></i>
          </div>
          <div className={styles.statContent}>
            <span className={styles.statLabel}>Épargnes Totales</span>
            <div className={styles.statValueContainer}>
              <span className={styles.statValue}>{formatAmount(stats?.totalSavings)}</span>
              <span className={styles.statUnit}>XAF</span>
            </div>
          </div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statIcon} style={{ background: "rgba(231,74,59,0.1)", color: "#e74a3b" }}>
            <i className="fas fa-university"></i>
          </div>
          <div className={styles.statContent}>
            <span className={styles.statLabel}>Volume d'Emprunts</span>
            <div className={styles.statValueContainer}>
              <span className={styles.statValue}>{formatAmount(stats?.totalLoans)}</span>
              <span className={styles.statUnit}>XAF</span>
            </div>
          </div>
        </div>
      </div>

      <div className={styles.infoGrid} style={{ marginTop: "2rem" }}>
        {/* Session Status & Quick Actions for SG */}
        <div className={styles.infoCard} style={{ background: stats?.activeSession ? "linear-gradient(135deg, #1e3a8a, #3b82f6)" : "#f8f9fc", color: stats?.activeSession ? "white" : "#2e3b4e" }}>
          <div className={styles.infoCardHeader} style={{ color: "inherit" }}>
            <h3 style={{ color: "inherit" }}><i className="fas fa-history"></i> Session en cours</h3>
          </div>
          <div style={{ padding: "1.5rem" }}>
            {stats?.activeSession ? (
              <>
                <h2 style={{ fontSize: "1.5rem", marginBottom: "0.5rem" }}>{stats.activeSession.name || "Session Actuelle"}</h2>
                <p style={{ opacity: 0.8, fontSize: "0.9rem" }}>Exercice {stats.activeSession.exerciseYear} - Lancée le {new Date(stats.activeSession.sessionDate).toLocaleDateString()}</p>
                {isSG && (
                  <button
                    type="button"
                    onClick={() => handleCloseSession(stats.activeSession.id, stats.activeSession.name || "Session Actuelle")}
                    className={styles.sessionBtn}
                    style={{ marginTop: "2rem", width: "100%", background: "#e74a3b" }}
                  >
                    Clôturer la session
                  </button>
                )}
              </>
            ) : (
              <div style={{ textAlign: "center", padding: "1rem" }}>
                <i className="fas fa-calendar-times" style={{ fontSize: "3rem", opacity: 0.1, marginBottom: "1rem" }}></i>
                <p>Aucune session active actuellement.</p>
                {isSG && <button className={styles.sessionBtn} style={{ marginTop: "1rem" }} onClick={() => setShowSessionModal(true)}>Démarrer une session</button>}
              </div>
            )}
          </div>
        </div>

        {/* Exercise Management Card */}
        <div className={styles.infoCard} style={{ background: exercises.some(e => e.active) ? "#f8f9fc" : "rgba(78, 115, 223, 0.05)", border: exercises.some(e => e.active) ? "1px solid #edf2f7" : "2px dashed #4e73df88" }}>
          <div className={styles.infoCardHeader}>
            <h3><i className="fas fa-calendar-alt"></i> Exercice Annuel</h3>
            <a href="/admin/parametres" className={styles.viewAllLink}>Tout voir <i className="fas fa-arrow-right"></i></a>
          </div>
          <div style={{ padding: "1.5rem" }}>
            {exercises.find((e: any) => e.active) ? (
              <>
                <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "1.5rem" }}>
                  <div style={{ width: "50px", height: "50px", borderRadius: "15px", background: "rgba(78, 115, 223, 0.1)", color: "#4e73df", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.2rem", fontWeight: 800 }}>
                    {exercises.find((e: any) => e.active).year}
                  </div>
                  <div>
                    <h4 style={{ margin: 0, color: "#2d3748" }}>Exercice en cours</h4>
                    <p style={{ margin: 0, fontSize: "0.85rem", color: "#718096" }}>Prêt pour les opérations de l{"'"}année.</p>
                  </div>
                </div>
                {isSG && (
                  <button
                    className={styles.addBtn}
                    style={{ borderStyle: "solid", background: "#f8f9fc" }}
                    onClick={() => {
                      const activeEx = exercises.find((e: any) => e.active);
                      if (activeEx) {
                        setExerciseForm({
                          ...exerciseForm,
                          year: activeEx.year.toString(),
                          startDate: activeEx.startDate,
                          endDate: activeEx.endDate,
                        });
                      }
                      setShowExerciseModal(true);
                    }}
                  >
                    Modifier l{"'"}exercice
                  </button>
                )}
              </>
            ) : (
              <div style={{ textAlign: "center", padding: "1rem" }}>
                <i className="fas fa-calendar-plus" style={{ fontSize: "3rem", opacity: 0.1, marginBottom: "1rem" }}></i>
                <p style={{ fontSize: "0.9rem", color: "#718096" }}>Aucun exercice n{"'"}est actif pour le moment.</p>
                {isSG && <button className={styles.sessionBtn} style={{ marginTop: "1rem", background: "linear-gradient(135deg, #1cc88a, #16a085)" }} onClick={() => setShowExerciseModal(true)}>Initialiser un Exercice</button>}
              </div>
            )}
          </div>
        </div>

      </div>

      {/* MODAL SESSION */}
      {showSessionModal && (
        <div className={styles.modalOverlay}>
          <div className={styles.modal}>
            <div className={styles.modalHeader}>
              <h3>Démarrer une session</h3>
              <button className={styles.modalClose} onClick={() => setShowSessionModal(false)}><i className="fas fa-times"></i></button>
            </div>
            <form onSubmit={handleCreateSession} className={styles.modalBody}>
              <div className={styles.formGroup}>
                <label>Exercice Relatif</label>
                <select
                  className={styles.formInput}
                  value={sessionForm.exercise.id}
                  onChange={e => setSessionForm({ ...sessionForm, exercise: { id: e.target.value } })}
                  required
                >
                  <option value="">-- Choisir un exercice --</option>
                  {exercises.map((ex: any) => (
                    <option key={ex.id} value={ex.id}>{ex.year} {ex.active ? "(Actif)" : ""}</option>
                  ))}
                </select>
              </div>
              <div className={styles.formGroup}>
                <label>Nom de la session (ex: Janvier)</label>
                <input
                  type="text"
                  className={styles.formInput}
                  value={sessionForm.name}
                  onChange={e => setSessionForm({ ...sessionForm, name: e.target.value })}
                  placeholder="Ex: Assemblée de Janvier"
                  required
                />
              </div>
              <div className={styles.formGroup}>
                <label>Date de la session</label>
                <input
                  type="date"
                  className={styles.formInput}
                  value={sessionForm.date}
                  onChange={e => setSessionForm({ ...sessionForm, date: e.target.value })}
                  required
                />
              </div>
              <div className={styles.modalActions}>
                <button type="button" className={styles.cancelBtn} onClick={() => setShowSessionModal(false)}>Annuler</button>
                <button type="submit" className={styles.submitBtn}>Ouvrir la session</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL EXERCICE */}
      {showExerciseModal && (
        <div className={styles.modalOverlay}>
          <div className={styles.modal} style={{ maxWidth: "650px" }}>
            <div className={styles.modalHeader}>
              <h3>Configurer l{"'"}Exercice</h3>
              <button className={styles.modalClose} onClick={() => setShowExerciseModal(false)}><i className="fas fa-times"></i></button>
            </div>
            <form onSubmit={handleCreateExercise} className={styles.modalBody}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.5rem" }}>
                <div className={styles.formGroup}>
                  <label>Année</label>
                  <input
                    type="number"
                    className={styles.formInput}
                    value={exerciseForm.year}
                    onChange={e => setExerciseForm({ ...exerciseForm, year: e.target.value })}
                    required
                    disabled={!!exerciseForm.id}
                  />
                </div>
                <div className={styles.formGroup}>
                  <label>Nom de l{"'"}exercice</label>
                  <input
                    type="text"
                    className={styles.formInput}
                    value={exerciseForm.name}
                    onChange={e => setExerciseForm({ ...exerciseForm, name: e.target.value })}
                    required
                  />
                </div>
                <div className={styles.formGroup}>
                  <label>Date Début</label>
                  <input
                    type="date"
                    className={styles.formInput}
                    value={exerciseForm.startDate}
                    onChange={e => setExerciseForm({ ...exerciseForm, startDate: e.target.value })}
                    required
                    disabled={!!exerciseForm.id}
                  />
                </div>
                <div className={styles.formGroup}>
                  <label>Date Fin</label>
                  <input type="date" className={styles.formInput} value={exerciseForm.endDate} onChange={e => setExerciseForm({ ...exerciseForm, endDate: e.target.value })} required />
                </div>
              </div>
              <div className={styles.modalActions}>
                <button type="button" className={styles.cancelBtn} onClick={() => setShowExerciseModal(false)}>Annuler</button>
                <button type="submit" className={styles.submitBtn} style={{ background: "#1cc88a" }}>Enregistrer l{"'"}Exercice</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Transactions Récentes Unifiées */}
      <section style={{ marginTop: "3rem" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
          <h2 style={{ fontSize: "1.1rem", fontWeight: 700, margin: 0 }}>Journal des Activités</h2>
          <a href="/admin/operations" style={{ fontSize: "0.8rem", fontWeight: 700, color: "#4e73df" }}>Accéder au back-office <i className="fas fa-arrow-right"></i></a>
        </div>
        <div className={styles.tableCard} style={{ background: "white", borderRadius: "24px", border: "1px solid #e3e6f0", overflow: "hidden" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead style={{ background: "#f8f9fc" }}>
              <tr>
                <th style={{ padding: "1rem 1.5rem", textAlign: "left", fontSize: "0.7rem", fontWeight: 800, color: "#858796", textTransform: "uppercase" }}>Date</th>
                <th style={{ padding: "1rem 1.5rem", textAlign: "left", fontSize: "0.7rem", fontWeight: 800, color: "#858796", textTransform: "uppercase" }}>Rôle / Action</th>
                <th style={{ padding: "1rem 1.5rem", textAlign: "right", fontSize: "0.7rem", fontWeight: 800, color: "#858796", textTransform: "uppercase" }}>Impact Financier</th>
              </tr>
            </thead>
            <tbody>
              {stats?.recentTransactions?.slice(0, 5).map((tx: any) => {
                const translateType = (type: string) => {
                  const mapping: any = {
                    "SAVING_DEPOSIT": "Dépôt d'épargne",
                    "SAVING_WITHDRAWAL": "Retrait d'épargne",
                    "BORROWING_LOAN": "Prêt accordé",
                    "LOAN_REFUND": "Remboursement prêt",
                    "SOLIDARITY_PAYMENT": "Cotisation Solidarité",
                    "AGAPE": "Agape",
                    "INSCRIPTION": "Frais d'inscription",
                    "PENALTY": "Pénalité"
                  };
                  return mapping[type] || type;
                };

                return (
                  <tr key={tx.id} style={{ borderBottom: "1px solid #f8f9fc" }}>
                    <td style={{ padding: "1rem 1.5rem", fontSize: "0.85rem" }}>{new Date(tx.date).toLocaleDateString()}</td>
                    <td style={{ padding: "1rem 1.5rem" }}>
                      <span style={{ display: "block", fontWeight: 700, fontSize: "0.9rem" }}>{translateType(tx.type)}</span>
                      <span style={{ fontSize: "0.75rem", color: "#858796" }}>{tx.description}</span>
                    </td>
                    <td style={{ padding: "1rem 1.5rem", textAlign: "right", fontWeight: 800, color: tx.amount > 0 ? "#1cc88a" : "#e74a3b" }}>
                      {tx.amount > 0 ? "+" : ""} {tx.amount.toLocaleString()} XAF
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
