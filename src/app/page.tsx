"use client";

import styles from "./page.module.css";
import Link from "next/link";
import Image from "next/image";
import { useTranslation } from "@/context/LanguageContext";
import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";

export default function HomePage() {
  const { t, locale, setLocale } = useTranslation();
  const { user, isLogged, loading } = useAuth();
  const router = useRouter();
  const [dropdownOpen, setDropdownOpen] = useState(false);

  useEffect(() => {
    if (!loading && isLogged && user) {
      const role = user.role.toUpperCase();
      if (role === "SUPER_ADMIN") router.push("/super-admin");
      else if (role === "ADMIN" || role === "SECRETAIRE_GENERALE") router.push("/admin");
      else if (role === "TRESORIER") router.push("/treasurer");
      else if (role === "PRESIDENT") router.push("/president");
      else router.push("/membre");
    }
  }, [isLogged, user, loading, router]);

  return (
    <div className={styles.landing}>
      {/* Background Image */}
      <div className={styles.bgImage}>
        <Image
          src="/img/guest_background.jpg"
          alt="Background"
          fill
          priority
          style={{ objectFit: "cover" }}
          quality={90}
        />
        <div className={styles.bgOverlay}></div>
      </div>

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
          <Link href="/" className={`${styles.navLink} ${styles.active}`}>
            <i className="fas fa-home"></i>
            <span>{t.common.accueil}</span>
          </Link>
          <Link href="/connexion" className={styles.navLink}>
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

      {/* Hero - Welcome Box */}
      <main className={styles.hero}>
        <div className={styles.welcomeBox}>
          <div className={styles.welcomeGlow}></div>
          <div className={styles.logoCircle}>
            <Image src="/img/icon.png" alt="Logo" width={60} height={60} className={styles.logoImg} />
            <div className={styles.logoRing}></div>
          </div>
          <h1 className={styles.welcomeTitle}>{t.common.bienvenue}</h1>
          <div className={styles.divider}>
            <span></span>
            <i className="fas fa-handshake"></i>
            <span></span>
          </div>
          <h2 className={styles.welcomeSubtitle}>{t.common.mutuelle}</h2>
          <p className={styles.tagline}>{t.login.tagline}</p>
          <Link href="/connexion" className={styles.connectBtn}>
            <span>{t.common.connexion.toUpperCase()}</span>
            <i className="fas fa-arrow-right"></i>
          </Link>
        </div>
      </main>
    </div>
  );
}
