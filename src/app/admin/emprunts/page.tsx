"use client";

import { useEffect, useState } from "react";
import styles from "./emprunts.module.css";
import { useTranslation } from "@/context/LanguageContext";
import { secretaryService } from "@/services/secretaryService";

export default function EmpruntsPage() {
  const { t, locale } = useTranslation();
  const [loans, setLoans] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");

  useEffect(() => {
    async function loadLoans() {
      try {
        const data = await secretaryService.getAllLoans();
        setLoans(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    loadLoans();
  }, []);

  const filtered = loans.filter(e => 
    `${e.member?.user?.firstName} ${e.member?.user?.name} ${e.member?.username}`.toLowerCase().includes(search.toLowerCase())
  );

  function formatAmount(n: number) {
    return (n || 0).toLocaleString(locale === "fr" ? "fr-FR" : "en-US");
  }

  if (loading) return (
    <div className={styles.loadingContainer}>
      <div className={styles.spinner}></div>
      <p>Chargement des emprunts...</p>
    </div>
  );
  if (error) return <div className={styles.error}>Erreur: {error}</div>;

  const totalLoans = loans.length;
  const activeLoans = loans.filter(l => l.status === "ACTIVE").length;
  const totalAmount = loans.reduce((sum, l) => sum + (l.amount || 0), 0);

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <div className={styles.headerContent}>
          <div className={styles.headerIcon}>
            <i className="fas fa-hand-holding-usd"></i>
          </div>
          <div className={styles.titleSection}>
            <h1 className={styles.title}>{t.emprunts.titre}</h1>
            <p className={styles.subtitle}>Suivi des emprunts, remboursements et taux d'intérêts</p>
          </div>
        </div>
        <button className={styles.addBtn}>
          <i className="fas fa-plus-circle"></i> Demander un emprunt
        </button>
      </header>

      {/* Stats */}
      <div className={styles.statsRow}>
        <div className={styles.statCard}>
          <div className={`${styles.statIcon} ${styles.statIconBlue}`}>
            <i className="fas fa-file-invoice-dollar"></i>
          </div>
          <div>
            <span className={styles.statLabel}>Total emprunts</span>
            <strong className={styles.statValue}>{totalLoans}</strong>
          </div>
        </div>
        <div className={styles.statCard}>
          <div className={`${styles.statIcon} ${styles.statIconGreen}`}>
            <i className="fas fa-spinner"></i>
          </div>
          <div>
            <span className={styles.statLabel}>En cours</span>
            <strong className={styles.statValue}>{activeLoans}</strong>
          </div>
        </div>
        <div className={styles.statCard}>
          <div className={`${styles.statIcon} ${styles.statIconPurple}`}>
            <i className="fas fa-coins"></i>
          </div>
          <div>
            <span className={styles.statLabel}>Montant total</span>
            <strong className={styles.statValue}>{formatAmount(totalAmount)} <small>XAF</small></strong>
          </div>
        </div>
      </div>

      {/* Search */}
      <div className={styles.searchBar}>
        <i className="fas fa-search"></i>
        <input 
          type="text" 
          placeholder={t.membres.rechercher} 
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* Loans Grid */}
      <div className={styles.grid}>
        {filtered.map((e) => {
          const total = (e.amount || 0) * (1 + (e.interestRate || 0)/100);
          const remaining = total - (e.refundedAmount || 0);
          const progress = total > 0 ? Math.round(((e.refundedAmount || 0) / total) * 100) : 0;
          return (
            <div key={e.id} className={styles.card}>
              <div className={styles.cardHeader}>
                <div className={styles.memberAvatar}>
                  {e.member?.user?.firstName?.[0]}{e.member?.user?.name?.[0]}
                </div>
                <div className={styles.memberInfo}>
                  <h3>{e.member?.user?.firstName} {e.member?.user?.name}</h3>
                  <span className={`${styles.badge} ${e.status === "ACTIVE" ? styles.badgeActive : styles.badgeCompleted}`}>
                    <i className={`fas fa-${e.status === "ACTIVE" ? "clock" : "check-circle"}`}></i>
                    {e.status === "ACTIVE" ? t.dashboard.active : t.dashboard.termine}
                  </span>
                </div>
              </div>
              <div className={styles.cardBody}>
                <div className={styles.loanStats}>
                  <div className={styles.loanStat}>
                    <i className="fas fa-money-bill-wave"></i>
                    <div>
                      <span>{t.emprunts.total}</span>
                      <strong>{formatAmount(total)} XAF</strong>
                    </div>
                  </div>
                  <div className={styles.loanStat}>
                    <i className="fas fa-hourglass-half"></i>
                    <div>
                      <span>{t.emprunts.restant}</span>
                      <strong className={styles.remaining}>{formatAmount(remaining)} XAF</strong>
                    </div>
                  </div>
                </div>
                <div className={styles.progressContainer}>
                  <div className={styles.progressText}>
                    <span>Remboursement</span>
                    <span className={styles.progressPercent}>{progress}%</span>
                  </div>
                  <div className={styles.progressBar}>
                    <div className={styles.progressFill} style={{ width: `${progress}%` }}></div>
                  </div>
                </div>
              </div>
              <div className={styles.cardFooter}>
                <a href={`/admin/emprunts/${e.id}`} className={styles.detailsBtn}>
                  <i className="fas fa-eye"></i> {t.dashboard.details}
                </a>
                {e.status === "ACTIVE" && (
                  <button className={styles.refundBtn}>
                    <i className="fas fa-undo"></i> {t.emprunts.remboursement}
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Empty State */}
      {filtered.length === 0 && (
        <div className={styles.emptyState}>
          <div className={styles.emptyIcon}>
            <i className="fas fa-hand-holding-usd"></i>
          </div>
          <h3>Aucun emprunt enregistr{"é"}</h3>
          <p>Les emprunts des membres apparaîtront ici une fois cr{"éé"}s.</p>
        </div>
      )}
    </div>
  );
}
