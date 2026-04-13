"use client";

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
  const { showToast } = useNotification();
  
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({
    typeId: "",
    beneficiaryId: "",
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
      showToast("Demande d'aide créée. Financement mixte activé.", "success");
      setShowModal(false);
      loadData();
    } catch (err: any) {
      showToast(err.message || "Erreur lors de la création de l'aide.", "error");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDisburse = async (id: number) => {
    if (!confirm("Voulez-vous décaisser cette aide ? Les dettes du membre seront prélevées automatiquement.")) return;
    try {
      await secretaryService.disburseHelp(id);
      showToast("Aide décaissée. Dettes remboursées par priorité.", "success");
      loadData();
    } catch (err: any) {
      showToast(err.message || "Erreur lors du décaissement.", "error");
    }
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
            <button className={styles.confirmBtn} onClick={() => setShowModal(true)}>
              <i className="fas fa-hand-holding-heart"></i> Ouvrir un Dossier d'Aide
            </button>
          )}
          {activeTab === "nomenclature" && (
             <button className={styles.confirmBtn} style={{ background: "linear-gradient(135deg, #1cc88a, #16a085)" }}>
                <i className="fas fa-plus"></i> Nouveau Type d'Aide
             </button>
          )}
        </div>
      </header>

      <div className={styles.tabsContainer}>
        <div className={styles.tabsHeader}>
          <button className={`${styles.tabBtn} ${activeTab === "dossiers" ? styles.tabBtnActive : ""}`} onClick={() => setActiveTab("dossiers")}>
            <i className="fas fa-folder-open"></i> Dossiers en cours
          </button>
          <button className={`${styles.tabBtn} ${activeTab === "nomenclature" ? styles.tabBtnActive : ""}`} onClick={() => setActiveTab("nomenclature")}>
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
                          <th style={{ textAlign: "right" }}>Actions</th>
                       </tr>
                    </thead>
                    <tbody>
                       {aides.length === 0 ? (
                         <tr><td colSpan={6} style={{ textAlign: "center", padding: "3rem", color: "#a0aec0" }}>Aucun dossier d'aide en cours.</td></tr>
                       ) : aides.map(a => (
                         <tr key={a.id}>
                            <td>
                               <div style={{ fontWeight: 700 }}>{a.member?.user?.firstName} {a.member?.user?.name}</div>
                               <small style={{ color: "#a0aec0" }}>{a.member?.registrationNumber}</small>
                            </td>
                            <td><span className={styles.badgePrimary}>{a.helpType?.name}</span></td>
                            <td style={{ fontWeight: 700 }}>{a.targetAmount?.toLocaleString()} XAF</td>
                            <td style={{ color: "#1cc88a", fontWeight: 800 }}>{a.collectedAmount?.toLocaleString()} XAF</td>
                            <td>
                               <span className={a.status === "DISBURSED" ? styles.badgeSuccess : a.status === "ACTIVE" ? styles.badgePrimary : styles.badgeSecondary}>
                                  {a.status === "ACTIVE" ? "EN COLLECTE" : a.status === "COMPLETED" ? "PRÊT" : "DÉCAISSÉ"}
                               </span>
                            </td>
                            <td style={{ textAlign: "right" }}>
                               {a.status !== "DISBURSED" && (
                                 <button className={styles.confirmBtn} style={{ padding: "0.5rem 1rem", fontSize: "0.8rem", background: "linear-gradient(135deg, #1cc88a, #16a085)" }} onClick={() => handleDisburse(a.id)}>
                                    DÉCAISSER
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
                         </tr>
                      </thead>
                      <tbody>
                         {helpTypes.length === 0 ? (
                            <tr><td colSpan={4} style={{ textAlign: "center", padding: "3rem", color: "#a0aec0" }}>Aucun type d'aide défini.</td></tr>
                         ) : helpTypes.map(h => (
                           <tr key={h.id}>
                              <td>
                                 <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                                    <div style={{ width: "36px", height: "36px", borderRadius: "10px", background: "rgba(28, 200, 138, 0.1)", display: "flex", alignItems: "center", justifyContent: "center", color: "#1cc88a" }}>
                                       <i className="fas fa-heart"></i>
                                    </div>
                                    <span style={{ fontWeight: 700 }}>{h.name}</span>
                                 </div>
                              </td>
                              <td style={{ fontWeight: 800, color: "#2d3748" }}>{h.defaultAmount?.toLocaleString()} <small style={{ fontWeight: 400, opacity: 0.6 }}>XAF</small></td>
                              <td style={{ color: "#718096", fontSize: "0.85rem" }}>Caisse Solidarité</td>
                              <td><span className={styles.badgeSuccess}>ACTIF</span></td>
                           </tr>
                         ))}
                      </tbody>
                   </table>
                </div>
             </div>
          )}
        </div>
      </div>

       {showModal && (
        <div className={styles.modalOverlay}>
          <div className={`${styles.modal} fade-in-up`} style={{ maxWidth: "550px", borderRadius: "30px", border: "none", overflow: "hidden" }}>
            <div className={styles.modalHeader} style={{ background: "linear-gradient(135deg, #1cc88a, #13855c)", padding: "1.75rem 2rem" }}>
              <h3 style={{ color: "white", fontSize: "1.3rem", fontWeight: 800 }}>Nouveau Dossier d'Aide</h3>
              <button className={styles.modalClose} style={{ color: "white", background: "rgba(255,255,255,0.2)" }} onClick={() => setShowModal(false)}>
                <i className="fas fa-times"></i>
              </button>
            </div>
            <form onSubmit={handleCreateAide} className={styles.modalBody} style={{ padding: "2rem" }}>
               <div className={styles.formGroup}>
                  <label style={{ color: "#4e73df", fontWeight: 700 }}><i className="fas fa-user-tag" style={{ marginRight: "0.5rem" }}></i> Membre Bénéficiaire</label>
                  <select className={styles.formInput} value={form.beneficiaryId} onChange={e => setForm({...form, beneficiaryId: e.target.value})} required style={{ borderRadius: "15px", padding: "0.85rem 1.25rem" }}>
                     <option value="">Sélectionner un membre...</option>
                     {members.map(m => <option key={m.id} value={m.id}>{m.user?.firstName} {m.user?.name}</option>)}
                  </select>
               </div>
               <div className={styles.formGroup}>
                  <label style={{ color: "#4e73df", fontWeight: 700 }}><i className="fas fa-notes-medical" style={{ marginRight: "0.5rem" }}></i> Nature de l'Aide</label>
                  <select className={styles.formInput} value={form.typeId} onChange={e => {
                    const type = helpTypes.find(t => t.id === Number(e.target.value));
                    setForm({...form, typeId: e.target.value, amount: type?.defaultAmount?.toString() || ""});
                  }} required style={{ borderRadius: "15px", padding: "0.85rem 1.25rem" }}>
                     <option value="">Sélectionner une catégorie...</option>
                     {helpTypes.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
                  </select>
               </div>
               <div className={styles.formGroup}>
                  <label style={{ color: "#4e73df", fontWeight: 700 }}><i className="fas fa-money-check-alt" style={{ marginRight: "0.5rem" }}></i> Montant de l'Aide (XAF)</label>
                  <input type="number" className={styles.formInput} value={form.amount} onChange={e => setForm({...form, amount: e.target.value})} required style={{ borderRadius: "15px", padding: "0.85rem 1.25rem" }} />
               </div>
               
               <div className={styles.glassCard} style={{ background: "rgba(28, 200, 138, 0.05)", border: "1px dashed #1cc88a", marginTop: "1.5rem", borderRadius: "20px", padding: "1.25rem" }}>
                  <p style={{ fontSize: "0.9rem", color: "#13855c", margin: 0, fontWeight: 500 }}>
                    <i className="fas fa-info-circle"></i> Le <b>Fonds Social</b> contribuera automatiquement à hauteur de <b>30%</b> une fois le dossier ouvert.
                  </p>
               </div>
 
               <div className={styles.modalActions} style={{ marginTop: "2rem", gap: "1rem" }}>
                  <button type="button" className={styles.cancelBtn} onClick={() => setShowModal(false)} style={{ borderRadius: "14px", padding: "1rem" }}>Annuler</button>
                  <button type="submit" className={styles.confirmBtn} disabled={submitting} style={{ background: "linear-gradient(135deg, #1cc88a, #13855c)", borderRadius: "14px", padding: "1rem", flex: 2, boxShadow: "0 10px 20px rgba(28, 200, 138, 0.2)" }}>
                    {submitting ? <i className="fas fa-spinner fa-spin"></i> : <><i className="fas fa-folder-plus" style={{ marginRight: "0.6rem" }}></i> Ouvrir le dossier</>}
                  </button>
               </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
