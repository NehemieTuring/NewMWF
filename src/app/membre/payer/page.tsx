"use client";

import { useEffect, useState } from "react";
import styles from "./payer.module.css";
import { useTranslation } from "@/context/LanguageContext";
import { memberService } from "@/services/memberService";

export default function MemberPayerPage() {
  const { t } = useTranslation();
  const [method, setMethod] = useState("om");
  const [sessions, setSessions] = useState<any[]>([]);
  const [debts, setDebts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const [sessionsData, debtsData] = await Promise.all([
          memberService.getSessions(),
          memberService.getDebts()
        ]);
        setSessions(Array.isArray(sessionsData) ? sessionsData.filter((s: any) => s.status === "ACTIVE") : []);
        setDebts(Array.isArray(debtsData) ? debtsData : []);
      } catch (err) {
        console.error("Failed to load payer data", err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  if (loading) return <div className={styles.loading}>Préparation du paiement...</div>;

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <h1 className={styles.title}>{t.common.payer}</h1>
        <p className={styles.subtitle}>Effectuer un versement sécurisé pour vos cotisations</p>
      </div>

      <div className={styles.container}>
        <div className={styles.paymentCard}>
          <div className={styles.formGroup}>
            <label>Type de versement</label>
            <select className={styles.select}>
              <option value="">Sélectionnez un type de versement</option>
              {sessions.map(s => (
                <option key={`session-${s.id}`} value={`session-${s.id}`}>
                  Épargne - Session {new Date(s.date).toLocaleDateString("fr-FR", { month: "long", year: "numeric" })}
                </option>
              ))}
              {debts.map(d => (
                <option key={`debt-${d.id}`} value={`debt-${d.id}`}>
                  {d.type || d.label || "Dette"} - {d.amount.toLocaleString()} XAF
                </option>
              ))}
              <option value="solidarity">Contribution Solidarité</option>
              <option value="social-fund">Fond Social Mensuel</option>
            </select>
          </div>

          <div className={styles.formGroup}>
            <label>Montant (XAF)</label>
            <input type="number" className={styles.input} placeholder="Ex: 25000" />
          </div>

          <div className={styles.methodGrid}>
            <div 
              className={`${styles.methodItem} ${method === "om" ? styles.methodActive : ""}`}
              onClick={() => setMethod("om")}
            >
              <div className={styles.methodCircle} style={{ background: "#ffcc00" }}>OM</div>
              <span>Orange Money</span>
            </div>
            <div 
              className={`${styles.methodItem} ${method === "momo" ? styles.methodActive : ""}`}
              onClick={() => setMethod("momo")}
            >
              <div className={styles.methodCircle} style={{ background: "#ffdd00", color: "#000" }}>MTN</div>
              <span>MTN MoMo</span>
            </div>
            <div 
              className={`${styles.methodItem} ${method === "card" ? styles.methodActive : ""}`}
              onClick={() => setMethod("card")}
            >
              <div className={styles.methodCircle} style={{ background: "#4e73df" }}><i className="fas fa-credit-card"></i></div>
              <span>Carte Bancaire</span>
            </div>
          </div>

          <button className={styles.submitBtn}>
            <i className="fas fa-lock"></i>
            Procéder au paiement sécurisé
          </button>
        </div>

        <div className={styles.helpDoc}>
          <h3><i className="fas fa-info-circle"></i> Besoin d'aide ?</h3>
          <p>Tous les versements sont soumis à validation par le trésorier. Un reçu numérique vous sera envoyé par email après confirmation.</p>
          <div className={styles.contactAdmin}>
            <i className="fas fa-headset"></i>
            <span>Support: +237 699 00 00 00</span>
          </div>
        </div>
      </div>
    </div>
  );
}
