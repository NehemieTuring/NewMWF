"use client";

import { useEffect, useState } from "react";
import styles from "./aides.module.css";
import { useTranslation } from "@/context/LanguageContext";
import { memberService } from "@/services/memberService";
import { useNotification } from "@/context/NotificationContext";

export default function AidesPage() {
  const { t, locale } = useTranslation();
  const { showToast } = useNotification();
  const [helps, setHelps] = useState<any[]>([]);
  const [helpTypes, setHelpTypes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isEligible, setIsEligible] = useState(true);

  // Modal state
  const [showModal, setShowModal] = useState(false);
  const [selectedType, setSelectedType] = useState("");
  const [motive, setMotive] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function loadData() {
    try {
      const [allHelps, types, eligibility] = await Promise.all([
        memberService.getAllHelps(),
        memberService.getHelpTypes(),
        memberService.checkEligibility()
      ]);
      setHelps(allHelps || []);
      setHelpTypes(types || []);
      setIsEligible(eligibility);
    } catch (err) {
      console.error("Failed to load helps", err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadData();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedType || !motive) {
      showToast("Veuillez remplir tous les champs", "error");
      return;
    }

    setSubmitting(true);
    try {
      await memberService.requestHelp(parseInt(selectedType), null, motive);
      showToast("Demande soumise avec succès !", "success");
      setShowModal(false);
      setSelectedType("");
      setMotive("");
      loadData(); // Reload list
    } catch (err: any) {
      showToast(err.message || "Erreur lors de la demande", "error");
    } finally {
      setSubmitting(false);
    }
  };

  function formatAmount(n: number) {
    return (n || 0).toLocaleString(locale === "fr" ? "fr-FR" : "en-US");
  }

  function getTypeIconClass(name: string) {
    const lower = (name || "").toLowerCase();
    if (lower.includes("maladie")) return styles.typeIconMaladie;
    if (lower.includes("déc") || lower.includes("dec")) return styles.typeIconDeces;
    return styles.typeIconDefault;
  }

  function getTypeIcon(name: string) {
    const lower = (name || "").toLowerCase();
    if (lower.includes("maladie")) return "fas fa-hospital";
    if (lower.includes("déc") || lower.includes("dec")) return "fas fa-pray";
    return "fas fa-hand-holding-heart";
  }

  function getStatusClass(status: string) {
    if (status === "DISBURSED") return styles.statusDisbursed;
    if (status === "COMPLETED") return styles.statusCompleted;
    if (status === "PENDING") return styles.statusPending;
    if (status === "REJECTED") return styles.statusRejected;
    return styles.statusActive;
  }

  function getStatusLabel(status: string) {
    if (status === "DISBURSED") return "DÉCAISSÉ";
    if (status === "COMPLETED") return "PRÊT";
    if (status === "PENDING") return "EN ATTENTE";
    if (status === "REJECTED") return "REJETÉ";
    return "EN COURS";
  }

  if (loading) return (
    <div className={styles.page}>
      <div style={{ height: "60vh", display: "flex", alignItems: "center", justifyContent: "center", gap: "1rem", color: "var(--primary)", fontWeight: 700, fontSize: "1.1rem" }}>
        <i className="fas fa-spinner fa-spin" style={{ fontSize: "1.5rem" }}></i>
        Chargement des aides...
      </div>
    </div>
  );

  const ongoingHelps = helps.filter(h => h.status !== "DISBURSED" && h.status !== "REJECTED");
  const historyHelps = helps.filter(h => h.status === "DISBURSED" || h.status === "REJECTED");

  return (
    <div className={styles.page}>
      {/* Header */}
      <header className={styles.header} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 className={styles.title}>
            Solidarité & <span className="text-gradient">Aides</span>
          </h1>
          <p className={styles.subtitle}>Consultez l&apos;historique et le statut des aides du Fonds Social.</p>
        </div>

        <button
          className={styles.requestButton}
          onClick={() => setShowModal(true)}
          disabled={!isEligible}
          title={!isEligible ? "Vous avez une dette de solidarité de plus de 6 mois" : "Demander une aide"}
        >
          <i className="fas fa-plus-circle"></i>
          Demander une aide
        </button>
      </header>

      {!isEligible && (
        <div style={{
          background: 'rgba(231, 74, 59, 0.1)',
          color: '#e74a3b',
          padding: '1rem',
          borderRadius: '12px',
          marginBottom: '2rem',
          fontSize: '0.9rem',
          fontWeight: 600,
          border: '1px solid rgba(231, 74, 59, 0.2)',
          display: 'flex',
          alignItems: 'center',
          gap: '0.75rem'
        }}>
          <i className="fas fa-exclamation-triangle"></i>
          Droit aux aides suspendu : Votre cotisation de solidarité présente un retard de plus de 6 mois.
        </div>
      )}

      {/* Ongoing Helps Table */}
      <section style={{ marginBottom: "3rem" }}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>Aides en cours</h2>
          <span className={styles.countBadge}>
            <i className="fas fa-circle" style={{ fontSize: "0.4rem" }}></i>
            {ongoingHelps.length} dossier{ongoingHelps.length > 1 ? "s" : ""}
          </span>
        </div>

        {ongoingHelps.length > 0 ? (
          <div className={styles.tableWrapper}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Type d&apos;aide</th>
                  <th>Bénéficiaire</th>
                  <th>Montant cible</th>
                  <th>Collecté</th>
                  <th>Statut</th>
                </tr>
              </thead>
              <tbody>
                {ongoingHelps.map((help, index) => {
                  const typeName = help.helpType?.name || "Aide";

                  return (
                    <tr key={help.id} className="fade-in" style={{ animationDelay: `${index * 0.05}s` }}>
                      {/* Type */}
                      <td>
                        <div className={styles.typeCell}>
                          <div className={`${styles.typeIcon} ${getTypeIconClass(typeName)}`}>
                            <i className={getTypeIcon(typeName)}></i>
                          </div>
                          <div>
                            <div className={styles.typeName}>{typeName}</div>
                            {help.motive && (
                              <div style={{ fontSize: '0.75rem', opacity: 0.6, maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }} title={help.motive}>
                                {help.motive}
                              </div>
                            )}
                          </div>
                        </div>
                      </td>

                      {/* Beneficiary */}
                      <td>
                        <span className={styles.beneficiaryName}>
                          {help.member?.user?.firstName} {help.member?.user?.name}
                        </span>
                      </td>

                      {/* Target Amount */}
                      <td>
                        <span className={styles.amountValue}>
                          {formatAmount(help.targetAmount)}<small>XAF</small>
                        </span>
                      </td>

                      <td>
                        <span className={`${styles.amountValue} ${styles.amountGreen}`}>
                          {formatAmount(help.collectedAmount)}<small>XAF</small>
                        </span>
                      </td>

                      {/* Status */}
                      <td>
                        <span className={`${styles.statusTag} ${getStatusClass(help.status)}`}>
                          {getStatusLabel(help.status)}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <div className={styles.emptyState}>
            <i className="fas fa-heart"></i>
            <p>Aucune aide en cours pour le moment.</p>
          </div>
        )}
      </section>

      {/* Help Types */}
      <section className={styles.typesSection} style={{ marginBottom: "3rem" }}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>Barème des aides (Nomenclature)</h2>
        </div>
        {helpTypes.length > 0 ? (
          <div className={styles.typesGrid}>
            {helpTypes.map((type) => (
              <div key={type.id} className={type.active ? styles.typeCard : styles.typeCardDisabled}>
                <div className={styles.typeCardIcon}>
                  <i className={getTypeIcon(type.name)}></i>
                </div>
                <div className={styles.typeCardInfo}>
                  <h4>{type.name}</h4>
                  <p>Montant forfaitaire : <strong>{formatAmount(type.defaultAmount)} XAF</strong></p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className={styles.emptyState} style={{ padding: "2rem" }}>
            <p>Aucun type d&apos;aide configuré.</p>
          </div>
        )}
      </section>

      {/* History Table */}
      {historyHelps.length > 0 && (
        <section style={{ marginBottom: "3rem" }}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>Historique des aides</h2>
          </div>
          <div className={styles.tableWrapper}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Type d&apos;aide</th>
                  <th>Bénéficiaire</th>
                  <th>Montant final</th>
                  <th>Statut</th>
                </tr>
              </thead>
              <tbody>
                {historyHelps.map((help, index) => {
                  const typeName = help.helpType?.name || "Aide";
                  return (
                    <tr key={help.id} className="fade-in" style={{ opacity: 0.7 }}>
                      <td>
                        <div className={styles.typeCell}>
                          <div className={`${styles.typeIcon} ${getTypeIconClass(typeName)}`}>
                            <i className={getTypeIcon(typeName)}></i>
                          </div>
                          <div className={styles.typeName}>{typeName}</div>
                        </div>
                      </td>
                      <td>{help.member?.user?.firstName} {help.member?.user?.name}</td>
                      <td>{formatAmount(help.targetAmount)} XAF</td>
                      <td>
                        <span className={`${styles.statusTag} ${getStatusClass(help.status)}`}>
                          {getStatusLabel(help.status)}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </section>
      )}

      {/* Modal Formulation */}
      {showModal && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent}>
            <h2 className={styles.modalTitle}>Demande d&apos;aide</h2>
            <p className={styles.modalSubtitle}>Complétez les informations pour soumettre votre dossier au Secrétariat Général.</p>

            <form onSubmit={handleSubmit}>
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Nature de l&apos;aide</label>
                <select
                  className={styles.select}
                  value={selectedType}
                  onChange={(e) => setSelectedType(e.target.value)}
                  required
                >
                  <option value="">Sélectionnez un type...</option>
                  {helpTypes.filter(t => t.active).map(t => (
                    <option key={t.id} value={t.id}>{t.name} ({formatAmount(t.defaultAmount)} XAF)</option>
                  ))}
                </select>
              </div>

              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Motif / Justification</label>
                <textarea
                  className={styles.textarea}
                  placeholder="Expliquez brièvement la situation..."
                  value={motive}
                  onChange={(e) => setMotive(e.target.value)}
                  required
                ></textarea>
              </div>

              <div className={styles.modalActions}>
                <button type="button" className={styles.btnCancel} onClick={() => setShowModal(false)}>Annuler</button>
                <button type="submit" className={styles.btnSubmit} disabled={submitting}>
                  {submitting ? <i className="fas fa-spinner fa-spin"></i> : "Soumettre la demande"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
