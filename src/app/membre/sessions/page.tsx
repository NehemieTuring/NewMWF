"use client";

import { useEffect, useState } from "react";
import styles from "./sessions.module.css";
import { useTranslation } from "@/context/LanguageContext";
import { memberService } from "@/services/memberService";

export default function MemberSessionsPage() {
  const { t, locale } = useTranslation();
  const [sessions, setSessions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadSessions() {
      try {
        const data = await memberService.getSessions();
        setSessions(data || []);
      } catch (err) {
        console.error("Failed to load sessions", err);
      } finally {
        setLoading(false);
      }
    }
    loadSessions();
  }, []);

  if (loading) return <div className={styles.loading}>Chargement des sessions...</div>;

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <h1 className={styles.title}>{t.admin.sessions}</h1>
        <p className={styles.subtitle}>Liste des sessions de la mutuelle</p>
      </div>

      <div className={styles.grid}>
        {sessions.length > 0 ? (
          sessions.map((s) => (
            <div key={s.id} className={styles.card}>
              <div className={styles.cardHeader}>
                <div className={styles.icon}><i className="fas fa-calendar-check"></i></div>
                <h3>{new Date(s.date).toLocaleDateString(locale === "fr" ? "fr-FR" : "en-US", { month: "long", year: "numeric", day: "numeric" })}</h3>
              </div>
              <div className={styles.cardBody}>
                <span className={`${styles.badge} ${s.status === "ACTIVE" ? styles.badgeActive : styles.badgeClosed}`}>
                  {s.status === "ACTIVE" ? t.dashboard.active.toUpperCase() : "FERMÉE"}
                </span>
                {s.type && <p className={styles.sessionType}>{s.type}</p>}
              </div>
              <div className={styles.cardFooter}>
                <button className={styles.detailsBtn}>Détails de la session</button>
              </div>
            </div>
          ))
        ) : (
          <div className={styles.empty}>
            <i className="fas fa-calendar-times" style={{ display: 'block', fontSize: '3rem', marginBottom: '1rem', opacity: 0.3 }}></i>
            Aucune session disponible.
          </div>
        )}
      </div>
    </div>
  );
}
