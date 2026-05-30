"use client";

import { useEffect, useState, useRef } from "react";
import styles from "./membres.module.css";
import { useTranslation } from "@/context/LanguageContext";
import { secretaryService } from "@/services/secretaryService";
import { useNotification } from "@/context/NotificationContext";

export default function MembresPage() {
  const { t, locale } = useTranslation();
  const { showToast, confirm } = useNotification();
  const [members, setMembers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [showCsvModal, setShowCsvModal] = useState(false);
  const [csvUploading, setCsvUploading] = useState(false);
  const [csvResult, setCsvResult] = useState<any>(null);
  const csvInputRef = useRef<HTMLInputElement>(null);

  async function loadMembers() {
    try {
      setLoading(true);
      const data = await secretaryService.getAllMembers();
      setMembers(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  const handleDeleteMember = (member: any) => {
    const fullName = `${member.user?.firstName} ${member.user?.name}`;
    confirm({
      title: locale === "fr" ? "Supprimer le membre" : "Delete Member",
      message: locale === "fr"
        ? `Êtes-vous sûr de vouloir supprimer ${fullName} ? Le membre sera désactivé et son profil archivé, mais ses données historiques seront conservées.`
        : `Are you sure you want to delete ${fullName}? The member will be deactivated and their profile archived, but their historical data will be preserved.`,
      type: "danger",
      confirmText: locale === "fr" ? "Supprimer le membre" : "Delete Member",
      requiredConfirmValue: fullName,
      showMotiveInput: true,
      motivePlaceholder: locale === "fr" ? "Indiquez la raison de l'exclusion ou du départ..." : "State the reason for exclusion or departure...",
      onConfirm: async (motive) => {
        try {
          await secretaryService.deleteMember(member.id, motive);
          showToast(locale === "fr" ? "Membre supprimé avec succès." : "Member deleted successfully.", "success");
          loadMembers();
        } catch (err: any) {
          showToast(err.message || (locale === "fr" ? "Erreur lors de la suppression." : "Error during deletion."), "error");
        }
      }
    });
  };

  useEffect(() => {
    loadMembers();
  }, []);

  function formatAmount(n: number) {
    return (n || 0).toLocaleString(locale === "fr" ? "fr-FR" : "en-US");
  }

  async function handleCsvUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setCsvUploading(true);
    setCsvResult(null);
    try {
      const result = await secretaryService.importMembersCsv(file);
      setCsvResult(result);
      loadMembers();
    } catch (err: any) {
      setCsvResult({ error: true, message: err.message || t.superAdmin.erreur });
    } finally {
      setCsvUploading(false);
      if (csvInputRef.current) csvInputRef.current.value = "";
    }
  }

  const filtered = members.filter((m) =>
    `${m.user?.firstName} ${m.user?.name} ${m.username}`
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  if (loading) return <div className={styles.loading}>{t.membres.chargementMembres}</div>;
  if (error) return <div className={styles.error}>{t.superAdmin.erreur}: {error}</div>;

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>{t.membres.titre}</h1>
          <p className={styles.subtitle}>{members.length} {t.membres.sousTitre}</p>
        </div>
        <div style={{ display: "flex", gap: "0.75rem" }}>
          <button
            className={styles.addBtn}
            style={{ background: "linear-gradient(135deg, #1cc88a, #13a56d)" }}
            onClick={() => { setCsvResult(null); setShowCsvModal(true); }}
          >
            <i className="fas fa-file-csv"></i>
            {locale === "fr" ? "Importer CSV" : "Import CSV"}
          </button>
          <a href="/admin/membres/nouveau" className={styles.addBtn}>
            <i className="fas fa-plus"></i>
            {t.membres.nouveau}
          </a>
        </div>
      </div>

      <div className={styles.searchBar}>
        <i className="fas fa-search"></i>
        <input
          type="text"
          placeholder={t.membres.rechercher}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {filtered.length > 0 ? (
        <div className={styles.tableCard} style={{ background: "var(--white)", borderRadius: "20px", border: "1px solid var(--border-color)", overflow: "hidden", padding: "0.5rem" }}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th style={{ width: "60px" }}></th>
                <th>{t.membres.titre.slice(0, -1)}</th>
                <th>{t.common.nomUtilisateur}</th>
                <th>{t.membres.telephone}</th>
                <th>{t.membres.epargne}</th>
                <th>{t.membres.statut}</th>
                <th style={{ textAlign: "right" }}>{t.dashboard.actions}</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((member) => (
                <tr key={member.id}>
                  <td>
                    <div className={styles.avatar} style={{ width: "40px", height: "40px", fontSize: "0.8rem", borderRadius: "10px" }}>
                      {member.user?.firstName?.[0]}{member.user?.name?.[0]}
                    </div>
                  </td>
                  <td>
                    <div style={{ display: "flex", flexDirection: "column" }}>
                      <span style={{ fontWeight: 700, color: "var(--text-dark)" }}>{member.user?.firstName} {member.user?.name}</span>
                      <span style={{ fontSize: "0.75rem", color: "#858796" }}>{member.user?.email || (locale === "fr" ? "Pas d'email" : "No email")}</span>
                    </div>
                  </td>
                  <td>
                    <div style={{ display: "flex", flexDirection: "column" }}>
                      <span style={{ fontWeight: 600, color: "#4e73df", fontSize: "0.85rem" }}>
                        @{member.username}
                      </span>
                    </div>
                  </td>
                  <td style={{ fontSize: "0.9rem", color: "var(--text-muted)" }}>
                    {member.user?.tel || "N/A"}
                  </td>
                  <td>
                    <strong className={styles.savingsValue}>{formatAmount(member.savingsTotal)} XAF</strong>
                  </td>
                  <td>
                    <span className={`${styles.badge} ${member.calculatedStatus === 'EN_REGLE' ? styles.badgeActive : (member.calculatedStatus === 'INACTIF' ? styles.badgeInactive : styles.badgePending)}`}>
                      {member.calculatedStatus === 'EN_REGLE' ? (locale === "fr" ? 'En Règle' : 'In Order') : (member.calculatedStatus === 'INACTIF' ? t.membres.inactif : (locale === "fr" ? 'Insolvable' : 'Insolvent'))}
                    </span>
                  </td>
                  <td>
                    <div style={{ display: "flex", justifyContent: "flex-end", gap: "0.5rem" }}>
                      <a href={`/admin/membres/${member.id}`} className={styles.viewBtn} style={{ padding: "0.5rem 1rem", minWidth: "auto" }}>
                        <i className="fas fa-eye"></i> {t.membres.details}
                      </a>
                      <button
                        onClick={() => handleDeleteMember(member)}
                        className={styles.viewBtn}
                        style={{ padding: "0.5rem 1rem", minWidth: "auto", background: "rgba(231, 74, 59, 0.05)", color: "#e74a3b", borderColor: "rgba(231, 74, 59, 0.2)" }}
                      >
                        <i className="fas fa-trash-alt"></i>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className={styles.emptyState}>
          <div className={styles.emptyIcon}>
            <i className="fas fa-users"></i>
          </div>
          <h3>{members.length === 0 ? t.membres.aucunMembre : (locale === "fr" ? "Aucun résultat trouvé" : "No results found")}</h3>
          <p>{members.length === 0 ? t.membres.commencezInscription : (locale === "fr" ? "Essayez de rechercher avec un autre nom ou identifiant." : "Try searching with another name or identifier.")}</p>
          {members.length === 0 && (
            <a href="/admin/membres/nouveau" className={styles.addBtn}>
              <i className="fas fa-plus"></i> {t.membres.premierMembre}
            </a>
          )}
        </div>
      )}

      {/* CSV Import Modal */}
      {showCsvModal && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", backdropFilter: "blur(4px)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 9999 }} onClick={() => setShowCsvModal(false)}>
          <div style={{ background: "var(--white)", borderRadius: "20px", width: "90%", maxWidth: "600px", overflow: "hidden", boxShadow: "var(--shadow-xl)" }} onClick={(e) => e.stopPropagation()}>
            <div style={{ background: "linear-gradient(135deg, #1cc88a, #13a56d)", color: "white", padding: "1.5rem 2rem", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <h3 style={{ margin: 0, fontSize: "1.1rem", fontWeight: 700 }}><i className="fas fa-file-csv"></i> {t.membres.importerCsv}</h3>
              <button onClick={() => setShowCsvModal(false)} style={{ background: "rgba(255,255,255,0.15)", border: "none", color: "white", width: 32, height: 32, borderRadius: 8, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}><i className="fas fa-times"></i></button>
            </div>
            <div style={{ padding: "2rem" }}>
              <div style={{ background: "#f0fdf4", border: "1px solid #bbf7d0", borderRadius: "12px", padding: "1rem 1.25rem", marginBottom: "1.5rem" }}>
                <p style={{ fontWeight: 700, fontSize: "0.85rem", color: "#166534", marginBottom: "0.5rem" }}><i className="fas fa-info-circle"></i> {t.membres.formatFichier}</p>
                <p style={{ fontSize: "0.8rem", color: "#15803d", margin: 0, lineHeight: 1.6 }}>
                  {locale === "fr" ? "En-tête requis :" : "Required header:"} <code style={{ background: "#dcfce7", padding: "0.1rem 0.3rem", borderRadius: 4 }}>nom;prenom;email;username;telephone;adresse</code><br />
                  <strong>{t.membres.champsObligatoires}</strong> <code>username</code><br />
                  {locale === "fr" ? "Séparateur : virgule (,) ou point-virgule (;)" : "Separator: comma (,) or semicolon (;)"}
                </p>
              </div>

              <label htmlFor="csv-member-input" style={{
                display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
                border: "2px dashed #cbd5e1", borderRadius: "16px", padding: "2rem", cursor: "pointer",
                transition: "all 0.2s", background: "#fafbfc", marginBottom: "1rem"
              }}>
                {csvUploading ? (
                  <>
                    <i className="fas fa-spinner fa-spin" style={{ fontSize: "2rem", color: "#1cc88a", marginBottom: "0.75rem" }}></i>
                    <span style={{ fontWeight: 600, color: "#4a5568" }}>{locale === "fr" ? "Import en cours..." : "Import in progress..."}</span>
                  </>
                ) : (
                  <>
                    <i className="fas fa-cloud-upload-alt" style={{ fontSize: "2rem", color: "#94a3b8", marginBottom: "0.75rem" }}></i>
                    <span style={{ fontWeight: 600, color: "#4a5568" }}>{t.membres.cliquezDeposez}</span>
                    <span style={{ fontSize: "0.75rem", color: "#94a3b8", marginTop: "0.25rem" }}>{locale === "fr" ? "Formats acceptés : .csv" : "Accepted formats: .csv"}</span>
                  </>
                )}
              </label>
              <input ref={csvInputRef} id="csv-member-input" type="file" accept=".csv" style={{ display: "none" }} onChange={handleCsvUpload} />

              {csvResult && !csvResult.error && (
                <div style={{ marginTop: "1rem" }}>
                  <div style={{ display: "flex", gap: "1rem", marginBottom: "1rem" }}>
                    <div style={{ flex: 1, background: "#f0fdf4", borderRadius: "10px", padding: "0.75rem 1rem", textAlign: "center" }}>
                      <div style={{ fontSize: "1.5rem", fontWeight: 800, color: "#16a34a" }}>{csvResult.successCount}</div>
                      <div style={{ fontSize: "0.75rem", color: "#15803d" }}>{t.membres.reussis}</div>
                    </div>
                    <div style={{ flex: 1, background: csvResult.errorCount > 0 ? "#fef2f2" : "#f8fafc", borderRadius: "10px", padding: "0.75rem 1rem", textAlign: "center" }}>
                      <div style={{ fontSize: "1.5rem", fontWeight: 800, color: csvResult.errorCount > 0 ? "#dc2626" : "#94a3b8" }}>{csvResult.errorCount}</div>
                      <div style={{ fontSize: "0.75rem", color: csvResult.errorCount > 0 ? "#b91c1c" : "#94a3b8" }}>{t.membres.erreurs}</div>
                    </div>
                  </div>
                  {csvResult.details?.filter((d: any) => d.status === "error").length > 0 && (
                    <div style={{ maxHeight: "150px", overflow: "auto", fontSize: "0.8rem", color: "#dc2626", background: "#fef2f2", borderRadius: "8px", padding: "0.75rem" }}>
                      {csvResult.details.filter((d: any) => d.status === "error").map((d: any, i: number) => (
                        <div key={i}>{locale === "fr" ? "Ligne" : "Line"} {d.line} ({d.username}): {d.message}</div>
                      ))}
                    </div>
                  )}
                </div>
              )}
              {csvResult?.error && (
                <div style={{ marginTop: "1rem", background: "#fef2f2", borderRadius: "10px", padding: "1rem", color: "#dc2626", fontSize: "0.85rem" }}>
                  <i className="fas fa-exclamation-circle"></i> {csvResult.message}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
