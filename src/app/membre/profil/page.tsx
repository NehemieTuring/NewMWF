"use client";

import { useState } from "react";
import styles from "./profil.module.css";
import { useTranslation } from "@/context/LanguageContext";

export default function MemberProfilPage() {
  const { t } = useTranslation();
  const [editing, setEditing] = useState(false);

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <div className={styles.avatarHuge}>
          JD
          <button className={styles.editAvatar}><i className="fas fa-camera"></i></button>
        </div>
        <div className={styles.headerInfo}>
          <h1 className={styles.name}>Jean Dupont</h1>
          <p className={styles.role}>Membre Titulaire - Matricule: ENSPY-237</p>
          <div className={styles.actions}>
            <button className={styles.btnPrimary} onClick={() => setEditing(!editing)}>
              <i className={`fas ${editing ? "fa-save" : "fa-edit"}`}></i>
              {editing ? "Enregistrer" : "Modifier le profil"}
            </button>
          </div>
        </div>
      </div>

      <div className={styles.grid}>
        <div className={styles.card}>
          <div className={styles.cardHeader}>
            <h3>Informations Personnelles</h3>
          </div>
          <div className={styles.cardBody}>
            <div className={styles.formGroup}>
              <label>Nom complet</label>
              <input type="text" value="Jean Dupont" readOnly={!editing} className={styles.input} />
            </div>
            <div className={styles.formGroup}>
              <label>Adresse Email</label>
              <input type="email" value="jean.dupont@enspy.cm" readOnly={!editing} className={styles.input} />
            </div>
            <div className={styles.formGroup}>
              <label>Téléphone</label>
              <input type="tel" value="+237 699 00 00 01" readOnly={!editing} className={styles.input} />
            </div>
          </div>
        </div>

        <div className={styles.card}>
          <div className={styles.cardHeader}>
            <h3>Finances & Paramètres</h3>
          </div>
          <div className={styles.cardBody}>
            <div className={styles.statRow}>
              <span>Solde Fond Social</span>
              <strong>75 000 XAF</strong>
            </div>
            <div className={styles.statRow}>
              <span>Épargne cumulée</span>
              <strong>500 000 XAF</strong>
            </div>
            <div className={styles.divider}></div>
            <button className={styles.btnOutline}>
              <i className="fas fa-key"></i>
              Changer le mot de passe
            </button>
            <div className={styles.divider}></div>
            <div className={styles.formGroup}>
              <label>Notifications Mobile</label>
              <div className={styles.toggleRow}>
                <span>Activé</span>
                <button className={`${styles.toggleBtn} ${styles.toggleOn}`}>
                  <div className={styles.toggleThumb}></div>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
