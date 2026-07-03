"use client";

import { useEffect, useState } from "react";
import styles from "../admin.module.css";
import { useTranslation } from "@/context/LanguageContext";
import { treasurerService } from "@/services/treasurerService";
import { useNotification } from "@/context/NotificationContext";

type OperationType = "epargne" | "solidarite" | "emprunt" | "remboursement" | "achat";

export default function GlobalOperationsPage() {
  const { t } = useTranslation();
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
  const [itemName, setItemName] = useState("");
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
    if (!amount || !selectedOp) return;
    if (selectedOp !== "achat" && !selectedMemberId) return;

    if (!activeSession) {
      showToast(t.operations.erreurSessionFermee, "error");
      return;
    }

    const member = members.find(m => m.id === Number(selectedMemberId));
    const opLabel = actions.find(a => a.type === selectedOp)?.label;

    if (selectedOp === "remboursement") {
      const numAmount = Number(amount);
      if (refundType === "LOAN") {
        const limit = memberDebts.filter(d => d.type === "LOAN").reduce((acc, d) => acc + d.amount, 0);
        const limitLabel = t.operations.unPret;
        if (numAmount > limit) {
          showToast(t.operations.erreurMontantExcede.replace("{amount}", numAmount.toLocaleString()).replace("{limitLabel}", limitLabel).replace("{limit}", limit.toLocaleString()), "error");
          return;
        }
      }
    }

    let confirmMsg = selectedOp === "achat"
      ? t.operations.confirmMsgAchat.replace("{amount}", amount)
      : t.operations.confirmMsgOp.replace("{amount}", amount).replace("{member}", `${member?.user?.firstName} ${member?.user?.name}`).replace("{session}", activeSession.name || activeSession.sessionNumber);

    if (selectedOp === "remboursement" && refundType === "SOLIDARITY") {
      const numAmount = Number(amount);
      const socialDebts = memberDebts.filter(d => d.type === "SOLIDARITY" || d.type === "REFUELING");
      const limit = socialDebts.reduce((acc, d) => acc + d.amount, 0);
      if (numAmount > limit) {
        const surplus = numAmount - limit;
        confirmMsg += ` (Note : L'excédent de ${surplus.toLocaleString()} XAF sera versé dans la Caisse d'Inscription / Fond d'Adhésion).`;
      }
    }

    showConfirm({
      title: `${t.operations.confirmTitre}${opLabel}`,
      message: confirmMsg,
      type: "info",
      onConfirm: async () => {
        setLoading(true);
        try {
          if (selectedOp === "epargne") {
            await treasurerService.addMemberSaving(Number(selectedMemberId), Number(amount));
            showToast(t.operations.succesEpargne, "success");
          } else if (selectedOp === "remboursement") {
            if (refundType === "LOAN") {
              await treasurerService.addRefund(Number(selectedMemberId), Number(amount));
              showToast(t.operations.succesRemboursement, "success");
            } else {
              await treasurerService.paySolidarity(Number(selectedMemberId), Number(amount));
              showToast(t.operations.succesSolidarite, "success");
            }
          } else if (selectedOp === "emprunt") {
            await treasurerService.addLoan(Number(selectedMemberId), Number(amount));
            showToast(t.operations.succesPret, "success");
          } else if (selectedOp === "solidarite") {
            await treasurerService.paySolidarity(Number(selectedMemberId), Number(amount));
            showToast(t.operations.succesSolidarite, "success"); // Fixed: reuse same success msg for solidarity
          } else if (selectedOp === "achat") {
            const finalDescription = itemName ? `Article: ${itemName}${description ? ` - Justification: ${description}` : ""}` : (description || (t.operations.nomArticle));
            await treasurerService.recordSolidarityPurchase(Number(amount), finalDescription);
            showToast(t.operations.succesAchat, "success");
          }
          // Reset
          setAmount("");
          setDescription("");
          setItemName("");
          setSelectedOp(null);
          loadData();
        } catch (err: any) {
          showToast(err.message || t.superAdmin.erreur, "error");
        } finally {
          setLoading(false);
        }
      }
    });
  };

  const actions = [
    { type: "epargne" as OperationType, label: t.operations.collecteEpargne, icon: "fas fa-piggy-bank", color: "#1cc88a", desc: t.operations.collecteEpargneDesc },
    { type: "remboursement" as OperationType, label: t.operations.remboursementDette, icon: "fas fa-hand-holding-usd", color: "#4e73df", desc: t.operations.remboursementDetteDesc },
    { type: "emprunt" as OperationType, label: t.operations.accorderPret, icon: "fas fa-exchange-alt", color: "#36b9cc", desc: t.operations.accorderPretDesc },
    { type: "achat" as OperationType, label: t.operations.achatsMutuelle, icon: "fas fa-shopping-cart", color: "#e74a3b", desc: t.operations.achatsMutuelleDesc },
  ];

  return (
    <div className={styles.container}>
      <header style={{ marginBottom: "3rem" }}>
        <h1 style={{ fontSize: "1.8rem", fontWeight: 800, color: "var(--text-dark)" }}>{t.operations.titre}</h1>
        <p style={{ color: "var(--text-muted)" }}>{t.operations.sousTitre}</p>

        {!activeSession ? (
          <div style={{ marginTop: "1.5rem", padding: "1.5rem", background: "rgba(231,74,59,0.1)", border: "1px solid var(--danger)", borderRadius: "16px", display: "flex", alignItems: "center", gap: "1rem", color: "var(--danger)" }}>
            <i className="fas fa-exclamation-circle" style={{ fontSize: "1.5rem" }}></i>
            <div>
              <strong style={{ display: "block" }}>{t.operations.aucuneSession}</strong>
              <span style={{ fontSize: "0.85rem" }}>{t.operations.aucuneSessionDesc}</span>
            </div>
          </div>
        ) : (
          <div style={{ marginTop: "1.5rem", padding: "1.5rem", background: "rgba(28,200,138,0.1)", border: "1px solid var(--success)", borderRadius: "16px", display: "flex", alignItems: "center", gap: "1rem", color: "var(--success)" }}>
            <i className="fas fa-check-circle" style={{ fontSize: "1.5rem" }}></i>
            <div>
              <strong style={{ display: "block" }}>{t.operations.sessionOuverte}{activeSession.name || `Session #${activeSession.sessionNumber}`}</strong>
              <span style={{ fontSize: "0.85rem" }}>{t.operations.sessionOuverteDesc}</span>
            </div>
          </div>
        )}
      </header>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "1.5rem", opacity: !activeSession ? 0.7 : 1 }}>
        {actions.map((act) => (
          <div
            key={act.type}
            style={{
              background: "var(--white)",
              padding: "2rem",
              borderRadius: "24px",
              border: !activeSession ? "1px dashed var(--border-color)" : "1px solid var(--border-color)",
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
              <h3 style={{ margin: 0, fontSize: "1.1rem", fontWeight: 700, color: "var(--text-dark)" }}>{act.label}</h3>
              <p style={{ fontSize: "0.85rem", color: "var(--text-muted)", marginTop: "0.5rem", lineHeight: "1.4" }}>{act.desc}</p>
            </div>
            <button style={{ marginTop: "auto", background: "none", border: "none", color: act.color, fontWeight: 800, fontSize: "0.8rem", display: "flex", alignItems: "center", gap: "0.5rem", padding: 0, cursor: "pointer" }}>
              {t.operations.ouvrirModule} <i className="fas fa-arrow-right"></i>
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
              {selectedOp !== "achat" && (
                <div style={{ marginBottom: "1.5rem" }}>
                  <label style={{ display: "block", fontSize: "0.85rem", fontWeight: 700, color: "#4e73df", marginBottom: "0.5rem" }}>{t.operations.selectionMember}</label>
                  <select
                    className={styles.formInput}
                    value={selectedMemberId}
                    onChange={(e) => setSelectedMemberId(e.target.value)}
                    required
                  >
                    <option value="">{t.operations.choisirMembre}</option>
                    {members.map(m => (
                      <option key={m.id} value={m.id}>{m.user?.firstName} {m.user?.name} (@{m.username})</option>
                    ))}
                  </select>
                </div>
              )}

              <div style={{ marginBottom: "1.5rem" }}>
                <label style={{ display: "block", fontSize: "0.85rem", fontWeight: 700, color: "#4e73df", marginBottom: "0.5rem" }}>{t.operations.montantOperation}</label>
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
                  <label style={{ display: "block", fontSize: "0.85rem", fontWeight: 700, color: "#4e73df", marginBottom: "0.5rem" }}>{t.operations.queRemboursezVous}</label>
                  <div style={{ display: "flex", gap: "1rem" }}>
                    <label style={{ flex: 1, cursor: "pointer" }}>
                      <input type="radio" name="refundType" checked={refundType === "LOAN"} onChange={() => setRefundType("LOAN")} style={{ marginRight: "0.5rem" }} />
                      {t.operations.unPret}
                    </label>
                    <label style={{ flex: 1, cursor: "pointer" }}>
                      <input type="radio" name="refundType" checked={refundType === "SOLIDARITY"} onChange={() => setRefundType("SOLIDARITY")} style={{ marginRight: "0.5rem" }} />
                      {t.operations.solidariteRenflouement}
                    </label>
                  </div>
                  {selectedMemberId && (
                    <div style={{ marginTop: "0.5rem", fontSize: "0.8rem", color: "#e74a3b", fontWeight: 600 }}>
                      {refundType === "LOAN" ? (
                        <>{t.operations.dettePretActuelle}{(memberDebts.filter(d => d.type === "LOAN").reduce((acc, d) => acc + d.amount, 0)).toLocaleString()} XAF</>
                      ) : (
                        <>{t.operations.detteSolidariteActuelle}{(memberDebts.filter(d => d.type === "SOLIDARITY" || d.type === "REFUELING").reduce((acc, d) => acc + d.amount, 0)).toLocaleString()} XAF</>
                      )}
                    </div>
                  )}
                </div>
              )}

              {selectedOp === "achat" && (
                <div style={{ marginBottom: "1.5rem" }}>
                  <label style={{ display: "block", fontSize: "0.85rem", fontWeight: 700, color: "#4e73df", marginBottom: "0.5rem" }}>{t.operations.nomArticle}</label>
                  <input
                    type="text"
                    className={styles.formInput}
                    value={itemName}
                    onChange={(e) => setItemName(e.target.value)}
                    placeholder="Ex: Fournitures de bureau"
                    required
                  />
                </div>
              )}

              <div style={{ marginBottom: "2rem" }}>
                <label style={{ display: "block", fontSize: "0.85rem", fontWeight: 700, color: "#4e73df", marginBottom: "0.5rem" }}>{t.operations.justification}</label>
                <textarea
                  className={styles.formInput}
                  style={{ minHeight: "80px", resize: "none" }}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder={t.operations.detailsOperation}
                />
              </div>

              <div className={styles.modalActions}>
                <button type="button" className={styles.cancelBtn} onClick={() => setSelectedOp(null)}>{t.operations.annuler}</button>
                <button type="submit" className={styles.confirmBtn} disabled={loading} style={{ background: actions.find(a => a.type === selectedOp)?.color }}>
                  {loading ? t.operations.traitement : t.operations.confirmerOperation}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Historique rapide */}
      <section style={{ marginTop: "4rem" }}>
        <h2 style={{ fontSize: "1.1rem", fontWeight: 700, marginBottom: "1.5rem", color: "var(--text-dark)" }}>{t.operations.historiqueTitre}</h2>
        <div className={styles.tableCard}>
          <table className={styles.table}>
            <thead>
              <tr><th>{t.operations.date}</th><th>{t.operations.membre}</th><th>{t.operations.operation}</th><th style={{ textAlign: "right" }}>{t.operations.montant}</th></tr>
            </thead>
            <tbody>
              {transactions.length === 0 ? (
                <tr><td colSpan={4} style={{ textAlign: "center", padding: "2rem", color: "#a0aec0" }}>{t.operations.aucuneOperation}</td></tr>
              ) : transactions.slice(0, 5).map((tx: any) => {
                const getMemberName = (desc: string) => {
                  if (!desc) return "N/A";
                  if (desc.includes(" pour ")) return desc.split(" pour ")[1];
                  if (desc.includes(" for ")) return desc.split(" for ")[1];
                  return desc;
                };

                const translateType = (type: string) => {
                  const mapping: any = {
                    "SAVING_DEPOSIT": t.dashboard.epargnes,
                    "SAVING_WITHDRAWAL": t.dashboard.epargnes,
                    "BORROWING_LOAN": t.dashboard.emprunts,
                    "LOAN_REFUND": t.dashboard.emprunts,
                    "SOLIDARITY_PAYMENT": t.dashboard.fondSocial,
                    "SOLIDARITY_HELP": t.admin.aides,
                    "AGAPE": t.admin.agape,
                    "INSCRIPTION": t.dashboard.inscriptions,
                    "PENALTY": t.admin.dettes,
                    "SOCIAL_FUND_PURCHASE": t.operations.achatsMutuelle
                  };
                  return mapping[type] || type;
                };

                return (
                  <tr key={tx.id}>
                    <td>{new Date(tx.date).toLocaleDateString()}</td>
                    <td style={{ fontWeight: 600 }}>{tx.memberName || getMemberName(tx.description)}</td>
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
