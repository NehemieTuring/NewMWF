"use client";

import { useEffect, useState } from "react";
import styles from "../admin.module.css";
import { useTranslation } from "@/context/LanguageContext";
import { treasurerService } from "@/services/treasurerService";
import { useNotification } from "@/context/NotificationContext";

type OperationType = "epargne" | "solidarite" | "emprunt" | "remboursement";

export default function GlobalOperationsPage() {
  const { locale } = useTranslation();
  const { showToast } = useNotification();
  const [loading, setLoading] = useState(false);
  const [members, setMembers] = useState<any[]>([]);
  const [transactions, setTransactions] = useState<any[]>([]);
  
  // Selection states
  const [selectedOp, setSelectedOp] = useState<OperationType | null>(null);
  const [selectedMemberId, setSelectedMemberId] = useState("");
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");

  useEffect(() => {
    async function loadData() {
      try {
        const [memberData, adminData, statsData] = await Promise.all([
          treasurerService.getAllMembers(),
          treasurerService.getOtherAdmins(),
          treasurerService.getGlobalTransactions()
        ]);
        
        setMembers(memberData || []);
        setTransactions(statsData?.recentTransactions || []);
      } catch (err) {
        console.error("Failed to load operations data", err);
      }
    }
    loadData();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedMemberId || !amount || !selectedOp) return;

    setLoading(true);
    try {
      if (selectedOp === "epargne") {
        await treasurerService.addMemberSaving(Number(selectedMemberId), Number(amount));
        showToast("Épargne enregistrée avec succès", "success");
      } else if (selectedOp === "remboursement") {
        await treasurerService.addRefund(Number(selectedMemberId), Number(amount));
        showToast("Remboursement enregistré", "success");
      }
      // Reset
      setAmount("");
      setDescription("");
      setSelectedOp(null);
    } catch (err: any) {
      showToast(err.message || "Erreur lors de l'opération", "error");
    } finally {
      setLoading(false);
    }
  };

  const actions = [
    { type: "epargne" as OperationType, label: "Collecter Épargne", icon: "fas fa-piggy-bank", color: "#1cc88a", desc: "Enregistrer un versement d'épargne d'un membre." },
    { type: "remboursement" as OperationType, label: "Remboursement Prêt", icon: "fas fa-hand-holding-usd", color: "#4e73df", desc: "Enregistrer le remboursement partiel ou total d'un emprunt." },
    { type: "solidarite" as OperationType, label: "Fonds de Solidarité", icon: "fas fa-hand-holding-heart", color: "#f6c23e", desc: "Paiement de la cotisation solidarité / aides." },
    { type: "emprunt" as OperationType, label: "Accorder un Prêt", icon: "fas fa-exchange-alt", color: "#36b9cc", desc: "Valider et décaisser un nouvel emprunt pour un membre." },
  ];

  return (
    <div className={styles.container}>
      <header style={{ marginBottom: "3rem" }}>
        <h1 style={{ fontSize: "1.8rem", fontWeight: 800, color: "#2e3b4e" }}>Opérations Financières</h1>
        <p style={{ color: "#858796" }}>Interface opérationnelle pour la gestion des flux financiers quotidiens.</p>
      </header>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "1.5rem" }}>
         {actions.map((act) => (
           <div 
            key={act.type} 
            style={{ background: "white", padding: "2rem", borderRadius: "24px", border: "1px solid #e3e6f0", display: "flex", flexDirection: "column", gap: "1.25rem", cursor: "pointer", transition: "all 0.2s" }}
            onClick={() => setSelectedOp(act.type)}
            onMouseEnter={(e) => e.currentTarget.style.transform = "translateY(-5px)"}
            onMouseLeave={(e) => e.currentTarget.style.transform = "translateY(0)"}
           >
              <div style={{ width: "56px", height: "56px", borderRadius: "16px", background: `${act.color}15`, color: act.color, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.5rem" }}>
                 <i className={act.icon}></i>
              </div>
              <div>
                 <h3 style={{ margin: 0, fontSize: "1.1rem", fontWeight: 700, color: "#2e3b4e" }}>{act.label}</h3>
                 <p style={{ fontSize: "0.85rem", color: "#858796", marginTop: "0.5rem", lineHeight: "1.4" }}>{act.desc}</p>
              </div>
              <button style={{ marginTop: "auto", background: "none", border: "none", color: act.color, fontWeight: 800, fontSize: "0.8rem", display: "flex", alignItems: "center", gap: "0.5rem", padding: 0, cursor: "pointer" }}>
                 OUVRIR LE MODULE <i className="fas fa-arrow-right"></i>
              </button>
           </div>
         ))}
      </div>

      {/* Operation Modal */}
      {selectedOp && (
        <div className={styles.modalOverlay} onClick={() => setSelectedOp(null)}>
          <div className={styles.modal} style={{ maxWidth: "500px" }} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h3>{actions.find(a => a.type === selectedOp)?.label}</h3>
              <button className={styles.modalClose} onClick={() => setSelectedOp(null)}>
                <i className="fas fa-times"></i>
              </button>
            </div>
            <form onSubmit={handleSubmit} className={styles.modalBody} style={{ textAlign: "left" }}>
               <div style={{ marginBottom: "1.5rem" }}>
                  <label style={{ display: "block", fontSize: "0.85rem", fontWeight: 700, color: "#4e73df", marginBottom: "0.5rem" }}>Sélectionner le membre</label>
                  <select 
                    className={styles.formInput} 
                    value={selectedMemberId} 
                    onChange={(e) => setSelectedMemberId(e.target.value)}
                    required
                  >
                    <option value="">-- Choisir un membre --</option>
                    {members.map(m => (
                      <option key={m.id} value={m.id}>{m.user?.firstName} {m.user?.name} ({m.registrationNumber})</option>
                    ))}
                  </select>
               </div>

               <div style={{ marginBottom: "1.5rem" }}>
                  <label style={{ display: "block", fontSize: "0.85rem", fontWeight: 700, color: "#4e73df", marginBottom: "0.5rem" }}>Montant de l'opération (XAF)</label>
                  <input 
                    type="number" 
                    className={styles.formInput} 
                    value={amount} 
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="Ex: 25000"
                    required
                  />
               </div>

               <div style={{ marginBottom: "2rem" }}>
                  <label style={{ display: "block", fontSize: "0.85rem", fontWeight: 700, color: "#4e73df", marginBottom: "0.5rem" }}>Note / Observation</label>
                  <textarea 
                    className={styles.formInput} 
                    style={{ minHeight: "80px", resize: "none" }}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Détails optionnels..."
                  />
               </div>

               <div className={styles.modalActions}>
                  <button type="button" className={styles.cancelBtn} onClick={() => setSelectedOp(null)}>Annuler</button>
                  <button type="submit" className={styles.confirmBtn} disabled={loading} style={{ background: actions.find(a => a.type === selectedOp)?.color }}>
                     {loading ? "Traitement..." : "Confirmer l'opération"}
                  </button>
               </div>
            </form>
          </div>
        </div>
      )}
      
      {/* Historique rapide */}
      <section style={{ marginTop: "4rem" }}>
         <h2 style={{ fontSize: "1.1rem", fontWeight: 700, marginBottom: "1.5rem", color: "#4e4f5d" }}>Dernières opérations enregistrées</h2>
         <div className={styles.tableCard}>
            <table className={styles.table}>
               <thead>
                  <tr><th>Date</th><th>Membre</th><th>Opération</th><th style={{ textAlign: "right" }}>Montant</th></tr>
               </thead>
               <tbody>
                  {transactions.length === 0 ? (
                    <tr><td colSpan={4} style={{ textAlign: "center", padding: "2rem", color: "#a0aec0" }}>Aucune opération récente trouvée.</td></tr>
                  ) : transactions.slice(0, 5).map((tx: any) => (
                    <tr key={tx.id}>
                       <td>{new Date(tx.date).toLocaleDateString()}</td>
                       <td style={{ fontWeight: 600 }}>{tx.description.split(' pour ')[1] || tx.description}</td>
                       <td><span className={tx.amount > 0 ? styles.badgeSuccess : styles.badgePrimary}>{tx.type}</span></td>
                       <td style={{ textAlign: "right", fontWeight: 800 }}>{tx.amount.toLocaleString()} XAF</td>
                    </tr>
                  ))}
               </tbody>
            </table>
         </div>
      </section>
    </div>
  );
}
