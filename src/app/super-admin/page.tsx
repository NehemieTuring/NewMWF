"use client";

import { useState, useEffect } from "react";
import styles from "./dashboard.module.css";
import { useTranslation } from "@/context/LanguageContext";
import { getSuperDashboard, DashboardStats } from "@/services/superAdminService";
import ServerDateTime from "@/components/ServerDateTime";

export default function SuperAdminDashboard() {
  const { t, locale } = useTranslation();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadDashboard();
  }, []);

  async function loadDashboard() {
    try {
      console.log("Loading super admin dashboard stats...");
      setLoading(true);
      const data = await getSuperDashboard();
      console.log("Dashboard stats loaded successfully:", data);
      setStats(data);
    } catch (err: unknown) {
      console.error("Error loading dashboard stats:", err);
      setError(err instanceof Error ? err.message : t.superAdmin.erreur);
    } finally {
      setLoading(false);
    }
  }

  function formatAmount(n: number) {
    return n.toLocaleString(locale === "fr" ? "fr-FR" : "en-US");
  }

  if (loading) {
    return (
      <div className={styles.dashboard}>
        <div className={styles.loading}>
          <i className="fas fa-spinner"></i> {t.common.connexionEnCours}
        </div>
      </div>
    );
  }

  return (
    <div className={styles.dashboard}>
      {/* Welcome Banner */}
      <div className={styles.banner}>
        <div className={styles.bannerInfo}>
          <div className={styles.bannerBadge}>
            <i className="fas fa-crown"></i>
            Super Admin
          </div>
          <h2 className={styles.bannerTitle}>{t.superAdmin.tableauDeBord}</h2>
          <p className={styles.bannerSub}>{t.superAdmin.sousTitre}</p>
        </div>
      </div>

      {error && (
        <div className={styles.error}>
          <i className="fas fa-exclamation-triangle"></i> {error}
        </div>
      )}

      {/* Stats Grid */}
      <div className={styles.statsGrid}>
        <div className={styles.statCard}>
          <div className={styles.statIcon} style={{ background: "rgba(78,115,223,0.1)", color: "#4e73df" }}>
            <i className="fas fa-users"></i>
          </div>
          <div className={styles.statContent}>
            <span className={styles.statLabel}>{t.superAdmin.totalMembres}</span>
            <span className={styles.statValue}>{stats?.totalMembers ?? 0}</span>
          </div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statIcon} style={{ background: "rgba(28,200,138,0.1)", color: "#1cc88a" }}>
            <i className="fas fa-user-check"></i>
          </div>
          <div className={styles.statContent}>
            <span className={styles.statLabel}>{t.superAdmin.membresActifs}</span>
            <span className={styles.statValue}>{stats?.activeMembers ?? 0}</span>
          </div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statIcon} style={{ background: "rgba(78,115,223,0.1)", color: "#4e73df" }}>
            <i className="fas fa-check-circle"></i>
          </div>
          <div className={styles.statContent}>
            <span className={styles.statLabel}>{t.superAdmin.membresEnRegle}</span>
            <span className={styles.statValue}>{stats?.membersInRule ?? 0}</span>
          </div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statIcon} style={{ background: "rgba(231,74,59,0.1)", color: "#e74a3b" }}>
            <i className="fas fa-exclamation-circle"></i>
          </div>
          <div className={styles.statContent}>
            <span className={styles.statLabel}>{t.superAdmin.membresNonEnRegle}</span>
            <span className={styles.statValue}>{stats?.membersNotInRule ?? 0}</span>
          </div>
        </div>
      </div>

      {/* Cashboxes */}
      <div className={styles.cashboxSection}>
        <div className={styles.cashboxHeader}>
          <h3><i className="fas fa-cash-register"></i> {t.superAdmin.caisses}</h3>
        </div>
        <div className={styles.cashboxBody}>
          {stats?.cashboxes && stats.cashboxes.length > 0 ? (
            <div className={styles.cashboxGrid}>
              {stats.cashboxes.map((cb: any) => (
                <div key={cb.id} className={styles.cashboxCard}>
                  <div className={styles.cashboxName}>{cb.name}</div>
                  <div className={styles.cashboxBalance}>
                    {formatAmount(cb.balance)}
                    <span className={styles.cashboxUnit}>XAF</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p style={{ color: "var(--text-muted)", textAlign: "center", padding: "2rem" }}>
              ---
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
