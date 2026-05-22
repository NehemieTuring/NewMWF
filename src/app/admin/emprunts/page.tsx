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
  const totalAmount = loans.reduce((sum, l) => sum + (l.requestedAmount || 0), 0);

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

      {/* Loans Table */}
      {filtered.length > 0 && (
        <div className={styles.tableCard}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th style={{ width: "60px" }}></th>
                <th>Membre</th>
                <th>Montant Emprunté</th>
                <th>Reste à Payer</th>
                <th>Progression</th>
                <th>Statut</th>
                <th style={{ textAlign: "right" }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((e) => {
                const total = e.requestedAmount || 0;
                const remaining = e.remainingBalance || 0;
                const refunded = total - remaining;
                const progress = total > 0 ? Math.round((refunded / total) * 100) : 0;

                return (
                  <tr key={e.id}>
                    <td>
                      <div className={styles.memberAvatar} style={{ width: "40px", height: "40px", fontSize: "0.8rem", borderRadius: "10px" }}>
                        {e.member?.user?.firstName?.[0]}{e.member?.user?.name?.[0]}
                      </div>
                    </td>
                    <td>
                      <div style={{ display: "flex", flexDirection: "column" }}>
                        <span style={{ fontWeight: 700, color: "#2d3748" }}>{e.member?.user?.firstName} {e.member?.user?.name}</span>
                        <span style={{ fontSize: "0.75rem", color: "#a0aec0" }}>{e.member?.username}</span>
                      </div>
                    </td>
                    <td>
                      <strong style={{ color: "#2d3748" }}>{formatAmount(total)} XAF</strong>
                    </td>
                    <td>
                      <strong className={styles.remaining}>{formatAmount(remaining)} XAF</strong>
                    </td>
                    <td>
                      <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                        <div className={styles.progressMini}>
                          <div className={styles.progressMiniFill} style={{ width: `${progress}%` }}></div>
                        </div>
                        <span style={{ fontSize: "0.75rem", fontWeight: 800, color: "#4e73df" }}>{progress}%</span>
                      </div>
                    </td>
                    <td>
                      <span className={`${styles.badge} ${e.status === "ACTIVE" ? styles.badgeActive : styles.badgeCompleted}`}>
                        {e.status === "ACTIVE" ? t.dashboard.active : t.dashboard.termine}
                      </span>
                    </td>
                    <td>
                      <div style={{ display: "flex", justifyContent: "flex-end", gap: "0.5rem" }}>
                        <a href={`/admin/emprunts/${e.id}`} className={styles.detailsBtn} style={{ padding: "0.5rem 0.75rem", fontSize: "0.75rem" }}>
                          <i className="fas fa-eye"></i>Détails
                        </a>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

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
