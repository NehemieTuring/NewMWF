"use client";

import { useEffect, useState } from "react";
import styles from "./emprunts.module.css";
import { useTranslation } from "@/context/LanguageContext";
import { memberService } from "@/services/memberService";

export default function MyEmpruntsPage() {
  const { t, locale } = useTranslation();
  const [loans, setLoans] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadLoans() {
      try {
        const data = await memberService.getMyBorrowings();
        setLoans(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    loadLoans();
  }, []);

  function formatAmount(n: number) {
    return (n || 0).toLocaleString(locale === "fr" ? "fr-FR" : "en-US");
  }

  if (loading) return <div className={styles.loading}>Chargement de vos emprunts...</div>;
  if (error) return <div className={styles.errorBanner}>{error}</div>;

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>{t.common.mesEmprunts}</h1>
          <p className={styles.subtitle}>Consultez l'Ã©tat de vos prÃªts en cours et passÃ©s</p>
        </div>
        <button className={styles.addBtn}>
          <i className="fas fa-plus"></i> Demander un prÃªt
        </button>
      </div>

      <div className={styles.loanGrid}>
        {loans.map((e) => {
          const total = (e.amount || 0) * (1 + (e.interestRate || 0)/100);
          const remaining = total - (e.refundedAmount || 0);
          const progress = Math.round(((e.refundedAmount || 0) / total) * 100);
          return (
            <div key={e.id} className={styles.card}>
              <div className={styles.cardHeader}>
                <div className={`${styles.loanBadge} ${e.status === "ACTIVE" ? styles.badgeActive : styles.badgeCompleted}`}>
                   {e.status === "ACTIVE" ? "PrÃªt Actuel" : "TerminÃ©"}
                </div>
                <div className={styles.loanDate}>{new Date(e.createdAt).toLocaleDateString(locale === "fr" ? "fr-FR" : "en-US")}</div>
              </div>
              <div className={styles.cardBody}>
                <div className={styles.amountsGrid}>
                  <div className={styles.statCell}>
                    <span className={styles.statLabel}>{t.emprunts.total}</span>
                    <span className={styles.statValue}>{formatAmount(total)} XAF</span>
                  </div>
                  <div className={styles.statCell}>
                    <span className={styles.statLabel}>{t.emprunts.remboursement}</span>
                    <span className={styles.statValue} style={{ color: "var(--success)" }}>{formatAmount(e.refundedAmount)} XAF</span>
                  </div>
                </div>
                
                <div className={styles.progressSection}>
                  <div className={styles.progressInfo}>
                    <span>Progression</span>
                    <span>{progress}%</span>
                  </div>
                  <div className={styles.progressBar}>
                    <div className={styles.progressFill} style={{ width: `${progress}%` }}></div>
                  </div>
                </div>

                <div className={styles.remainingCard}>
                  <span className={styles.remainingLabel}>{t.emprunts.restant}</span>
                  <span className={styles.remainingValue}>{formatAmount(remaining)} XAF</span>
                </div>
              </div>
              <div className={styles.cardFooter}>
                <button className={styles.detailsBtn}>
                  <i className="fas fa-history"></i> Historique des remboursements
                </button>
                {e.status === "ACTIVE" && (
                  <button className={styles.payBtn}>
                    <i className="fas fa-money-bill-wave"></i> Effectuer un remboursement
                  </button>
                )}
              </div>
            </div>
          );
        })}
        {loans.length === 0 && <div className={styles.empty}>Aucun emprunt en cours.</div>}
      </div>
    </div>
  );
}

