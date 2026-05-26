"use client";
// UI: Blue Premium Theme Updated 16/04/2026

import { useEffect, useState } from "react";
import styles from "../admin.module.css";
import { secretaryService } from "@/services/secretaryService";
import { useNotification } from "@/context/NotificationContext";

export default function AidesPage() {
  const [activeTab, setActiveTab] = useState<"dossiers" | "nomenclature">("dossiers");
  const [aides, setAides] = useState<any[]>([]);
  const [helpTypes, setHelpTypes] = useState<any[]>([]);
  const [members, setMembers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const { showToast, confirm: showConfirm } = useNotification();

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
      const [aidesData, typesData, membersData] = await Promise.all([
        secretaryService.getAllHelps(),
        secretaryService.getHelpTypes(),
        secretaryService.getAllMembers()
      ]);
      setAides(aidesData || []);
      setHelpTypes(typesData || []);
      setMembers(membersData || []);
    } catch (err: any) {
      console.error(err);
      showToast("Erreur lors du chargement des données de solidarité.", "error");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadData();
  }, []);

  const handleCreateAide = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.typeId || !form.beneficiaryId) {
      showToast("Veuillez remplir tous les champs.", "error");
      return;
    }
    setSubmitting(true);
    try {
      await secretaryService.createHelp(Number(form.typeId), Number(form.beneficiaryId), Number(form.amount));
      showToast("Dossier d'aide créé et entièrement financé par le Fonds Social.", "success");
      setShowModal(false);
      setForm({ typeId: "", beneficiaryId: "", amount: "" });
      loadData();
    } catch (err: any) {
      showToast(err.message || "Erreur lors de la création de l'aide.", "error");
    } finally {
      setSubmitting(false);
    }
  };

  const handleCreateHelpType = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!typeForm.name || !typeForm.amount) {
      showToast("Veuillez remplir le nom et le montant.", "error");
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
        showToast("Type d'aide mis à jour avec succès.", "success");
      } else {
        await secretaryService.createHelpType(typeForm.name, typeForm.description, Number(typeForm.amount));
        showToast("Nouveau type d'aide configuré avec succès.", "success");
      }
      setShowTypeModal(false);
      setEditingType(null);
      setTypeForm({ name: "", description: "", amount: "" });
      loadData();
    } catch (err: any) {
      showToast(err.message || "Erreur lors de l'enregistrement du type d'aide.", "error");
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
      title: "Confirmer la suppression",
      message: "Êtes-vous sûr de vouloir supprimer ce type d'aide ? Cette action est irréversible et ne fonctionnera pas si le type est déjà utilisé.",
      type: "danger",
      confirmText: "Supprimer",
      onConfirm: async () => {
        try {
          await secretaryService.deleteHelpType(id);
          showToast("Type d'aide supprimé avec succès.", "success");
          loadData();
        } catch (err: any) {
          showToast(err.message || "Erreur lors de la suppression du type d'aide.", "error");
        }
      }
    });
  };

  const handleDisburse = (id: number) => {
    showConfirm({
      title: "Confirmation de décaissement",
      message: "Voulez-vous décaisser cette aide ? Les dettes du membre seront prélevées automatiquement sur le montant reçu.",
      type: "warning",
      confirmText: "Décaisser maintenant",
      onConfirm: async () => {
        try {
          await secretaryService.disburseHelp(id);
          showToast("Aide décaissée avec succès. Les dettes ont été régularisées.", "success");
          loadData();
        } catch (err: any) {
          showToast(err.message || "Erreur lors du décaissement.", "error");
        }
      }
    });
  };

  if (loading) return <div className="fas fa-spinner fa-spin" style={{ fontSize: "2rem", color: "#4e73df", margin: "5rem auto", display: "block" }}></div>;

  return (
    <div className={styles.container}>
      <header style={{ marginBottom: "2.5rem", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <h1 style={{ fontSize: "2rem", fontWeight: 900, color: "#1a365d" }}>Solidarité & <span className="text-gradient">Aides</span></h1>
          <p style={{ color: "#718096" }}>Gérez les assistances financières et la solidarité entre membres.</p>
        </div>
        <div style={{ display: "flex", gap: "1rem" }}>
          {activeTab === "dossiers" && (
            <button type="button" className={styles.confirmBtn} onClick={() => setShowModal(true)} style={{ background: "linear-gradient(135deg, #4e73df, #224abe)" }}>
              <i className="fas fa-plus-circle" style={{ marginRight: "0.5rem" }}></i> Ouvrir un Dossier d'Aide
            </button>
          )}
          {activeTab === "nomenclature" && (
            <button type="button" className={styles.confirmBtn} onClick={() => { setEditingType(null); setTypeForm({ name: "", description: "", amount: "" }); setShowTypeModal(true); }} style={{ background: "linear-gradient(135deg, #4e73df, #224abe)" }}>
              <i className="fas fa-plus"></i> Nouveau Type d'Aide
            </button>
          )}
        </div>
      </header>

      <div className={styles.tabsContainer}>
        <div className={styles.tabsHeader}>
          <button type="button" className={`${styles.tabBtn} ${activeTab === "dossiers" ? styles.tabBtnActive : ""}`} onClick={() => setActiveTab("dossiers")}>
            <i className="fas fa-folder-open"></i> Dossiers en cours
          </button>
          <button type="button" className={`${styles.tabBtn} ${activeTab === "nomenclature" ? styles.tabBtnActive : ""}`} onClick={() => setActiveTab("nomenclature")}>
            <i className="fas fa-list-ul"></i> Nomenclature / Barèmes
          </button>
        </div>

        <div className={styles.tabContent}>
          {activeTab === "dossiers" && (
            <div className="fade-in">
              <div className={styles.tableCard}>
                <table className={styles.table}>
                  <thead>
                    <tr>
                      <th>Bénéficiaire</th>
                      <th>Type d'Aide</th>
                      <th>Montant Cible</th>
                      <th>Collecté</th>
                      <th>Statut</th>
                    </tr>
                  </thead>
                  <tbody>
                    {aides.length === 0 ? (
                      <tr><td colSpan={5} style={{ textAlign: "center", padding: "3rem", color: "#a0aec0" }}>Aucun dossier d'aide en cours.</td></tr>
                    ) : aides.map(a => (
                      <tr key={a.id}>
                        <td>
                          <div style={{ fontWeight: 700 }}>{a.member?.user?.firstName} {a.member?.user?.name}</div>
                          <div style={{ fontSize: "0.75rem", color: "#858796" }}>@{a.member?.username}</div>
                        </td>
                        <td><span className={styles.badgePrimary}>{a.helpType?.name}</span></td>
                        <td style={{ fontWeight: 700 }}>{a.targetAmount?.toLocaleString()} XAF</td>
                        <td style={{ color: "#1cc88a", fontWeight: 800 }}>{a.collectedAmount?.toLocaleString()} XAF</td>
                        <td>
                          <span className={a.status === "DISBURSED" ? styles.badgeSuccess : a.status === "ACTIVE" ? styles.badgeSuccess : styles.badgeSecondary}>
                            {a.status === "ACTIVE" ? "FINANCÉ (FONDS SOCIAL)" : a.status === "COMPLETED" ? "PRÊT" : "DÉCAISSÉ"}
                          </span>
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
                      <th>Libellé de l'Aide</th>
                      <th>Montant Forfaitaire</th>
                      <th>Caisse Concernée</th>
                      <th>Statut</th>
                      <th style={{ textAlign: "right" }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {helpTypes.length === 0 ? (
                      <tr><td colSpan={4} style={{ textAlign: "center", padding: "3rem", color: "#a0aec0" }}>Aucun type d'aide défini.</td></tr>
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
                        <td style={{ color: "#718096", fontSize: "0.85rem" }}>Caisse Solidarité</td>
                        <td><span className={styles.badgeSuccess}>ACTIF</span></td>
                        <td style={{ textAlign: "right" }}>
                          <div style={{ display: "flex", gap: "0.5rem", justifyContent: "flex-end" }}>
                            <button type="button" className={styles.confirmBtn} style={{ padding: "0.5rem", width: "32px", height: "32px", display: "flex", alignItems: "center", justifyContent: "center", borderRadius: "8px", background: "rgba(78, 115, 223, 0.1)", color: "#4e73df", border: "none" }} title="Modifier" onClick={() => handleEditType(h)}>
                              <i className="fas fa-edit"></i>
                            </button>
                            <button type="button" className={styles.cancelBtn} style={{ padding: "0.5rem", width: "32px", height: "32px", display: "flex", alignItems: "center", justifyContent: "center", borderRadius: "8px", background: "rgba(231, 74, 59, 0.1)", color: "#e74a3b", border: "none" }} title="Supprimer" onClick={() => handleDeleteType(h.id)}>
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
                  Nouveau Dossier d'Aide
                </h3>
                <button type="button" className={styles.modalClose} style={{ color: "white", background: "rgba(255,255,255,0.2)", width: "32px", height: "32px", display: "flex", alignItems: "center", justifyContent: "center" }} onClick={() => setShowModal(false)}>
                  <i className="fas fa-times"></i>
                </button>
              </div>
              <form onSubmit={handleCreateAide} className={styles.modalBody} style={{ padding: "2.5rem" }}>
                <div className={styles.formGroup} style={{ marginBottom: "1.5rem" }}>
                  <label style={{ color: "#4e73df", fontWeight: 700, fontSize: "0.85rem", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "0.75rem", display: "block" }}>
                    <i className="fas fa-user-tag" style={{ marginRight: "0.5rem" }}></i> Membre Bénéficiaire
                  </label>
                  <select className={styles.formInput} value={form.beneficiaryId} onChange={e => setForm({ ...form, beneficiaryId: e.target.value })} required style={{ borderRadius: "15px", padding: "1rem 1.25rem", border: "1px solid #e2e8f0", background: "#f8fafc" }}>
                    <option value="">Sélectionner un membre...</option>
                    {members.map(m => <option key={m.id} value={m.id}>{m.user?.firstName} {m.user?.name}</option>)}
                  </select>
                </div>
                <div className={styles.formGroup} style={{ marginBottom: "1.5rem" }}>
                  <label style={{ color: "#4e73df", fontWeight: 700, fontSize: "0.85rem", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "0.75rem", display: "block" }}>
                    <i className="fas fa-notes-medical" style={{ marginRight: "0.5rem" }}></i> Nature de l'Aide
                  </label>
                  <select className={styles.formInput} value={form.typeId} onChange={e => {
                    const type = helpTypes.find(t => t.id === Number(e.target.value));
                    setForm({ ...form, typeId: e.target.value, amount: type?.defaultAmount?.toString() || "" });
                  }} required style={{ borderRadius: "15px", padding: "1rem 1.25rem", border: "1px solid #e2e8f0", background: "#f8fafc" }}>
                    <option value="">Sélectionner une catégorie...</option>
                    {helpTypes.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
                  </select>
                </div>
                <div className={styles.formGroup} style={{ marginBottom: "1.5rem" }}>
                  <label style={{ color: "#4e73df", fontWeight: 700, fontSize: "0.85rem", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "0.75rem", display: "block" }}>
                    <i className="fas fa-money-check-alt" style={{ marginRight: "0.5rem" }}></i> Montant de l'Aide (XAF)
                  </label>
                  <input type="number" className={styles.formInput} value={form.amount} readOnly required style={{ borderRadius: "15px", padding: "1rem 1.25rem", border: "1px solid #e2e8f0", background: "#f0f4f8", fontWeight: 700, color: "#4a5568", cursor: "not-allowed" }} />
                </div>



                <div className={styles.modalActions} style={{ marginTop: "2rem", gap: "1.25rem" }}>
                  <button type="button" className={styles.cancelBtn} onClick={() => setShowModal(false)} style={{ borderRadius: "16px", padding: "1.1rem", fontWeight: 700 }}>Annuler</button>
                  <button type="submit" className={styles.confirmBtn} disabled={submitting} style={{ background: "linear-gradient(135deg, #4e73df, #224abe)", borderRadius: "16px", padding: "1.1rem", flex: 2, boxShadow: "0 10px 25px rgba(78, 115, 223, 0.3)", border: "none" }}>
                    {submitting ? <i className="fas fa-spinner fa-spin"></i> : <><i className="fas fa-folder-plus" style={{ marginRight: "0.6rem" }}></i> Ouvrir le dossier</>}
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
                  {editingType ? "Modifier le Type d'Aide" : "Nouveau Type d'Aide"}
                </h3>
                <button type="button" className={styles.modalClose} style={{ color: "white", background: "rgba(255,255,255,0.2)", width: "32px", height: "32px", display: "flex", alignItems: "center", justifyContent: "center" }} onClick={() => setShowTypeModal(false)}>
                  <i className="fas fa-times"></i>
                </button>
              </div>
              <form onSubmit={handleCreateHelpType} className={styles.modalBody} style={{ padding: "2.5rem" }}>
                <div className={styles.formGroup} style={{ marginBottom: "1.5rem" }}>
                  <label style={{ color: "#4e73df", fontWeight: 700, fontSize: "0.85rem", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "0.75rem", display: "block" }}>
                    <i className="fas fa-tag" style={{ marginRight: "0.5rem" }}></i> Libellé de l'Aide
                  </label>
                  <input type="text" className={styles.formInput} value={typeForm.name} onChange={e => setTypeForm({ ...typeForm, name: e.target.value })} required placeholder="Ex: Mariage d'un membre..." style={{ borderRadius: "15px", padding: "1rem 1.25rem", border: "1px solid #e2e8f0", background: "#f8fafc" }} />
                </div>
                <div className={styles.formGroup} style={{ marginBottom: "1.5rem" }}>
                  <label style={{ color: "#4e73df", fontWeight: 700, fontSize: "0.85rem", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "0.75rem", display: "block" }}>
                    <i className="fas fa-align-left" style={{ marginRight: "0.5rem" }}></i> Description
                  </label>
                  <textarea className={styles.formInput} value={typeForm.description} onChange={e => setTypeForm({ ...typeForm, description: e.target.value })} placeholder="Détails sur les conditions..." style={{ borderRadius: "15px", padding: "1rem 1.25rem", border: "1px solid #e2e8f0", background: "#f8fafc", minHeight: "100px", resize: "none" }} />
                </div>
                <div className={styles.formGroup} style={{ marginBottom: "1.5rem" }}>
                  <label style={{ color: "#4e73df", fontWeight: 700, fontSize: "0.85rem", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "0.75rem", display: "block" }}>
                    <i className="fas fa-money-bill-wave" style={{ marginRight: "0.5rem" }}></i> Montant Forfaitaire (XAF)
                  </label>
                  <input type="number" className={styles.formInput} value={typeForm.amount} onChange={e => setTypeForm({ ...typeForm, amount: e.target.value })} required style={{ borderRadius: "15px", padding: "1rem 1.25rem", border: "1px solid #e2e8f0", background: "#f8fafc", fontWeight: 700, color: "#2d3748" }} />
                </div>

                <div className={styles.modalActions} style={{ marginTop: "2rem", gap: "1.25rem" }}>
                  <button type="button" className={styles.cancelBtn} onClick={() => setShowTypeModal(false)} style={{ borderRadius: "16px", padding: "1.1rem", fontWeight: 700 }}>Annuler</button>
                  <button type="submit" className={styles.confirmBtn} disabled={submitting} style={{ background: "linear-gradient(135deg, #4e73df, #224abe)", borderRadius: "16px", padding: "1.1rem", flex: 2, boxShadow: "0 10px 25px rgba(78, 115, 223, 0.3)", border: "none" }}>
                    {submitting ? <i className="fas fa-spinner fa-spin"></i> : <><i className="fas fa-check-circle" style={{ marginRight: "0.6rem" }}></i> {editingType ? "Enregistrer les modifications" : "Enregistrer le Type"}</>}
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

