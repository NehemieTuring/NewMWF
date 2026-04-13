"use client";

import { useEffect, useState } from "react";
import styles from "../treasurer.module.css";
import { useTranslation } from "@/context/LanguageContext";
import { treasurerService } from "@/services/treasurerService";
import { useNotification } from "@/context/NotificationContext";

type MemberTab = "profil" | "epargne" | "dettes" | "emprunts";

export default function TreasurerMembersPage() {
  const { locale } = useTranslation();
  const { showToast } = useNotification();
  const [members, setMembers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  
  // Member Detail Modal
  const [selectedMember, setSelectedMember] = useState<any>(null);
  const [activeDetailsTab, setActiveDetailsTab] = useState<MemberTab>("profil");
  const [memberDetails, setMemberDetails] = useState<any>(null);
  const [detailsLoading, setDetailsLoading] = useState(false);

  useEffect(() => {
    async function loadMembers() {
      try {
        const data = await treasurerService.getAllMembers();
        setMembers(data || []);
      } catch (err) {
        showToast("Échec du chargement des membres", "error");
      } finally {
        setLoading(false);
      }
    }
    loadMembers();
  }, []);

  const viewMemberDetails = async (member: any) => {
    setSelectedMember(member);
    setActiveDetailsTab("profil");
    setDetailsLoading(true);
    try {
      const [debts, solidarity, savings, borrowings] = await Promise.all([
        treasurerService.getMemberDebts(member.id).catch(() => []),
        treasurerService.getSolidarityDebt(member.id).catch(() => ({ remainingDebt: 0 })),
        treasurerService.getMemberSavings(member.id).catch(() => []),
        treasurerService.getMemberBorrowings(member.id).catch(() => [])
      ]);
      setMemberDetails({ debts, solidarity, savings, borrowings });
    } catch (err) {
      showToast("Erreur lors du chargement des détails du membre", "error");
    } finally {
      setDetailsLoading(false);
    }
  };

  function formatAmount(n: number) {
    return (n || 0).toLocaleString(locale === "fr" ? "fr-FR" : "en-US");
  }

  const filteredMembers = members.filter(m => 
    m.user?.name?.toLowerCase().includes(search.toLowerCase()) || 
    m.user?.firstName?.toLowerCase().includes(search.toLowerCase()) ||
    m.registrationNumber?.includes(search)
  );

  if (loading) return <div className="fas fa-spinner fa-spin" style={{ fontSize: "2rem", color: "#4e73df", margin: "5rem auto", display: "block" }}></div>;

  return (
    <div className={styles.container}>
      <header style={{ marginBottom: "2rem", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <h1 style={{ fontSize: "1.8rem", fontWeight: 800, color: "#2e3b4e" }}>Gestion des Membres</h1>
          <p style={{ color: "#858796" }}>Suivi de l'état financier et des profils des adhérents.</p>
        </div>
        <div style={{ display: "flex", gap: "1rem" }}>
           <div style={{ position: "relative", width: "300px" }}>
              <i className="fas fa-search" style={{ position: "absolute", left: "1rem", top: "50%", transform: "translateY(-50%)", color: "#858796" }}></i>
              <input 
                type="text" 
                placeholder="Rechercher un membre..." 
                className={styles.formInput} 
                style={{ paddingLeft: "2.5rem" }}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
           </div>
           <button className={styles.confirmBtn} style={{ background: "white", color: "#4e73df", border: "1px solid #4e73df" }}>
              <i className="fas fa-file-export"></i> Exp.
           </button>
        </div>
      </header>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(350px, 1fr))", gap: "1rem" }}>
        {filteredMembers.map((m) => (
          <div key={m.id} className={styles.memberCard} onClick={() => viewMemberDetails(m)}>
             <div className={styles.memberMain}>
                <div className={styles.memberAvatar}>
                   {m.user?.firstName?.[0] || m.user?.name?.[0] || "U"}
                </div>
                <div>
                   <span className={styles.memberName}>{m.user?.firstName} {m.user?.name}</span>
                   <span className={styles.memberSub}>Matricule: {m.registrationNumber || "N/A"}</span>
                </div>
             </div>
             <div style={{ textAlign: "right" }}>
                <span className={`${styles.badge} ${m.active ? styles.badgeSuccess : styles.badgeDanger}`}>
                   {m.active ? "ACTIF" : "INACTIF"}
                </span>
                <div style={{ marginTop: "0.25rem", color: "#858796", fontSize: "0.75rem" }}>{m.user?.tel || ""}</div>
             </div>
          </div>
        ))}
        {filteredMembers.length === 0 && <div style={{ padding: "4rem", textAlign: "center", color: "#858796", background: "white", borderRadius: "20px", border: "2px dashed #e3e6f0", gridColumn: "1 / -1" }}>Aucun membre trouvé.</div>}
      </div>

      {/* Member Details Modal */}
      {selectedMember && (
        <div className={styles.modalOverlay} onClick={() => setSelectedMember(null)}>
          <div className={styles.modal} style={{ maxWidth: "800px", width: "95%" }} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
                 <div style={{ width: "40px", height: "40px", borderRadius: "10px", background: "white", color: "#4e73df", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800 }}>
                    {selectedMember.user?.firstName?.[0]}
                 </div>
                 <h3 style={{ margin: 0 }}>Fiche Membre : {selectedMember.user?.firstName} {selectedMember.user?.name}</h3>
              </div>
              <button className={styles.modalClose} onClick={() => setSelectedMember(null)}>
                <i className="fas fa-times"></i>
              </button>
            </div>

            <div className={styles.tabsHeader} style={{ padding: "0 2rem", background: "#f8f9fc" }}>
              <button className={`${styles.tabBtn} ${activeDetailsTab === "profil" ? styles.tabBtnActive : ""}`} onClick={() => setActiveDetailsTab("profil")}>Profil</button>
              <button className={`${styles.tabBtn} ${activeDetailsTab === "epargne" ? styles.tabBtnActive : ""}`} onClick={() => setActiveDetailsTab("epargne")}>Épargne</button>
              <button className={`${styles.tabBtn} ${activeDetailsTab === "dettes" ? styles.tabBtnActive : ""}`} onClick={() => setActiveDetailsTab("dettes")}>Dettes</button>
              <button className={`${styles.tabBtn} ${activeDetailsTab === "emprunts" ? styles.tabBtnActive : ""}`} onClick={() => setActiveDetailsTab("emprunts")}>Emprunts</button>
            </div>

            <div className={styles.modalBody} style={{ minHeight: "300px", textAlign: "left" }}>
              {detailsLoading ? (
                 <div style={{ textAlign: "center", padding: "4rem" }}>
                    <i className="fas fa-spinner fa-spin" style={{ fontSize: "2rem", color: "#4e73df" }}></i>
                    <p style={{ marginTop: "1rem", color: "#858796" }}>Récupération des données financières...</p>
                 </div>
              ) : memberDetails && (
                <div className="fade-in">
                   {activeDetailsTab === "profil" && (
                     <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "2rem" }}>
                        <div>
                           <label style={{ display: "block", fontSize: "0.7rem", fontWeight: 800, color: "#858796", textTransform: "uppercase" }}>Informations de contact</label>
                           <p style={{ fontWeight: 600 }}>Email: {selectedMember.user?.email || "N/A"}</p>
                           <p style={{ fontWeight: 600 }}>Tél: {selectedMember.user?.tel || "N/A"}</p>
                           <p style={{ fontWeight: 600 }}>Adresse: {selectedMember.address || "Non renseignée"}</p>
                        </div>
                        <div>
                           <label style={{ display: "block", fontSize: "0.7rem", fontWeight: 800, color: "#858796", textTransform: "uppercase" }}>Adhésion</label>
                           <p style={{ fontWeight: 600 }}>Matricule: {selectedMember.registrationNumber}</p>
                           <p style={{ fontWeight: 600 }}>Statut: {selectedMember.active ? "Actif" : "Inactif"}</p>
                        </div>
                     </div>
                   )}

                   {activeDetailsTab === "epargne" && (
                     <div>
                        <div style={{ padding: "1.5rem", background: "rgba(28,200,138,0.1)", borderRadius: "12px", marginBottom: "1.5rem" }}>
                           <span style={{ fontSize: "0.8rem", fontWeight: 700, color: "#1cc88a" }}>SOLDE ÉPARGNE CUMULÉ</span>
                           <h2 style={{ color: "#1cc88a", margin: 0 }}>{formatAmount(memberDetails.savings?.reduce((acc: any, s: any) => acc + s.amount, 0))} XAF</h2>
                        </div>
                        <table className={styles.table}>
                           <thead>
                              <tr><th>Date</th><th>Type</th><th>Montant</th></tr>
                           </thead>
                           <tbody>
                              {memberDetails.savings?.map((s: any) => (
                                 <tr key={s.id}>
                                    <td>{new Date(s.createdAt).toLocaleDateString()}</td>
                                    <td><span className={styles.badgePrimary}>{s.type}</span></td>
                                    <td style={{ fontWeight: 700 }}>{formatAmount(s.amount)} XAF</td>
                                 </tr>
                              ))}
                           </tbody>
                        </table>
                     </div>
                   )}

                   {activeDetailsTab === "dettes" && (
                     <div>
                        <div style={{ padding: "1.5rem", background: "rgba(231,74,59,0.1)", borderRadius: "12px", marginBottom: "1.5rem" }}>
                           <span style={{ fontSize: "0.8rem", fontWeight: 700, color: "#e74a3b" }}>DETTE SOLIDARITÉ RESTANTE</span>
                           <h2 style={{ color: "#e74a3b", margin: 0 }}>{formatAmount(memberDetails.solidarity?.remainingAmount)} XAF</h2>
                        </div>
                        <h4 style={{ marginBottom: "1rem" }}>Dettes spécifiques</h4>
                        <table className={styles.table}>
                           <thead>
                              <tr><th>Type</th><th>Montant</th><th>Session</th></tr>
                           </thead>
                           <tbody>
                              {memberDetails.debts?.map((d: any, i: number) => (
                                 <tr key={i}>
                                    <td>{d.type}</td>
                                    <td style={{ fontWeight: 700, color: "#e74a3b" }}>{formatAmount(d.amount)} XAF</td>
                                    <td>{d.sessionName || "N/A"}</td>
                                 </tr>
                              ))}
                           </tbody>
                        </table>
                     </div>
                   )}

                   {activeDetailsTab === "emprunts" && (
                     <div>
                        <table className={styles.table}>
                           <thead>
                              <tr><th>Montant</th><th>Statut</th><th>Demandé le</th><th>Remboursé</th></tr>
                           </thead>
                           <tbody>
                              {memberDetails.borrowings?.map((b: any) => (
                                 <tr key={b.id}>
                                    <td style={{ fontWeight: 800 }}>{formatAmount(b.amount)} XAF</td>
                                    <td><span className={b.status === 'APPROVED' ? styles.badgeSuccess : styles.badgeWarning}>{b.status}</span></td>
                                    <td>{new Date(b.createdAt).toLocaleDateString()}</td>
                                    <td>{formatAmount(b.refundedAmount || 0)} XAF</td>
                                 </tr>
                              ))}
                              {memberDetails.borrowings?.length === 0 && <tr><td colSpan={4} style={{ textAlign: "center", padding: "2rem", color: "#858796" }}>Aucun historique d'emprunt.</td></tr>}
                           </tbody>
                        </table>
                     </div>
                   )}
                </div>
              )}
            </div>
            <div className={styles.modalActions} style={{ background: "#f8f9fc", padding: "1.5rem 2rem", borderTop: "1px solid #e3e6f0" }}>
               <button className={styles.cancelBtn} onClick={() => setSelectedMember(null)}>Fermer la fiche</button>
               <button className={styles.confirmBtn} style={{ background: "linear-gradient(135deg, #4e73df, #224abe)" }}>Archiver le dossier</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
