"use client";

import { useEffect, useState } from "react";
import styles from "../admin.module.css";
import { secretaryService } from "@/services/secretaryService";
import { useNotification } from "@/context/NotificationContext";

export default function AgapePage() {
  const [agapes, setAgapes] = useState<any[]>([]);
  const [sessions, setSessions] = useState<any[]>([]);
  const [socialBalance, setSocialBalance] = useState(0);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const { showToast } = useNotification();
  
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({
    title: "",
    description: "",
    amount: "",
    date: new Date().toISOString().split("T")[0],
    sessionId: ""
  });

  async function loadData() {
    setLoading(true);
    try {
      const [agapeData, sessionData, dashboardStats] = await Promise.all([
        secretaryService.getAgapes(),
        secretaryService.getSessions(),
        secretaryService.getGlobalTransactions()
      ]);
      setAgapes(agapeData || []);
      setSessions(sessionData || []);
      setSocialBalance(dashboardStats?.totalEnrollments || 0);
    } catch (err) {
      console.error(err);
      showToast("Erreur lors du chargement des agapes.", "error");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadData();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.sessionId) {
      showToast("Veuillez sélectionner une session.", "error");
      return;
    }
    setSubmitting(true);
    try {
      await secretaryService.createAgape({
        ...form,
        amount: Number(form.amount)
      });
      showToast("Agape enregistrée et financée par le compte des Inscriptions.", "success");
      setShowModal(false);
      setForm({
        title: "",
        description: "",
        amount: "",
        date: new Date().toISOString().split("T")[0],
        sessionId: ""
      });
      loadData();
    } catch (err: any) {
      showToast(err.message || "Erreur lors de la création de l'agape.", "error");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div className="fas fa-spinner fa-spin" style={{ fontSize: "2rem", color: "#4e73df", margin: "5rem auto", display: "block" }}></div>;

  return (
    <div className={styles.container}>
      <header style={{ marginBottom: "2.5rem", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <h1 style={{ fontSize: "2rem", fontWeight: 900, color: "#1a365d" }}>Gestion des <span className="text-gradient">Agapes</span></h1>
          <p style={{ color: "#718096" }}>Organisation des repas et moments de partage communautaire.</p>
        </div>
        <button className={styles.confirmBtn} onClick={() => setShowModal(true)}>
          <i className="fas fa-plus"></i> Nouvelle Agape
        </button>
      </header>

      <div className={styles.glassCard} style={{ 
        background: "rgba(255,255,255,0.7)", 
        padding: "1.5rem", 
        marginBottom: "2rem", 
        border: "1px solid rgba(78, 115, 223, 0.2)",
        display: "flex",
        justifyContent: "flex-end",
        alignItems: "center"
      }}>
         <div style={{ background: "#4e73df", color: "white", padding: "0.6rem 1.5rem", borderRadius: "14px", fontWeight: 850 }}>
            SOLDE INSCRIPTIONS: {socialBalance.toLocaleString()} XAF
         </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: "1.5rem" }}>
        {agapes.length === 0 ? (
          <div className="empty-state" style={{ gridColumn: "1 / -1", padding: "4rem" }}>
            <p>Aucune agape enregistrée pour le moment.</p>
          </div>
        ) : agapes.map(a => (
          <div key={a.id} className={styles.staggerDelayed} style={{ background: "white", padding: "1.5rem", borderRadius: "20px", border: "1px solid #e2e8f0", boxShadow: "0 4px 12px rgba(0,0,0,0.03)" }}>
             <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "1rem" }}>
                <div style={{ width: "40px", height: "40px", borderRadius: "10px", background: "rgba(231, 74, 59, 0.1)", color: "#e74a3b", display: "flex", alignItems: "center", justifyContent: "center" }}>
                   <i className="fas fa-utensils"></i>
                </div>
                <span style={{ fontSize: "0.8rem", color: "#a0aec0", fontWeight: 700 }}>{new Date(a.eventDate).toLocaleDateString()}</span>
             </div>
             <h3 style={{ margin: "0 0 0.5rem 0", fontSize: "1.1rem" }}>{a.title}</h3>
             <p style={{ fontSize: "0.85rem", color: "#718096", marginBottom: "1.5rem" }}>{a.description}</p>
             <div style={{ borderTop: "1px solid #f7fafc", paddingTop: "1rem", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontSize: "0.75rem", color: "#a0aec0" }}>Session: {a.session?.name}</span>
                <span style={{ fontWeight: 800, color: "#2d3748" }}>{a.amount?.toLocaleString()} XAF</span>
             </div>
          </div>
        ))}
      </div>

      {showModal && (
        <div className={styles.modalOverlay}>
          <div className={`${styles.modal} fade-in-up`} style={{ maxWidth: "550px", borderRadius: "30px", border: "none", overflow: "hidden", boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)" }}>
            <div className={styles.modalHeader} style={{ background: "linear-gradient(135deg, #4e73df, #224abe)", padding: "1.75rem 2rem" }}>
              <h3 style={{ color: "white", fontSize: "1.35rem", fontWeight: 800, margin: 0 }}>
                <i className="fas fa-utensils" style={{ marginRight: "0.75rem", opacity: 0.8 }}></i>
                Organiser une Agape
              </h3>
              <button className={styles.modalClose} style={{ color: "white", background: "rgba(255,255,255,0.2)", width: "32px", height: "32px", display: "flex", alignItems: "center", justifyContent: "center" }} onClick={() => setShowModal(false)}>
                <i className="fas fa-times"></i>
              </button>
            </div>
            <form onSubmit={handleSubmit} className={styles.modalBody} style={{ padding: "2.5rem" }}>
               <div className={styles.formGroup} style={{ marginBottom: "1.5rem" }}>
                  <label style={{ color: "#4e73df", fontWeight: 700, fontSize: "0.85rem", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "0.75rem", display: "block" }}>
                    <i className="fas fa-bullhorn" style={{ marginRight: "0.5rem" }}></i> Titre de l'événement
                  </label>
                  <input type="text" className={styles.formInput} value={form.title} onChange={e => setForm({...form, title: e.target.value})} placeholder="Ex: Grand repas de fin d'exercice" required style={{ borderRadius: "15px", padding: "1rem 1.25rem", border: "1px solid #e2e8f0", background: "#f8fafc" }} />
               </div>
               <div className={styles.formGroup} style={{ marginBottom: "1.5rem" }}>
                  <label style={{ color: "#4e73df", fontWeight: 700, fontSize: "0.85rem", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "0.75rem", display: "block" }}>
                    <i className="fas fa-align-left" style={{ marginRight: "0.5rem" }}></i> Description
                  </label>
                  <textarea className={styles.formInput} style={{ minHeight: "100px", borderRadius: "15px", padding: "1rem 1.25rem", border: "1px solid #e2e8f0", background: "#f8fafc" }} value={form.description} onChange={e => setForm({...form, description: e.target.value})} placeholder="Détails du menu ou motif..." required />
               </div>
               <div className={styles.formGroup} style={{ marginBottom: "1.5rem" }}>
                  <label style={{ color: "#4e73df", fontWeight: 700, fontSize: "0.85rem", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "0.75rem", display: "block" }}>
                    <i className="fas fa-money-bill-wave" style={{ marginRight: "0.5rem" }}></i> Budget total (XAF)
                  </label>
                  <input type="number" className={styles.formInput} value={form.amount} onChange={e => setForm({...form, amount: e.target.value})} placeholder="Montant (45 000 XAF)" required style={{ borderRadius: "15px", padding: "1rem 1.25rem", border: "1px solid #e2e8f0", background: "#f8fafc", fontWeight: 700, color: "#2d3748" }} />
               </div>
               <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.5rem", marginBottom: "2rem" }}>
                 <div className={styles.formGroup}>
                    <label style={{ color: "#4e73df", fontWeight: 700, fontSize: "0.85rem", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "0.75rem", display: "block" }}>
                      <i className="fas fa-calendar-day" style={{ marginRight: "0.5rem" }}></i> Date prévue
                    </label>
                    <input type="date" className={styles.formInput} value={form.date} onChange={e => setForm({...form, date: e.target.value})} required style={{ borderRadius: "15px", padding: "1rem 1.25rem", border: "1px solid #e2e8f0", background: "#f8fafc" }} />
                 </div>
                 <div className={styles.formGroup}>
                    <label style={{ color: "#4e73df", fontWeight: 700, fontSize: "0.85rem", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "0.75rem", display: "block" }}>
                      <i className="fas fa-clock" style={{ marginRight: "0.5rem" }}></i> Session liée
                    </label>
                    <select className={styles.formInput} value={form.sessionId} onChange={e => setForm({...form, sessionId: e.target.value})} required style={{ borderRadius: "15px", padding: "1rem 1.25rem", border: "1px solid #e2e8f0", background: "#f8fafc" }}>
                       <option value="">Sélectionner...</option>
                       {sessions.map(s => <option key={s.id} value={s.id}>{s.name || `Session #${s.sessionNumber}`}</option>)}
                    </select>
                 </div>
               </div>
               <div className={styles.modalActions} style={{ marginTop: "1.5rem", gap: "1.25rem" }}>
                  <button type="button" className={styles.cancelBtn} onClick={() => setShowModal(false)} style={{ borderRadius: "16px", padding: "1.1rem", fontWeight: 700 }}>Annuler</button>
                  <button type="submit" className={styles.confirmBtn} disabled={submitting} style={{ background: "linear-gradient(135deg, #4e73df, #224abe)", borderRadius: "16px", padding: "1.1rem", flex: 2, boxShadow: "0 10px 25px rgba(78, 115, 223, 0.3)", border: "none" }}>
                    {submitting ? <i className="fas fa-spinner fa-spin"></i> : <><i className="fas fa-check-circle" style={{ marginRight: "0.6rem" }}></i> Confirmer & Financer</>}
                  </button>
               </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
