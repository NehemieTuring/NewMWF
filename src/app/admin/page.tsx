"use client";

import { useEffect, useState, useMemo } from "react";
import styles from "./admin-dashboard.module.css";
import { useTranslation } from "@/context/LanguageContext";
import { secretaryService } from "@/services/secretaryService";

export default function AdminDashboard() {
  const { t, locale } = useTranslation();
  const [showSessionModal, setShowSessionModal] = useState(false);
  const [stats, setStats] = useState<any>(null);
  const [activeHelps, setActiveHelps] = useState<any[]>([]);
  const [activeLoans, setActiveLoans] = useState<any[]>([]);
  const [unreadMessages, setUnreadMessages] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadDashboardData() {
      try {
        const [statsData, helpsData, loansData, unreadData] = await Promise.all([
          secretaryService.getGlobalTransactions(),
          secretaryService.getActiveHelps(),
          secretaryService.getAllLoans(),
          secretaryService.getUnreadCount().catch(() => ({ count: 0 })),
        ]);
        
        setStats(statsData);
        setActiveHelps(Array.isArray(helpsData) ? helpsData.slice(0, 3) : []);
        setActiveLoans(Array.isArray(loansData) ? loansData.filter((l: any) => l.status === 'ACTIVE').slice(0, 3) : []);
        setUnreadMessages(unreadData?.count || 0);
      } catch (err: any) {
        console.error("Dashboard data load error:", err);
        setError(err.message || "Impossible de charger les données du tableau de bord");
      } finally {
        setLoading(false);
      }
    }
    loadDashboardData();
  }, []);

  function formatAmount(n: number) {
    return (n || 0).toLocaleString(locale === "fr" ? "fr-FR" : "en-US");
  }

  if (loading && !stats) {
    return (
      <div className={styles.loading}>
        <i className={`fas fa-circle-notch ${styles.loadingSpinner}`}></i>
        <p>Préparation du portail de la Secrétaire Générale...</p>
      </div>
    );
  }

  return (
    <div className={styles.dashboard}>
      <header style={{ marginBottom: '-1rem' }}>
        <h1 style={{ fontSize: '1.8rem', fontWeight: 900, color: '#2d3748' }}>Tableau de Bord</h1>
        <p style={{ color: '#718096', fontWeight: 600 }}>Bienvenue dans votre espace de pilotage, Secrétaire Générale</p>
      </header>

      {/* Session Banner */}
      <div className={styles.sessionBanner}>
        <div className={styles.sessionInfo}>
          {stats?.activeSession ? (
            <>
              <div className={styles.sessionBadge}>
                <div className={styles.sessionBadgeDot}></div>
                {t.dashboard.sessionActive}
              </div>
              <h2 className={styles.sessionTitle}>{stats.activeSession.name}</h2>
              <p className={styles.sessionExercise}>Exercice Budgétaire {stats.activeSession.exerciseYear}</p>
            </>
          ) : (
            <>
              <div className={styles.sessionBadge} style={{ background: '#fef3f2', color: '#b91c1c' }}>
                <i className="fas fa-exclamation-triangle"></i>
                {t.dashboard.aucuneSession}
              </div>
              <h2 className={styles.sessionTitle}>Prêt pour une session ?</h2>
              <p className={styles.sessionExercise}>{t.dashboard.demarrerSession}</p>
            </>
          )}
        </div>
        <div className={styles.sessionActions}>
          {unreadMessages > 0 && (
            <a href="/admin/chat" className={styles.sessionBtn} style={{ background: '#f59e0b', boxShadow: '0 4px 15px rgba(245, 158, 11, 0.2)' }}>
              <i className="fas fa-comment-alt"></i>
              {unreadMessages} Nouveaux messages
            </a>
          )}
          {stats?.activeSession ? (
            <button className={`${styles.sessionBtn} ${styles.sessionBtnDanger}`} onClick={() => { if(window.confirm("Voulez-vous clôturer cette session ?")) secretaryService.closeSession(stats.activeSession.id).then(() => window.location.reload()) }}>
              <i className="fas fa-lock"></i>
              {t.dashboard.cloturerSession}
            </button>
          ) : (
            <button className={styles.sessionBtn} onClick={() => setShowSessionModal(true)}>
              <i className="fas fa-plus"></i>
              {t.dashboard.nouvelleSession}
            </button>
          )}
        </div>
      </div>

      {/* Stats Grid */}
      <div className={styles.statsGrid}>
        <div className={styles.statCard}>
          <div className={styles.statIcon} style={{ background: "rgba(56, 161, 105, 0.1)", color: "#38a169" }}>
            <i className="fas fa-user-plus"></i>
          </div>
          <div className={styles.statContent}>
            <span className={styles.statLabel}>Adhésions</span>
            <div className={styles.statValueContainer}>
              <span className={styles.statValue}>{formatAmount(stats?.totalEnrollments)}</span>
              <span className={styles.statUnit}>XAF</span>
            </div>
          </div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statIcon} style={{ background: "rgba(78, 115, 223, 0.1)", color: "#4e73df" }}>
            <i className="fas fa-shield-alt"></i>
          </div>
          <div className={styles.statContent}>
            <span className={styles.statLabel}>Fonds Social</span>
            <div className={styles.statValueContainer}>
              <span className={styles.statValue}>{formatAmount(stats?.totalSocialFunds)}</span>
              <span className={styles.statUnit}>XAF</span>
            </div>
          </div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statIcon} style={{ background: "rgba(33, 147, 176, 0.1)", color: "#2193b0" }}>
            <i className="fas fa-piggy-bank"></i>
          </div>
          <div className={styles.statContent}>
            <span className={styles.statLabel}>Épargnes Totales</span>
            <div className={styles.statValueContainer}>
              <span className={styles.statValue}>{formatAmount(stats?.totalSavings)}</span>
              <span className={styles.statUnit}>XAF</span>
            </div>
          </div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statIcon} style={{ background: "rgba(245, 101, 101, 0.1)", color: "#e53e3e" }}>
            <i className="fas fa-university"></i>
          </div>
          <div className={styles.statContent}>
            <span className={styles.statLabel}>Volume d'Emprunts</span>
            <div className={styles.statValueContainer}>
              <span className={styles.statValue}>{formatAmount(stats?.totalLoans)}</span>
              <span className={styles.statUnit}>XAF</span>
            </div>
          </div>
        </div>
      </div>

      {/* Info Grid */}
      <div className={styles.infoGrid}>
        {/* Aides */}
        <div className={styles.infoCard}>
          <div className={styles.infoCardHeader}>
            <h3><i className="fas fa-heart"></i> {t.dashboard.aidesActives}</h3>
            <a href="/admin/aides" className={styles.viewAllLink}>
              Tout voir <i className="fas fa-chevron-right" style={{ fontSize: '0.7rem' }}></i>
            </a>
          </div>
          <div className={styles.infoCardBody}>
            {activeHelps.length > 0 ? activeHelps.map((help) => {
              const current = help.currentAmount || 0;
              const target = help.targetAmount || 1;
              const progress = Math.min(100, Math.round((current / target) * 100));
              return (
                <div key={help.id} className={styles.listItem}>
                  <div className={styles.itemHeader}>
                    <div className={styles.itemAvatar}>
                      <i className="fas fa-hands-helping"></i>
                    </div>
                    <div className={styles.itemMeta}>
                      <span className={styles.itemName}>{help.beneficiary?.user?.firstName} {help.beneficiary?.user?.name}</span>
                      <span className={styles.itemSub}>{help.type?.name}</span>
                    </div>
                  </div>
                  <div className={styles.progressSection}>
                    <div className={styles.progressBar}>
                      <div className={styles.progressFill} style={{ width: `${progress}%`, background: 'linear-gradient(90deg, #38a169, #48bb78)' }}></div>
                    </div>
                    <div className={styles.progressInfo}>
                      <span className={styles.amountText}>{formatAmount(current)} / {formatAmount(target)}</span>
                      <span className={styles.percentText} style={{ color: '#38a169' }}>{progress}%</span>
                    </div>
                  </div>
                </div>
              );
            }) : (
              <div style={{ textAlign: 'center', padding: '2rem', color: '#a0aec0' }}>Aucune aide active en ce moment</div>
            )}
            <a href="/admin/aies/nouveau" className={styles.addBtn}>
              <i className="fas fa-plus-circle"></i> Enregistrer une nouvelle aide
            </a>
          </div>
        </div>

        {/* Emprunts */}
        <div className={styles.infoCard}>
          <div className={styles.infoCardHeader}>
            <h3><i className="fas fa-wallet"></i> {t.dashboard.empruntsActifs}</h3>
            <a href="/admin/emprunts" className={styles.viewAllLink}>
              Tout voir <i className="fas fa-chevron-right" style={{ fontSize: '0.7rem' }}></i>
            </a>
          </div>
          <div className={styles.infoCardBody}>
            {activeLoans.length > 0 ? activeLoans.map((loan) => {
              const refunded = loan.refundedAmount || 0;
              const total = (loan.amount || 0) * (1 + (loan.interestRate || 0)/100);
              const progress = Math.min(100, Math.round((refunded / total) * 100));
              return (
                <div key={loan.id} className={styles.listItem}>
                  <div className={styles.itemHeader}>
                    <div className={styles.itemAvatar} style={{ color: '#e53e3e' }}>
                      <i className="fas fa-hand-holding-usd"></i>
                    </div>
                    <div className={styles.itemMeta}>
                      <span className={styles.itemName}>{loan.member?.user?.firstName} {loan.member?.user?.name}</span>
                      <span className={styles.itemSub}>Échéance : {loan.endDate ? new Date(loan.endDate).toLocaleDateString() : "Non définie"}</span>
                    </div>
                  </div>
                  <div className={styles.progressSection}>
                    <div className={styles.progressBar}>
                      <div className={styles.progressFill} style={{ width: `${progress}%`, background: 'linear-gradient(90deg, #e53e3e, #f56565)' }}></div>
                    </div>
                    <div className={styles.progressInfo}>
                      <span className={styles.amountText}>{formatAmount(refunded)} / {formatAmount(total)}</span>
                      <span className={styles.percentText} style={{ color: '#e53e3e' }}>{progress}%</span>
                    </div>
                  </div>
                </div>
              );
            }) : (
              <div style={{ textAlign: 'center', padding: '2rem', color: '#a0aec0' }}>Aucun emprunt actif à signaler</div>
            )}
            <a href="/admin/emprunts" className={styles.addBtn}>
               Gérer les demandes de prêt
            </a>
          </div>
        </div>
      </div>

      {/* New Session Modal */}
      {showSessionModal && (
        <div className={styles.modalOverlay} onClick={() => setShowSessionModal(false)}>
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h3>Lancer une nouvelle Session</h3>
              <button className={styles.modalClose} onClick={() => setShowSessionModal(false)}>
                <i className="fas fa-times"></i>
              </button>
            </div>
            <form className={styles.modalBody} onSubmit={(e) => { e.preventDefault(); /* Logic to create session */ }}>
              <div className={styles.formGroup}>
                <label>Nom de la Session (optionnel)</label>
                <input type="text" className={styles.formInput} placeholder="Ex: Session de Mars 2026" />
              </div>
              <div className={styles.formGroup}>
                <label>Date de la Session</label>
                <input type="date" className={styles.formInput} defaultValue={new Date().toISOString().split('T')[0]} />
              </div>
              <div className={styles.modalActions}>
                <button type="button" className={styles.cancelBtn} onClick={() => setShowSessionModal(false)}>
                  {t.dashboard.annuler}
                </button>
                <button type="submit" className={styles.submitBtn}>
                  Confirmer et Ouvrir la Session
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

