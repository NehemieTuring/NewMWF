"use client";

import { useEffect, useState } from "react";
import styles from "./agape.module.css";
import { useTranslation } from "@/context/LanguageContext";

export default function AgapePage() {
  const { t, locale } = useTranslation();
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Assuming a future endpoint, but for now we just show empty
    const fetchEvents = async () => {
      try {
        // const data = await secretaryService.getAgapeEvents();
        // setEvents(data);
        setEvents([]);
      } catch (err) {
        console.error("Failed to fetch agape events", err);
      } finally {
        setLoading(false);
      }
    };
    fetchEvents();
  }, []);

  if (loading) {
    return (
      <div className={styles.loading}>
        <i className="fas fa-spinner fa-spin"></i>
        <span>Chargement des événements...</span>
      </div>
    );
  }

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <div className={styles.titleSection}>
          <h1 className={styles.title}>{t.admin.agape}</h1>
          <p className={styles.subtitle}>Organisation d'événements sociaux et moments de partage</p>
        </div>
        <button className={styles.addBtn}>
          <i className="fas fa-calendar-plus"></i> Prévoir un Agape
        </button>
      </header>

      <div className={styles.content}>
        {events.length > 0 ? (
          <div className={styles.timeline}>
            {events.map((event) => (
              <div key={event.id} className={styles.eventItem}>
                <div className={styles.eventDate}>
                  <span className={styles.day}>{new Date(event.date).getDate()}</span>
                  <span className={styles.month}>{new Date(event.date).toLocaleDateString(locale === "fr" ? "fr-FR" : "en-US", { month: "short" })}</span>
                </div>
                <div className={styles.eventCard}>
                  <div className={styles.eventHeader}>
                    <h3>{event.name}</h3>
                    <span className={styles.budget}>{event.budget.toLocaleString()} XAF</span>
                  </div>
                  <p className={styles.eventInfo}>
                    <i className="fas fa-users"></i> {event.participants} participants inscrits
                  </p>
                  <div className={styles.eventActions}>
                    <button className={styles.actionBtn}><i className="fas fa-eye"></i> Gérer l'événement</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className={styles.emptyState}>
            <div className={styles.emptyIcon}>
              <i className="fas fa-wine-glass-alt"></i>
            </div>
            <h3>Aucun Agape prévu</h3>
            <p>Les événements de partage et de convivialité apparaîtront ici dès qu'ils seront programmés.</p>
          </div>
        )}
      </div>
    </div>
  );
}
