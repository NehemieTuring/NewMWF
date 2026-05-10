"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import styles from "../session-details.module.css";
import { secretaryService } from "@/services/secretaryService";
import { useTranslation } from "@/context/LanguageContext";
import { useNotification } from "@/context/NotificationContext";

export default function SessionDetailsPage() {
  const { id } = useParams();
  const router = useRouter();
  const { t, locale } = useTranslation();
  const { showToast } = useNotification();
  
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadSessionDetails() {
      if (!id) return;
      try {
        setLoading(true);
        const bilan = await secretaryService.getSessionBilan(Number(id));
        setData(bilan);
      } catch (err: any) {
        setError(err.message || "Erreur lors du chargement des détails");
        showToast("Impossible de charger les données de la session", "error");
      } finally {
        setLoading(false);
      }
    }
    loadSessionDetails();
  }, [id, showToast]);

  function formatAmount(n: number) {
    return (n || 0).toLocaleString(locale === "fr" ? "fr-FR" : "en-US");
  }

  if (loading) {
    return (
      <div className={styles.loading}>
        <i className="fas fa-circle-notch fa-spin"></i>
        <span>{t.dashboard.chargement}...</span>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className={styles.page}>
        <header className={styles.header}>
          <div className={styles.titleSection}>
            <h1 className={styles.title}>Erreur</h1>
            <p className={styles.subtitle}>{error || "Données introuvables"}</p>
          </div>
          <button className={styles.backBtn} onClick={() => router.back()}>
            <i className="fas fa-arrow-left"></i> Retour
          </button>
        </header>
      </div>
    );
  }

  const transactions = data.recentTransactions || [];

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <div className={styles.titleSection}>
          <h1 className={styles.title}>Bilan de Session</h1>
          <p className={styles.subtitle}>Consultez l'activité financière détaillée de cette session</p>
        </div>
        <button type="button" className={styles.backBtn} onClick={() => router.push("/admin/sessions")}>
          <i className="fas fa-chevron-left"></i> Retour aux sessions
        </button>
      </header>

      <div className={styles.statsGrid}>
        <div className={styles.statCard}>
          <div className={styles.statIcon} style={{ background: "rgba(78, 115, 223, 0.1)", color: "#4e73df" }}>
            <i className="fas fa-piggy-bank"></i>
          </div>
          <div className={styles.statInfo}>
            <span className={styles.statLabel}>Épargnes Globales</span>
            <span className={styles.statValue}>{formatAmount(data.totalSavings)} XAF</span>
          </div>
        </div>

        <div className={styles.statCard}>
          <div className={styles.statIcon} style={{ background: "rgba(54, 185, 204, 0.1)", color: "#36b9cc" }}>
            <i className="fas fa-hand-holding-usd"></i>
          </div>
          <div className={styles.statInfo}>
            <span className={styles.statLabel}>Prêts Accordés</span>
            <span className={styles.statValue}>{formatAmount(data.totalLoans)} XAF</span>
          </div>
        </div>

        <div className={styles.statCard}>
          <div className={styles.statIcon} style={{ background: "rgba(28, 200, 138, 0.1)", color: "#1cc88a" }}>
            <i className="fas fa-undo"></i>
          </div>
          <div className={styles.statInfo}>
            <span className={styles.statLabel}>Remboursements</span>
            <span className={styles.statValue}>{formatAmount(data.totalRefunds)} XAF</span>
          </div>
        </div>

        <div className={styles.statCard}>
          <div className={styles.statIcon} style={{ background: "rgba(231, 74, 59, 0.1)", color: "#e74a3b" }}>
            <i className="fas fa-heart"></i>
          </div>
          <div className={styles.statInfo}>
            <span className={styles.statLabel}>Fonds Solidarité</span>
            <span className={styles.statValue}>{formatAmount(data.totalSocialFunds)} XAF</span>
          </div>
        </div>
      </div>

      <div className={styles.sectionTitle}>
        <i className="fas fa-history"></i> JOURNAL DES TRANSACTIONS
      </div>

      <div className={styles.tableCard}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Date</th>
              <th>Catégorie</th>
              <th>Description</th>
              <th style={{ textAlign: "right" }}>Montant</th>
            </tr>
          </thead>
          <tbody>
            {transactions.length > 0 ? (
              transactions.map((tx: any) => (
                <tr key={tx.id}>
                  <td>{new Date(tx.date).toLocaleDateString()}</td>
                  <td>
                    <span className={`${styles.badge} ${styles['badge_' + tx.type] || ''}`}>
                      {tx.type || "AUTRE"}
                    </span>
                  </td>
                  <td style={{ fontWeight: 700 }}>{tx.description}</td>
                  <td style={{ textAlign: "right" }} className={tx.amount > 0 ? styles.amount_pos : styles.amount_neg}>
                    {formatAmount(tx.amount)} XAF
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={4} style={{ textAlign: "center", padding: "4rem", color: "#a0aec0" }}>
                  Aucune transaction enregistrée pour cette session
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
