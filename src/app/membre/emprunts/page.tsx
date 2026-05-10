"use client";

import { useEffect, useState } from "react";
import styles from "../membre.module.css";
import { useTranslation } from "@/context/LanguageContext";
import { memberService } from "@/services/memberService";
import { useNotification } from "@/context/NotificationContext";

export default function EmpruntsPage() {
  const { locale } = useTranslation();
  const { showToast } = useNotification();
  const [borrowings, setBorrowings] = useState<any[]>([]);
  const [activeSession, setActiveSession] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [selectedLoan, setSelectedLoan] = useState<any>(null);
  const [refunds, setRefunds] = useState<any[]>([]);
  const [refundsLoading, setRefundsLoading] = useState(false);

  // Loan Request Modal
  const [showLoanRequest, setShowLoanRequest] = useState(false);
  const [loanAmount, setLoanAmount] = useState("");

  useEffect(() => {
    async function loadData() {
      try {
        const [borrowData, sessionData] = await Promise.all([
          memberService.getMyBorrowings(),
          memberService.getSessions()
        ]);
        setBorrowings(borrowData || []);
        
        const current = sessionData?.find((s: any) => s.active === true || s.state === "OPEN");
        setActiveSession(current || null);
      } catch (err) {
        console.error("Failed to load data", err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const viewLoanDetails = async (loan: any) => {
    setSelectedLoan(loan);
    setRefundsLoading(true);
    try {
      const data = await memberService.getLoanRefunds(loan.id).catch(() => []);
      setRefunds(data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setRefundsLoading(false);
    }
  };

  const handleLoanRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeSession) {
      showToast("Opération impossible : Aucune session de collecte n'est actuellement ouverte.", "error");
      return;
    }
    try {
      await memberService.requestLoan(Number(loanAmount));
      showToast("Demande d'emprunt soumise avec succès", "success");
      setShowLoanRequest(false);
      setLoanAmount("");
      const updated = await memberService.getMyBorrowings();
      setBorrowings(updated);
    } catch (err: any) {
      showToast(err.message || "Erreur lors de la demande", "error");
    }
  };

  function formatAmount(n: number) {
    return (n || 0).toLocaleString(locale === "fr" ? "fr-FR" : "en-US");
  }

  function getStatusLabel(status: string) {
    switch (status) {
      case "APPROVED": return "APPROUVÉ";
      case "PENDING": return "EN ATTENTE";
      case "REJECTED": return "REFUSÉ";
      case "ACTIVE": return "ACTIF";
      case "COMPLETED": return "REMBOURSÉ";
      default: return status;
    }
  }

  function getStatusColor(status: string) {
    switch (status) {
      case "APPROVED": case "ACTIVE": return "#1cc88a";
      case "PENDING": return "#f6c23e";
      case "REJECTED": return "#e74a3b";
      case "COMPLETED": return "#4e73df";
      default: return "#858796";
    }
  }

  if (loading) return (
    <div className={styles.container}>
      <div className={styles.loadingContainer}>
        <div className={styles.loadingSpinner}></div>
        <span className={styles.loadingText}>Chargement de vos emprunts...</span>
      </div>
    </div>
  );

  const activeCount = borrowings.filter(b => b.status === "ACTIVE" || b.status === "APPROVED").length;
  const totalBorrowed = borrowings.reduce((s, b) => s + (b.requestedAmount || 0), 0);
  const totalRefunded = borrowings.reduce((s, b) => s + ((b.requestedAmount || 0) - (b.remainingBalance || 0)), 0);

  return (
    <div className={styles.container}>
      <header className="fade-in-up" style={{ marginBottom: "2rem", display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <div>
          <h1 style={{ fontSize: "1.8rem", fontWeight: 800, color: "#2e3b4e", letterSpacing: "-0.02em" }}>
            Mes <span className="text-gradient">Emprunts</span>
          </h1>
          <p style={{ color: "#858796", fontSize: "0.95rem" }}>Suivi complet de vos emprunts, remboursements et demandes de prêt.</p>
          
          {!activeSession && (
            <div style={{ marginTop: "1rem", color: "#e74a3b", fontSize: "0.85rem", display: "flex", alignItems: "center", gap: "0.5rem", fontWeight: 600 }}>
               <i className="fas fa-exclamation-triangle"></i>
               Aucune session de collecte ouverte. Les nouvelles demandes sont temporairement suspendues.
            </div>
          )}
        </div>
        <button 
          className={styles.confirmBtn} 
          onClick={() => activeSession && setShowLoanRequest(true)} 
          disabled={!activeSession}
          style={{ 
            background: activeSession ? "linear-gradient(135deg, #4e73df, #224abe)" : "#cbd5e0", 
            boxShadow: activeSession ? "0 4px 15px rgba(78,115,223,0.3)" : "none",
            cursor: activeSession ? "pointer" : "not-allowed"
          }}
        >
          <i className="fas fa-plus"></i> Demander un emprunt
        </button>
      </header>

      {/* KPIs */}
      <div className={`${styles.dashboardGrid} stagger-children`}>
        <div className={styles.statCard}>
          <div className={styles.statIcon} style={{ background: "rgba(78,115,223,0.1)", color: "#4e73df" }}>
            <i className="fas fa-hand-holding-usd"></i>
          </div>
          <div className={styles.statInfo}>
            <span className={styles.statLabel}>Emprunts Actifs</span>
            <span className={styles.statValue}>{activeCount}</span>
          </div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statIcon} style={{ background: "rgba(28,200,138,0.1)", color: "#1cc88a" }}>
            <i className="fas fa-coins"></i>
          </div>
          <div className={styles.statInfo}>
            <span className={styles.statLabel}>Total Emprunté</span>
            <span className={styles.statValue}>{formatAmount(totalBorrowed)} <small>XAF</small></span>
          </div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statIcon} style={{ background: "rgba(246,194,62,0.1)", color: "#f6c23e" }}>
            <i className="fas fa-redo"></i>
          </div>
          <div className={styles.statInfo}>
            <span className={styles.statLabel}>Total Remboursé</span>
            <span className={styles.statValue}>{formatAmount(totalRefunded)} <small>XAF</small></span>
          </div>
        </div>
      </div>

      {/* Loans List */}
      <section className="fade-in-up" style={{ marginTop: "2rem", animationDelay: "0.2s" }}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>Historique Complet</h2>
          <span className={styles.statusBadge} style={{ background: "rgba(78,115,223,0.08)", color: "#4e73df" }}>
            {borrowings.length} emprunt{borrowings.length > 1 ? "s" : ""}
          </span>
        </div>
        <div className={styles.tableWrapper}>
          <table className={styles.dataTable}>
            <thead>
              <tr>
                <th>Réf.</th>
                <th>Montant</th>
                <th>Statut</th>
                <th>Date Demande</th>
                <th style={{ textAlign: "right" }}>Remboursé</th>
                <th style={{ textAlign: "center" }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {borrowings.map((b) => {
                const totalDebt = b.requestedAmount || 0;
                const paid = totalDebt - (b.remainingBalance || 0);
                const progress = totalDebt > 0 ? Math.round((paid / totalDebt) * 100) : 0;
                return (
                  <tr key={b.id}>
                    <td style={{ fontWeight: 700, color: "#4e73df" }}>#{b.id}</td>
                    <td style={{ fontWeight: 800 }}>{formatAmount(b.requestedAmount)} XAF</td>
                    <td>
                      <span className={styles.statusBadge} style={{ background: `${getStatusColor(b.status)}15`, color: getStatusColor(b.status) }}>
                        {getStatusLabel(b.status)}
                      </span>
                    </td>
                    <td style={{ color: "#858796", fontSize: "0.9rem" }}>{new Date(b.createdAt).toLocaleDateString()}</td>
                    <td style={{ textAlign: "right" }}>
                      <div style={{ display: "flex", alignItems: "center", justifyContent: "flex-end", gap: "0.75rem" }}>
                        <div className={styles.progressTrack} style={{ width: "80px", height: "6px" }}>
                          <div className={styles.progressFill} style={{ width: `${Math.min(progress, 100)}%` }}></div>
                        </div>
                        <span style={{ fontWeight: 700, fontSize: "0.85rem" }}>{formatAmount(paid)}</span>
                      </div>
                    </td>
                    <td style={{ textAlign: "center" }}>
                      <button className={styles.actionBtn} onClick={() => viewLoanDetails(b)}>
                        <i className="fas fa-eye"></i> Détails
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          {borrowings.length === 0 && (
            <div className="empty-state" style={{ border: "none", borderRadius: 0 }}>
              <i className="fas fa-hand-holding-usd"></i>
              <p>Vous n&apos;avez effectué aucun emprunt.</p>
            </div>
          )}
        </div>
      </section>

      {/* Loan Detail Modal */}
      {selectedLoan && (
        <div className={styles.modalOverlay} onClick={() => setSelectedLoan(null)}>
          <div className={styles.modal} style={{ maxWidth: "700px", width: "95%" }} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h3>Détail Emprunt #{selectedLoan.id}</h3>
              <button className={styles.modalClose} onClick={() => setSelectedLoan(null)}>
                <i className="fas fa-times"></i>
              </button>
            </div>
            <div className={styles.modalBody} style={{ textAlign: "left" }}>
              {/* Summary */}
              <div className={styles.kpiRow} style={{ marginBottom: "2rem" }}>
                <div className={styles.kpiItem}>
                  <span className={styles.kpiItemLabel}>Montant Initial</span>
                  <span className={styles.kpiItemValue}>{formatAmount(selectedLoan.requestedAmount)} XAF</span>
                </div>
                <div className={styles.kpiItem}>
                  <span className={styles.kpiItemLabel}>Intérêts (pré-prélevés)</span>
                  <span className={styles.kpiItemValue}>{formatAmount(selectedLoan.interestAmount)} XAF</span>
                </div>
                <div className={styles.kpiItem}>
                  <span className={styles.kpiItemLabel}>Net Reçu</span>
                  <span className={styles.kpiItemValue}>{formatAmount(selectedLoan.netAmountReceived)} XAF</span>
                </div>
              </div>

              {/* Progress */}
              <div className={styles.progressContainer}>
                <div className={styles.progressHeader}>
                  <span>Progression du remboursement</span>
                  <span style={{ color: "#1cc88a" }}>
                    {formatAmount(selectedLoan.requestedAmount - (selectedLoan.remainingBalance || 0))} / {formatAmount(selectedLoan.requestedAmount)} XAF
                  </span>
                </div>
                <div className={styles.progressTrack} style={{ height: "10px" }}>
                  <div className={styles.progressFill} style={{ 
                    width: `${Math.min(100, Math.round(((selectedLoan.requestedAmount - (selectedLoan.remainingBalance || 0)) / (selectedLoan.requestedAmount || 1)) * 100))}%`
                  }}></div>
                </div>
              </div>

              {/* Refund History */}
              <div className={styles.sectionHeader} style={{ marginTop: "1.5rem" }}>
                <h4 className={styles.sectionTitle} style={{ fontSize: "1rem" }}>Historique des Remboursements</h4>
              </div>
              {refundsLoading ? (
                <div style={{ textAlign: "center", padding: "2rem" }}><div className={styles.loadingSpinner} style={{ width: 32, height: 32, margin: "0 auto" }}></div></div>
              ) : refunds.length > 0 ? (
                <div className={styles.tableWrapper}>
                  <table className={styles.dataTable}>
                    <thead>
                      <tr>
                        <th>Date</th>
                        <th style={{ textAlign: "right" }}>Montant</th>
                      </tr>
                    </thead>
                    <tbody>
                      {refunds.map((r: any, i: number) => (
                        <tr key={i}>
                          <td>{new Date(r.date || r.createdAt).toLocaleDateString()}</td>
                          <td style={{ textAlign: "right", fontWeight: 700, color: "#1cc88a" }}>+{formatAmount(r.amount)} XAF</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="empty-state" style={{ padding: "2rem" }}>
                  <i className="fas fa-history" style={{ fontSize: "2rem" }}></i>
                  <p>Aucun remboursement enregistré.</p>
                </div>
              )}
            </div>
            <div className={styles.modalActions} style={{ background: "#f8f9fc", padding: "1.5rem 2rem", borderTop: "1px solid #e3e6f0" }}>
              <button className={styles.cancelBtn} onClick={() => setSelectedLoan(null)}>Fermer</button>
            </div>
          </div>
        </div>
      )}

      {/* Loan Request Modal */}
      {showLoanRequest && (
        <div className={styles.modalOverlay} onClick={() => setShowLoanRequest(false)}>
          <div className={styles.modal} style={{ maxWidth: "450px" }} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h3>Demande d&apos;emprunt</h3>
              <button className={styles.modalClose} onClick={() => setShowLoanRequest(false)}>
                <i className="fas fa-times"></i>
              </button>
            </div>
            <form onSubmit={handleLoanRequest} className={styles.modalBody} style={{ textAlign: "left" }}>
              <div style={{ marginBottom: "1.5rem" }}>
                <label style={{ display: "block", fontSize: "0.85rem", fontWeight: 700, color: "#4e73df", marginBottom: "0.5rem" }}>Montant souhaité (XAF)</label>
                <input 
                  type="number" 
                  className={styles.input}
                  value={loanAmount}
                  onChange={(e) => setLoanAmount(e.target.value)}
                  placeholder="Ex: 50000"
                  required
                />
              </div>
              <p style={{ fontSize: "0.8rem", color: "#858796", marginBottom: "2rem" }}>Votre demande sera soumise à l&apos;approbation du comité de crédit.</p>
              <div className={styles.modalActions}>
                <button type="button" className={styles.cancelBtn} onClick={() => setShowLoanRequest(false)}>Annuler</button>
                <button type="submit" className={styles.confirmBtn} style={{ background: "linear-gradient(135deg, #4e73df, #224abe)" }}>Soumettre la demande</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
