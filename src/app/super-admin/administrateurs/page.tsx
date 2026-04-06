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
  AdminData,
} from "@/services/superAdminService";

type ModalType = "add" | "delete" | "deactivate" | "activate" | "password" | null;

export default function AdminManagementPage() {
  const { t } = useTranslation();
  const [admins, setAdmins] = useState<AdminData[]>([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState<ModalType>(null);
  const [selectedAdmin, setSelectedAdmin] = useState<AdminData | null>(null);
  const [toast, setToast] = useState<{ type: "success" | "error"; message: string } | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [showAddPassword, setShowAddPassword] = useState(false);
  const [showChangePassword, setShowChangePassword] = useState(false)

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

  async function handleActivate() {
    if (!selectedAdmin) return;
    console.log(`Attempting to activate administrator ID: ${selectedAdmin.id} (${selectedAdmin.user.email})`);
    setSubmitting(true);
    try {
      await activateAdmin(selectedAdmin.id);
      console.log("Administrator activated successfully.");
      showToast("success", t.superAdmin.succes);
      setModal(null);
      loadAdmins();
    } catch (err: unknown) {
      console.error("Error activating administrator:", err);
      showToast("error", err instanceof Error ? err.message : t.superAdmin.erreur);
    } finally {
      setSubmitting(false);
    }
  }

  async function handleDeactivate() {
    if (!selectedAdmin) return;
    console.log(`Attempting to deactivate administrator ID: ${selectedAdmin.id} (${selectedAdmin.user.email})`);
    setSubmitting(true);
    try {
      await deactivateAdmin(selectedAdmin.id);
      console.log("Administrator deactivated successfully.");
      showToast("success", t.superAdmin.succes);
      setModal(null);
      loadAdmins();
    } catch (err: unknown) {
      console.error("Error deactivating administrator:", err);
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
        <button className={styles.addBtn} onClick={() => openModal("add")}>
          <i className="fas fa-plus"></i>
          {t.superAdmin.ajouterAdmin}
        </button>
      </div>

      {/* Admin Cards Grid */}
      {admins.length === 0 ? (
        <div className={styles.emptyState}>
          <div className={styles.emptyIcon}><i className="fas fa-user-shield"></i></div>
          <p>{t.superAdmin.aucunAdmin}</p>
        </div>
      ) : (
        <div className={styles.grid}>
          {admins.map((admin) => (
            <div key={admin.id} className={styles.card}>
              <div className={styles.cardHeader}>
                <div className={styles.avatar}>
                  <i className="fas fa-user-shield"></i>
                </div>
                <div style={{ flex: 1 }}>
                  <div className={styles.adminName}>
                    {admin.user.firstName} {admin.user.name}
                  </div>
                  <div className={styles.adminEmail}>{admin.user.email}</div>
                </div>
                <span className={`${styles.badge} ${admin.active ? styles.badgeActive : styles.badgeInactive}`}>
                  <i className="fas fa-circle" style={{ fontSize: "0.4rem" }}></i>
                  {admin.active ? t.superAdmin.actif : t.superAdmin.inactif}
                </span>
              </div>
              <div className={styles.cardBody}>
                <div className={styles.infoRow}>
                  <i className="fas fa-id-badge"></i>
                  <span>{admin.username}</span>
                </div>
                <div className={styles.infoRow}>
                  <i className="fas fa-shield-alt"></i>
                  <span className={styles.roleTag}>{getRoleName(admin.adminRole)}</span>
                </div>
                {admin.user.tel && (
                  <div className={styles.infoRow}>
                    <i className="fas fa-phone"></i>
                    <span>{admin.user.tel}</span>
                  </div>
                )}
              </div>
              <div className={styles.cardFooter}>
                <button className={`${styles.actionBtn} ${styles.btnPassword}`} onClick={() => openModal("password", admin)}>
                  <i className="fas fa-key"></i> {t.superAdmin.changerMotDePasse}
                </button>
                {admin.active ? (
                  <button className={`${styles.actionBtn} ${styles.btnDeactivate}`} onClick={() => openModal("deactivate", admin)}>
                    <i className="fas fa-ban"></i> {t.superAdmin.desactiverAdmin}
                  </button>
                ) : (
                  <button className={`${styles.actionBtn} ${styles.btnActivate}`} onClick={() => openModal("activate", admin)}>
                    <i className="fas fa-check-circle"></i> {t.superAdmin.activerAdmin}
                  </button>
                )}
                <button className={`${styles.actionBtn} ${styles.btnDelete}`} onClick={() => openModal("delete", admin)}>
                  <i className="fas fa-trash"></i>
                </button>
              </div>
            </div>
          ))}
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

      {/* Activate Modal */}
      {modal === "activate" && selectedAdmin && (
        <div className={styles.modalOverlay} onClick={() => setModal(null)}>
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h3>{t.superAdmin.confirmerActivation}</h3>
              <button className={styles.modalClose} onClick={() => setModal(null)}>
                <i className="fas fa-times"></i>
              </button>
            </div>
            <div className={styles.modalBody}>
              <div className={styles.modalIcon} style={{ color: "var(--success-color, #1cc88a)" }}><i className="fas fa-check-circle"></i></div>
              <p className={styles.warningText}>
                {t.superAdmin.confirmActivateAdmin}
                <br /><strong>{selectedAdmin.user.firstName} {selectedAdmin.user.name}</strong>
              </p>
              <div className={styles.modalActions}>
                <button className={styles.cancelBtn} onClick={() => setModal(null)}>
                  {t.dashboard.annuler}
                </button>
                <button className={`${styles.submitBtn}`} style={{ backgroundColor: "var(--success-color, #1cc88a)" }} onClick={handleActivate} disabled={submitting}>
                  {submitting ? "..." : t.superAdmin.confirmer}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Deactivate Modal */}
      {modal === "deactivate" && selectedAdmin && (
        <div className={styles.modalOverlay} onClick={() => setModal(null)}>
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h3>{t.superAdmin.confirmerDesactivation}</h3>
              <button className={styles.modalClose} onClick={() => setModal(null)}>
                <i className="fas fa-times"></i>
              </button>
            </div>
            <div className={styles.modalBody}>
              <div className={styles.modalIcon}><i className="fas fa-ban"></i></div>
              <p className={styles.warningText}>
                {t.superAdmin.confirmDeactivateAdmin}
                <br /><strong>{selectedAdmin.user.firstName} {selectedAdmin.user.name}</strong>
              </p>
              <div className={styles.modalActions}>
                <button className={styles.cancelBtn} onClick={() => setModal(null)}>
                  {t.dashboard.annuler}
                </button>
                <button className={`${styles.submitBtn} ${styles.dangerBtn}`} onClick={handleDeactivate} disabled={submitting}>
                  {submitting ? "..." : t.superAdmin.confirmer}
                </button>
              </div>
            </div>
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
                <br /><strong>{selectedAdmin.user.firstName} {selectedAdmin.user.name}</strong>
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
                <span><strong>{selectedAdmin.user.firstName} {selectedAdmin.user.name}</strong> ({selectedAdmin.user.email})</span>
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
    </div>
  );
}
