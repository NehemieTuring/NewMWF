"use client";

import { useEffect, useState } from "react";
import styles from "../admin.module.css";
import { secretaryService } from "@/services/secretaryService";
import { useNotification } from "@/context/NotificationContext";
import { useAuth } from "@/context/AuthContext";

type Tab = "sessions" | "exercices";

export default function StructuralAdminPage() {
  const [activeTab, setActiveTab] = useState<Tab>("sessions");
  const [loading, setLoading] = useState(true);
  const { showToast, confirm } = useNotification();
  const { user } = useAuth();
  const isTreasurer = user?.subRole === "TRESORIER";

  // Data states
  const [sessions, setSessions] = useState<any[]>([]);
  const [exercises, setExercises] = useState<any[]>([]);
  const [helpTypes, setHelpTypes] = useState<any[]>([]);

  // Modals state
  const [showExerciseModal, setShowExerciseModal] = useState(false);
  const [showSessionModal, setShowSessionModal] = useState(false);
  const [showCloseExerciseModal, setShowCloseExerciseModal] = useState(false);
  const [exerciseToClose, setExerciseToClose] = useState<any>(null);
  const [confirmExerciseName, setConfirmExerciseName] = useState("");
  const [showCloseSessionModal, setShowCloseSessionModal] = useState(false);
  const [sessionToClose, setSessionToClose] = useState<any>(null);
  const [confirmSessionName, setConfirmSessionName] = useState("");

  // Form states
  const [exerciseForm, setExerciseForm] = useState({
    id: null as number | null,
    year: new Date().getFullYear(),
    name: `Exercice ${new Date().getFullYear()}`,
    startDate: `${new Date().getFullYear()}-01-01`,
    endDate: `${new Date().getFullYear()}-12-31`,
    interestRate: 3.0,
    solidarityAmount: 150000.0,
    agapeAmount: 45000,
    penaltyAmount: 15000
  });

  const [sessionForm, setSessionForm] = useState({
    name: "",
    date: new Date().toISOString().split("T")[0],
    exercise: { id: "" }
  });

  async function loadStructure() {
    setLoading(true);
    try {
      const [sessionsData, exercisesData, helpData] = await Promise.all([
        secretaryService.getSessions(),
        secretaryService.getExercises(),
        secretaryService.getHelpTypes()
      ]);
      setSessions(sessionsData || []);
      setExercises(exercisesData || []);
      setHelpTypes(helpData || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }
  useEffect(() => {
    loadStructure();
  }, []);

  const handleCreateExercise = async (e: React.FormEvent) => {
    e.preventDefault();

    // Client-side check for duplicates
    if (!exerciseForm.id) {
      const exists = exercises.some(ex => ex.year === exerciseForm.year);
      if (exists) {
        showToast(`L'année ${exerciseForm.year} est déjà utilisée par un autre exercice. Veuillez choisir une autre année ou modifier l'existant.`, "warning");
        return;
      }
    }

    try {
      if (exerciseForm.id) {
        await secretaryService.updateExercise(exerciseForm.id, exerciseForm as any);
        showToast("L'exercice a été mis à jour avec succès.", "success");
      } else {
        await secretaryService.createExercise(exerciseForm);
        showToast("L'exercice annuel a été initialisé avec succès.", "success");
      }
      setShowExerciseModal(false);
      loadStructure();
    } catch (err: any) {
      console.error(err);
      const msg = err.message || "";
      if (msg.includes("déjà été créé") || msg.includes("existe déjà") || msg.includes("Conflict")) {
        showToast(`L'année ${exerciseForm.year} est déjà utilisée.`, "error");
      } else {
        showToast(err.message || "Erreur lors de l'enregistrement de l'exercice financier.", "error");
      }
    }
  };

  const handleCreateSession = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!sessionForm.exercise.id) {
      alert("Veuillez d'abord sélectionner un exercice.");
      return;
    }
    try {
      await secretaryService.createSession(sessionForm);
      setShowSessionModal(false);
      loadStructure();
      showToast("La séance mensuelle a été créée et ouverte.", "success");
    } catch (err: any) {
      console.error(err);
      showToast(err.message || "Erreur lors de l'ouverture de la séance.", "error");
    }
  };

  const handleCloseExercise = (ex: any) => {
    setExerciseToClose(ex);
    setConfirmExerciseName("");
    setShowCloseExerciseModal(true);
  };

  const confirmAndCloseExercise = async () => {
    const exerciseName = exerciseToClose.name || `Exercice ${exerciseToClose.year}`;

    if (confirmExerciseName !== exerciseName) {
      showToast("Le nom saisi ne correspond pas exactement.", "error");
      return;
    }

    try {
      setLoading(true);
      const result = await secretaryService.closeExercise(exerciseToClose.id);
      setShowCloseExerciseModal(false);
      loadStructure();

      // Afficher les détails du renflouement si disponibles
      if (result && result.membersCharged) {
        showToast(
          `Exercice clôturé ! Renflouement: ${result.membersCharged} membres chargés de ${Number(result.amountPerMember).toLocaleString()} XAF chacun (total: ${Number(result.totalTarget).toLocaleString()} XAF).`,
          "success"
        );
      } else {
        showToast(result?.message || "L'exercice a été clôturé avec succès.", "success");
      }
    } catch (err: any) {
      console.error(err);
      showToast("Erreur lors de la clôture de l'exercice.", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleCloseSession = (session: any) => {
    setSessionToClose(session);
    setConfirmSessionName("");
    setShowCloseSessionModal(true);
  };

  const confirmAndCloseSession = async () => {
    const sessionName = sessionToClose.name || `Session #${sessionToClose.sessionNumber}`;
    if (confirmSessionName !== sessionName) {
      showToast("Le nom saisi ne correspond pas exactement.", "error");
      return;
    }
    try {
      setLoading(true);
      await secretaryService.closeSession(sessionToClose.id);
      setShowCloseSessionModal(false);
      loadStructure();
      showToast("La séance a été clôturée avec succès.", "success");
    } catch (err: any) {
      console.error(err);
      showToast("Erreur lors de la clôture de la séance.", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleEditExercise = (ex: any) => {
    setExerciseForm({
      id: ex.id,
      year: ex.year,
      name: ex.name || `Exercice ${ex.year}`,
      startDate: ex.startDate,
      endDate: ex.endDate,
      interestRate: ex.interestRate || 3.0,
      solidarityAmount: ex.solidarityAmount || 150000.0,
      agapeAmount: ex.agapeAmount || 45000,
      penaltyAmount: ex.penaltyAmount || 15000
    });
    setShowExerciseModal(true);
  };

  if (loading) return <div className="fas fa-spinner fa-spin" style={{ fontSize: "2rem", color: "#4e73df", margin: "5rem auto", display: "block" }}></div>;

  return (
    <div className={styles.container}>
      {/* Dynamic Animated Header */}
      <header className="fade-in-up" style={{ marginBottom: "2.5rem", display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
        <div>
          <h1 style={{ fontSize: "2.2rem", fontWeight: 900, color: "var(--text-dark)", marginBottom: "0.5rem", letterSpacing: "-0.03em" }}>
            Administration & <span className="text-gradient">Structure</span>
          </h1>
          <p style={{ color: "var(--text-muted)", fontSize: "1.05rem", fontWeight: 500 }}>Pilotez les exercices annuels et gérez les sessions de la mutuelle.</p>
        </div>
        <div style={{ display: "flex", gap: "0.75rem" }}>
          <div className={styles.sidebarBadge} style={{ background: "rgba(78, 115, 223, 0.1)", color: "#4e73df", padding: "0.5rem 1rem" }}>
            <i className="fas fa-microchip"></i> Mode Administrateur
          </div>
        </div>
      </header>

      {/* Quick Stats / KPIs */}
      <div className="stagger-children" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "1.5rem", marginBottom: "3rem" }}>
        <div className={styles.kpiCard}>
          <div className={styles.kpiIcon} style={{ background: "rgba(78, 115, 223, 0.1)", color: "#4e73df" }}>
            <i className="fas fa-calendar-check"></i>
          </div>
          <div className={styles.kpiContent}>
            <span className={styles.kpiLabel}>Exercice Actif</span>
            <span className={styles.kpiValue}>{exercises.find(e => e.active)?.year || "Aucun"}</span>
          </div>
        </div>
        <div className={styles.kpiCard}>
          <div className={styles.kpiIcon} style={{ background: "rgba(78, 115, 223, 0.1)", color: "#4e73df" }}>
            <i className="fas fa-clock"></i>
          </div>
          <div className={styles.kpiContent}>
            <span className={styles.kpiLabel}>Sessions (Exercice en cours)</span>
            <span className={styles.kpiValue}>
              {sessions.filter(s => s.exercise?.id === exercises.find(e => e.active)?.id).length} totales
            </span>
          </div>
        </div>
        <div className={styles.kpiCard}>
          <div className={styles.kpiIcon} style={{ background: "rgba(28, 200, 138, 0.1)", color: "#1cc88a" }}>
            <i className="fas fa-check-circle"></i>
          </div>
          <div className={styles.kpiContent}>
            <span className={styles.kpiLabel}>Sessions Clôturées (Exercice en cours)</span>
            <span className={styles.kpiValue}>
              {sessions.filter(s => s.exercise?.id === exercises.find(e => e.active)?.id && s.state !== "OPEN" && s.state !== "SAVING").length}
            </span>
          </div>
        </div>
      </div>

      <div className={styles.tabsContainer}>
        <div className={styles.tabsHeader}>
          <button className={`${styles.tabBtn} ${activeTab === "sessions" ? styles.tabBtnActive : ""}`} onClick={() => setActiveTab("sessions")}>
            <i className="fas fa-history"></i> Sessions
          </button>
          <button className={`${styles.tabBtn} ${activeTab === "exercices" ? styles.tabBtnActive : ""}`} onClick={() => setActiveTab("exercices")}>
            <i className="fas fa-calendar-alt"></i> Exercices
          </button>


        </div>

        <div className={styles.tabContent}>
          {activeTab === "sessions" && (
            <div className="fade-in">
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "2rem" }}>
                <div>
                  <h3 style={{ margin: 0, fontSize: "1.4rem", fontWeight: 800, color: "var(--text-dark)" }}>Calendrier des Sessions</h3>
                  <p style={{ color: "var(--text-muted)", fontSize: "0.9rem" }}>Gérez les rencontres mensuelles et les clôtures.</p>
                </div>
                <button
                  className={styles.confirmBtn}
                  style={{ background: "linear-gradient(135deg, #4e73df, #224abe)", padding: "0.85rem 1.5rem" }}
                  onClick={() => {
                    const activeSession = sessions.find(s => (s.state === "OPEN" || s.state === "SAVING"));
                    if (activeSession) {
                      showToast(`La session "${activeSession.name || 'actuelle'}" est déjà ouverte. Veuillez la clôturer avant d'en créer une nouvelle.`, "warning");
                      return;
                    }
                    const activeExercise = exercises.find(e => e.active);
                    if (!activeExercise) {
                      showToast("Veuillez d'abord activer un exercice annuel dans l'onglet 'Exercices'.", "warning");
                      return;
                    }
                    setSessionForm({
                      ...sessionForm,
                      exercise: { id: activeExercise.id }
                    });
                    setShowSessionModal(true);
                  }}
                >
                  <i className="fas fa-plus"></i> Créer une session
                </button>
              </div>

              <div className={styles.tableCard}>
                <table className={styles.table}>
                  <thead>
                    <tr>
                      <th style={{ width: "60px" }}>N°</th>
                      <th>Nom de la Session</th>
                      <th>Date</th>
                      <th>Statut</th>
                      <th style={{ textAlign: "right" }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {sessions.length === 0 ? (
                      <tr><td colSpan={5} style={{ textAlign: "center", padding: "3rem", color: "var(--text-muted)" }}>Aucune session enregistrée.</td></tr>
                    ) : sessions.map(s => (
                      <tr key={s.id}>
                        <td>
                          <div style={{ width: "32px", height: "32px", borderRadius: "8px", background: "rgba(78, 115, 223, 0.1)", color: "#4e73df", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, fontSize: "0.8rem" }}>
                            {s.sessionNumber}
                          </div>
                        </td>
                        <td style={{ fontWeight: 700, color: "var(--text-dark)" }}>{s.name || `Session #${s.sessionNumber}`}</td>
                        <td style={{ color: "var(--text-muted)", fontSize: "0.9rem" }}>
                          {new Date(s.date).toLocaleDateString(undefined, { day: 'numeric', month: 'long', year: 'numeric' })}
                        </td>
                        <td>
                          <span style={{
                            padding: "0.35rem 0.85rem",
                            borderRadius: "50px",
                            fontSize: "0.7rem",
                            fontWeight: 800,
                            background: (s.state === "OPEN" || s.state === "SAVING") ? "rgba(28, 200, 138, 0.12)" : "#f7fafc",
                            color: (s.state === "OPEN" || s.state === "SAVING") ? "#1cc88a" : "#718096",
                            border: "1px solid rgba(0,0,0,0.02)"
                          }}>
                            {(s.state === "OPEN" || s.state === "SAVING") ? "OUVERTE" : "CLÔTURÉE"}
                          </span>
                        </td>
                        <td style={{ textAlign: "right" }}>
                          <div style={{ display: "flex", gap: "0.25rem", justifyContent: "flex-end" }}>
                            <button
                              onClick={() => window.location.href = `/admin/sessions/${s.id}`}
                              style={{ background: "none", border: "none", color: "#4e73df", cursor: "pointer", fontSize: "1.1rem", padding: "0.5rem" }}
                              title="Détails"
                            >
                              <i className="fas fa-eye"></i>
                            </button>
                            {(s.state === "OPEN" || s.state === "SAVING") && (
                              <button
                                onClick={() => handleCloseSession(s)}
                                style={{ background: "none", border: "none", color: "#e74a3b", cursor: "pointer", fontSize: "1.1rem", padding: "0.5rem" }}
                                title="Clôturer"
                              >
                                <i className="fas fa-lock"></i>
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === "exercices" && (
            <div className="fade-in">
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "2rem" }}>
                <div>
                  <h3 style={{ margin: 0, fontSize: "1.4rem", fontWeight: 800, color: "var(--text-dark)" }}>Exercices Annuels</h3>
                  <p style={{ color: "var(--text-muted)", fontSize: "0.9rem" }}>Historique et configuration des cycles de la mutuelle.</p>
                </div>
                <button
                  className={styles.confirmBtn}
                  style={{ background: "linear-gradient(135deg, #4e73df, #224abe)", padding: "0.85rem 1.5rem" }}
                  onClick={() => {
                    const activeExercise = exercises.find(e => e.active);
                    if (activeExercise) {
                      showToast(`L'exercice ${activeExercise.year} est déjà actif. Veuillez le clôturer avant d'en créer un nouveau.`, "warning");
                      return;
                    }
                    setExerciseForm({
                      id: null,
                      year: new Date().getFullYear(),
                      name: `Exercice ${new Date().getFullYear()}`,
                      startDate: `${new Date().getFullYear()}-01-01`,
                      endDate: `${new Date().getFullYear()}-12-31`,
                      interestRate: 3.0,
                      solidarityAmount: 150000.0,
                      agapeAmount: 45000,
                      penaltyAmount: 15000
                    });
                    setShowExerciseModal(true);
                  }}
                >
                  <i className="fas fa-plus"></i> Nouvel Exercice
                </button>
              </div>

              <div className={styles.tableCard}>
                <table className={styles.table}>
                  <thead>
                    <tr>
                      <th>Année Active</th>
                      <th>Période</th>
                      <th>Statut Cycle</th>
                      <th style={{ textAlign: "right" }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {exercises.length === 0 ? (
                      <tr><td colSpan={4} style={{ textAlign: "center", padding: "3rem", color: "#a0aec0" }}>Aucun exercice configuré.</td></tr>
                    ) : exercises.map(ex => (
                      <tr key={ex.id}>
                        <td>
                          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                            <div style={{ padding: "0.5rem", borderRadius: "8px", background: "rgba(78, 115, 223, 0.1)", color: "#4e73df", fontWeight: 800 }}>{ex.year}</div>
                            <span style={{ fontWeight: 700 }}>{ex.name || `Exercice ${ex.year}`}</span>
                          </div>
                        </td>
                        <td style={{ color: "var(--text-muted)" }}>
                          {new Date(ex.startDate).toLocaleDateString()} - {new Date(ex.endDate).toLocaleDateString()}
                        </td>
                        <td>
                          <span className={ex.active ? styles.badgeSuccess : styles.badgePrimary}>
                            {ex.active ? "ACTIF" : "ARCHIVÉ"}
                          </span>
                        </td>
                        <td style={{ textAlign: "right" }}>
                          {ex.active && (
                            <button
                              onClick={() => handleCloseExercise(ex)}
                              style={{ background: "none", border: "none", color: "#e74a3b", cursor: "pointer", fontSize: "1.1rem", padding: "0.5rem" }}
                              title="Clôturer l'exercice"
                            >
                              <i className="fas fa-lock"></i>
                            </button>
                          )}
                          {ex.active && (
                            <button
                              onClick={() => handleEditExercise(ex)}
                              style={{ background: "none", border: "none", color: "#4e73df", cursor: "pointer", fontSize: "1.1rem", padding: "0.5rem" }}
                              title="Modifier"
                            >
                              <i className="fas fa-edit"></i>
                            </button>
                          )}

                          {isTreasurer && (
                            <button
                              onClick={() => window.location.href = `/admin/bilans?ex=${ex.id}`}
                              style={{ background: "none", border: "none", color: "#718096", cursor: "pointer", fontSize: "1.1rem", padding: "0.5rem" }}
                              title="Rapport"
                            >
                              <i className="fas fa-file-alt"></i>
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}




        </div>
      </div>

      {/* MODAL EXERCICE */}
      {showExerciseModal && (
        <div className={styles.modalOverlay}>
          <div className={`${styles.modal} fade-in-up`} style={{ maxWidth: "650px" }}>
            <div className={styles.modalHeader}>
              <h3><i className="fas fa-calendar-plus"></i> Configurer un Nouvel Exercice</h3>
              <button className={styles.modalClose} onClick={() => setShowExerciseModal(false)}><i className="fas fa-times"></i></button>
            </div>
            <form onSubmit={handleCreateExercise} className={styles.modalForm}>
              <div className={styles.formGrid}>
                <div className={styles.formField}>
                  <label>Année</label>
                  <input
                    type="number"
                    className={styles.formInput}
                    value={exerciseForm.year}
                    onChange={e => {
                      const yr = parseInt(e.target.value) || 0;
                      setExerciseForm({
                        ...exerciseForm,
                        year: yr,
                        name: `Exercice ${yr}`,
                        startDate: `${yr}-01-01`,
                        endDate: `${yr}-12-31`
                      });
                    }}
                    required
                    disabled={!!exerciseForm.id}
                  />
                </div>
                <div className={styles.formField}>
                  <label>Nom de l{"'"}Exercice (facultatif)</label>
                  <input
                    type="text"
                    className={styles.formInput}
                    value={exerciseForm.name}
                    onChange={e => setExerciseForm({ ...exerciseForm, name: e.target.value })}
                  />
                </div>
                <div className={styles.formField}>
                  <label>Date Début</label>
                  <input
                    type="date"
                    className={styles.formInput}
                    value={exerciseForm.startDate}
                    onChange={e => setExerciseForm({ ...exerciseForm, startDate: e.target.value })}
                    required
                  />
                </div>
                <div className={styles.formField}>
                  <label>Date Fin</label>
                  <input
                    type="date"
                    className={styles.formInput}
                    value={exerciseForm.endDate}
                    onChange={e => setExerciseForm({ ...exerciseForm, endDate: e.target.value })}
                    required
                  />
                </div>
              </div>
              <div className={styles.modalActions}>
                <button type="button" className={styles.cancelBtn} onClick={() => setShowExerciseModal(false)}>Annuler</button>
                <button type="submit" className={`${styles.confirmBtn} ${styles.confirmActionBtn}`}>Lancer l{"'"}Exercice</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL SESSION */}
      {showSessionModal && (
        <div className={styles.modalOverlay}>
          <div className={`${styles.modal} fade-in-up`} style={{ maxWidth: "450px" }}>
            <div className={styles.modalHeader}>
              <h3><i className="fas fa-history"></i> Créer une Session Mensuelle</h3>
              <button className={styles.modalClose} onClick={() => setShowSessionModal(false)}><i className="fas fa-times"></i></button>
            </div>
            <form onSubmit={handleCreateSession} className={styles.modalForm}>
              <div className={styles.formGrid}>
                <div className={styles.formField} style={{ gridColumn: "span 2" }}>
                  <label>Choisir l{"'"}Exercice</label>
                  <select
                    className={styles.formInput}
                    value={sessionForm.exercise.id}
                    onChange={e => setSessionForm({ ...sessionForm, exercise: { id: e.target.value ? Number(e.target.value) : "" } as any })}
                    required
                  >
                    <option value="">-- Sélectionner l{"'"}exercice --</option>
                    {exercises.filter(ex => ex.active).map(ex => (
                      <option key={ex.id} value={ex.id}>{ex.year} (Actif)</option>
                    ))}
                  </select>
                </div>
                <div className={styles.formField} style={{ gridColumn: "span 2" }}>
                  <label>Nom de la Session (ex: Janvier)</label>
                  <input
                    type="text"
                    className={styles.formInput}
                    value={sessionForm.name}
                    onChange={e => setSessionForm({ ...sessionForm, name: e.target.value })}
                    placeholder="Entrez le mois ou le nom"
                    required
                  />
                </div>
                <div className={styles.formField} style={{ gridColumn: "span 2" }}>
                  <label>Date de la Session</label>
                  <input
                    type="date"
                    className={styles.formInput}
                    value={sessionForm.date}
                    onChange={e => setSessionForm({ ...sessionForm, date: e.target.value })}
                    required
                  />
                </div>
              </div>
              <div className={styles.modalActions}>
                <button type="button" className={styles.cancelBtn} onClick={() => setShowSessionModal(false)}>Annuler</button>
                <button type="submit" className={`${styles.confirmBtn} ${styles.confirmActionBtn}`}>Ouvrir la Session</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL CLÔTURE EXERCICE */}
      {showCloseExerciseModal && exerciseToClose && (
        <div className={styles.modalOverlay}>
          <div className={`${styles.modal} fade-in-up`} style={{ maxWidth: "500px", borderTop: "5px solid #e74a3b" }}>
            <div className={styles.modalHeader}>
              <h3 style={{ color: "#e74a3b" }}>
                <i className="fas fa-exclamation-triangle"></i> Clôture Définitive
              </h3>
              <button className={styles.modalClose} onClick={() => setShowCloseExerciseModal(false)}>
                <i className="fas fa-times"></i>
              </button>
            </div>
            <div className={styles.modalBody} style={{ padding: "1.5rem" }}>
              <p style={{ color: "#2d3748", fontWeight: 600, marginBottom: "1rem" }}>
                Attention : La clôture de l{"'"}exercice est une action irréversible. Toutes les données seront archivées.
              </p>
              <div
                style={{
                  background: "#fff5f5",
                  padding: "1rem",
                  borderRadius: "12px",
                  border: "1px solid #feb2b2",
                  marginBottom: "1.5rem",
                  fontSize: "0.9rem",
                  color: "#c53030"
                }}
              >
                Pour confirmer la clôture de l{"'"}exercice <strong style={{ textDecoration: "underline" }}>{exerciseToClose.name || `Exercice ${exerciseToClose.year}`}</strong>, veuillez saisir son nom exactement :
              </div>
              <div className={styles.formField}>
                <input
                  type="text"
                  className={styles.formInput}
                  placeholder="Saisissez le nom ici..."
                  value={confirmExerciseName}
                  onChange={(e) => setConfirmExerciseName(e.target.value)}
                  autoFocus
                />
              </div>
            </div>
            <div className={styles.modalActions} style={{ padding: "1rem 1.5rem 1.5rem" }}>
              <button type="button" className={styles.cancelBtn} onClick={() => setShowCloseExerciseModal(false)}>
                Annuler
              </button>
              <button
                type="button"
                className={styles.confirmBtn}
                style={{
                  background: confirmExerciseName === (exerciseToClose.name || `Exercice ${exerciseToClose.year}`)
                    ? "linear-gradient(135deg, #e74a3b, #c0392b)"
                    : "#cbd5e0",
                  cursor: confirmExerciseName === (exerciseToClose.name || `Exercice ${exerciseToClose.year}`) ? "pointer" : "not-allowed"
                }}
                disabled={confirmExerciseName !== (exerciseToClose.name || `Exercice ${exerciseToClose.year}`)}
                onClick={confirmAndCloseExercise}
              >
                Confirmer la clôture
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL CLÔTURE SESSION */}
      {showCloseSessionModal && sessionToClose && (
        <div className={styles.modalOverlay}>
          <div className={`${styles.modal} fade-in-up`} style={{ maxWidth: "500px", borderTop: "5px solid #e74a3b" }}>
            <div className={styles.modalHeader}>
              <h3 style={{ color: "#e74a3b" }}>
                <i className="fas fa-exclamation-triangle"></i> Clôture de Séance
              </h3>
              <button className={styles.modalClose} onClick={() => setShowCloseSessionModal(false)}>
                <i className="fas fa-times"></i>
              </button>
            </div>
            <div className={styles.modalBody} style={{ padding: "1.5rem" }}>
              <p style={{ color: "#2d3748", fontWeight: 600, marginBottom: "1rem" }}>
                Attention : La clôture de cette séance est irréversible. Aucune opération ne pourra plus être effectuée sur cette séance.
              </p>
              <div
                style={{
                  background: "#fff5f5",
                  padding: "1rem",
                  borderRadius: "12px",
                  border: "1px solid #feb2b2",
                  marginBottom: "1.5rem",
                  fontSize: "0.9rem",
                  color: "#c53030"
                }}
              >
                Pour confirmer la clôture de la séance <strong style={{ textDecoration: "underline" }}>{sessionToClose.name || `Session #${sessionToClose.sessionNumber}`}</strong>, veuillez saisir son nom exactement :
              </div>
              <div className={styles.formField}>
                <input
                  type="text"
                  className={styles.formInput}
                  placeholder="Saisissez le nom ici..."
                  value={confirmSessionName}
                  onChange={(e) => setConfirmSessionName(e.target.value)}
                  autoFocus
                />
              </div>
            </div>
            <div className={styles.modalActions} style={{ padding: "1rem 1.5rem 1.5rem" }}>
              <button type="button" className={styles.cancelBtn} onClick={() => setShowCloseSessionModal(false)}>
                Annuler
              </button>
              <button
                type="button"
                className={styles.confirmBtn}
                style={{
                  background: confirmSessionName === (sessionToClose.name || `Session #${sessionToClose.sessionNumber}`)
                    ? "linear-gradient(135deg, #e74a3b, #c0392b)"
                    : "#cbd5e0",
                  cursor: confirmSessionName === (sessionToClose.name || `Session #${sessionToClose.sessionNumber}`) ? "pointer" : "not-allowed"
                }}
                disabled={confirmSessionName !== (sessionToClose.name || `Session #${sessionToClose.sessionNumber}`)}
                onClick={confirmAndCloseSession}
              >
                Confirmer la clôture
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
