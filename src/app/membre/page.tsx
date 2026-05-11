"use client";

import { useEffect, useState } from "react";
import styles from "./membre.module.css";
import { useTranslation } from "@/context/LanguageContext";
import { memberService } from "@/services/memberService";
import { presidentService } from "@/services/presidentService";
import { secretaryService } from "@/services/secretaryService";
import { treasurerService } from "@/services/treasurerService";
import { useAuth } from "@/context/AuthContext";
import Link from "next/link";
import { webSocketService } from "@/services/webSocketService";
import ServerDateTime from "@/components/ServerDateTime";

export default function MembreDashboard() {
  const { t, locale } = useTranslation();
  const { user } = useAuth();
  const [profile, setProfile] = useState<any>(null);
  const [debts, setDebts] = useState<any>(null);
  const [balance, setBalance] = useState(0);
  const [activeHelps, setActiveHelps] = useState<any[]>([]);
  const [borrowings, setBorrowings] = useState<any[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [adminStats, setAdminStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const role = user?.role?.toUpperCase();
  const subRole = user?.subRole?.toUpperCase();

  // Redirect Super Admin away if they land here
  useEffect(() => {
    if (role === "SUPER_ADMIN") {
      window.location.href = "/super-admin";
    }
  }, [role]);

  if (role === "SUPER_ADMIN") return null;

  useEffect(() => {
    async function loadData() {
      try {
        const [profileData, debtsData, balanceData, helpsData, unreadData, borrowData] = await Promise.all([
          memberService.getProfile().catch(() => null),
          memberService.getDebts().catch(() => null),
          memberService.getSavingBalance().catch(() => 0),
          memberService.getActiveHelps().catch(() => []),
          memberService.getUnreadCount().catch(() => 0),
          memberService.getMyBorrowings().catch(() => []),
        ]);
        setProfile(profileData);
        setDebts(debtsData || { totalDebts: 0 });
        setBalance(typeof balanceData === 'number' ? balanceData : 0);
        setActiveHelps(helpsData || []);
        setUnreadCount(unreadData || 0);
        setBorrowings(borrowData || []);

        if (role === "ADMIN") {
          try {
            if (subRole === "PRESIDENT") {
              const stats = await presidentService.getGlobalTransactions();
              setAdminStats(stats);
            } else if (subRole === "TRESORIER") {
              const cashData = await treasurerService.getCashboxes();
              setAdminStats(cashData);
            } else if (subRole === "SECRETAIRE_GENERALE") {
              const stats = await secretaryService.getGlobalTransactions();
              setAdminStats(stats);
            }
          } catch (e) {
            console.error("Failed to load admin insights:", e);
          }
        }
      } catch (err: any) {
        console.error("Dashboard error:", err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [role, subRole]);

  useEffect(() => {
    if (user?.id) {
        webSocketService.connect(
            user.id,
            () => setUnreadCount(prev => prev + 1), // Private msg -> increment
            () => setUnreadCount(prev => prev + 1), // Group msg -> increment (or handle differently)
            () => {}, // Update
            () => {}, // Status
            (count) => setUnreadCount(count) // Direct unread count update from server
        );
        return () => webSocketService.disconnect();
    }
  }, [user]);

  const totalDebtAmount = Array.isArray(debts) ? debts.reduce((sum, d) => sum + (d.amount || 0), 0) : (debts?.totalDebts || 0);

  function formatAmount(n: number) {
    return (n || 0).toLocaleString(locale === "fr" ? "fr-FR" : "en-US");
  }

  if (loading) {
    return (
      <div className={styles.container}>
        <div className={styles.loadingContainer}>
          <div className={styles.loadingSpinner}></div>
          <span className={styles.loadingText}>Chargement du tableau de bord...</span>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      {/* Animated Header */}
      <header className="fade-in-up" style={{ marginBottom: "2rem", display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "1rem" }}>
        <div>
          <h1 style={{ fontSize: "1.8rem", fontWeight: 800, color: "#2e3b4e", marginBottom: "0.25rem", letterSpacing: "-0.02em" }}>
            Bonjour, <span className="text-gradient">{profile?.user?.firstName || user?.username}</span> !
          </h1>
          <p style={{ color: "#858796", fontSize: "0.95rem" }}>Voici un aperçu de vos activités à la Mutuelle Néhémie.</p>
        </div>
        <ServerDateTime />
      </header>

      {/* Primary Stats Grid with stagger */}
      <div className={`${styles.dashboardGrid} stagger-children`}>
        <div className={styles.statCard}>
          <div className={styles.statIcon} style={{ background: "rgba(78,115,223,0.1)", color: "#4e73df" }}>
            <i className="fas fa-user-check"></i>
          </div>
          <div className={styles.statInfo}>
            <span className={styles.statLabel}>Statut Adhésion</span>
            <span className={styles.statValue} style={{ color: profile?.active ? "#1cc88a" : "#e74a3b", fontSize: "1.2rem" }}>
              {profile?.active ? "Actif / En Règle" : "Action Requise"}
            </span>
          </div>
        </div>

        <div className={styles.statCard}>
          <div className={styles.statIcon} style={{ background: "rgba(28,200,138,0.1)", color: "#1cc88a" }}>
            <i className="fas fa-piggy-bank"></i>
          </div>
          <div className={styles.statInfo}>
            <span className={styles.statLabel}>Solde Épargne</span>
            <span className={styles.statValue}>{formatAmount(balance)} <small>XAF</small></span>
          </div>
        </div>

        <div className={styles.statCard}>
          <div className={styles.statIcon} style={{ background: "rgba(246,194,62,0.1)", color: "#f6c23e" }}>
            <i className="fas fa-file-invoice-dollar"></i>
          </div>
          <div className={styles.statInfo}>
            <span className={styles.statLabel}>Dettes Totales</span>
            <span className={styles.statValue}>{formatAmount(totalDebtAmount)} <small>XAF</small></span>
          </div>
        </div>

        <Link href="/membre/emprunts" className={styles.statCard} style={{ textDecoration: "none" }}>
          <div className={styles.statIcon} style={{ background: "rgba(231,74,59,0.1)", color: "#e74a3b" }}>
            <i className="fas fa-hand-holding-usd"></i>
          </div>
          <div className={styles.statInfo}>
            <span className={styles.statLabel}>Emprunts Actifs</span>
            <span className={styles.statValue}>
              {borrowings.filter(b => b.status === "ACTIVE" || b.status === "APPROVED").length} en cours
            </span>
          </div>
        </Link>

        <Link href="/membre/messages" className={styles.statCard} style={{ textDecoration: "none" }}>
          <div className={styles.statIcon} style={{ background: "rgba(54,185,204,0.1)", color: "#36b9cc" }}>
            <i className="fas fa-comments"></i>
          </div>
          <div className={styles.statInfo}>
            <span className={styles.statLabel}>Messages</span>
            <span className={styles.statValue}>
              {unreadCount > 0 ? `${unreadCount} Non lus` : "Aucun message"}
            </span>
          </div>
        </Link>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: "2rem" }}>
        {/* Aides Section */}
        <section className="fade-in-up" style={{ animationDelay: "0.3s" }}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>Aides & Solidarités Actives</h2>
            <Link href="/membre/aides" style={{ fontSize: "0.85rem", color: "#4e73df", fontWeight: 600 }}>Voir tout →</Link>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            {activeHelps.slice(0, 3).map((help) => {
              const progress = Math.min(100, Math.round(((help.collectedAmount || 0) / (help.targetAmount || 1)) * 100));
              return (
                <div key={help.id} className={styles.dataCard}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.75rem" }}>
                    <div style={{ display: "flex", gap: "0.75rem", alignItems: "center" }}>
                      <div style={{ width: "40px", height: "40px", borderRadius: "12px", background: "linear-gradient(135deg, rgba(78,115,223,0.1), rgba(33,147,176,0.1))", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.9rem", color: "#4e73df" }}>
                        <i className="fas fa-hand-holding-heart"></i>
                      </div>
                      <div>
                        <h4 style={{ fontSize: "0.9rem", margin: 0, fontWeight: 700 }}>{help.helpType?.name}</h4>
                        <small style={{ color: "#858796" }}>{help.member?.user?.firstName} {help.member?.user?.name}</small>
                      </div>
                    </div>
                    <span style={{ fontSize: "0.8rem", fontWeight: 800, color: "#1cc88a", background: "rgba(28,200,138,0.08)", padding: "0.2rem 0.6rem", borderRadius: "8px", height: "fit-content" }}>{progress}%</span>
                  </div>
                  <div className={styles.progressTrack}>
                    <div className={styles.progressFill} style={{ width: `${progress}%` }}></div>
                  </div>
                </div>
              );
            })}
            {activeHelps.length === 0 && (
              <div className="empty-state">
                <i className="fas fa-heart"></i>
                <p>Aucune aide active pour le moment.</p>
              </div>
            )}
          </div>
        </section>

        {/* Quick Actions */}
        <section className="fade-in-up" style={{ animationDelay: "0.4s" }}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>Actions Rapides</h2>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
            <Link href="/membre/emprunts" style={{
              background: "linear-gradient(135deg, #4e73df, #224abe)",
              color: "white", padding: "1.15rem 1.25rem", borderRadius: "14px",
              textDecoration: "none", fontWeight: 600, display: "flex", alignItems: "center", gap: "0.75rem",
              transition: "all 0.3s ease", boxShadow: "0 4px 15px rgba(78,115,223,0.25)"
            }}>
              <i className="fas fa-hand-holding-usd" style={{ fontSize: "1.1rem" }}></i>
              Demander un emprunt
            </Link>
            <Link href="/membre/finances" style={{
              background: "white", color: "#4e73df", border: "2px solid rgba(78,115,223,0.2)",
              padding: "1.15rem 1.25rem", borderRadius: "14px",
              textDecoration: "none", fontWeight: 600, display: "flex", alignItems: "center", gap: "0.75rem",
              transition: "all 0.3s ease"
            }}>
              <i className="fas fa-plus-circle" style={{ fontSize: "1.1rem" }}></i>
              Faire une épargne
            </Link>
            <Link href="/membre/aides" style={{
              background: "#f8f9fc", color: "#2e3b4e",
              padding: "1.15rem 1.25rem", borderRadius: "14px",
              textDecoration: "none", fontWeight: 600, display: "flex", alignItems: "center", gap: "0.75rem",
              transition: "all 0.3s ease"
            }}>
              <i className="fas fa-heart" style={{ fontSize: "1.1rem", color: "#e74a3b" }}></i>
              Contribuer à une aide
            </Link>
            <Link href="/membre/profil" style={{
              background: "#f8f9fc", color: "#2e3b4e",
              padding: "1.15rem 1.25rem", borderRadius: "14px",
              textDecoration: "none", fontWeight: 600, display: "flex", alignItems: "center", gap: "0.75rem",
              transition: "all 0.3s ease"
            }}>
              <i className="fas fa-user-cog" style={{ fontSize: "1.1rem", color: "#36b9cc" }}></i>
              Mon Profil
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
}
