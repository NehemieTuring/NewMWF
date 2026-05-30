"use client";

import { useState, useEffect, useCallback } from "react";
import styles from "./admins.module.css";
import { useTranslation } from "@/context/LanguageContext";
import {
  getAllAdmins,
  createAdmin,
  deactivateAdmin,
  activateAdmin,
  deleteAdmin,
  changeUserPasswordByEmail,
  importAdminsCsv,
  AdminData,
} from "@/services/superAdminService";
import { useRef } from "react";

type ModalType = "add" | "delete" | "password" | null;

export default function AdminManagementPage() {
  const { t, locale } = useTranslation();
  const [admins, setAdmins] = useState<AdminData[]>([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState<ModalType>(null);
  const [selectedAdmin, setSelectedAdmin] = useState<AdminData | null>(null);
  const [toast, setToast] = useState<{ type: "success" | "error"; message: string } | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [showAddPassword, setShowAddPassword] = useState(false);
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [showCsvModal, setShowCsvModal] = useState(false);
  const [csvUploading, setCsvUploading] = useState(false);
  const [csvResult, setCsvResult] = useState<any>(null);
  const csvInputRef = useRef<HTMLInputElement>(null);

  // Form state for adding admin
  const [addForm, setAddForm] = useState({
    name: "", firstName: "", email: "", username: "", password: "", role: "",
  });

  // Form state for password change
  const [newPassword, setNewPassword] = useState("");

  const loadAdmins = useCallback(async () => {
    try {
      console.log("Loading all administrators...");
      setLoading(true);
      const data = await getAllAdmins();
      console.log(`Successfully loaded ${data.length} administrators.`);
      setAdmins(data);
    } catch (err: unknown) {
      console.error("Failed to load administrators:", err);
      showToast("error", t.superAdmin.erreur);
    } finally {
      setLoading(false);
    }
  }, [t.superAdmin.erreur]);

  useEffect(() => {
    loadAdmins();
  }, [loadAdmins]);

  function showToast(type: "success" | "error", message: string) {
    setToast({ type, message });
    setTimeout(() => setToast(null), 3000);
  }

  function openModal(type: ModalType, admin?: AdminData) {
    setModal(type);
    setSelectedAdmin(admin || null);
    if (type === "add") {
      setAddForm({ name: "", firstName: "", email: "", username: "", password: "", role: "" });
      setShowAddPassword(false);
    }
    if (type === "password") {
      setNewPassword("");
      setShowChangePassword(false);
    }
  }

  async function handleAddAdmin(e: React.FormEvent) {
    e.preventDefault();
    if (!addForm.role) return;
    console.log("Attempting to create a new administrator:", { ...addForm, password: "***" });
    setSubmitting(true);
    try {
      const result = await createAdmin(addForm);
      console.log("Administrator created successfully:", result);
      showToast("success", t.superAdmin.succes);
      setModal(null);
      loadAdmins();
    } catch (err: unknown) {
      console.error("Error creating administrator:", err);
      showToast("error", err instanceof Error ? err.message : t.superAdmin.erreur);
    } finally {
      setSubmitting(false);
    }
  }


  async function handleDelete() {
    if (!selectedAdmin) return;
    console.log(`Attempting to delete administrator ID: ${selectedAdmin.id} (${selectedAdmin.user.email})`);
    setSubmitting(true);
    try {
      await deleteAdmin(selectedAdmin.id);
      console.log("Administrator deleted successfully.");
      showToast("success", t.superAdmin.succes);
      setModal(null);
      loadAdmins();
    } catch (err: unknown) {
      console.error("Error deleting administrator:", err);
      showToast("error", err instanceof Error ? err.message : t.superAdmin.erreur);
    } finally {
      setSubmitting(false);
    }
  }

  async function handleChangePassword(e: React.FormEvent) {
    e.preventDefault();
    if (!selectedAdmin || !newPassword) return;
    console.log(`Attempting to change password for user email: ${selectedAdmin.user.email}`);
    setSubmitting(true);
    try {
      await changeUserPasswordByEmail(selectedAdmin.user.email, newPassword);
      console.log("Password changed successfully.");
      showToast("success", t.superAdmin.succes);
      setModal(null);
    } catch (err: unknown) {
      console.error("Error changing password:", err);
      showToast("error", err instanceof Error ? err.message : t.superAdmin.erreur);
    } finally {
      setSubmitting(false);
    }
  }

  function getRoleName(role: string): string {
    switch (role) {
      case "SECRETAIRE_GENERALE": return t.superAdmin.secretaireGenerale;
      case "PRESIDENT": return t.superAdmin.president;
      case "TRESORIER": return t.superAdmin.tresorier;
      default: return role;
    }
  }

  async function handleCsvUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setCsvUploading(true);
    setCsvResult(null);
    try {
      const result = await importAdminsCsv(file);
      setCsvResult(result);
      loadAdmins();
    } catch (err: any) {
      setCsvResult({ error: true, message: err.message || "Erreur lors de l'import." });
    } finally {
      setCsvUploading(false);
      if (csvInputRef.current) csvInputRef.current.value = "";
    }
  }

  if (loading) {
    return (
      <div className={styles.page}>
        <div className={styles.loading}>
          <i className="fas fa-spinner"></i> {t.common.connexionEnCours}
        </div>
      </div>
    );
  }

  return (
    <div className={styles.page}>
      {/* Header */}
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>{t.superAdmin.gestionAdmins}</h1>
          <p className={styles.subtitle}>{admins.length} {t.admin.administrateurs.toLowerCase()}</p>
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
          <button className={styles.addBtn} onClick={() => openModal("add")}>
            <i className="fas fa-plus"></i>
            {t.superAdmin.ajouterAdmin}
          </button>
        </div>
      </div>

      {/* Admin Cards Grid */}
      {admins.length === 0 ? (
        <div className={styles.emptyState}>
          <div className={styles.emptyIcon}><i className="fas fa-user-shield"></i></div>
          <p>{t.superAdmin.aucunAdmin}</p>
        </div>
      ) : (
        <div className={styles.tableCard}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>{t.admin.administrateurs}</th>
                <th>{t.superAdmin.usernameAdmin}</th>
                <th>{t.superAdmin.roleAdmin}</th>
                <th>{t.dashboard.statut}</th>
                <th style={{ textAlign: "right" }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {admins.map((admin) => (
                <tr key={admin.id}>
                  <td>
                    <div className={styles.adminIdentity}>
                      <div className={styles.tableAvatar}>
                        <i className="fas fa-user-shield"></i>
                      </div>
                      <div>
                        <div className={styles.adminNameTable}>
                          {admin.user?.firstName} {admin.user?.name}
                        </div>
                        <div className={styles.adminEmailTable}>{admin.user?.email}</div>
                      </div>
                    </div>
                  </td>
                  <td>
                    <span className={styles.usernameText}>@{admin.username}</span>
                  </td>
                  <td>
                    <span className={styles.roleBadge}>{getRoleName(admin.adminRole)}</span>
                  </td>
                  <td>
                    <span className={`${styles.badge} ${admin.active ? styles.badgeActive : styles.badgeInactive}`}>
                      <i className="fas fa-circle" style={{ fontSize: "0.4rem" }}></i>
                      {admin.active ? t.superAdmin.actif : t.superAdmin.inactif}
                    </span>
                  </td>
                  <td style={{ textAlign: "right" }}>
                    <div className={styles.tableActions}>
                      <button className={styles.iconBtn} onClick={() => openModal("password", admin)} title={t.superAdmin.changerMotDePasse}>
                        <i className="fas fa-key"></i>
                      </button>
                      {/* Retrait des boutons d'activation/désactivation selon la demande utilisateur */}
                      <button className={`${styles.iconBtn} ${styles.btnDeleteIcon}`} onClick={() => openModal("delete", admin)} title={t.superAdmin.supprimerAdmin}>
                        <i className="fas fa-trash"></i>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Add Admin Modal */}
      {modal === "add" && (
        <div className={styles.modalOverlay} onClick={() => setModal(null)}>
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h3>{t.superAdmin.ajouterAdmin}</h3>
              <button className={styles.modalClose} onClick={() => setModal(null)}>
                <i className="fas fa-times"></i>
              </button>
            </div>
            <form className={styles.modalBody} onSubmit={handleAddAdmin}>
              <div className={styles.formGroup}>
                <label>{t.superAdmin.nomAdmin}</label>
                <input className={styles.formInput} type="text" required
                  value={addForm.name} onChange={(e) => setAddForm({ ...addForm, name: e.target.value })} />
              </div>
              <div className={styles.formGroup}>
                <label>{t.superAdmin.prenomAdmin}</label>
                <input className={styles.formInput} type="text" required
                  value={addForm.firstName} onChange={(e) => setAddForm({ ...addForm, firstName: e.target.value })} />
              </div>
              <div className={styles.formGroup}>
                <label>{t.superAdmin.emailAdmin}</label>
                <input className={styles.formInput} type="email" required
                  value={addForm.email} onChange={(e) => setAddForm({ ...addForm, email: e.target.value })} />
              </div>
              <div className={styles.formGroup}>
                <label>{t.superAdmin.usernameAdmin}</label>
                <input className={styles.formInput} type="text" required
                  value={addForm.username} onChange={(e) => setAddForm({ ...addForm, username: e.target.value })} />
              </div>
              <div className={styles.formGroup}>
                <label>{t.superAdmin.motDePasseAdmin}</label>
                <div className={styles.passwordWrapper}>
                  <input className={styles.formInput} type={showAddPassword ? "text" : "password"} required
                    value={addForm.password} onChange={(e) => setAddForm({ ...addForm, password: e.target.value })} />
                  <button type="button" className={styles.eyeBtn} onClick={() => setShowAddPassword(!showAddPassword)}>
                    <i className={showAddPassword ? "fas fa-eye-slash" : "fas fa-eye"}></i>
                  </button>
                </div>
              </div>
              <div className={styles.formGroup}>
                <label>{t.superAdmin.roleAdmin}</label>
                <select className={styles.formSelect} required
                  value={addForm.role} onChange={(e) => setAddForm({ ...addForm, role: e.target.value })}>
                  <option value="">{t.superAdmin.selectionnerRole}</option>
                  <option value="SECRETAIRE_GENERALE">{t.superAdmin.secretaireGenerale}</option>
                  <option value="PRESIDENT">{t.superAdmin.president}</option>
                  <option value="TRESORIER">{t.superAdmin.tresorier}</option>
                </select>
              </div>
              <div className={styles.modalActions}>
                <button type="button" className={styles.cancelBtn} onClick={() => setModal(null)}>
                  {t.dashboard.annuler}
                </button>
                <button type="submit" className={styles.submitBtn} disabled={submitting}>
                  <i className="fas fa-plus"></i>
                  {submitting ? "..." : t.superAdmin.ajouterAdmin}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}


      {/* Delete Modal */}
      {modal === "delete" && selectedAdmin && (
        <div className={styles.modalOverlay} onClick={() => setModal(null)}>
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h3>{t.superAdmin.confirmerSuppression}</h3>
              <button className={styles.modalClose} onClick={() => setModal(null)}>
                <i className="fas fa-times"></i>
              </button>
            </div>
            <div className={styles.modalBody}>
              <div className={styles.modalIcon}><i className="fas fa-exclamation-triangle"></i></div>
              <p className={styles.warningText}>
                {t.superAdmin.confirmDeleteAdmin}
                <br /><strong>{selectedAdmin.user?.firstName} {selectedAdmin.user?.name}</strong>
              </p>
              <div className={styles.modalActions}>
                <button className={styles.cancelBtn} onClick={() => setModal(null)}>
                  {t.dashboard.annuler}
                </button>
                <button className={`${styles.submitBtn} ${styles.dangerBtn}`} onClick={handleDelete} disabled={submitting}>
                  <i className="fas fa-trash"></i>
                  {submitting ? "..." : t.superAdmin.supprimerAdmin}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Password Modal */}
      {modal === "password" && selectedAdmin && (
        <div className={styles.modalOverlay} onClick={() => setModal(null)}>
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h3>{t.superAdmin.changerMotDePasse}</h3>
              <button className={styles.modalClose} onClick={() => setModal(null)}>
                <i className="fas fa-times"></i>
              </button>
            </div>
            <form className={styles.modalBody} onSubmit={handleChangePassword}>
              <div className={styles.infoRow} style={{ marginBottom: "1.25rem", padding: "0.75rem 1rem", background: "rgba(78,115,223,0.05)", borderRadius: "10px" }}>
                <i className="fas fa-user"></i>
                <span><strong>{selectedAdmin.user?.firstName} {selectedAdmin.user?.name}</strong> ({selectedAdmin.user.email})</span>
              </div>
              <div className={styles.formGroup}>
                <label>{t.superAdmin.nouveauMotDePasse}</label>
                <div className={styles.passwordWrapper}>
                  <input className={styles.formInput} type={showChangePassword ? "text" : "password"} required minLength={4}
                    value={newPassword} onChange={(e) => setNewPassword(e.target.value)} />
                  <button type="button" className={styles.eyeBtn} onClick={() => setShowChangePassword(!showChangePassword)}>
                    <i className={showChangePassword ? "fas fa-eye-slash" : "fas fa-eye"}></i>
                  </button>
                </div>
              </div>
              <div className={styles.modalActions}>
                <button type="button" className={styles.cancelBtn} onClick={() => setModal(null)}>
                  {t.dashboard.annuler}
                </button>
                <button type="submit" className={styles.submitBtn} disabled={submitting}>
                  <i className="fas fa-key"></i>
                  {submitting ? "..." : t.superAdmin.confirmer}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Toast */}
      {toast && (
        <div className={`${styles.toast} ${toast.type === "success" ? styles.toastSuccess : styles.toastError}`}>
          <i className={`fas ${toast.type === "success" ? "fa-check-circle" : "fa-exclamation-circle"}`}></i>
          {toast.message}
        </div>
      )}

      {/* CSV Import Modal */}
      {showCsvModal && (
        <div className={styles.modalOverlay} onClick={() => setShowCsvModal(false)}>
          <div className={styles.modal} style={{ maxWidth: "600px" }} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader} style={{ background: "linear-gradient(135deg, #1cc88a, #13a56d)", color: "white" }}>
              <h3 style={{ color: "white" }}><i className="fas fa-file-csv"></i> {locale === "fr" ? "Importer des administrateurs via CSV" : "Import administrators via CSV"}</h3>
              <button className={styles.modalClose} style={{ color: "white" }} onClick={() => setShowCsvModal(false)}>
                <i className="fas fa-times"></i>
              </button>
            </div>
            <div className={styles.modalBody} style={{ padding: "1.5rem" }}>
              {/* Format instructions */}
              <div style={{ background: "#f0fdf4", border: "1px solid #bbf7d0", borderRadius: "12px", padding: "1rem", marginBottom: "1.5rem" }}>
                <p style={{ fontWeight: 700, fontSize: "0.85rem", color: "#166534", marginBottom: "0.5rem" }}>
                  <i className="fas fa-info-circle"></i> {locale === "fr" ? "Format du fichier CSV" : "CSV File Format"}
                </p>
                <p style={{ fontSize: "0.8rem", color: "#15803d", margin: 0, lineHeight: 1.6 }}>
                  {locale === "fr" ? "En-tête requis :" : "Required header:"} <code style={{ background: "#dcfce7", padding: "0.1rem 0.3rem", borderRadius: 4 }}>nom;prenom;email;username;role</code><br />
                  <strong>{locale === "fr" ? "Champs obligatoires :" : "Required fields:"}</strong> <code>username</code>, <code>role</code><br />
                  <strong>{locale === "fr" ? "Rôles valides :" : "Valid roles:"}</strong> <code>SECRETAIRE_GENERALE</code>, <code>PRESIDENT</code>, <code>TRESORIER</code>
                </p>
              </div>

              {/* Upload zone */}
              <label htmlFor="csv-admin-input" style={{
                display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
                border: "2px dashed #cbd5e1", borderRadius: "16px", padding: "2rem", cursor: "pointer",
                transition: "all 0.2s", background: "#fafbfc", marginBottom: "1rem"
              }}>
                {csvUploading ? (
                  <>
                    <i className="fas fa-spinner fa-spin" style={{ fontSize: "2rem", color: "#1cc88a", marginBottom: "0.75rem" }}></i>
                    <span style={{ fontWeight: 600, color: "#4a5568" }}>{locale === "fr" ? "Import en cours..." : "Importing..."}</span>
                  </>
                ) : (
                  <>
                    <i className="fas fa-cloud-upload-alt" style={{ fontSize: "2rem", color: "#94a3b8", marginBottom: "0.75rem" }}></i>
                    <span style={{ fontWeight: 600, color: "#4a5568" }}>{locale === "fr" ? "Cliquez ou déposez votre fichier CSV" : "Click or drop your CSV file"}</span>
                    <span style={{ fontSize: "0.75rem", color: "#94a3b8", marginTop: "0.25rem" }}>{locale === "fr" ? "Format accepté : .csv" : "Accepted format: .csv"}</span>
                  </>
                )}
              </label>
              <input ref={csvInputRef} id="csv-admin-input" type="file" accept=".csv" style={{ display: "none" }} onChange={handleCsvUpload} />

              {/* Results */}
              {csvResult && !csvResult.error && (
                <div style={{ marginTop: "1rem" }}>
                  <div style={{ display: "flex", gap: "1rem", marginBottom: "1rem" }}>
                    <div style={{ flex: 1, background: "#f0fdf4", borderRadius: "10px", padding: "0.75rem 1rem", textAlign: "center" }}>
                      <div style={{ fontSize: "1.5rem", fontWeight: 800, color: "#16a34a" }}>{csvResult.successCount}</div>
                      <div style={{ fontSize: "0.75rem", color: "#15803d" }}>{locale === "fr" ? "Réussis" : "Success"}</div>
                    </div>
                    <div style={{ flex: 1, background: csvResult.errorCount > 0 ? "#fef2f2" : "#f8fafc", borderRadius: "10px", padding: "0.75rem 1rem", textAlign: "center" }}>
                      <div style={{ fontSize: "1.5rem", fontWeight: 800, color: csvResult.errorCount > 0 ? "#dc2626" : "#94a3b8" }}>{csvResult.errorCount}</div>
                      <div style={{ fontSize: "0.75rem", color: csvResult.errorCount > 0 ? "#b91c1c" : "#94a3b8" }}>{locale === "fr" ? "Erreurs" : "Errors"}</div>
                    </div>
                  </div>
                  {csvResult.details?.filter((d: any) => d.status === "error").length > 0 && (
                    <div style={{ maxHeight: "150px", overflow: "auto", fontSize: "0.8rem", color: "#dc2626", background: "#fef2f2", borderRadius: "8px", padding: "0.75rem" }}>
                      {csvResult.details.filter((d: any) => d.status === "error").map((d: any, i: number) => (
                        <div key={i}>Ligne {d.line} ({d.username}): {d.message}</div>
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
