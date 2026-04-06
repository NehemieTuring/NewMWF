"use client";

import { useState } from "react";
import styles from "./payer.module.css";
import { useTranslation } from "@/context/LanguageContext";

export default function MemberPayerPage() {
  const { t } = useTranslation();
  const [method, setMethod] = useState("om");

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
              <option>Épargne session Mars 2026</option>
              <option>Remboursement Prêt L-001</option>
              <option>Aide Médicale (Solidarité)</option>
              <option>Fond Social Mensuel</option>
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
