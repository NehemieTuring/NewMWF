"use client";

import { useTheme } from "@/context/ThemeContext";
import styles from "./ThemeSwitcher.module.css";

export default function ThemeSwitcher() {
  const { theme, toggleTheme } = useTheme();

  return (
    <button 
      className={styles.themeBtn} 
      onClick={toggleTheme}
      title={theme === "light" ? "Activer le mode sombre" : "Activer le mode clair"}
    >
      <i className={theme === "light" ? "fas fa-moon" : "fas fa-sun"}></i>
    </button>
  );
}
