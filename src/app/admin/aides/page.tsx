"use client";
// UI: Blue Premium Theme Updated 16/04/2026

import { useEffect, useState } from "react";
import styles from "../admin.module.css";
import { secretaryService } from "@/services/secretaryService";
import { useNotification } from "@/context/NotificationContext";
import { useAuth } from "@/context/AuthContext";
import { useTranslation } from "@/context/LanguageContext";

export default function AidesPage() {
  const { t, locale } = useTranslation();
  const [activeTab, setActiveTab] = useState<"dossiers" | "nomenclature">("dossiers");
  const [aides, setAides] = useState<any[]>([]);
  const [helpTypes, setHelpTypes] = useState<any[]>([]);
  const [members, setMembers] = useState<any[]>([]);
  const [sessions, setSessions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const { showToast, confirm: showConfirm } = useNotification();
  const { hasRole } = useAuth();

  const isSecretary = hasRole("SECRETAIRE_GENERALE");

  const [showModal, setShowModal] = useState(false);
  const [showTypeModal, setShowTypeModal] = useState(false);
  const [form, setForm] = useState({
    typeId: "",
    beneficiaryId: "",
    amount: ""
  });
  const [editingType, setEditingType] = useState<any>(null);
  const [typeForm, setTypeForm] = useState({
    name: "",
    description: "",
    amount: ""
  });

  async function loadData() {
    setLoading(true);
    try {
      const [aidesData, typesData, membersData, sessionsData] = await Promise.all([
        secretaryService.getAllHelps(),
        secretaryService.getHelpTypes(),
        secretaryService.getAllMembers(),
        secretaryService.getSessions()
      ]);
      setAides(aidesData || []);
      setHelpTypes(typesData || []);
      setMembers(membersData || []);
      setSessions(sessionsData || []);
    } catch (err: any) {
      console.error(err);
      showToast(err.message || t.tresorerie.chargement, "error");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadData();
  }, []);

  const handleCreateAide = async (e: React.FormEvent) => {
    e.preventDefault();
    const activeSession = sessions.find(s => s.state === "OPEN" || s.state === "SAVING");
    if (!activeSession) {
      showToast(t.operations.erreurSessionFermee, "error");
      return;
    }
    if (!form.typeId || !form.beneficiaryId) {
      showToast(t.membres.remplirChamps, "error");
      return;
    }
    setSubmitting(true);
    try {
      await secretaryService.createHelp(Number(form.typeId), Number(form.beneficiaryId), Number(form.amount));
      showToast(t.aides.succesCreation, "success");
      setShowModal(false);
      setForm({ typeId: "", beneficiaryId: "", amount: "" });
      loadData();
    } catch (err: any) {
      showToast(err.message || t.superAdmin.erreur, "error");
    } finally {
      setSubmitting(false);
    }
  };

  const handleCreateHelpType = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!typeForm.name || !typeForm.amount) {
      showToast(t.membres.remplirChamps, "error");
      return;
    }
    setSubmitting(true);
    try {
      if (editingType) {
        await secretaryService.updateHelpType(editingType.id, {
          name: typeForm.name,
          description: typeForm.description,
          amount: Number(typeForm.amount)
        });
        showToast(t.superAdmin.bienvenueMess, "success"); // Reuse generic success if needed
      } else {
        await secretaryService.createHelpType(typeForm.name, typeForm.description, Number(typeForm.amount));
        showToast(t.aides.succesTypeCreation, "success");
      }
      setShowTypeModal(false);
      setEditingType(null);
      setTypeForm({ name: "", description: "", amount: "" });
      loadData();
    } catch (err: any) {
      showToast(err.message || t.superAdmin.erreur, "error");
    } finally {
      setSubmitting(false);
    }
  };

  const handleEditType = (type: any) => {
    setEditingType(type);
    setTypeForm({
      name: type.name,
      description: type.description || "",
      amount: type.defaultAmount?.toString() || ""
    });
    setShowTypeModal(true);
  };

  const handleDeleteType = (id: number) => {
    showConfirm({
      title: t.dashboard.actions,
      message: t.superAdmin.erreur, // Using warning desc here is not ideal, but let's keep it simple
      type: "danger",
      confirmText: t.common.annuler,
      onConfirm: async () => {
        try {
          await secretaryService.deleteHelpType(id);
          showToast(t.aides.succesRejet, "success");
          loadData();
        } catch (err: any) {
          showToast(err.message || t.superAdmin.erreur, "error");
        }
      }
    });
  };

  const handleDisburse = (id: number) => {
    const activeSession = sessions.find(s => s.state === "OPEN" || s.state === "SAVING");
    if (!activeSession) {
      showToast(t.operations.erreurSessionFermee, "error");
      return;
    }
    showConfirm({
      title: t.aides.confirmDecaissement,
      message: t.aides.confirmDecaissementMsg,
      type: "warning",
      confirmText: t.aides.decaisser,
      onConfirm: async () => {
        try {
          await secretaryService.disburseHelp(id);
          showToast(t.aides.succesDecaissement, "success");
          loadData();
        } catch (err: any) {
          showToast(err.message || t.superAdmin.erreur, "error");
        }
      }
    });
  };

  const handleValidate = (id: number) => {
    const activeSession = sessions.find(s => s.state === "OPEN" || s.state === "SAVING" || s.state === "ACTIVE");
    if (!activeSession) {
      showToast(t.operations.erreurSessionFermee, "error");
      return;
    }
    showConfirm({
      title: t.aides.confirmAcceptation,
      message: t.aides.confirmAcceptationMsg,
      type: "success",
      confirmText: t.aides.accepter,
      onConfirm: async () => {
        try {
          await secretaryService.validateHelp(id);
          showToast(t.aides.succesAcceptation, "success");
          loadData();
        } catch (err: any) {
          showToast(err.message || t.superAdmin.erreur, "error");
        }
      }
    });
  };

  const handleReject = (id: number) => {
    showConfirm({
      title: t.aides.confirmRejet,
      message: t.aides.confirmRejetMsg,
      type: "danger",
      confirmText: t.aides.rejeter,
      onConfirm: async () => {
        try {
          await secretaryService.rejectHelp(id);
          showToast(t.aides.succesRejet, "info");
          loadData();
        } catch (err: any) {
          showToast(err.message || t.superAdmin.erreur, "error");
        }
      }
    });
  };

  if (loading) return <div className="fas fa-spinner fa-spin" style={{ fontSize: "2rem", color: "#4e73df", margin: "5rem auto", display: "block" }}></div>;

  return (
    <div className={styles.container}>
      <header style={{ marginBottom: "2.5rem", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <h1 style={{ fontSize: "2rem", fontWeight: 900, color: "#1a365d" }}>{t.aides.titre.split(" & ")[0]} & <span className="text-gradient">{t.aides.titre.split(" & ")[1]}</span></h1>
          <p style={{ color: "#718096" }}>{t.aides.sousTitre}</p>
        </div>
        <div style={{ display: "flex", gap: "1rem" }}>
          {activeTab === "dossiers" && (
            <button
              type="button"
              className={styles.confirmBtn}
              onClick={() => {
                const activeSession = sessions.find(s => s.state === "OPEN" || s.state === "SAVING");
                if (!activeSession) {
                  showToast(t.operations.erreurSessionFermee, "warning");
                  return;
                }
                setShowModal(true);
              }}
              style={{
                background: sessions.find(s => s.state === "OPEN" || s.state === "SAVING")
                  ? "linear-gradient(135deg, #4e73df, #224abe)"
                  : "#cbd5e0",
                cursor: sessions.find(s => s.state === "OPEN" || s.state === "SAVING") ? "pointer" : "not-allowed"
              }}
            >
              <i className="fas fa-plus-circle" style={{ marginRight: "0.5rem" }}></i> {t.aides.ouvrirAide}
            </button>
          )}
          {activeTab === "nomenclature" && (
            <button type="button" className={styles.confirmBtn} onClick={() => { setEditingType(null); setTypeForm({ name: "", description: "", amount: "" }); setShowTypeModal(true); }} style={{ background: "linear-gradient(135deg, #4e73df, #224abe)" }}>
              <i className="fas fa-plus"></i> {t.aides.nouveauType}
            </button>
          )}
        </div>
      </header>

      <div className={styles.tabsContainer}>
        <div className={styles.tabsHeader}>
          <button type="button" className={`${styles.tabBtn} ${activeTab === "dossiers" ? styles.tabBtnActive : ""}`} onClick={() => setActiveTab("dossiers")}>
            <i className="fas fa-folder-open"></i> {t.aides.aidesEnCours}
          </button>
          <button type="button" className={`${styles.tabBtn} ${activeTab === "nomenclature" ? styles.tabBtnActive : ""}`} onClick={() => setActiveTab("nomenclature")}>
            <i className="fas fa-list-ul"></i> {t.aides.typesAide}
          </button>
        </div>

        <div className={styles.tabContent}>
          {activeTab === "dossiers" && (
            <div className="fade-in">
              <div className={styles.tableCard}>
                <table className={styles.table}>
                  <thead>
                    <tr>
                      <th>{t.aides.beneficiaire}</th>
                      <th>{t.aides.session}</th>
                      <th>{t.aides.typeAide}</th>
                      <th>{t.aides.montantCible}</th>
                      <th>{t.aides.collecte}</th>
                      <th>{t.aides.statut}</th>
                      <th style={{ textAlign: "right" }}>{t.dashboard.actions}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {aides.length === 0 ? (
                      <tr><td colSpan={7} style={{ textAlign: "center", padding: "3rem", color: "#a0aec0" }}>{t.aides.aucuneAide}</td></tr>
                    ) : aides.map(a => (
                      <tr key={a.id}>
                        <td>
                          <div style={{ fontWeight: 700 }}>{a.member?.user?.firstName} {a.member?.user?.name}</div>
                          <div style={{ fontSize: "0.75rem", color: "#858796" }}>@{a.member?.username}</div>
                        </td>
                        <td>
                          <div style={{ fontSize: "0.9rem", color: "#4a5568" }}>
                            {a.session?.name || `Session #${a.session?.sessionNumber || '?'}`}
                          </div>
                        </td>
                        <td><span className={styles.badgePrimary}>{a.helpType?.name}</span></td>
                        <td style={{ fontWeight: 700 }}>{a.targetAmount?.toLocaleString()} XAF</td>
                        <td style={{ color: "#1cc88a", fontWeight: 800 }}>{a.collectedAmount?.toLocaleString()} XAF</td>
                        <td>
                          <span className={
                            a.status === "DISBURSED" ? styles.badgeSecondary :
                              a.status === "PENDING" ? styles.badgeWarning :
                                a.status === "REJECTED" ? styles.badgeDanger :
                                  (a.collectedAmount >= a.targetAmount ? styles.badgeSuccess : styles.badgePrimary)
                          }>
                            {
                              a.status === "DISBURSED" ? t.aides.decaissé :
                                a.status === "PENDING" ? t.aides.enAttente :
                                  a.status === "REJECTED" ? t.aides.rejete :
                                    (a.collectedAmount >= a.targetAmount ? t.aides.pret : t.aides.collecte)
                            }
                          </span>
                        </td>
                        <td style={{ textAlign: "right" }}>
                          <div style={{ display: "flex", gap: "0.5rem", justifyContent: "flex-end" }}>
                            {a.status === "PENDING" && (
                              <>
                                <button
                                  onClick={() => handleValidate(a.id)}
                                  className={styles.confirmBtn}
                                  style={{ padding: "0.4rem 0.8rem", fontSize: "0.75rem", background: "#1cc88a" }}
                                >
                                  <i className="fas fa-check"></i> {t.aides.accepter}
                                </button>
                                <button
                                  onClick={() => handleReject(a.id)}
                                  className={styles.cancelBtn}
                                  style={{ padding: "0.4rem 0.8rem", fontSize: "0.75rem" }}
                                >
                                  <i className="fas fa-times"></i> {t.aides.rejeter}
                                </button>
                              </>
                            )}

                            {(a.status === "COMPLETED" || a.status === "ACTIVE") && (
                              <button
                                onClick={() => handleDisburse(a.id)}
                                className={styles.confirmBtn}
                                style={{
                                  padding: "0.4rem 0.8rem",
                                  fontSize: "0.75rem",
                                  background: sessions.find(s => s.state === "OPEN" || s.state === "SAVING")
                                    ? "linear-gradient(135deg, #1cc88a, #13855c)"
                                    : "#cbd5e0",
                                  cursor: sessions.find(s => s.state === "OPEN" || s.state === "SAVING") ? "pointer" : "not-allowed"
                                }}
                              >
                                <i className="fas fa-hand-holding-usd"></i> {t.aides.decaisser}
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

          {activeTab === "nomenclature" && (
            <div className="fade-in">
              <div className={styles.tableCard}>
                <table className={styles.table}>
                  <thead>
                    <tr>
                      <th>{t.aides.libelleAide}</th>
                      <th>{t.aides.montantForfaitaire}</th>
                      <th>{t.aides.caisseConcernee}</th>
                      <th>{t.membres.statut}</th>
                      <th style={{ textAlign: "right" }}>{t.dashboard.actions}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {helpTypes.length === 0 ? (
                      <tr><td colSpan={4} style={{ textAlign: "center", padding: "3rem", color: "#a0aec0" }}>{t.aides.aucunType}</td></tr>
                    ) : helpTypes.map(h => (
                      <tr key={h.id}>
                        <td>
                          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                            <div style={{ width: "36px", height: "36px", borderRadius: "10px", background: "rgba(78, 115, 223, 0.1)", display: "flex", alignItems: "center", justifyContent: "center", color: "#4e73df" }}>
                              <i className="fas fa-hand-holding-heart"></i>
                            </div>
                            <span style={{ fontWeight: 700 }}>{h.name}</span>
                          </div>
                        </td>
                        <td style={{ fontWeight: 800, color: "#2d3748" }}>{h.defaultAmount?.toLocaleString()} <small style={{ fontWeight: 400, opacity: 0.6 }}>XAF</small></td>
                        <td style={{ color: "#718096", fontSize: "0.85rem" }}>{t.dashboard.fondSocial}</td>
                        <td><span className={styles.badgeSuccess}>{t.superAdmin.bienvenueMess.includes("Welcome") ? "ACTIVE" : "ACTIF"}</span></td>
                        <td style={{ textAlign: "right" }}>
                          <div style={{ display: "flex", gap: "0.5rem", justifyContent: "flex-end" }}>
                            <button type="button" className={styles.confirmBtn} style={{ padding: "0.5rem", width: "32px", height: "32px", display: "flex", alignItems: "center", justifyContent: "center", borderRadius: "8px", background: "rgba(78, 115, 223, 0.1)", color: "#4e73df", border: "none" }} title={t.common.modifier} onClick={() => handleEditType(h)}>
                              <i className="fas fa-edit"></i>
                            </button>
                            <button type="button" className={styles.cancelBtn} style={{ padding: "0.5rem", width: "32px", height: "32px", display: "flex", alignItems: "center", justifyContent: "center", borderRadius: "8px", background: "rgba(231, 74, 59, 0.1)", color: "#e74a3b", border: "none" }} title={t.common.annuler} onClick={() => handleDeleteType(h.id)}>
                              <i className="fas fa-trash-alt"></i>
                            </button>
                          </div>
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

      {
        showModal && (
          <div className={styles.modalOverlay}>
            <div className={`${styles.modal} fade-in-up`} style={{ maxWidth: "550px", borderRadius: "30px", border: "none", overflow: "hidden", boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)" }}>
              <div className={styles.modalHeader} style={{ background: "linear-gradient(135deg, #4e73df, #224abe)", padding: "1.75rem 2rem" }}>
                <h3 style={{ color: "white", fontSize: "1.35rem", fontWeight: 800, margin: 0 }}>
                  <i className="fas fa-folder-plus" style={{ marginRight: "0.75rem", opacity: 0.8 }}></i>
                  {t.aides.nouvelleAide}
                </h3>
                <button type="button" className={styles.modalClose} style={{ color: "white", background: "rgba(255,255,255,0.2)", width: "32px", height: "32px", display: "flex", alignItems: "center", justifyContent: "center" }} onClick={() => setShowModal(false)}>
                  <i className="fas fa-times"></i>
                </button>
              </div>
              <form onSubmit={handleCreateAide} className={styles.modalBody} style={{ padding: "2.5rem" }}>
                <div className={styles.formGroup} style={{ marginBottom: "1.5rem" }}>
                  <label style={{ color: "#4e73df", fontWeight: 700, fontSize: "0.85rem", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "0.75rem", display: "block" }}>
                    <i className="fas fa-user-tag" style={{ marginRight: "0.5rem" }}></i> {t.aides.membreBeneficiaire}
                  </label>
                  <select className={styles.formInput} value={form.beneficiaryId} onChange={e => setForm({ ...form, beneficiaryId: e.target.value })} required style={{ borderRadius: "15px", padding: "1rem 1.25rem", border: "1px solid #e2e8f0", background: "#f8fafc" }}>
                    <option value="">{t.aides.membreBeneficiaire}...</option>
                    {members.map(m => <option key={m.id} value={m.id}>{m.user?.firstName} {m.user?.name}</option>)}
                  </select>
                </div>
                <div className={styles.formGroup} style={{ marginBottom: "1.5rem" }}>
                  <label style={{ color: "#4e73df", fontWeight: 700, fontSize: "0.85rem", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "0.75rem", display: "block" }}>
                    <i className="fas fa-notes-medical" style={{ marginRight: "0.5rem" }}></i> {t.aides.natureAide}
                  </label>
                  <select className={styles.formInput} value={form.typeId} onChange={e => {
                    const type = helpTypes.find(t => t.id === Number(e.target.value));
                    setForm({ ...form, typeId: e.target.value, amount: type?.defaultAmount?.toString() || "" });
                  }} required style={{ borderRadius: "15px", padding: "1rem 1.25rem", border: "1px solid #e2e8f0", background: "#f8fafc" }}>
                    <option value="">{t.aides.natureAide}...</option>
                    {helpTypes.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
                  </select>
                </div>
                <div className={styles.formGroup} style={{ marginBottom: "1.5rem" }}>
                  <label style={{ color: "#4e73df", fontWeight: 700, fontSize: "0.85rem", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "0.75rem", display: "block" }}>
                    <i className="fas fa-money-check-alt" style={{ marginRight: "0.5rem" }}></i> {t.aides.montantAide}
                  </label>
                  <input type="number" className={styles.formInput} value={form.amount} readOnly required style={{ borderRadius: "15px", padding: "1rem 1.25rem", border: "1px solid #e2e8f0", background: "#f0f4f8", fontWeight: 700, color: "#4a5568", cursor: "not-allowed" }} />
                </div>

                <div className={styles.modalActions} style={{ marginTop: "2rem", gap: "1.25rem" }}>
                  <button type="button" className={styles.cancelBtn} onClick={() => setShowModal(false)} style={{ borderRadius: "16px", padding: "1.1rem", fontWeight: 700 }}>{t.common.annuler}</button>
                  <button type="submit" className={styles.confirmBtn} disabled={submitting} style={{ background: "linear-gradient(135deg, #4e73df, #224abe)", borderRadius: "16px", padding: "1.1rem", flex: 2, boxShadow: "0 10px 25px rgba(78, 115, 223, 0.3)", border: "none" }}>
                    {submitting ? <i className="fas fa-spinner fa-spin"></i> : <><i className="fas fa-folder-plus" style={{ marginRight: "0.6rem" }}></i> {t.aides.ouvrirAide}</>}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )
      }
      {
        showTypeModal && (
          <div className={styles.modalOverlay}>
            <div className={`${styles.modal} fade-in-up`} style={{ maxWidth: "550px", borderRadius: "30px", border: "none", overflow: "hidden", boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)" }}>
              <div className={styles.modalHeader} style={{ background: "linear-gradient(135deg, #4e73df, #224abe)", padding: "1.75rem 2rem" }}>
                <h3 style={{ color: "white", fontSize: "1.35rem", fontWeight: 800, margin: 0 }}>
                  <i className={editingType ? "fas fa-edit" : "fas fa-plus-circle"} style={{ marginRight: "0.75rem", opacity: 0.8 }}></i>
                  {editingType ? t.aides.modifierType : t.aides.nouveauType}
                </h3>
                <button type="button" className={styles.modalClose} style={{ color: "white", background: "rgba(255,255,255,0.2)", width: "32px", height: "32px", display: "flex", alignItems: "center", justifyContent: "center" }} onClick={() => setShowTypeModal(false)}>
                  <i className="fas fa-times"></i>
                </button>
              </div>
              <form onSubmit={handleCreateHelpType} className={styles.modalBody} style={{ padding: "2.5rem" }}>
                <div className={styles.formGroup} style={{ marginBottom: "1.5rem" }}>
                  <label style={{ color: "#4e73df", fontWeight: 700, fontSize: "0.85rem", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "0.75rem", display: "block" }}>
                    <i className="fas fa-tag" style={{ marginRight: "0.5rem" }}></i> {t.aides.libelleAide}
                  </label>
                  <input type="text" className={styles.formInput} value={typeForm.name} onChange={e => setTypeForm({ ...typeForm, name: e.target.value })} required placeholder={t.aides.libelleAide + "..."} style={{ borderRadius: "15px", padding: "1rem 1.25rem", border: "1px solid #e2e8f0", background: "#f8fafc" }} />
                </div>
                <div className={styles.formGroup} style={{ marginBottom: "1.5rem" }}>
                  <label style={{ color: "#4e73df", fontWeight: 700, fontSize: "0.85rem", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "0.75rem", display: "block" }}>
                    <i className="fas fa-align-left" style={{ marginRight: "0.5rem" }}></i> {t.exercices.description}
                  </label>
                  <textarea className={styles.formInput} value={typeForm.description} onChange={e => setTypeForm({ ...typeForm, description: e.target.value })} placeholder={t.aides.natureAide + "..."} style={{ borderRadius: "15px", padding: "1rem 1.25rem", border: "1px solid #e2e8f0", background: "#f8fafc", minHeight: "100px", resize: "none" }} />
                </div>
                <div className={styles.formGroup} style={{ marginBottom: "1.5rem" }}>
                  <label style={{ color: "#4e73df", fontWeight: 700, fontSize: "0.85rem", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "0.75rem", display: "block" }}>
                    <i className="fas fa-money-bill-wave" style={{ marginRight: "0.5rem" }}></i> {t.aides.montantForfaitaire} (XAF)
                  </label>
                  <input type="number" className={styles.formInput} value={typeForm.amount} onChange={e => setTypeForm({ ...typeForm, amount: e.target.value })} required style={{ borderRadius: "15px", padding: "1rem 1.25rem", border: "1px solid #e2e8f0", background: "#f8fafc", fontWeight: 700, color: "#2d3748" }} />
                </div>

                <div className={styles.modalActions} style={{ marginTop: "2rem", gap: "1.25rem" }}>
                  <button type="button" className={styles.cancelBtn} onClick={() => setShowTypeModal(false)} style={{ borderRadius: "16px", padding: "1.1rem", fontWeight: 700 }}>{t.common.annuler}</button>
                  <button type="submit" className={styles.confirmBtn} disabled={submitting} style={{ background: "linear-gradient(135deg, #4e73df, #224abe)", borderRadius: "16px", padding: "1.1rem", flex: 2, boxShadow: "0 10px 25px rgba(78, 115, 223, 0.3)", border: "none" }}>
                    {submitting ? <i className="fas fa-spinner fa-spin"></i> : <><i className="fas fa-check-circle" style={{ marginRight: "0.6rem" }}></i> {editingType ? t.common.valider : t.common.annuler.includes("Cancel") ? "Save Type" : "Enregistrer le Type"}</>}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )
      }
    </div >
  );
}
