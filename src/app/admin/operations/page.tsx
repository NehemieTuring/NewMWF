"use client";

import { useEffect, useState } from "react";
import styles from "../admin.module.css";
import { useTranslation } from "@/context/LanguageContext";
import { treasurerService } from "@/services/treasurerService";
import { useNotification } from "@/context/NotificationContext";

type OperationType = "epargne" | "solidarite" | "emprunt" | "remboursement";

export default function GlobalOperationsPage() {
  const { locale } = useTranslation();
  const { showToast, confirm: showConfirm } = useNotification();
  const [loading, setLoading] = useState(false);
  const [members, setMembers] = useState<any[]>([]);
  const [transactions, setTransactions] = useState<any[]>([]);
  const [activeSession, setActiveSession] = useState<any>(null);

  // Selection states
  const [selectedOp, setSelectedOp] = useState<OperationType | null>(null);
  const [selectedMemberId, setSelectedMemberId] = useState("");
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [refundType, setRefundType] = useState<"LOAN" | "SOLIDARITY">("LOAN");
  const [memberDebts, setMemberDebts] = useState<any[]>([]);

  useEffect(() => {
    if (selectedMemberId && selectedOp === "remboursement") {
      treasurerService.getMemberDebts(Number(selectedMemberId))
        .then(setMemberDebts)
        .catch(err => console.error("Error fetching debts", err));
    } else {
      setMemberDebts([]);
    }
  }, [selectedMemberId, selectedOp]);

  async function loadData() {
    try {
      const [memberData, statsData, sessionData] = await Promise.all([
        treasurerService.getAllMembers(),
        treasurerService.getGlobalTransactions(),
        treasurerService.getSessions()
      ]);
      setMembers(memberData || []);
      setTransactions(statsData?.recentTransactions || []);

      const session = sessionData?.find((s: any) => s.active === true);
      setActiveSession(session || null);
    } catch (err) {
      console.error("Failed to load operations data", err);
    }
  }

  useEffect(() => {
    loadData();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedMemberId || !amount || !selectedOp) return;

    if (!activeSession) {
      showToast("Opération impossible : Aucune session de collecte n'est actuellement ouverte.", "error");
      return;
    }

    const member = members.find(m => m.id === Number(selectedMemberId));
    const opLabel = actions.find(a => a.type === selectedOp)?.label;

    if (selectedOp === "remboursement") {
      const numAmount = Number(amount);
      let limit = 0;
      let limitLabel = "";

      if (refundType === "LOAN") {
        limit = memberDebts.filter(d => d.type === "LOAN").reduce((acc, d) => acc + d.amount, 0);
        limitLabel = "dette de prêt";
      } else {
        // La dette "SOLIDARITY" est le pivot qui inclut le renflouement sur le backend
        const solidarityEntry = memberDebts.find(d => d.type === "SOLIDARITY");
        const refuelingEntries = memberDebts.filter(d => d.type === "REFUELING");

        // Si on a une entrée master SOLIDARITY, c'est elle qui fait foi
        if (solidarityEntry) {
          limit = solidarityEntry.amount;
        } else {
          // Sinon on somme les renflouements (cas rare où la dette globale n'est pas encore créée)
          limit = refuelingEntries.reduce((acc, d) => acc + d.amount, 0);
        }
        limitLabel = "dette de solidarité/renflouement";
      }

      if (numAmount > limit) {
        showToast(`Opération refusée : Le montant (${numAmount.toLocaleString()} XAF) excède la ${limitLabel} (${limit.toLocaleString()} XAF).`, "error");
        return;
      }
    }

    showConfirm({
      title: `Confirmer ${opLabel}`,
      message: `Voulez-vous enregistrer cette opération de ${amount} XAF pour ${member?.user?.firstName} ${member?.user?.name} ? (Session: ${activeSession.name || activeSession.sessionNumber})`,
      type: "info",
      onConfirm: async () => {
        setLoading(true);
        try {
          if (selectedOp === "epargne") {
            await treasurerService.addMemberSaving(Number(selectedMemberId), Number(amount));
            showToast("Épargne enregistrée avec succès", "success");
          } else if (selectedOp === "remboursement") {
            if (refundType === "LOAN") {
              await treasurerService.addRefund(Number(selectedMemberId), Number(amount));
              showToast("Remboursement de prêt enregistré", "success");
            } else {
              await treasurerService.paySolidarity(Number(selectedMemberId), Number(amount));
              showToast("Paiement Solidarité/Renflouement enregistré", "success");
            }
          } else if (selectedOp === "emprunt") {
            await treasurerService.addLoan(Number(selectedMemberId), Number(amount));
            showToast("Prêt accordé et décaissé avec succès", "success");
          } else if (selectedOp === "solidarite") {
            await treasurerService.paySolidarity(Number(selectedMemberId), Number(amount));
            showToast("Cotisation Solidarité enregistrée", "success");
          }
          // Reset
          setAmount("");
          setDescription("");
          setSelectedOp(null);
          loadData();
        } catch (err: any) {
          showToast(err.message || "Erreur lors de l'opération", "error");
        } finally {
          setLoading(false);
        }
      }
    });
  };

  const actions = [
    { type: "epargne" as OperationType, label: "Collecter Épargne", icon: "fas fa-piggy-bank", color: "#1cc88a", desc: "Enregistrer un versement d'épargne d'un membre." },
    { type: "remboursement" as OperationType, label: "Remboursement de Dette", icon: "fas fa-hand-holding-usd", color: "#4e73df", desc: "Payer un prêt en cours ou une cotisation de solidarité (renflouement)." },
    { type: "emprunt" as OperationType, label: "Accorder un Prêt", icon: "fas fa-exchange-alt", color: "#36b9cc", desc: "Valider et décaisser un nouvel emprunt pour un membre." },
  ];

  return (
    <div className={styles.container}>
      <header style={{ marginBottom: "3rem" }}>
        <h1 style={{ fontSize: "1.8rem", fontWeight: 800, color: "#2e3b4e" }}>Opérations Financières</h1>
        <p style={{ color: "#858796" }}>Interface opérationnelle pour la gestion des flux financiers quotidiens.</p>

        {!activeSession ? (
          <div style={{ marginTop: "1.5rem", padding: "1.5rem", background: "#fff5f5", border: "1px solid #feb2b2", borderRadius: "16px", display: "flex", alignItems: "center", gap: "1rem", color: "#c53030" }}>
            <i className="fas fa-exclamation-circle" style={{ fontSize: "1.5rem" }}></i>
            <div>
              <strong style={{ display: "block" }}>Aucune session active</strong>
              <span style={{ fontSize: "0.85rem" }}>Vous devez ouvrir une session dans le module de gestion pour enregistrer des collectes d'épargne, des remboursements ou accorder des prêts.</span>
            </div>
          </div>
        ) : (
          <div style={{ marginTop: "1.5rem", padding: "1.5rem", background: "#f0fff4", border: "1px solid #9ae6b4", borderRadius: "16px", display: "flex", alignItems: "center", gap: "1rem", color: "#276749" }}>
            <i className="fas fa-check-circle" style={{ fontSize: "1.5rem" }}></i>
            <div>
              <strong style={{ display: "block" }}>Session Active : {activeSession.name || `Session #${activeSession.sessionNumber}`}</strong>
              <span style={{ fontSize: "0.85rem" }}>La session est ouverte. Vous pouvez enregistrer les opérations financières courantes.</span>
            </div>
          </div>
        )}
      </header>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "1.5rem", opacity: !activeSession ? 0.7 : 1 }}>
        {actions.map((act) => (
          <div
            key={act.type}
            style={{
              background: "white",
              padding: "2rem",
              borderRadius: "24px",
              border: !activeSession ? "1px dashed #cbd5e0" : "1px solid #e3e6f0",
              display: "flex",
              flexDirection: "column",
              gap: "1.25rem",
              cursor: !activeSession ? "not-allowed" : "pointer",
              transition: "all 0.2s"
            }}
            onClick={() => activeSession && setSelectedOp(act.type)}
            onMouseEnter={(e) => activeSession && (e.currentTarget.style.transform = "translateY(-5px)")}
            onMouseLeave={(e) => activeSession && (e.currentTarget.style.transform = "translateY(0)")}
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
                    <option key={m.id} value={m.id}>{m.user?.firstName} {m.user?.name} (@{m.username})</option>
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

              {selectedOp === "remboursement" && (
                <div style={{ marginBottom: "1.5rem" }}>
                  <label style={{ display: "block", fontSize: "0.85rem", fontWeight: 700, color: "#4e73df", marginBottom: "0.5rem" }}>Que remboursez-vous ?</label>
                  <div style={{ display: "flex", gap: "1rem" }}>
                    <label style={{ flex: 1, cursor: "pointer" }}>
                      <input type="radio" name="refundType" checked={refundType === "LOAN"} onChange={() => setRefundType("LOAN")} style={{ marginRight: "0.5rem" }} />
                      Un Prêt (Emprunt)
                    </label>
                    <label style={{ flex: 1, cursor: "pointer" }}>
                      <input type="radio" name="refundType" checked={refundType === "SOLIDARITY"} onChange={() => setRefundType("SOLIDARITY")} style={{ marginRight: "0.5rem" }} />
                      Solidarité / Renflouement
                    </label>
                  </div>
                  {selectedMemberId && (
                    <div style={{ marginTop: "0.5rem", fontSize: "0.8rem", color: "#e74a3b", fontWeight: 600 }}>
                      {refundType === "LOAN" ? (
                        <>Dette de prêt actuelle : {(memberDebts.filter(d => d.type === "LOAN").reduce((acc, d) => acc + d.amount, 0)).toLocaleString()} XAF</>
                      ) : (
                        <>Dette Solidarité/Renflouement : {(memberDebts.find(d => d.type === "SOLIDARITY")?.amount || memberDebts.filter(d => d.type === "REFUELING").reduce((acc, d) => acc + d.amount, 0)).toLocaleString()} XAF</>
                      )}
                    </div>
                  )}
                </div>
              )}

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
              ) : transactions.slice(0, 5).map((tx: any) => {
                const getMemberName = (desc: string) => {
                  if (!desc) return "N/A";
                  if (desc.includes(" pour ")) return desc.split(" pour ")[1];
                  if (desc.includes(" for ")) return desc.split(" for ")[1];
                  return desc;
                };

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
                  <tr key={tx.id}>
                    <td>{new Date(tx.date).toLocaleDateString()}</td>
                    <td style={{ fontWeight: 600 }}>{getMemberName(tx.description)}</td>
                    <td>
                      <span className={tx.amount > 0 ? styles.badgeSuccess : styles.badgePrimary}>
                        {translateType(tx.type)}
                      </span>
                    </td>
                    <td style={{ textAlign: "right", fontWeight: 800 }}>{tx.amount.toLocaleString()} XAF</td>
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
