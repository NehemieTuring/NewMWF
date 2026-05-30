"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { secretaryService } from "@/services/secretaryService";
import styles from "./nouveau.module.css";
import { useTranslation } from "@/context/LanguageContext";

export default function NewMemberPage() {
  const router = useRouter();
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [step, setStep] = useState(1);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    firstName: "",
    email: "",
    tel: "",
    address: "",
    username: "",
    password: "",
    confirmPassword: "",
    inscriptionDate: new Date().toISOString().split('T')[0],
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    // Pour le téléphone, on ne garde que les chiffres et les espaces
    if (name === "tel") {
      const numericValue = value.replace(/[^0-9\s+]/g, "");
      setFormData({ ...formData, [name]: numericValue });
      return;
    }

    setFormData({ ...formData, [name]: value });
  };

  const handleNext = () => {
    if (step === 1) {
      if (!formData.name || !formData.firstName || !formData.email || !formData.tel) {
        setError(t.membres.remplirChamps);
        return;
      }
      setError("");
      setStep(2);
    }
  };

  const handleBack = () => {
    setError("");
    setStep(1);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      setError(t.membres.passwordsMismatch);
      return;
    }
    if (formData.password.length < 4) {
      setError(t.membres.passwordTooShort);
      return;
    }

    setLoading(true);
    setError("");

    try {
      const { confirmPassword, ...dataToSend } = formData;
      await secretaryService.registerMember(dataToSend);
      setStep(3); // On passe à l'étape de succès
    } catch (err: any) {
      setError(err.message || t.superAdmin.erreur);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.page}>
      {/* Header */}
      <header className={styles.headerCard}>
        <div className={styles.headerInfo}>
          <button className={styles.backBtn} onClick={() => router.back()}>
            <i className="fas fa-arrow-left"></i>
          </button>
          <div>
            <h1>{t.membres.nouveauMembre}</h1>
            <p>{t.membres.inscrireEnseignant}</p>
          </div>
        </div>
      </header>

      {/* Stepper */}
      <div className={styles.stepper}>
        <div className={`${styles.stepItem} ${step >= 1 ? styles.stepActive : ""} ${step > 1 ? styles.stepDone : ""}`}>
          <div className={styles.stepCircle}>
            {step > 1 ? <i className="fas fa-check"></i> : "1"}
          </div>
          <span>{t.membres.infosPersonnelles}</span>
        </div>
        <div className={styles.stepLine}></div>
        <div className={`${styles.stepItem} ${step >= 2 ? styles.stepActive : ""} ${step > 2 ? styles.stepDone : ""}`}>
          <div className={styles.stepCircle}>
            {step > 2 ? <i className="fas fa-check"></i> : "2"}
          </div>
          <span>{t.membres.identifiantsSecurite}</span>
        </div>
        <div className={styles.stepLine}></div>
        <div className={`${styles.stepItem} ${step >= 3 ? styles.stepActive : ""}`}>
          <div className={styles.stepCircle}>
            {step === 3 ? <i className="fas fa-check"></i> : "3"}
          </div>
          <span>{t.membres.confirmation}</span>
        </div>
      </div>

      {/* Form Card */}
      <div className={styles.formCard}>
        {error && (
          <div className={styles.errorBanner}>
            <i className="fas fa-exclamation-circle"></i>
            <span>{error}</span>
          </div>
        )}

        {step === 1 && (
          <div className={styles.stepContent}>
            <div className={styles.sectionTitle}>
              <i className="fas fa-user"></i>
              <h2>{t.membres.infosPersonnelles}</h2>
            </div>
            <p className={styles.sectionDesc}>{t.membres.inscrireEnseignant}</p>

            <div className={styles.formGrid}>
              <div className={styles.formGroup}>
                <label>{t.membres.nomLabel} <span className={styles.required}>*</span></label>
                <div className={styles.inputWrapper}>
                  <i className="fas fa-user"></i>
                  <input
                    type="text"
                    name="name"
                    placeholder="Ex: KAMGA"
                    value={formData.name}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>
              <div className={styles.formGroup}>
                <label>{t.membres.prenomLabel} <span className={styles.required}>*</span></label>
                <div className={styles.inputWrapper}>
                  <i className="fas fa-signature"></i>
                  <input
                    type="text"
                    name="firstName"
                    placeholder="Ex: Jean Pierre"
                    value={formData.firstName}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>
              <div className={styles.formGroup}>
                <label>{t.membres.emailLabel} <span className={styles.required}>*</span></label>
                <div className={styles.inputWrapper}>
                  <i className="fas fa-envelope"></i>
                  <input
                    type="email"
                    name="email"
                    placeholder="Ex: kamga@enspy.cm"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>
              <div className={styles.formGroup}>
                <label>{t.membres.telLabel} <span className={styles.required}>*</span></label>
                <div className={styles.inputWrapper}>
                  <i className="fas fa-phone"></i>
                  <input
                    type="text"
                    name="tel"
                    placeholder="Ex: 6 99 00 00 00"
                    value={formData.tel}
                    onChange={handleChange}
                    inputMode="tel"
                    pattern="[0-9\s+]*"
                    required
                  />
                </div>
              </div>
              <div className={styles.formGroup}>
                <label>Date d'inscription <span className={styles.required}>*</span></label>
                <div className={styles.inputWrapper}>
                  <i className="fas fa-calendar-alt"></i>
                  <input
                    type="date"
                    name="inscriptionDate"
                    value={formData.inscriptionDate}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>
              <div className={styles.formGroup}>
                <label>{t.membres.adresseLabel}</label>
                <div className={styles.inputWrapper}>
                  <i className="fas fa-map-marker-alt"></i>
                  <input
                    type="text"
                    name="address"
                    placeholder="Ex: Yaoundé, Cameroun"
                    value={formData.address}
                    onChange={handleChange}
                  />
                </div>
              </div>
            </div>

            <div className={styles.formActions}>
              <button type="button" className={styles.cancelBtn} onClick={() => router.back()}>
                <i className="fas fa-times"></i> {t.membres.annuler}
              </button>
              <button type="button" className={styles.nextBtn} onClick={handleNext}>
                {t.membres.suivant} <i className="fas fa-arrow-right"></i>
              </button>
            </div>
          </div>
        )}

        {step === 2 && (
          <form onSubmit={handleSubmit} className={styles.stepContent}>
            <div className={styles.sectionTitle}>
              <i className="fas fa-shield-alt"></i>
              <h2>{t.membres.identifiantsSecurite}</h2>
            </div>
            <p className={styles.sectionDesc}>{t.membres.identifiantsSecurite}</p>

            <div className={styles.formGrid}>
              <div className={`${styles.formGroup} ${styles.fullWidth}`}>
                <label>{t.membres.usernameLabel} <span className={styles.required}>*</span></label>
                <div className={styles.inputWrapper}>
                  <i className="fas fa-at"></i>
                  <input
                    type="text"
                    name="username"
                    placeholder="Ex: kamga.jp"
                    value={formData.username}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>
              <div className={styles.formGroup}>
                <label>{t.membres.passwordLabel} <span className={styles.required}>*</span></label>
                <div className={styles.inputWrapper}>
                  <i className="fas fa-lock"></i>
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    placeholder="Minimum 4 caractères"
                    value={formData.password}
                    onChange={handleChange}
                    required
                  />
                  <button
                    type="button"
                    className={styles.visibilityBtn}
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    <i className={showPassword ? "fas fa-eye-slash" : "fas fa-eye"}></i>
                  </button>
                </div>
              </div>
              <div className={styles.formGroup}>
                <label>{t.membres.confirmPasswordLabel} <span className={styles.required}>*</span></label>
                <div className={styles.inputWrapper}>
                  <i className="fas fa-lock"></i>
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    name="confirmPassword"
                    placeholder="Retapez le mot de passe"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    required
                  />
                  <button
                    type="button"
                    className={styles.visibilityBtn}
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    <i className={showConfirmPassword ? "fas fa-eye-slash" : "fas fa-eye"}></i>
                  </button>
                </div>
              </div>
            </div>

            {/* Preview Card */}
            <div className={styles.previewCard}>
              <div className={styles.previewAvatar}>
                {formData.firstName?.[0]}{formData.name?.[0]}
              </div>
              <div className={styles.previewInfo}>
                <strong>{formData.firstName} {formData.name}</strong>
                <span>{formData.email}</span>
                <span>{formData.tel}</span>
              </div>
            </div>

            <div className={styles.formActions}>
              <button type="button" className={styles.backStepBtn} onClick={handleBack}>
                <i className="fas fa-arrow-left"></i> {t.membres.retour}
              </button>
              <button type="submit" className={styles.submitBtn} disabled={loading}>
                <i className={loading ? "fas fa-spinner fa-spin" : "fas fa-user-plus"}></i>
                {loading ? t.membres.inscriptionEnCours : t.membres.inscrireMembre}
              </button>
            </div>
          </form>
        )}

        {step === 3 && (
          <div className={styles.successContent}>
            <div className={styles.successIcon}>
              <i className="fas fa-check-circle"></i>
            </div>
            <h2>{t.membres.succesInscription}</h2>
            <p><strong>{formData.firstName} {formData.name}</strong> {t.membres.ajouteMutuelle}</p>
            <div className={styles.feeNotification}>
              <i className="fas fa-check"></i>
              <span>{t.membres.fraisRegles}</span>
            </div>
            <div className={styles.successActions}>
              <button className={styles.backStepBtn} onClick={() => { setStep(1); setFormData({ name: "", firstName: "", email: "", tel: "", address: "", username: "", password: "", confirmPassword: "", inscriptionDate: new Date().toISOString().split('T')[0] }); }}>
                <i className="fas fa-plus"></i> {t.membres.inscrireAutre}
              </button>
              <button className={styles.submitBtn} onClick={() => router.push("/admin/membres")}>
                <i className="fas fa-users"></i> {t.membres.voirListe}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
