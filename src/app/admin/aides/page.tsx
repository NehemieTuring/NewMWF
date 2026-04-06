"use client";

import { useEffect, useState } from "react";
import styles from "./aides.module.css";
import { useTranslation } from "@/context/LanguageContext";
import { secretaryService } from "@/services/secretaryService";

export default function AidesPage() {
  const { t, locale } = useTranslation();
  const [aides, setAides] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");

  useEffect(() => {
    async function loadAides() {
      try {
        const data = await secretaryService.getAllHelps();
        setAides(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    loadAides();
  }, []);

  const filtered = aides.filter(a => 
    `${a.beneficiary?.user?.firstName} ${a.beneficiary?.user?.name}`.toLowerCase().includes(search.toLowerCase()) || 
    a.type?.name?.toLowerCase().includes(search.toLowerCase())
  );

  function formatAmount(n: number) {
    return (n || 0).toLocaleString(locale === "fr" ? "fr-FR" : "en-US");
  }

  if (loading) return <div className={styles.loading}>Chargement des aides...</div>;
  if (error) return <div className={styles.error}>Erreur: {error}</div>;

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <div className={styles.titleSection}>
          <h1 className={styles.title}>{t.admin.aides}</h1>
          <p className={styles.subtitle}>Solidarité et aides aux membres de la mutuelle</p>
        </div>
        <button className={styles.addBtn}>
          <i className="fas fa-plus-circle"></i> Créer une nouvelle aide
        </button>
      </header>

      <div className={styles.searchBar}>
        <i className="fas fa-search"></i>
        <input 
          type="text" 
          placeholder={t.membres.rechercher} 
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className={styles.grid}>
        {filtered.map((a) => {
          const current = a.currentAmount || 0;
          const target = a.targetAmount || 1;
          const progress = Math.round((current / target) * 100);
          return (
            <div key={a.id} className={styles.card}>
              <div className={styles.cardHeader}>
                <div className={styles.aidTypeIcon}>
                  <i className="fas fa-hand-holding-heart"></i>
                </div>
                <div className={styles.aidInfo}>
                  <h3>{a.type?.name}</h3>
                  <span className={styles.aidMember}>{a.beneficiary?.user?.firstName} {a.beneficiary?.user?.name}</span>
                </div>
                <span className={`${styles.badge} ${a.status === "ACTIVE" ? styles.badgeActive : styles.badgeCompleted}`}>
                  {a.status === "ACTIVE" ? t.dashboard.active.toUpperCase() : t.dashboard.termine.toUpperCase()}
                </span>
              </div>
              <div className={styles.cardBody}>
                <div className={styles.aidStats}>
                  <div className={styles.stat}>
                    <span>{t.admin.objectif}</span>
                    <strong>{formatAmount(target)} XAF</strong>
                  </div>
                  <div className={styles.stat}>
                    <span>{t.admin.collecte}</span>
                    <strong className={styles.collected}>{formatAmount(current)} XAF</strong>
                  </div>
                </div>
                <div className={styles.progressBar}>
                  <div className={styles.progressFill} style={{ width: `${progress}%` }}></div>
                </div>
                <div className={styles.progressInfo}>
                  <span>{progress}% du montant total</span>
                  <span>{new Date(a.createdAt).toLocaleDateString(locale === "fr" ? "fr-FR" : "en-US")}</span>
                </div>
              </div>
              <div className={styles.cardFooter}>
                <a href={`/admin/aides/${a.id}`} className={styles.detailsBtn}>
                  <i className="fas fa-info-circle"></i> {t.dashboard.details}
                </a>
                {a.status === "ACTIVE" && (
                  <button className={styles.contributeBtn}>
                    <i className="fas fa-donate"></i> {t.admin.contribuer}
                  </button>
                )}
              </div>
            </div>
          );
        })}
        {filtered.length === 0 && (
          <div className={styles.emptyState}>
            <div className={styles.emptyIcon}>
              <i className="fas fa-hand-holding-heart"></i>
            </div>
            <h3>Aucune aide enregistrée</h3>
            <p>Les demandes d'aides et de solidarité apparaîtront ici.</p>
          </div>
        )}
      </div>
    </div>
  );
}

