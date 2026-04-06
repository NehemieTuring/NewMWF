"use client";

import { useEffect, useState } from "react";
import styles from "./profil.module.css";
import { useTranslation } from "@/context/LanguageContext";
import { secretaryService } from "@/services/secretaryService";
import { useAuth } from "@/context/AuthContext";

export default function ProfilPage() {
  const { t } = useTranslation();
  const { user: authUser } = useAuth();
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [activeTab, setActiveTab] = useState("info");

  const [formData, setFormData] = useState({
    name: "",
    firstName: "",
    email: "",
    tel: "",
    username: "",
  });

  const [passwordData, setPasswordData] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  useEffect(() => {
    async function loadProfile() {
      try {
        const data = await secretaryService.getProfile();
        setProfile(data);
        setFormData({
          name: data.user?.name || "",
          firstName: data.user?.firstName || "",
          email: data.user?.email || "",
          tel: data.user?.tel || "",
          username: data.username || "",
        });
      } catch (err: any) {
        setError(err.message === "Failed to fetch" ? "Serveur inaccessible" : err.message);
      } finally {
        setLoading(false);
      }
    }
    loadProfile();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPasswordData({ ...passwordData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");
    try {
      if (activeTab === "info") {
        await secretaryService.updateProfile(formData);
        setSuccess("Profil mis à jour avec succès !");
      } else {
        if (passwordData.newPassword !== passwordData.confirmPassword) {
          throw new Error("Les nouveaux mots de passe ne correspondent pas.");
        }
        await secretaryService.updatePassword(passwordData);
        setSuccess("Mot de passe mis à jour avec succès !");
        setPasswordData({ oldPassword: "", newPassword: "", confirmPassword: "" });
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading && !profile) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.spinner}></div>
        <span>{t.common.chargement}...</span>
      </div>
    );
  }

  const initials = profile?.user?.firstName?.[0] || authUser?.email?.[0] || "?";
  const initials2 = profile?.user?.name?.[0] || "";

  return (
    <div className={styles.page}>
      <header className={styles.headerContainer}>
        <div className={styles.headerInfo}>
          <h1>{t.common.monProfil}</h1>
          <p>Gérez vos informations personnelles et vos paramètres de sécurité</p>
        </div>
        <div className={styles.headerAction}>
          {/* Action button if needed */}
        </div>
      </header>

      <div className={styles.mainGrid}>
        {/* Sidebar Summary */}
        <aside className={styles.profileSidebar}>
          <div className={styles.profileCard}>
            <div className={styles.avatarWrapper}>
              <div className={styles.avatar}>
                {initials}{initials2}
              </div>
              <button className={styles.editAvatarBtn} title="Changer d'avatar">
                <i className="fas fa-camera"></i>
              </button>
            </div>
            <h2 className={styles.profileName}>
              {profile?.user?.firstName} {profile?.user?.name}
            </h2>
            <span className={styles.profileRole}>
              {profile?.adminRole || "Secrétaire Générale"}
            </span>

            <div className={styles.quickInfo}>
              <div className={styles.infoItem}>
                <i className="fas fa-user-tag"></i>
                <span>@{profile?.username || "utilisateur"}</span>
              </div>
              <div className={styles.infoItem}>
                <i className="fas fa-calendar-check"></i>
                <span>Membre depuis 2024</span>
              </div>
            </div>
          </div>
        </aside>

        {/* Content Area */}
        <main className={styles.contentCard}>
          <nav className={styles.tabs}>
            <button 
              className={`${styles.tab} ${activeTab === "info" ? styles.activeTab : ""}`}
              onClick={() => setActiveTab("info")}
            >
              <i className="fas fa-info-circle" style={{ marginRight: "8px" }}></i>
              Informations
            </button>
            <button 
              className={`${styles.tab} ${activeTab === "security" ? styles.activeTab : ""}`}
              onClick={() => setActiveTab("security")}
            >
              <i className="fas fa-shield-alt" style={{ marginRight: "8px" }}></i>
              Sécurité
            </button>
          </nav>

          <div className={styles.tabContent}>
            <form onSubmit={handleSubmit}>
              {error && (
                <div className={`${styles.statusBanner} ${styles.errorBanner}`}>
                  <i className="fas fa-exclamation-circle"></i>
                  <span>{error}</span>
                </div>
              )}
              {success && (
                <div className={`${styles.statusBanner} ${styles.successBanner}`}>
                  <i className="fas fa-check-circle"></i>
                  <span>{success}</span>
                </div>
              )}

              {activeTab === "info" ? (
                <div className={styles.formGrid}>
                  <div className={styles.formGroup}>
                    <label>Nom</label>
                    <div className={styles.inputWrapper}>
                      <input 
                        className={styles.input} 
                        type="text" 
                        name="name" 
                        value={formData.name} 
                        onChange={handleChange} 
                        required 
                      />
                      <i className="fas fa-user"></i>
                    </div>
                  </div>
                  <div className={styles.formGroup}>
                    <label>Prénom</label>
                    <div className={styles.inputWrapper}>
                      <input 
                        className={styles.input} 
                        type="text" 
                        name="firstName" 
                        value={formData.firstName} 
                        onChange={handleChange} 
                        required 
                      />
                      <i className="fas fa-signature"></i>
                    </div>
                  </div>
                  <div className={styles.formGroup}>
                    <label>Email</label>
                    <div className={styles.inputWrapper}>
                      <input 
                        className={styles.input} 
                        type="email" 
                        name="email" 
                        value={formData.email} 
                        onChange={handleChange} 
                        required 
                      />
                      <i className="fas fa-envelope"></i>
                    </div>
                  </div>
                  <div className={styles.formGroup}>
                    <label>Téléphone</label>
                    <div className={styles.inputWrapper}>
                      <input 
                        className={styles.input} 
                        type="text" 
                        name="tel" 
                        value={formData.tel} 
                        onChange={handleChange} 
                        required 
                      />
                      <i className="fas fa-phone"></i>
                    </div>
                  </div>
                  <div className={`${styles.formGroup} ${styles.fullWidth}`}>
                    <label>Identifiant (Username)</label>
                    <div className={styles.inputWrapper}>
                      <input 
                        className={styles.input} 
                        type="text" 
                        name="username" 
                        value={formData.username} 
                        readOnly 
                        style={{ backgroundColor: "var(--light)", cursor: "not-allowed" }}
                      />
                      <i className="fas fa-id-badge"></i>
                    </div>
                  </div>
                </div>
              ) : (
                <div className={styles.formGrid}>
                  <div className={`${styles.formGroup} ${styles.fullWidth}`}>
                    <div className={styles.securityNote}>
                      Pour changer votre mot de passe, vous devez d'abord saisir votre mot de passe actuel.
                    </div>
                  </div>
                  <div className={`${styles.formGroup} ${styles.fullWidth}`}>
                    <label>Ancien mot de passe</label>
                    <div className={styles.inputWrapper}>
                      <input 
                        className={styles.input} 
                        type="password" 
                        name="oldPassword" 
                        value={passwordData.oldPassword} 
                        onChange={handlePasswordChange} 
                        required 
                      />
                      <i className="fas fa-lock"></i>
                    </div>
                  </div>
                  <div className={styles.formGroup}>
                    <label>Nouveau mot de passe</label>
                    <div className={styles.inputWrapper}>
                      <input 
                        className={styles.input} 
                        type="password" 
                        name="newPassword" 
                        value={passwordData.newPassword} 
                        onChange={handlePasswordChange} 
                        required 
                      />
                      <i className="fas fa-key"></i>
                    </div>
                  </div>
                  <div className={styles.formGroup}>
                    <label>Confirmer nouveau mot de passe</label>
                    <div className={styles.inputWrapper}>
                      <input 
                        className={styles.input} 
                        type="password" 
                        name="confirmPassword" 
                        value={passwordData.confirmPassword} 
                        onChange={handlePasswordChange} 
                        required 
                      />
                      <i className="fas fa-shield-check"></i>
                    </div>
                  </div>
                </div>
              )}

              <div className={styles.formActions}>
                <button type="submit" className={styles.saveBtn} disabled={loading}>
                  <i className={loading ? "fas fa-spinner fa-spin" : "fas fa-save"}></i>
                  {loading ? "Traitement..." : "Enregistrer les modifications"}
                </button>
              </div>
            </form>
          </div>
        </main>
      </div>
    </div>
  );
}
