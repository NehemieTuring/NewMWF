"use client";

import React, { useEffect } from "react";
import styles from "./Toast.module.css";

export type ToastType = "success" | "error" | "info" | "warning";

interface ToastProps {
  message: string;
  type: ToastType;
  onClose: () => void;
  duration?: number;
}

export default function Toast({ message, type, onClose, duration = 3000 }: ToastProps) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, duration);
    return () => clearTimeout(timer);
  }, [onClose, duration]);

  const getIcon = () => {
    switch (type) {
      case "success": return "fa-check-circle";
      case "error": return "fa-exclamation-circle";
      case "warning": return "fa-exclamation-triangle";
      default: return "fa-info-circle";
    }
  };

  return (
    <div className={`${styles.toast} ${styles[type]}`}>
      <div className={styles.icon}>
        <i className={`fas ${getIcon()}`}></i>
      </div>
      <div className={styles.message}>{message}</div>
      <button className={styles.closeBtn} onClick={onClose}>
        <i className="fas fa-times"></i>
      </button>
      <div className={styles.progressBar}>
        <div className={styles.progress} style={{ animationDuration: `${duration}ms` }}></div>
      </div>
    </div>
  );
}
