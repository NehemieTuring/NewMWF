"use client";

import { useState } from "react";
import styles from "../administrateurs/admins.module.css";
import { useTranslation } from "@/context/LanguageContext";
import { changeUserPasswordByEmail } from "@/services/superAdminService";

export default function PasswordManagementPage() {
  const { t } = useTranslation();
  const [email, setEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [toast, setToast] = useState<{ type: "success" | "error"; message: string } | null>(null);

  function showToast(type: "success" | "error", message: string) {
    setToast({ type, message });
    setTimeout(() => setToast(null), 3000);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email || !newPassword) return;
    console.log(`Initiating password change for user: ${email}`);
    setSubmitting(true);
    try {
      await changeUserPasswordByEmail(email, newPassword);
      console.log(`Password change successful for user: ${email}`);
      showToast("success", t.superAdmin.succes);
      setEmail("");
      setNewPassword("");
    } catch (err: unknown) {
      console.error(`Failed to change password for user ${email}:`, err);
      showToast("error", err instanceof Error ? err.message : t.superAdmin.erreur);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>{t.superAdmin.changerMotDePasse}</h1>
          <p className={styles.subtitle}>
            {t.superAdmin.motsDePasse}
          </p>
        </div>
      </div>

      <div className={styles.centeredContainer}>
        <div className={styles.card} style={{ width: "100%", maxWidth: 520 }}>
          <div className={styles.cardHeader}>
            <div className={styles.avatar} style={{ background: "linear-gradient(135deg, #4e73df, #224abe)" }}>
              <i className="fas fa-key"></i>
            </div>
            <div>
              <div className={styles.adminName}>{t.superAdmin.changerMotDePasse}</div>
              <div className={styles.adminEmail}>Admin / Membres</div>
            </div>
          </div>
          <form className={styles.cardBody} onSubmit={handleSubmit}>
            <div className={styles.formGroup}>
              <label>{t.superAdmin.idUtilisateur}</label>
              <input
                className={styles.formInput}
                type="email"
                required
                placeholder="Ex: admin@mutuelle.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className={styles.formGroup}>
              <label>{t.superAdmin.nouveauMotDePasse}</label>
              <div className={styles.passwordWrapper}>
                <input
                  className={styles.formInput}
                  type={showPassword ? "text" : "password"}
                  required
                  minLength={4}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                />
                <button
                  type="button"
                  className={styles.eyeBtn}
                  onClick={() => setShowPassword(!showPassword)}
                >
                  <i className={`fas ${showPassword ? "fa-eye-slash" : "fa-eye"}`}></i>
                </button>
              </div>
            </div>
            <div className={styles.modalActions}>
              <button type="submit" className={styles.submitBtn} disabled={submitting}>
                <i className="fas fa-key"></i>
                {submitting ? "..." : t.superAdmin.confirmer}
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Toast */}
      {toast && (
        <div className={`${styles.toast} ${toast.type === "success" ? styles.toastSuccess : styles.toastError}`}>
          <i className={`fas ${toast.type === "success" ? "fa-check-circle" : "fa-exclamation-circle"}`}></i>
          {toast.message}
        </div>
      )}
    </div>
  );
}
