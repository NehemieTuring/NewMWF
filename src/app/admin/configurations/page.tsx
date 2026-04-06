"use client";

import { useState } from "react";
import styles from "./configurations.module.css";
import { useTranslation } from "@/context/LanguageContext";
import { useTheme } from "@/context/ThemeContext";

export default function ConfigurationsPage() {
  const { t, locale, setLocale } = useTranslation();
  const { theme, setTheme } = useTheme();

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <h1 className={styles.title}>{t.common.configurations}</h1>
        <p className={styles.subtitle}>Personnalisez votre expérience</p>
      </div>

      <div className={styles.grid}>
        <div className={styles.card}>
          <div className={styles.cardHeader}>
            <i className="fas fa-language"></i>
            <h3>{t.common.langue}</h3>
          </div>
          <div className={styles.cardBody}>
            <button 
              className={`${styles.selectBtn} ${locale === "fr" ? styles.selected : ""}`}
              onClick={() => setLocale("fr")}
            >
              <span>Français</span>
              {locale === "fr" && <i className="fas fa-check-circle"></i>}
            </button>
            <button 
              className={`${styles.selectBtn} ${locale === "en" ? styles.selected : ""}`}
              onClick={() => setLocale("en")}
            >
              <span>English</span>
              {locale === "en" && <i className="fas fa-check-circle"></i>}
            </button>
          </div>
        </div>

        <div className={styles.card}>
          <div className={styles.cardHeader}>
            <i className={`fas ${theme === "light" ? "fa-sun" : "fa-moon"}`}></i>
            <h3>Thème</h3>
          </div>
          <div className={styles.cardBody}>
            <button 
              className={`${styles.selectBtn} ${theme === "light" ? styles.selected : ""}`}
              onClick={() => setTheme("light")}
            >
              <span>Clair</span>
              {theme === "light" && <i className="fas fa-check-circle"></i>}
            </button>
            <button 
              className={`${styles.selectBtn} ${theme === "dark" ? styles.selected : ""}`}
              onClick={() => setTheme("dark")}
            >
              <span>Sombre</span>
              {theme === "dark" && <i className="fas fa-check-circle"></i>}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
