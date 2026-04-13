"use client";

import React from "react";
import styles from "./ConfirmModal.module.css";

interface ConfirmModalProps {
  isOpen: boolean;
  title: string;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
  confirmText?: string;
  cancelText?: string;
  type?: "danger" | "info" | "success" | "warning";
}

export default function ConfirmModal({
  isOpen,
  title,
  message,
  onConfirm,
  onCancel,
  confirmText = "Confirmer",
  cancelText = "Annuler",
  type = "info"
}: ConfirmModalProps) {
  if (!isOpen) return null;

  const getIcon = () => {
    switch (type) {
      case "danger": return "fa-exclamation-triangle";
      case "success": return "fa-check-circle";
      case "warning": return "fa-exclamation-circle";
      default: return "fa-info-circle";
    }
  };

  return (
    <div className="modal-overlay" onClick={onCancel}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className={`modal-header ${styles[type]}`}>
          <h3>{title}</h3>
          <button className="modal-close" onClick={onCancel}>
            <i className="fas fa-times"></i>
          </button>
        </div>
        <div className="modal-body">
          <div className={styles.bodyContent}>
            <div className={`${styles.icon} ${styles[type]}`}>
              <i className={`fas ${getIcon()}`}></i>
            </div>
            <p className={styles.message}>{message}</p>
          </div>
        </div>
        <div className="modal-footer">
          <button className={`${styles.btn} ${styles.btnCancel}`} onClick={onCancel}>
            {cancelText}
          </button>
          <button className={`${styles.btn} ${styles[type]} ${styles.btnConfirm}`} onClick={onConfirm}>
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}
