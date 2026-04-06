"use client";

import { useEffect, useState } from "react";
import styles from "../../admin/profil/profil.module.css";
import { useTranslation } from "@/context/LanguageContext";
import { treasurerService } from "@/services/treasurerService";
import { useAuth } from "@/context/AuthContext";
import dashboardStyles from "../../admin/dashboard.module.css";

export default function TreasurerProfilPage() {
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
        const data = await treasurerService.getProfile();
        setProfile(data);
      } catch (err: any) {
        setError(err.message);
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
      await treasurerService.updatePassword(newPassword);
      setSuccess("Mot de passe mis à jour avec succès !");
      setNewPassword("");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className={styles.loading}>Chargement de votre profil...</div>;

  return (
    <div className={styles.page}>
      <header className={styles.headerContainer}>
        <div className={styles.headerInfo}>
          <h1 className={styles.title}>{t.common.monProfil}</h1>
          <p className={styles.subtitle}>Gérez vos informations financières et de sécurité sur la plateforme</p>
        </div>
        <div className={styles.profileBadge} style={{ background: "rgba(78, 115, 223, 0.1)", padding: "0.5rem 1.5rem", borderRadius: "50px", border: "1px solid rgba(78, 115, 223, 0.2)" }}>
           <i className="fas fa-shield-alt" style={{ color: "#4e73df", marginRight: "0.75rem" }}></i>
           <span style={{ fontWeight: 700, color: "#4e73df", fontSize: "0.9rem" }}>Espace Sécurisé</span>
        </div>
      </header>

      <div className={styles.mainGrid}>
        {/* Sidebar Info */}
        <aside className={styles.profileSidebar}>
          <div className={styles.profileCard}>
            <div className={styles.avatarWrapper}>
              <div className={styles.avatar}>
                {profile?.firstName?.[0] || authUser?.email?.[0]?.toUpperCase()}{profile?.name?.[0]}
              </div>
              <button className={styles.editAvatarBtn} title="Changer l'avatar">
                <i className="fas fa-camera"></i>
              </button>
            </div>
            
            <h2 className={styles.profileName}>{profile?.firstName && profile?.name ? `${profile.firstName} ${profile.name}` : "Trésorier de la Mutuelle"}</h2>
            <div className={styles.profileRole}>TRÉSORIER</div>

            <div className={styles.quickInfo}>
              <div className={styles.infoItem}>
                <i className="fas fa-envelope"></i>
                <span>{profile?.email || authUser?.email}</span>
              </div>
              <div className={styles.infoItem}>
                <i className="fas fa-phone"></i>
                <span>{profile?.tel || "Non renseigné"}</span>
              </div>
              <div className={styles.infoItem}>
                <i className="fas fa-wallet"></i>
                <span>Trésorerie Centrale</span>
              </div>
              <div className={styles.infoItem}>
                <i className="fas fa-calendar-check"></i>
                <span>Membre depuis 2024</span>
              </div>
            </div>
          </div>
        </aside>

        {/* Content Tabs */}
        <main className={styles.contentCard}>
          <div className={styles.tabs}>
            <div className={`${styles.tab} ${styles.activeTab}`}>Sécurité & Compte</div>
            <div className={styles.tab}>Informations Personnelles</div>
          </div>

          <div className={styles.tabContent}>
            <div className={styles.securityNote}>
               <i className="fas fa-shield-halved" style={{ marginRight: "0.75rem" }}></i>
               Utilisez un mot de passe fort combinant majuscules, minuscules et caractères spéciaux pour protéger votre accès trésorier.
            </div>

            <form onSubmit={handlePasswordSubmit} className={styles.formContainer}>
              <h2 style={{ fontSize: "1.25rem", fontWeight: 700, marginBottom: "1.5rem", color: "#1f2937" }}>
                Changer le mot de passe
              </h2>

              {error && (
                <div className={`${styles.statusBanner} ${styles.errorBanner}`}>
                  <i className="fas fa-exclamation-circle"></i>
                  {error}
                </div>
              )}
              {success && (
                <div className={`${styles.statusBanner} ${styles.successBanner}`}>
                  <i className="fas fa-check-circle"></i>
                  {success}
                </div>
              )}
              
              <div className={styles.formGrid}>
                <div className={`${styles.formGroup} ${styles.fullWidth}`}>
                  <label>Nouveau mot de passe</label>
                  <div className={styles.inputWrapper}>
                    <i className="fas fa-lock"></i>
                    <input 
                      type="password" 
                      className={styles.input}
                      value={newPassword} 
                      onChange={(e) => setNewPassword(e.target.value)} 
                      placeholder="Entrez votre nouveau mot de passe"
                      required 
                    />
                  </div>
                </div>
              </div>
              
              <div className={styles.formActions}>
                <button type="submit" className={styles.saveBtn} disabled={loading || !newPassword}>
                  <i className="fas fa-save"></i> 
                  Mettre à jour la sécurité
                </button>
              </div>
            </form>

            <div className={styles.divider} style={{ margin: "3rem 0 1.5rem", height: "1px", background: "#e5e7eb" }}></div>

            <div className={dashboardStyles?.infoNote || ""}>
              <div style={{ display: "flex", gap: "1rem", alignItems: "flex-start", background: "#eff6ff", padding: "1.25rem", borderRadius: "12px", border: "1px solid #dbeafe" }}>
                <i className="fas fa-info-circle" style={{ color: "#3b82f6", marginTop: "0.25rem" }}></i>
                <p style={{ fontSize: "0.9rem", color: "#1e40af", lineHeight: "1.5" }}>
                  <strong>Note importante :</strong> Pour modifier vos informations d'identité (nom, prénom, téléphone), veuillez contacter le Secrétariat Général. En tant que trésorier, vos accès sont restreints pour garantir l'intégrité des données financières.
                </p>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
