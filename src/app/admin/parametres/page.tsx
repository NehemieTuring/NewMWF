"use client";

import { useEffect, useState } from "react";
import styles from "../admin.module.css";
import { secretaryService } from "@/services/secretaryService";
import { useNotification } from "@/context/NotificationContext";

type Tab = "sessions" | "exercices";

export default function StructuralAdminPage() {
  const [activeTab, setActiveTab] = useState<Tab>("sessions");
  const [loading, setLoading] = useState(true);
  const { showToast } = useNotification();
  
  // Data states
  const [sessions, setSessions] = useState<any[]>([]);
  const [exercises, setExercises] = useState<any[]>([]);
  const [helpTypes, setHelpTypes] = useState<any[]>([]);

  // Modals state
  const [showExerciseModal, setShowExerciseModal] = useState(false);
  const [showSessionModal, setShowSessionModal] = useState(false);

  // Form states
  const [exerciseForm, setExerciseForm] = useState({
    year: new Date().getFullYear(),
    name: `Exercice ${new Date().getFullYear()}`,
    startDate: `${new Date().getFullYear()}-01-01`,
    endDate: `${new Date().getFullYear()}-12-31`,
    interestRate: 3.0,
    solidarityAmount: 15000,
    agapeAmount: 10000,
    penaltyAmount: 1000
  });

  const [sessionForm, setSessionForm] = useState({
    name: "",
    sessionDate: new Date().toISOString().split("T")[0],
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
    try {
      await secretaryService.createExercise(exerciseForm);
      setShowExerciseModal(false);
      loadStructure();
      showToast("L'exercice annuel a été initialisé avec succès.", "success");
    } catch (err) {
      console.error(err);
      showToast("Erreur lors de l'initialisation de l'exercice financier.", "error");
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
    } catch (err) {
      console.error(err);
      showToast("Erreur lors de l'ouverture de la séance.", "error");
    }
  };

  if (loading) return <div className="fas fa-spinner fa-spin" style={{ fontSize: "2rem", color: "#4e73df", margin: "5rem auto", display: "block" }}></div>;

  return (
    <div className={styles.container}>
      {/* Dynamic Animated Header */}
      <header className="fade-in-up" style={{ marginBottom: "2.5rem", display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
        <div>
          <h1 style={{ fontSize: "2.2rem", fontWeight: 900, color: "#1a365d", marginBottom: "0.5rem", letterSpacing: "-0.03em" }}>
            Administration & <span className="text-gradient">Structure</span>
          </h1>
          <p style={{ color: "#718096", fontSize: "1.05rem", fontWeight: 500 }}>Pilotez les exercices annuels et gérez les sessions de la mutuelle.</p>
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
          <div className={styles.kpiIcon} style={{ background: "rgba(28, 200, 138, 0.1)", color: "#1cc88a" }}>
            <i className="fas fa-clock"></i>
          </div>
          <div className={styles.kpiContent}>
            <span className={styles.kpiLabel}>Sessions</span>
            <span className={styles.kpiValue}>{sessions.length} totales</span>
          </div>
        </div>
        <div className={styles.kpiCard}>
          <div className={styles.kpiIcon} style={{ background: "rgba(246, 194, 62, 0.1)", color: "#f6c23e" }}>
            <i className="fas fa-hand-holding-heart"></i>
          </div>
          <div className={styles.kpiContent}>
            <span className={styles.kpiLabel}>Types d{"'"}Aide</span>
            <span className={styles.kpiValue}>{helpTypes.length}</span>
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
                    <h3 style={{ margin: 0, fontSize: "1.4rem", fontWeight: 800, color: "#2d3748" }}>Calendrier des Sessions</h3>
                    <p style={{ color: "#718096", fontSize: "0.9rem" }}>Gérez les rencontres mensuelles et les clôtures.</p>
                  </div>
                  <button className={styles.confirmBtn} style={{ background: "linear-gradient(135deg, #4e73df, #224abe)", padding: "0.85rem 1.5rem" }} onClick={() => setShowSessionModal(true)}>
                    <i className="fas fa-plus"></i> Créer une session
                  </button>
               </div>
               
               <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: "1.5rem" }}>
                  {sessions.length === 0 ? (
                    <div className="empty-state" style={{ gridColumn: "1 / -1", padding: "4rem" }}>
                       <i className="fas fa-calendar-times" style={{ fontSize: "3rem", opacity: 0.2, marginBottom: "1rem" }}></i>
                       <p>Aucune session enregistrée pour le moment.</p>
                    </div>
                  ) : sessions.map(s => (
                    <div key={s.id} className={styles.staggerDelayed} style={{ background: "white", padding: "1.75rem", borderRadius: "24px", border: "1px solid #e2e8f0", position: "relative", boxShadow: "0 4px 12px rgba(0,0,0,0.03)", overflow: "hidden" }}>
                       {s.status === "ACTIVE" && (
                         <div style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "4px", background: "linear-gradient(90deg, #4e73df, #224abe)" }}></div>
                       )}
                       <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "1.25rem" }}>
                          <div style={{ width: "48px", height: "48px", borderRadius: "14px", background: s.status === "ACTIVE" ? "rgba(78, 115, 223, 0.1)" : "#f7fafc", display: "flex", alignItems: "center", justifyContent: "center", color: s.status === "ACTIVE" ? "#4e73df" : "#a0aec0", fontSize: "1.2rem" }}>
                             <i className="fas fa-calendar-check"></i>
                          </div>
                          <span style={{ padding: "0.35rem 0.85rem", borderRadius: "50px", fontSize: "0.7rem", fontWeight: 800, background: s.status === "ACTIVE" ? "rgba(28,200,138,0.1)" : "#f7fafc", color: s.status === "ACTIVE" ? "#1cc88a" : "#718096", border: "1px solid rgba(0,0,0,0.05)", height: "fit-content" }}>
                             {s.status === "ACTIVE" ? "EN COURS" : "CLÔTURÉE"}
                          </span>
                       </div>
                       <h4 style={{ margin: "0 0 0.5rem 0", fontSize: "1.1rem", fontWeight: 800, color: "#1a365d" }}>{s.name}</h4>
                       <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", color: "#718096", fontSize: "0.85rem", marginBottom: "1.75rem" }}>
                          <i className="far fa-clock"></i>
                          <span>Tenu le {new Date(s.date).toLocaleDateString(undefined, { day: 'numeric', month: 'long', year: 'numeric' })}</span>
                       </div>
                       <div style={{ display: "flex", gap: "0.75rem" }}>
                          <button className={styles.cancelBtn} style={{ flex: 1, padding: "0.75rem", borderRadius: "12px", fontSize: "0.85rem" }}>Détails</button>
                          {s.status === "ACTIVE" && (
                            <button className={styles.confirmBtn} style={{ flex: 1.5, padding: "0.75rem", background: "linear-gradient(135deg, #e74a3b, #c0392b)", borderRadius: "12px", fontSize: "0.85rem" }}>Clôturer</button>
                          )}
                       </div>
                    </div>
                  ))}
               </div>
            </div>
          )}

          {activeTab === "exercices" && (
            <div className="fade-in">
               <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "2rem" }}>
                  <div>
                    <h3 style={{ margin: 0, fontSize: "1.4rem", fontWeight: 800, color: "#2d3748" }}>Exercices Annuels</h3>
                    <p style={{ color: "#718096", fontSize: "0.9rem" }}>Historique et configuration des cycles de la mutuelle.</p>
                  </div>
                  <button className={styles.confirmBtn} style={{ background: "linear-gradient(135deg, #4e73df, #224abe)", padding: "0.85rem 1.5rem" }} onClick={() => setShowExerciseModal(true)}>
                    <i className="fas fa-plus"></i> Nouvel Exercice
                  </button>
               </div>
               
               <div className={styles.tableCard} style={{ border: "1px solid #e2e8f0", boxShadow: "0 4px 12px rgba(0,0,0,0.03)" }}>
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
                             <td style={{ color: "#718096" }}>
                                {new Date(ex.startDate).toLocaleDateString()} - {new Date(ex.endDate).toLocaleDateString()}
                             </td>
                             <td>
                               <span className={ex.active ? styles.badgeSuccess : styles.badgePrimary}>
                                 {ex.active ? "ACTIF" : "ARCHIVÉ"}
                               </span>
                             </td>
                             <td style={{ textAlign: "right" }}>
                                <button style={{ background: "none", border: "none", color: "#4e73df", cursor: "pointer", fontSize: "1rem", padding: "0.5rem" }} title="Modifier">
                                   <i className="fas fa-edit"></i>
                                </button>
                                <button style={{ background: "none", border: "none", color: "#718096", cursor: "pointer", fontSize: "1rem", padding: "0.5rem" }} title="Rapport">
                                   <i className="fas fa-file-alt"></i>
                                </button>
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
                    onChange={e => setExerciseForm({...exerciseForm, year: parseInt(e.target.value)})}
                    required 
                  />
                </div>
                <div className={styles.formField}>
                  <label>Nom de l{"'"}Exercice</label>
                  <input 
                    type="text" 
                    className={styles.formInput} 
                    value={exerciseForm.name} 
                    onChange={e => setExerciseForm({...exerciseForm, name: e.target.value})}
                    required 
                  />
                </div>
                <div className={styles.formField}>
                  <label>Date Début</label>
                  <input 
                    type="date" 
                    className={styles.formInput} 
                    value={exerciseForm.startDate} 
                    onChange={e => setExerciseForm({...exerciseForm, startDate: e.target.value})}
                    required 
                  />
                </div>
                <div className={styles.formField}>
                  <label>Date Fin</label>
                  <input 
                    type="date" 
                    className={styles.formInput} 
                    value={exerciseForm.endDate} 
                    onChange={e => setExerciseForm({...exerciseForm, endDate: e.target.value})}
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
                    onChange={e => setSessionForm({...sessionForm, exercise: { id: e.target.value }})}
                    required
                  >
                    <option value="">-- Sélectionner l{"'"}exercice --</option>
                    {exercises.map(ex => (
                      <option key={ex.id} value={ex.id}>{ex.year} {ex.active ? "(Actif)" : ""}</option>
                    ))}
                  </select>
                </div>
                <div className={styles.formField} style={{ gridColumn: "span 2" }}>
                  <label>Nom de la Session (ex: Janvier)</label>
                  <input 
                    type="text" 
                    className={styles.formInput} 
                    value={sessionForm.name} 
                    onChange={e => setSessionForm({...sessionForm, name: e.target.value})}
                    placeholder="Entrez le mois ou le nom"
                    required 
                  />
                </div>
                <div className={styles.formField} style={{ gridColumn: "span 2" }}>
                  <label>Date de la Session</label>
                  <input 
                    type="date" 
                    className={styles.formInput} 
                    value={sessionForm.sessionDate} 
                    onChange={e => setSessionForm({...sessionForm, sessionDate: e.target.value})}
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
    </div>
  );
}
