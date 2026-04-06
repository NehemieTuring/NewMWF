"use client";

import styles from "./page.module.css";
import Link from "next/link";
import Image from "next/image";
import { useTranslation } from "@/context/LanguageContext";
import { useState } from "react";

export default function HomePage() {
  const { t, locale, setLocale } = useTranslation();
  const [dropdownOpen, setDropdownOpen] = useState(false);

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
          <h1 className={styles.welcomeTitle}>{t.common.bienvenue}</h1>
          <h2 className={styles.welcomeSubtitle}>{t.common.mutuelle}</h2>
          <Link href="/connexion" className={styles.connectBtn}>
            <i className="fas fa-sign-in-alt"></i>
            <span>{t.common.connexion.toUpperCase()}</span>
          </Link>
        </div>
      </main>
    </div>
  );
}
