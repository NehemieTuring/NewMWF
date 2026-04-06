"use client";

import { useEffect, useState } from "react";
import styles from "./home.module.css";
import { useTranslation } from "@/context/LanguageContext";
import { memberService } from "@/services/memberService";
import { useAuth } from "@/context/AuthContext";

export default function MembreHome() {
  const { t, locale } = useTranslation();
  const { user } = useAuth();
  const [profile, setProfile] = useState<any>(null);
  const [debts, setDebts] = useState<any>(null);
  const [balance, setBalance] = useState(0);
  const [activeHelps, setActiveHelps] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadMemberData() {
      try {
        const [profileData, debtsData, balanceData, helpsData] = await Promise.all([
          memberService.getProfile(),
          memberService.getDebts(),
          memberService.getSavingBalance(),
          memberService.getActiveHelps(),
        ]);
        setProfile(profileData);
        setDebts(debtsData);
        setBalance(balanceData);
        setActiveHelps(helpsData);
      } catch (err: any) {
        console.error("Dashboard error:", err);
      } finally {
        setLoading(false);
      }
    }
    loadMemberData();
  }, []);

  function formatAmount(n: number) {
    return (n || 0).toLocaleString(locale === "fr" ? "fr-FR" : "en-US");
  }

  if (loading) return <div className={styles.loading}>Chargement de votre compte...</div>;

  return (
    <div className={styles.page}>
      <div className={styles.grid}>
        {/* News / Helps */}
        <div className={styles.newsSection}>
          <div className={styles.sectionHeader}>
            <h2><i className="fas fa-newspaper"></i> {t.common.actualites}</h2>
          </div>
          <div className={styles.newsList}>
            {activeHelps.map((help) => {
              const current = help.currentAmount || 0;
              const target = help.targetAmount || 1;
              const progress = Math.round((current / target) * 100);
              return (
                <div key={help.id} className={styles.newsCard}>
                  <div className={styles.newsHeader}>
                    <div className={styles.newsAvatar}>
                      {help.beneficiary?.user?.firstName?.[0]}{help.beneficiary?.user?.name?.[0]}
                    </div>
                    <div>
                      <h4 className={styles.newsType}>{help.type?.name}</h4>
                      <span className={styles.newsMember}>{help.beneficiary?.user?.firstName} {help.beneficiary?.user?.name}</span>
                    </div>
                  </div>
                  <p className={styles.newsComment}>{help.description}</p>
                  <div className={styles.newsProgress}>
                    <div className={styles.progressTrack}>
                      <div className={styles.progressFill} style={{ width: `${progress}%` }}></div>
                    </div>
                    <div className={styles.progressInfo}>
                      <span>{formatAmount(current)} / {formatAmount(target)} XAF</span>
                      <span className={styles.progressPercent}>{progress}%</span>
                    </div>
                  </div>
                </div>
              );
            })}
            {activeHelps.length === 0 && <p className={styles.empty}>Aucune actualité pour le moment.</p>}
          </div>
        </div>

        {/* Account Card */}
        <div className={styles.accountSection}>
          <div className={styles.accountCard}>
            <div className={styles.accountIcon}>
              <i className="fas fa-wallet"></i>
            </div>
            <h3>{t.common.votreCompte}</h3>
            <div className={styles.accountAmount}>
              <span className={styles.amountValue}>{formatAmount(balance)}</span>
              <span className={styles.amountCurrency}>XAF</span>
            </div>
            <p className={styles.accountLabel}>{t.common.fondSocialDisponible}</p>
            <div className={styles.accountActions}>
              <a href="/membre/payer" className={styles.payBtn}>
                <i className="fas fa-money-bill-wave"></i> {t.common.payer}
              </a>
              <a href="/membre/dette" className={styles.debtBtn}>
                <i className="fas fa-file-invoice-dollar"></i> {t.common.maDette}
              </a>
            </div>
          </div>

          {/* Quick Stats */}
          <div className={styles.quickStats}>
            <div className={styles.quickStat}>
              <div className={styles.quickStatIcon} style={{ background: "rgba(28,200,138,0.1)", color: "#1cc88a" }}>
                <i className="fas fa-piggy-bank"></i>
              </div>
              <div>
                <span className={styles.quickStatLabel}>{t.common.epargneTotale}</span>
                <strong className={styles.quickStatValue}>{formatAmount(balance)} XAF</strong>
              </div>
            </div>
            <div className={styles.quickStat}>
              <div className={styles.quickStatIcon} style={{ background: "rgba(246,194,62,0.1)", color: "#f6c23e" }}>
                <i className="fas fa-hand-holding-usd"></i>
              </div>
              <div>
                <span className={styles.quickStatLabel}>{t.common.empruntEnCours}</span>
                <strong className={styles.quickStatValue}>{formatAmount(debts?.totalDebts || 0)} XAF</strong>
              </div>
            </div>
            <div className={styles.quickStat}>
              <div className={styles.quickStatIcon} style={{ background: "rgba(78,115,223,0.1)", color: "#4e73df" }}>
                <i className="fas fa-user-check"></i>
              </div>
              <div>
                <span className={styles.quickStatLabel}>Statut</span>
                <strong className={styles.quickStatValue}>{profile?.active ? "En règle" : "Non à jour"}</strong>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
