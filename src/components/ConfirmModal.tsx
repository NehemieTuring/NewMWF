"use client";

import React, { useState, useEffect } from "react";
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
  requiredConfirmValue?: string;
  isLoading?: boolean;
}

export default function ConfirmModal({
  isOpen,
  title,
  message,
  onConfirm,
  onCancel,
  confirmText = "Confirmer",
  cancelText = "Annuler",
  type = "info",
  requiredConfirmValue,
  isLoading = false
}: ConfirmModalProps) {
  const [inputValue, setInputValue] = useState("");

  useEffect(() => {
    if (isOpen) {
      setInputValue("");
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const getIcon = () => {
    switch (type) {
      case "danger": return "fa-exclamation-triangle";
      case "success": return "fa-check-circle";
      case "warning": return "fa-exclamation-circle";
      default: return "fa-info-circle";
    }
  };

  const isConfirmDisabled = requiredConfirmValue ? inputValue !== requiredConfirmValue : false;

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
            <div className={styles.messageContainer}>
              <p className={styles.message}>{message}</p>

              {requiredConfirmValue && (
                <div className={styles.inputWrapper} style={{ marginTop: '1.5rem' }}>
                  <label style={{ display: 'block', fontSize: '0.85rem', color: '#858796', marginBottom: '0.5rem' }}>
                    Veuillez saisir <strong>{requiredConfirmValue}</strong> pour confirmer :
                  </label>
                  <input
                    type="text"
                    className="form-input"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    placeholder={requiredConfirmValue}
                    autoFocus
                    style={{
                      width: '100%',
                      padding: '0.8rem',
                      borderRadius: '0.5rem',
                      border: '1px solid #d1d3e2',
                      fontSize: '1rem'
                    }}
                  />
                </div>
              )}
            </div>
          </div>
        </div>
        <div className={styles.modalFooter}>
          <button type="button" className={`${styles.btn} ${styles.btnCancel}`} onClick={onCancel}>
            {cancelText}
          </button>
          <button
            type="button"
            className={`${styles.btn} ${styles[type]} ${styles.btnConfirm}`}
            onClick={onConfirm}
            disabled={isConfirmDisabled || isLoading}
            style={{ opacity: (isConfirmDisabled || isLoading) ? 0.5 : 1, cursor: (isConfirmDisabled || isLoading) ? 'not-allowed' : 'pointer' }}
          >
            {isLoading && <i className="fas fa-spinner fa-spin" style={{ marginRight: '0.5rem' }}></i>}
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}
