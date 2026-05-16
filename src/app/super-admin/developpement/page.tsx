"use client";

import { useState, useEffect, useCallback } from "react";
import styles from "./dev.module.css";

interface ServerTime {
  dateTime: string;
  timestamp: number;
  timezone: string;
  formatted: string;
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api";

export default function DeveloppementPage() {
  const [serverTime, setServerTime] = useState<ServerTime | null>(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Form states
  const [isoDate, setIsoDate] = useState("");
  const [isoTime, setIsoTime] = useState("");
  const [addHours, setAddHours] = useState("");
  const [addDays, setAddDays] = useState("");

  const fetchServerTime = useCallback(async () => {
    console.log("🔄 Tentative de synchronisation de l'heure avec le backend...");
    try {
      const res = await fetch(`${API_BASE_URL}/system/time`);
      if (!res.ok) throw new Error("Impossible de récupérer l'heure du serveur");
      const data: ServerTime = await res.json();
      console.log("✅ Heure serveur récupérée :", data.dateTime);
      setServerTime(data);
      setError("");
    } catch (err: any) {
      console.error("❌ Erreur lors de la récupération de l'heure :", err);
      setError(err.message || "Erreur de connexion au serveur");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchServerTime();
    const interval = setInterval(fetchServerTime, 5000);
    return () => clearInterval(interval);
  }, [fetchServerTime]);

  const callSetTime = async (body: Record<string, string>, successMsg: string) => {
    console.log("📤 Envoi de la requête de modification d'heure :", body);
    setActionLoading(true);
    setError("");
    setSuccess("");
    try {
      const res = await fetch(`${API_BASE_URL}/system/time`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      
      console.log("📥 Réponse du serveur (status) :", res.status);
      
      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        console.error("❌ Le serveur a renvoyé une erreur :", errData);
        throw new Error(errData.error || "Erreur lors de la modification");
      }
      
      const data: ServerTime = await res.json();
      console.log("✅ Modification réussie ! Nouvelle heure :", data.dateTime);
      setServerTime(data);
      setSuccess(successMsg);
      setTimeout(() => setSuccess(""), 4000);
    } catch (err: any) {
      console.error("🔥 Exception lors de l'appel API :", err);
      setError(err.message || "Erreur inconnue");
    } finally {
      setActionLoading(false);
    }
  };

  const handleSetExactTime = () => {
    if (!isoDate || !isoTime) {
      setError("Veuillez remplir la date et l'heure");
      return;
    }
    callSetTime({ isoDateTime: `${isoDate}T${isoTime}` }, `✅ Heure définie à ${isoDate} ${isoTime}`);
  };

  const handleAddHours = () => {
    if (!addHours) { setError("Veuillez entrer un nombre d'heures"); return; }
    callSetTime({ addHours }, `✅ ${addHours} heure(s) ajoutée(s)`);
    setAddHours("");
  };

  const handleAddDays = () => {
    if (!addDays) { setError("Veuillez entrer un nombre de jours"); return; }
    callSetTime({ addDays }, `✅ ${addDays} jour(s) ajouté(s)`);
    setAddDays("");
  };

  const handleReset = () => {
    callSetTime({ reset: "true" }, "✅ Horloge réinitialisée à l'heure réelle");
  };

  // Quick actions
  interface QuickAction {
    label: string;
    icon: string;
    body: Record<string, string>;
    msg: string;
  }

  const quickActions: QuickAction[] = [
    { label: "+1 Heure", icon: "fas fa-clock", body: { addHours: "1" }, msg: "✅ +1 heure" },
    { label: "+6 Heures", icon: "fas fa-clock", body: { addHours: "6" }, msg: "✅ +6 heures" },
    { label: "+12 Heures", icon: "fas fa-clock", body: { addHours: "12" }, msg: "✅ +12 heures" },
    { label: "+1 Jour", icon: "fas fa-calendar-plus", body: { addDays: "1" }, msg: "✅ +1 jour" },
    { label: "+7 Jours", icon: "fas fa-calendar-plus", body: { addDays: "7" }, msg: "✅ +7 jours" },
    { label: "+30 Jours", icon: "fas fa-calendar-plus", body: { addDays: "30" }, msg: "✅ +30 jours" },
    { label: "-1 Jour", icon: "fas fa-calendar-minus", body: { addDays: "-1" }, msg: "✅ -1 jour" },
    { label: "-7 Jours", icon: "fas fa-calendar-minus", body: { addDays: "-7" }, msg: "✅ -7 jours" },
  ];

  if (loading) {
    return (
      <div className={styles.page}>
        <div className={styles.loadingState}>
          <i className="fas fa-circle-notch fa-spin"></i>
          <p>Connexion au serveur...</p>
        </div>
      </div>
    );
  }

  // Parse server time for display
  const serverDate = serverTime ? new Date(serverTime.dateTime) : null;
  const dayNames = ["Dimanche", "Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi"];

  return (
    <div className={styles.page}>
      {/* Page Header */}
      <header className={styles.header}>
        <div>
          <h1 className={styles.title}>
            <i className="fas fa-code"></i> Outils de Développement
          </h1>
          <p className={styles.subtitle}>
            Manipulation de l'horloge système du backend pour le développement et les tests.
          </p>
        </div>
        <div className={styles.profileBadge}>
          <i className="fas fa-flask"></i>
          Mode Dev
        </div>
      </header>

      {/* Alerts */}
      {error && (
        <div className={styles.alert + " " + styles.alertDanger}>
          <i className="fas fa-exclamation-triangle"></i>
          <span>{error}</span>
          <button onClick={() => setError("")}><i className="fas fa-times"></i></button>
        </div>
      )}
      {success && (
        <div className={styles.alert + " " + styles.alertSuccess}>
          <i className="fas fa-check-circle"></i>
          <span>{success}</span>
        </div>
      )}

      {/* Current Server Time Display */}
      <section className={styles.currentTimeCard}>
        <div className={styles.currentTimeHeader}>
          <div className={styles.liveIndicator}>
            <span className={styles.liveDot}></span>
            LIVE — Heure du Serveur
          </div>
          <span className={styles.timezone}>
            <i className="fas fa-globe"></i> {serverTime?.timezone || "N/A"}
          </span>
        </div>
        <div className={styles.currentTimeBody}>
          <div className={styles.bigTime}>
            {serverDate
              ? serverDate.getHours().toString().padStart(2, "0") + ":" +
                serverDate.getMinutes().toString().padStart(2, "0") + ":" +
                serverDate.getSeconds().toString().padStart(2, "0")
              : "--:--:--"}
          </div>
          <div className={styles.bigDate}>
            {serverDate
              ? `${dayNames[serverDate.getDay()]} ${serverDate.getDate()} ${
                  ["Janvier","Février","Mars","Avril","Mai","Juin","Juillet","Août","Septembre","Octobre","Novembre","Décembre"][serverDate.getMonth()]
                } ${serverDate.getFullYear()}`
              : "---"}
          </div>
          <div className={styles.rawIso}>
            <code>{serverTime?.dateTime || "N/A"}</code>
          </div>
        </div>
      </section>

      {/* Controls Grid */}
      <div className={styles.controlsGrid}>

        {/* 1. Set Exact Time */}
        <section className={styles.card}>
          <div className={styles.cardHeader}>
            <i className="fas fa-crosshairs"></i>
            <h3>Définir une Date & Heure Précise</h3>
          </div>
          <div className={styles.cardBody}>
            <p className={styles.cardDesc}>
              Remplace complètement l'horloge du backend par la date et l'heure spécifiées.
            </p>
            <div className={styles.formRow}>
              <div className={styles.formGroup}>
                <label><i className="fas fa-calendar-day"></i> Date</label>
                <input
                  type="date"
                  value={isoDate}
                  onChange={(e) => setIsoDate(e.target.value)}
                  className={styles.input}
                />
              </div>
              <div className={styles.formGroup}>
                <label><i className="fas fa-clock"></i> Heure</label>
                <input
                  type="time"
                  step="1"
                  value={isoTime}
                  onChange={(e) => setIsoTime(e.target.value)}
                  className={styles.input}
                />
              </div>
            </div>
            <button
              className={styles.btnPrimary}
              onClick={handleSetExactTime}
              disabled={actionLoading}
            >
              {actionLoading ? <i className="fas fa-spinner fa-spin"></i> : <i className="fas fa-check"></i>}
              Appliquer
            </button>
          </div>
        </section>

        {/* 2. Add Time */}
        <section className={styles.card}>
          <div className={styles.cardHeader}>
            <i className="fas fa-forward"></i>
            <h3>Avancer / Reculer le Temps</h3>
          </div>
          <div className={styles.cardBody}>
            <p className={styles.cardDesc}>
              Ajouter ou retirer des heures/jours à l'horloge actuelle du backend.
            </p>
            <div className={styles.formRow}>
              <div className={styles.formGroup}>
                <label><i className="fas fa-hourglass-half"></i> Heures</label>
                <div className={styles.inputGroup}>
                  <input
                    type="number"
                    placeholder="ex: 5 ou -3"
                    value={addHours}
                    onChange={(e) => setAddHours(e.target.value)}
                    className={styles.input}
                  />
                  <button className={styles.btnSmall} onClick={handleAddHours} disabled={actionLoading}>
                    <i className="fas fa-plus"></i>
                  </button>
                </div>
              </div>
              <div className={styles.formGroup}>
                <label><i className="fas fa-calendar-week"></i> Jours</label>
                <div className={styles.inputGroup}>
                  <input
                    type="number"
                    placeholder="ex: 7 ou -2"
                    value={addDays}
                    onChange={(e) => setAddDays(e.target.value)}
                    className={styles.input}
                  />
                  <button className={styles.btnSmall} onClick={handleAddDays} disabled={actionLoading}>
                    <i className="fas fa-plus"></i>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* Quick Actions */}
      <section className={styles.card} style={{ marginTop: "1.5rem" }}>
        <div className={styles.cardHeader}>
          <i className="fas fa-bolt"></i>
          <h3>Actions Rapides</h3>
        </div>
        <div className={styles.cardBody}>
          <div className={styles.quickGrid}>
            {quickActions.map((action) => (
              <button
                key={action.label}
                className={styles.quickBtn}
                onClick={() => callSetTime(action.body, action.msg)}
                disabled={actionLoading}
              >
                <i className={action.icon}></i>
                {action.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Reset Button */}
      <section className={styles.resetSection}>
        <button
          className={styles.btnReset}
          onClick={handleReset}
          disabled={actionLoading}
        >
          <i className="fas fa-undo-alt"></i>
          Réinitialiser à l'heure réelle
        </button>
        <p className={styles.resetHint}>
          Remet l'horloge du backend à l'heure système réelle de la machine.
        </p>
      </section>
    </div>
  );
}
