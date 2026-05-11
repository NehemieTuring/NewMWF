"use client";

import { useEffect, useState } from "react";
import { presidentService } from "@/services/presidentService";
import styles from "./president-dashboard.module.css";
import Link from "next/link";
import ServerDateTime from "@/components/ServerDateTime";

export default function PresidentDashboard() {
  const [data, setData] = useState<{
    stats: any;
    cashboxes: any;
    activeHelps: any[];
    recentLoans: any[];
    membersInRuleCount: number;
    membersNotInRuleCount: number;
    exercises: any[];
    unreadMessages: number;
  }>({
    stats: null,
    cashboxes: null,
    activeHelps: [],
    recentLoans: [],
    membersInRuleCount: 0,
    membersNotInRuleCount: 0,
    exercises: [],
    unreadMessages: 0,
  });
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadData() {
      try {
        const [
          transactionsData, 
          cashboxesData, 
          helpsData, 
          loansData, 
          inRuleData, 
          notInRuleData,
          exercisesData,
          unreadData
        ] = await Promise.all([
          presidentService.getGlobalTransactions(),
          presidentService.getCashboxes(),
          presidentService.getActiveHelps(),
          presidentService.getAllLoans(),
          presidentService.getMembersInRule(),
          presidentService.getMembersNotInRule(),
          presidentService.getExercises(),
          presidentService.getUnreadCount(),
        ]);

        setData({
          stats: transactionsData,
          cashboxes: cashboxesData,
          activeHelps: Array.isArray(helpsData) ? helpsData : [],
          recentLoans: Array.isArray(loansData) ? loansData.slice(0, 5) : [],
          membersInRuleCount: Array.isArray(inRuleData) ? inRuleData.length : (inRuleData?.length || 0),
          membersNotInRuleCount: Array.isArray(notInRuleData) ? notInRuleData.length : (notInRuleData?.length || 0),
          exercises: Array.isArray(exercisesData) ? exercisesData : [],
          unreadMessages: unreadData?.count || 0,
        });
      } catch (err: any) {
        console.error("Dashboard data load error:", err);
        setError(err.message || "Erreur lors du chargement des données");
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  if (loading) {
    return (
      <div className={styles.loading}>
        <i className={`fas fa-circle-notch ${styles.loadingSpinner}`}></i>
        <p>Chargement du tableau de bord présidentiel...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.error}>
        <i className="fas fa-exclamation-triangle"></i>
        <p>Erreur: {error}</p>
        <button onClick={() => window.location.reload()}>Réessayer</button>
      </div>
    );
  }

  const currentExercise = data.exercises.find(e => e.status === "ACTIVE") || data.exercises[0];

  return (
    <div className={styles.dashboard}>
      <header className={styles.header}>
        <div className={styles.titleSection}>
          <h1>Tableau de Bord Président</h1>
          <p>Bienvenue sur le portail de pilotage de la mutuelle ENSPY</p>
        </div>
        <ServerDateTime />
      </header>

      {/* Stats Grid */}
      <div className={styles.statsGrid}>
        <div className={styles.statCard}>
          <div className={`${styles.statIcon} ${styles.iconBlue}`}>
            <i className="fas fa-piggy-bank"></i>
          </div>
          <div className={styles.statInfo}>
            <span className={styles.statLabel}>Épargnes Totales</span>
            <h3 className={styles.statValue}>{data.stats?.totalSavings?.toLocaleString() || 0} <small>FCFA</small></h3>
          </div>
        </div>
        <div className={styles.statCard}>
          <div className={`${styles.statIcon} ${styles.iconGreen}`}>
            <i className="fas fa-hand-holding-usd"></i>
          </div>
          <div className={styles.statInfo}>
            <span className={styles.statLabel}>Emprunts Actifs</span>
            <h3 className={styles.statValue}>{data.stats?.totalBorrowings?.toLocaleString() || 0} <small>FCFA</small></h3>
          </div>
        </div>
        <div className={styles.statCard}>
          <div className={`${styles.statIcon} ${styles.iconOrange}`}>
            <i className="fas fa-users"></i>
          </div>
          <div className={styles.statInfo}>
            <span className={styles.statLabel}>Membres Actifs</span>
            <h3 className={styles.statValue}>{data.stats?.activeMembers || 0}</h3>
          </div>
        </div>
        <div className={styles.statCard}>
          <div className={`${styles.statIcon} ${styles.iconPurple}`}>
            <i className="fas fa-user-check"></i>
          </div>
          <div className={styles.statInfo}>
            <span className={styles.statLabel}>Membres en Règle</span>
            <h3 className={styles.statValue}>{data.membersInRuleCount} / {data.stats?.activeMembers || 0}</h3>
          </div>
        </div>
        {data.unreadMessages > 0 && (
          <div className={styles.statCard} style={{ border: '2px solid #4e73df' }}>
            <div className={`${styles.statIcon} ${styles.iconBlue}`} style={{ background: '#4e73df', color: 'white' }}>
              <i className="fas fa-envelope"></i>
            </div>
            <div className={styles.statInfo}>
              <span className={styles.statLabel}>Messages non lus</span>
              <h3 className={styles.statValue}>{data.unreadMessages}</h3>
              <Link href="/president/chat" style={{ fontSize: '0.7rem', fontWeight: 700, color: '#4e73df', textDecoration: 'none' }}>Voir la messagerie</Link>
            </div>
          </div>
        )}
      </div>

      <div className={styles.mainGrid}>
        <div className={styles.cardSection}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}><i className="fas fa-vault"></i> État des Caisses</h2>
          </div>
          <div className={styles.tableWrapper}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Nom de la Caisse</th>
                  <th className={styles.amount}>Solde Disponible</th>
                </tr>
              </thead>
              <tbody>
                {data.cashboxes?.cashboxes?.length > 0 ? (
                  data.cashboxes.cashboxes.map((box: any, idx: number) => (
                    <tr key={idx}>
                      <td>{box.name}</td>
                      <td className={styles.amount}>{box.balance?.toLocaleString()} FCFA</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={2} style={{ textAlign: "center", padding: "2rem" }}>Aucune donnée de caisse disponible</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div className={styles.cardSection}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}><i className="fas fa-life-ring"></i> Demandes d'Aides</h2>
            <Link href="/president/aides" className={styles.viewAll}>Voir tout</Link>
          </div>
          <div className={styles.helpList}>
            {data.activeHelps.length > 0 ? (
              data.activeHelps.slice(0, 4).map((help: any, idx: number) => (
                <div key={idx} className={styles.helpItem}>
                  <div className={styles.avatar}>
                    {help.memberName?.charAt(0) || "M"}
                  </div>
                  <div className={styles.helpInfo}>
                    <span className={styles.memberName}>{help.memberName}</span>
                    <span className={styles.helpType}>{help.type || "Aide sociale"}</span>
                  </div>
                  <div className={styles.helpAmount}>
                    {help.amount?.toLocaleString()} <small>FCFA</small>
                  </div>
                </div>
              ))
            ) : (
              <p style={{ textAlign: "center", color: "#718096", fontSize: "0.9rem" }}>Aucune demande d'aide active</p>
            )}
          </div>
        </div>
      </div>

      <div className={styles.cardSection}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}><i className="fas fa-receipt"></i> Emprunts Récents</h2>
          <Link href="/president/bilans" className={styles.viewAll}>Gérer les emprunts</Link>
        </div>
        <div className={styles.tableWrapper}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Membre</th>
                <th>Montant</th>
                <th>Date</th>
                <th>Statut</th>
              </tr>
            </thead>
            <tbody>
              {data.recentLoans.length > 0 ? (
                data.recentLoans.map((loan: any, idx: number) => (
                  <tr key={idx}>
                    <td style={{ fontWeight: 600 }}>{loan.memberName || `Membre #${loan.memberId}`}</td>
                    <td className={styles.amount}>{loan.amount?.toLocaleString()} FCFA</td>
                    <td>{loan.date ? new Date(loan.date).toLocaleDateString() : "N/A"}</td>
                    <td>
                      <span className={`${styles.badge} ${
                        loan.status === "APPROVED" ? styles.badgeSuccess : 
                        loan.status === "PENDING" ? styles.badgeWarning : 
                        styles.badgeDanger
                      }`}>
                        {loan.status}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} style={{ textAlign: "center", padding: "2rem" }}>Aucun emprunt enregistré récemment</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
