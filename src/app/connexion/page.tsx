"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import styles from "./connexion.module.css";
import { useTranslation } from "@/context/LanguageContext";
import { useAuth } from "@/context/AuthContext";

type Role = "administrator" | "member";

export default function ConnexionPage() {
  const { t, locale, setLocale } = useTranslation();
  const router = useRouter();
  const { login, logout } = useAuth();
  const [activeModal, setActiveModal] = useState<Role | null>(null);
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (!formData.email || !formData.password) {
      setError("Veuillez saisir votre nom d'utilisateur et votre mot de passe");
      setLoading(false);
      return;
    }

    try {
      const data = await login(formData.email, formData.password);
      // Route based on actual role from backend
      const role = data.role?.toUpperCase();

      // Vérification du rôle par rapport à la partie choisie
      if (activeModal === "administrator" && role === "MEMBER") {
        logout();
        setError(t.login.erreurAccesAdmin);
        return;
      }
      
      if (activeModal === "member" && role !== "MEMBER") {
        logout();
        setError(t.login.erreurAccesMembre);
        return;
      }

      if (role === "SUPER_ADMIN") {
        router.push("/super-admin");
      } else if (role === "MEMBER") {
        router.push("/membre");
      } else if (role === "ADMIN") {
        const subRole = data.subRole?.toUpperCase();
        if (subRole === "PRESIDENT") {
          router.push("/president");
        } else if (subRole === "TRESORIER") {
          router.push("/treasurer");
        } else {
          // SECRETAIRE_GENERALE or others
          router.push("/admin");
        }
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : t.common.erreurIdentifiants;
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.page}>
      {/* Navbar */}
      <nav className={styles.navbar}>
        <Link href="/" className={styles.navBrand}>
          <Image
            src="/img/icon.png"
            alt="ENSPY"
            width={40}
            height={40}
            className={styles.navLogo}
          />
          <span className={styles.brandText}>{t.common.enspy}</span>
        </Link>
        <div className={styles.navLinks}>
          <Link href="/" className={styles.navLink}>
            <i className="fas fa-home"></i>
            <span>{t.common.accueil}</span>
          </Link>
          <Link href="/connexion" className={`${styles.navLink} ${styles.active}`}>
            <i className="fas fa-sign-in-alt"></i>
            <span>{t.common.connexion}</span>
          </Link>
          <div className={styles.langDropdown}>
            <button 
              className={styles.langBtn}
              onClick={() => setDropdownOpen(!dropdownOpen)}
            >
              <i className="fas fa-globe"></i>
              <span>{locale === "fr" ? "Français" : "English"}</span>
              <i className="fas fa-caret-down"></i>
            </button>
            {dropdownOpen && (
              <div
                className={styles.langMenu}
                style={{
                  position: "absolute",
                  top: "100%",
                  right: 0,
                  backgroundColor: "#fff",
                  boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
                  borderRadius: "4px",
                  padding: "5px 0",
                  zIndex: 1000,
                  minWidth: "120px",
                }}
              >
                <button
                  onClick={() => {
                    setLocale("fr");
                    setDropdownOpen(false);
                  }}
                  className={styles.langItem}
                  style={{
                    display: "block",
                    width: "100%",
                    padding: "8px 15px",
                    textAlign: "left",
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    color: locale === "fr" ? "#2c3e50" : "#7f8c8d",
                    fontWeight: locale === "fr" ? "bold" : "normal",
                  }}
                >
                  Français
                </button>
                <button
                  onClick={() => {
                    setLocale("en");
                    setDropdownOpen(false);
                  }}
                  className={styles.langItem}
                  style={{
                    display: "block",
                    width: "100%",
                    padding: "8px 15px",
                    textAlign: "left",
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    color: locale === "en" ? "#2c3e50" : "#7f8c8d",
                    fontWeight: locale === "en" ? "bold" : "normal",
                  }}
                >
                  English
                </button>
              </div>
            )}
          </div>
        </div>
      </nav>

      <div className={styles.content}>
        <div className={styles.cardsGrid}>
          {/* Admin Card */}
          <div className={styles.roleCard}>
            <div className={styles.roleImage}>
              <Image
                src="/img/admin_connection.jpg"
                alt={t.login.titreAdmin}
                fill
                style={{ objectFit: "cover" }}
              />
            </div>
            <div className={styles.roleContent}>
              <h3 className={styles.roleTitle}>{t.login.titreAdmin}</h3>
              <p className={styles.roleDesc}>{t.login.descAdmin}</p>
              <button className={styles.connectBtn} onClick={() => setActiveModal("administrator")}>
                <i className="fas fa-user-shield"></i>
                <span>{t.common.connexion.toUpperCase()}</span>
              </button>
            </div>
          </div>

          {/* Member Card */}
          <div className={styles.roleCard}>
            <div className={styles.roleImage}>
              <Image
                src="/img/member_connection.jpg"
                alt={t.login.titreMembre}
                fill
                style={{ objectFit: "cover" }}
              />
            </div>
            <div className={styles.roleContent}>
              <h3 className={styles.roleTitle}>{t.login.titreMembre}</h3>
              <p className={styles.roleDesc}>{t.login.descMembre}</p>
              <button className={styles.connectBtn} onClick={() => setActiveModal("member")}>
                <i className="fas fa-user"></i>
                <span>{t.common.connexion.toUpperCase()}</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Login Modal */}
      {activeModal && (
        <div className={styles.modalOverlay} onClick={() => setActiveModal(null)}>
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h3>{activeModal === "administrator" ? t.login.titreModalAdmin : t.login.titreModalMembre}</h3>
              <button className={styles.modalClose} onClick={() => setActiveModal(null)}>
                <i className="fas fa-times"></i>
              </button>
            </div>
            <form className={styles.modalBody} onSubmit={handleSubmit}>
              {error && <div className={styles.errorText}>{error}</div>}
              <div className={styles.formGroup}>
                <label>{t.common.nomUtilisateur}</label>
                <div className={styles.inputWrapper}>
                  <i className="fas fa-user"></i>
                  <input
                    type="text"
                    placeholder={t.common.nomUtilisateur}
                    autoComplete="off"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  />
                </div>
              </div>
              <div className={styles.formGroup}>
                <label>{t.common.motDePasse}</label>
                <div className={styles.inputWrapper}>
                  <i className="fas fa-lock"></i>
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder={t.common.motDePasse}
                    autoComplete="off"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  />
                  <button
                    type="button"
                    className={styles.toggleBtn}
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    <i className={`fas ${showPassword ? "fa-eye-slash" : "fa-eye"}`}></i>
                  </button>
                </div>
              </div>
              <button type="submit" className={styles.submitBtn} disabled={loading}>
                {loading ? t.common.connexionEnCours : t.common.seConnecter}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
