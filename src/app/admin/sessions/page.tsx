"use client";

import { useEffect, useState } from "react";
import styles from "./sessions.module.css";
import { useTranslation } from "@/context/LanguageContext";
import { secretaryService } from "@/services/secretaryService";
import { useNotification } from "@/context/NotificationContext";

export default function SessionsPage() {
  const { t, locale } = useTranslation();
  const { showToast, confirm } = useNotification();
  const [sessions, setSessions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadSessions() {
      try {
        const data = await secretaryService.getSessions();
        setSessions(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    loadSessions();
  }, []);

  const handleCloseSession = async (id: number) => {
    confirm({
      title: "Clôturer la session",
      message: "Voulez-vous vraiment clôturer cette session ? Cette action est irréversible.",
      type: "warning",
      confirmText: "Clôturer",
      onConfirm: async () => {
        try {
          await secretaryService.closeSession(id);
          showToast("Session clôturée avec succès !", "success");
          const data = await secretaryService.getSessions();
          setSessions(data);
        } catch (err: any) {
          showToast("Erreur: " + err.message, "error");
        }
      }
    });
  };

  function formatAmount(n: number) {
    return (n || 0).toLocaleString(locale === "fr" ? "fr-FR" : "en-US");
  }

  if (loading) return <div className={styles.loading}>Chargement des sessions...</div>;
  if (error) return <div className={styles.error}>Erreur: {error}</div>;

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <div className={styles.titleSection}>
          <h1 className={styles.title}>{t.sessions.titre}</h1>
          <p className={styles.subtitle}>{sessions.length} sessions au total pour cet exercice financier</p>
        </div>
        <button type="button" className={styles.addBtn}>
          <i className="fas fa-calendar-plus"></i> Créer une nouvelle session
        </button>
      </header>

      <div className={styles.grid}>
        {sessions.map((session) => (
          <div key={session.id} className={`${styles.card} ${(session.state === "OPEN" || session.state === "SAVING") ? styles.cardActive : ""}`}>
            <div className={styles.cardHeader}>
              <div className={styles.dateIcon}>
                <i className="far fa-calendar-alt"></i>
              </div>
              <div className={styles.sessionStatus}>
                <span className={`${styles.badge} ${(session.state === "OPEN" || session.state === "SAVING") ? styles.badgeActive : styles.badgeInactive}`}>
                  {(session.state === "OPEN" || session.state === "SAVING") ? t.dashboard.active.toUpperCase() : t.dashboard.termine.toUpperCase()}
                </span>
              </div>
            </div>
            <div className={styles.cardBody}>
              <h3 className={styles.sessionDate}>{new Date(session.date).toLocaleDateString(locale === "fr" ? "fr-FR" : "en-US", { day: "numeric", month: "long", year: "numeric" })}</h3>
              <p className={styles.sessionExercice}>{t.sessions.exercice}: <strong>{session.exercise?.year || session.exerciseYear || "N/A"}</strong></p>
              <div className={styles.sessionBrief}>
                 <span>Nom: {session.name || `Session #${session.sessionNumber}`}</span>
              </div>
            </div>
            <div className={styles.cardFooter}>
              <button 
                type="button"
                onClick={() => window.location.href = `/admin/sessions/${session.id}`} 
                className={styles.detailsBtn}
              >
                <i className="fas fa-eye"></i> {t.dashboard.details}
              </button>
              {(session.state === "OPEN" || session.state === "SAVING") && (
                <button type="button" className={`${styles.detailsBtn} ${styles.closeBtn}`} onClick={() => handleCloseSession(session.id)}>
                  <i className="fas fa-lock"></i> {t.sessions.cloturer}
                </button>
              )}
            </div>
          </div>
        ))}
        {sessions.length === 0 && (
          <div className={styles.emptyState}>
            <div className={styles.emptyIcon}>
              <i className="fas fa-calendar-times"></i>
            </div>
            <h3>Aucune session en cours</h3>
            <p>Les sessions de pointage et de paiement apparaîtront ici.</p>
          </div>
        )}
      </div>
    </div>
  );
}

