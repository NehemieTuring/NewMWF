"use client";

import { useEffect, useState } from "react";
import styles from "./president-profil.module.css";
import { useTranslation } from "@/context/LanguageContext";
import { presidentService } from "@/services/presidentService";
import { useAuth } from "@/context/AuthContext";

export default function PresidentProfilPage() {
  const { t } = useTranslation();
  const { user: authUser } = useAuth();
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    async function loadProfile() {
      try {
        const data = await presidentService.getProfile();
        // Handle both flattened and nested profile structures
        setProfile(data);
      } catch (err: any) {
        console.error("Profile load error:", err);
        setError(err.message || "Erreur lors du chargement du profil");
      } finally {
        setLoading(false);
      }
    }
    loadProfile();
  }, []);

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPassword) return;
    setLoading(true);
    setError("");
    setSuccess("");
    try {
      await presidentService.updatePassword(newPassword);
      setSuccess("Mot de passe mis à jour avec succès !");
      setNewPassword("");
    } catch (err: any) {
      console.error("Password change error:", err);
      setError(err.message || "Erreur lors du changement de mot de passe");
    } finally {
      setLoading(false);
    }
  };

  if (loading && !profile) {
    return (
      <div className={styles.loading}>
        <i className={`fas fa-circle-notch ${styles.spinner}`}></i>
        <p>Préparation de votre compte...</p>
      </div>
    );
  }

  // Resilient data access
  const userData = profile?.user || profile;
  const initials = (userData?.firstName?.[0] || "") + (userData?.name?.[0] || "");

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div className={styles.avatarContainer}>
          <div className={styles.avatarLarge}>
            {initials || <i className="fas fa-user-tie"></i>}
          </div>
        </div>
        <div className={styles.titleSection}>
          <h1>{t.common.monProfil}</h1>
          <p style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 700, color: '#4e73df' }}>
            <i className="fas fa-user-shield"></i> Président : @{userData?.username || authUser?.email?.split('@')[0]}
          </p>
          <p>Bienvenue sur votre espace de gestion personnelle</p>
        </div>
      </header>

      <div className={styles.grid}>
        <div className={styles.card}>
          <h2 className={styles.sectionTitle}><i className="fas fa-id-card"></i> Identité du Président</h2>
          <div className={styles.infoList}>
            <div className={styles.infoItem}>
              <div className={styles.infoIcon}><i className="fas fa-user"></i></div>
              <div className={styles.infoDetails}>
                <span className={styles.infoLabel}>NOM COMPLET</span>
                <span className={styles.infoValue}>{userData?.firstName} {userData?.name}</span>
              </div>
            </div>
            <div className={styles.infoItem}>
              <div className={styles.infoIcon}><i className="fas fa-envelope"></i></div>
              <div className={styles.infoDetails}>
                <span className={styles.infoLabel}>ADRESSE E-MAIL</span>
                <span className={styles.infoValue}>{userData?.email || "Non renseignée"}</span>
              </div>
            </div>
            <div className={styles.infoItem}>
              <div className={styles.infoIcon}><i className="fas fa-phone"></i></div>
              <div className={styles.infoDetails}>
                <span className={styles.infoLabel}>TÉLÉPHONE</span>
                <span className={styles.infoValue}>{userData?.tel || "Non renseigné"}</span>
              </div>
            </div>
            <div className={styles.infoItem}>
              <div className={styles.infoIcon}><i className="fas fa-map-marker-alt"></i></div>
              <div className={styles.infoDetails}>
                <span className={styles.infoLabel}>ADRESSE PHYSIQUE</span>
                <span className={styles.infoValue}>{userData?.address || "Non renseignée"}</span>
              </div>
            </div>
          </div>
        </div>

        <div className={styles.card}>
          <h2 className={styles.sectionTitle}><i className="fas fa-shield-alt"></i> Sécurité du Compte</h2>
          <form onSubmit={handlePasswordSubmit} className={styles.form}>
            {error && <div className={styles.errorBanner}><i className="fas fa-exclamation-circle"></i>{error}</div>}
            {success && <div className={styles.successBanner}><i className="fas fa-check-circle"></i>{success}</div>}
            
            <div className={styles.formGroup}>
              <label>Changer le mot de passe</label>
              <div className={styles.inputWrapper}>
                <i className="fas fa-lock"></i>
                <input 
                  type="password" 
                  className={styles.input}
                  value={newPassword} 
                  onChange={(e) => setNewPassword(e.target.value)} 
                  placeholder="Tapez le nouveau mot de passe"
                  required 
                />
              </div>
            </div>
            
            <button type="submit" className={styles.saveBtn} disabled={loading || !newPassword}>
              <i className="fas fa-key"></i>
              {loading ? "Mise à jour..." : "Appliquer le nouveau mot de passe"}
            </button>
          </form>

          <div className={styles.noteCard}>
            <i className="fas fa-info-circle"></i>
            <p>
              Pour toute modification de vos informations d'identité (Nom, Email, Téléphone), 
              veuillez contacter le Secrétariat Général par soucis de traçabilité administrative.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
