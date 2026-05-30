"use client";

import { useEffect, useState } from "react";
import styles from "../membre.module.css";
import { useTranslation } from "@/context/LanguageContext";
import { useAuth } from "@/context/AuthContext";
import { memberService } from "@/services/memberService";
import { secretaryService } from "@/services/secretaryService";
import { presidentService } from "@/services/presidentService";
import { treasurerService } from "@/services/treasurerService";
import { superAdminService } from "@/services/superAdminService";
import { useNotification } from "@/context/NotificationContext";

type Tab = "infos" | "securite";

export default function MemberProfilPage() {
  const { t } = useTranslation();
  const { showToast } = useNotification();
  const { user: authUser, updateUser } = useAuth();
  const [activeTab, setActiveTab] = useState<Tab>("infos");
  const [profileData, setProfileData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Password states
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Editable fields
  const [editMode, setEditMode] = useState(false);
  const [editData, setEditData] = useState({ name: "", firstName: "", username: "", tel: "", address: "" });

  useEffect(() => {
    async function loadData() {
      try {
        const role = authUser?.role?.toUpperCase() || "";
        const subRole = authUser?.subRole?.toUpperCase() || "";

        let data;
        try {
          if (role === "SUPER_ADMIN") {
            data = await superAdminService.getProfile();
          } else if (subRole === "TRESORIER") {
            data = await treasurerService.getProfile().catch(() => memberService.getProfile());
          } else if (subRole === "PRESIDENT") {
            data = await presidentService.getProfile().catch(() => memberService.getProfile());
          } else if (subRole === "SECRETAIRE_GENERALE") {
            data = await secretaryService.getProfile().catch(() => memberService.getProfile());
          } else {
            data = await memberService.getProfile();
          }
        } catch (err: any) {
          // Fallback to member profile if specialized fails
          data = await memberService.getProfile().catch(() => null);
        }
        setProfileData(data);
      } catch (err) {
        console.error("Failed to load profile", err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [authUser?.role, authUser?.subRole]);

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      showToast("Les mots de passe ne correspondent pas", "error");
      return;
    }
    const role = authUser?.role?.toUpperCase() || "";
    const subRole = authUser?.subRole?.toUpperCase() || "";
    const isSuperAdmin = role === "SUPER_ADMIN";
    const isOperationalAdmin = role.includes("ADMIN") && !!subRole;

    try {
      if (isSuperAdmin) {
        await superAdminService.updatePassword(newPassword);
      } else if (subRole === "TRESORIER") {
        await treasurerService.updatePassword(newPassword).catch(() => memberService.updatePassword(newPassword));
      } else if (subRole === "PRESIDENT") {
        await presidentService.updatePassword(newPassword).catch(() => memberService.updatePassword(newPassword));
      } else if (subRole === "SECRETAIRE_GENERALE") {
        await secretaryService.updatePassword(newPassword).catch(() => memberService.updatePassword(newPassword));
      } else {
        await memberService.updatePassword(newPassword);
      }

      showToast("Mot de passe mis à jour avec succès", "success");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err: any) {
      showToast(err.message || "Erreur lors de la mise à jour", "error");
    }
  };

  if (loading) return (
    <div className={styles.container}>
      <div className={styles.loadingContainer}>
        <div className={styles.loadingSpinner}></div>
        <span className={styles.loadingText}>Chargement du profil...</span>
      </div>
    </div>
  );

  // Backend returns Member { user: { name, firstName, email, tel }, registrationNumber, address, ... }
  const memberData = profileData;
  const userData = memberData?.user || authUser;
  const displayName = userData?.name || (authUser as any)?.name || "";
  const displayFirstName = userData?.firstName || (authUser as any)?.firstName || "";
  const displayEmail = userData?.email || authUser?.email || "";
  const displayTel = userData?.tel || (authUser as any)?.tel || "Non renseigné";
  const memberAddress = userData?.address || (authUser as any)?.address || "Non renseignée";
  const inscriptionDate = memberData?.inscriptionDate;

  // Backend often uses 'avatar' field for the photo URL
  const userPhoto = userData?.avatar || userData?.photoUrl;
  const initials = (displayFirstName?.[0] || "") + (displayName?.[0] || userData?.username?.[0] || "U");

  function getRoleLabel() {
    const role = authUser?.role?.toUpperCase();
    const sub = authUser?.subRole?.toUpperCase();
    if (role === "SUPER_ADMIN") return "Super Administrateur";
    if (sub === "PRESIDENT") return "Président";
    if (sub === "TRESORIER") return "Trésorier";
    if (sub === "SECRETAIRE_GENERALE") return "Secrétaire Générale";
    return "Membre";
  }

  const startEdit = () => {
    setEditData({
      name: displayName,
      firstName: displayFirstName,
      username: profileData?.username || "",
      tel: displayTel === "Non renseigné" ? "" : displayTel,
      address: memberAddress === "Non renseignée" ? "" : memberAddress
    });
    setEditMode(true);
  };

  const handleSaveProfile = async () => {
    const role = authUser?.role?.toUpperCase() || "";
    const subRole = authUser?.subRole?.toUpperCase() || "";
    const isSuperAdmin = role === "SUPER_ADMIN";
    const isOperationalAdmin = role.includes("ADMIN") && !!subRole;

    try {
      if (isSuperAdmin) {
        await superAdminService.updateProfile(editData);
      } else if (subRole === "SECRETAIRE_GENERALE") {
        await secretaryService.updateProfile(editData);
      } else if (subRole === "TRESORIER") {
        await treasurerService.updateProfile(editData).catch(() => memberService.updateProfile(editData));
      } else if (subRole === "PRESIDENT") {
        await presidentService.updateProfile(editData).catch(() => memberService.updateProfile(editData));
      } else {
        await memberService.updateProfile(editData);
      }

      showToast("Profil mis à jour avec succès", "success");
      setEditMode(false);

      // Refresh data
      let data;
      if (isSuperAdmin) data = await superAdminService.getProfile();
      else if (subRole === "SECRETAIRE_GENERALE") data = await secretaryService.getProfile();
      else if (subRole === "TRESORIER") data = await treasurerService.getProfile().catch(() => memberService.getProfile());
      else if (subRole === "PRESIDENT") data = await presidentService.getProfile().catch(() => memberService.getProfile());
      else data = await memberService.getProfile();

      setProfileData(data);
    } catch (err: any) {
      showToast(err.message || "Erreur lors de la mise à jour", "error");
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      showToast("Veuillez sélectionner une image valide", "error");
      return;
    }

    // Validate file size (e.g., max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      showToast("L'image est trop volumineuse (max 5Mo)", "error");
      return;
    }

    const role = authUser?.role?.toUpperCase() || "";
    const subRole = authUser?.subRole?.toUpperCase() || "";
    const isSuperAdmin = role === "SUPER_ADMIN";
    const isOperationalAdmin = role.includes("ADMIN") && !!subRole;

    try {
      if (isSuperAdmin) {
        await superAdminService.updateAvatar(file);
      } else if (subRole === "SECRETAIRE_GENERALE") {
        await secretaryService.updateAvatar(file);
      } else if (subRole === "TRESORIER") {
        await treasurerService.updateAvatar(file).catch(() => memberService.updateAvatar(file));
      } else if (subRole === "PRESIDENT") {
        await presidentService.updateAvatar(file).catch(() => memberService.updateAvatar(file));
      } else {
        await memberService.updateAvatar(file);
      }

      showToast("Photo de profil mise à jour avec succès", "success");

      // Refresh profile data
      let data;
      if (isSuperAdmin) data = await superAdminService.getProfile();
      else if (subRole === "SECRETAIRE_GENERALE") data = await secretaryService.getProfile();
      else if (subRole === "TRESORIER") data = await treasurerService.getProfile().catch(() => memberService.getProfile());
      else if (subRole === "PRESIDENT") data = await presidentService.getProfile().catch(() => memberService.getProfile());
      else data = await memberService.getProfile();
      setProfileData(data);

      // Sync global AuthContext
      if (data) {
        if (data.role) localStorage.setItem("auth_role", data.role);
        if (data.subRole) localStorage.setItem("auth_sub_role", data.subRole);

        const avatarUrl = data.avatar || (data as any).photoUrl || data?.user?.avatar || data?.user?.photoUrl;
        if (avatarUrl) localStorage.setItem("auth_avatar", avatarUrl);

        updateUser({ avatar: avatarUrl });
      }
    } catch (err: any) {
      showToast(err.message || "Erreur lors de l'upload de la photo", "error");
    }
  };

  return (
    <div className={styles.container}>
      {/* Profile Header */}
      <header className="fade-in-up" style={{ marginBottom: "2.5rem", display: "flex", alignItems: "center", gap: "2rem" }}>
        <div
          className={styles.avatarContainer}
          onClick={() => document.getElementById('avatarInput')?.click()}
          style={{
            width: "100px", height: "100px", borderRadius: "24px",
            background: userPhoto
              ? `url(${userPhoto.startsWith('http') ? userPhoto : 'http://localhost:8080' + userPhoto}) center/cover`
              : "linear-gradient(135deg, #4e73df, #2193b0)",
            color: "white", display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: "2.2rem", fontWeight: 800, letterSpacing: "1px",
            boxShadow: "0 10px 30px rgba(78,115,223,0.3)",
            flexShrink: 0
          }}>
          {!userPhoto && initials}
          <div className={styles.avatarOverlay}>
            <i className="fas fa-camera"></i>
          </div>
          <input
            type="file"
            id="avatarInput"
            hidden
            accept="image/*"
            onChange={handleFileChange}
          />
        </div>
        <div>
          <h1 style={{ fontSize: "1.8rem", fontWeight: 800, color: "var(--text-dark)", margin: 0, letterSpacing: "-0.02em" }}>
            {displayFirstName} {displayName}
          </h1>
          <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
            <span className={styles.statusBadge} style={{ background: "rgba(28,200,138,0.1)", color: "#1cc88a" }}>
              <i className="fas fa-circle" style={{ fontSize: "0.4rem", marginRight: "0.4rem" }}></i> MEMBRE ACTIF
            </span>
            <span className={styles.statusBadge} style={{ background: "rgba(78,115,223,0.1)", color: "#4e73df" }}>
              {getRoleLabel()}
            </span>
          </div>
        </div>
      </header>

      <div className={styles.tabsContainer}>
        <div className={styles.tabsHeader}>
          <button
            className={`${styles.tabBtn} ${activeTab === "infos" ? styles.tabBtnActive : ""}`}
            onClick={() => setActiveTab("infos")}
          >
            <i className="fas fa-info-circle"></i> Informations
          </button>
          <button
            className={`${styles.tabBtn} ${activeTab === "securite" ? styles.tabBtnActive : ""}`}
            onClick={() => setActiveTab("securite")}
          >
            <i className="fas fa-shield-alt"></i> Sécurité
          </button>
        </div>

        <div className={styles.tabContent}>
          {activeTab === "infos" && (
            <div className="fade-in" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "2rem" }}>
              {/* Personal Info Card */}
              <div className={styles.dataCard}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.75rem" }}>
                  <h3 className={styles.sectionTitle}>Données Personnelles</h3>
                  {!editMode && (
                    <button className={styles.actionBtn} onClick={startEdit}>
                      <i className="fas fa-edit"></i> Modifier
                    </button>
                  )}
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
                  <FieldRow label="Nom" value={displayName} editMode={editMode} editValue={editData.name} onChange={(v) => setEditData({ ...editData, name: v })} />
                  <FieldRow label="Prénom" value={displayFirstName} editMode={editMode} editValue={editData.firstName} onChange={(v) => setEditData({ ...editData, firstName: v })} />
                  <FieldRow label="Identifiant (Username)" value={"@" + (profileData?.username || "À renseigner")} editMode={editMode} editValue={editData.username} onChange={(v) => setEditData({ ...editData, username: v })} />
                  <FieldRow label="Adresse Email" value={displayEmail} />
                  <FieldRow
                    label="N° de téléphone"
                    value={displayTel}
                    editMode={editMode}
                    editValue={editData.tel}
                    onChange={(v) => {
                      const numericValue = v.replace(/[^0-9\s+]/g, "");
                      setEditData({ ...editData, tel: numericValue });
                    }}
                    inputMode="tel"
                    pattern="[0-9\s+]*"
                  />
                  <FieldRow label="Adresse de résidence" value={memberAddress} editMode={editMode} editValue={editData.address} onChange={(v) => setEditData({ ...editData, address: v })} />
                  {editMode && (
                    <div style={{ display: "flex", gap: "0.75rem", marginTop: "0.5rem" }}>
                      <button className={styles.cancelBtn} onClick={() => setEditMode(false)}>Annuler</button>
                      <button className={styles.confirmBtn} onClick={handleSaveProfile} style={{ background: "linear-gradient(135deg, #1cc88a, #13855c)" }}>
                        <i className="fas fa-check"></i> Sauvegarder
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* Membership Info Card */}
              <div className={styles.dataCard}>
                <h3 className={styles.sectionTitle} style={{ marginBottom: "1.75rem" }}>Adhésion</h3>
                <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
                  <FieldRow label="Rôle" value={getRoleLabel()} valueColor="#4e73df" />
                  <FieldRow label="Date d'inscription" value={inscriptionDate ? new Date(inscriptionDate).toLocaleDateString() : "—"} />
                </div>
              </div>
            </div>
          )}

          {activeTab === "securite" && (
            <div className="fade-in" style={{ maxWidth: "500px" }}>
              <div className={styles.dataCard}>
                <h3 className={styles.sectionTitle} style={{ marginBottom: "1.75rem" }}>Changer le mot de passe</h3>
                <form onSubmit={handleUpdatePassword} style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
                  <div>
                    <label style={{ display: "block", fontSize: "0.85rem", fontWeight: 600, marginBottom: "0.5rem", color: "var(--text-dark)" }}>Nouveau mot de passe</label>
                    <div style={{ position: "relative" }}>
                      <input
                        type={showNewPassword ? "text" : "password"}
                        className={styles.input}
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        placeholder="••••••••"
                        style={{ paddingRight: "3rem" }}
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowNewPassword(!showNewPassword)}
                        style={{ position: "absolute", right: "12px", top: "50%", transform: "translateY(-50%)", background: "none", border: "none", color: "var(--text-muted)", cursor: "pointer", padding: "8px" }}
                      >
                        <i className={`fas ${showNewPassword ? "fa-eye-slash" : "fa-eye"}`}></i>
                      </button>
                    </div>
                  </div>
                  <div>
                    <label style={{ display: "block", fontSize: "0.85rem", fontWeight: 600, marginBottom: "0.5rem", color: "var(--text-dark)" }}>Confirmer le mot de passe</label>
                    <div style={{ position: "relative" }}>
                      <input
                        type={showConfirmPassword ? "text" : "password"}
                        className={styles.input}
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="••••••••"
                        style={{ paddingRight: "3rem" }}
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        style={{ position: "absolute", right: "12px", top: "50%", transform: "translateY(-50%)", background: "none", border: "none", color: "var(--text-muted)", cursor: "pointer", padding: "8px" }}
                      >
                        <i className={`fas ${showConfirmPassword ? "fa-eye-slash" : "fa-eye"}`}></i>
                      </button>
                    </div>
                  </div>
                  <button type="submit" className={styles.confirmBtn} style={{ marginTop: "0.5rem", justifyContent: "center", background: "linear-gradient(135deg, #4e73df, #224abe)", boxShadow: "0 4px 15px rgba(78,115,223,0.25)" }}>
                    <i className="fas fa-lock"></i> Enregistrer le nouveau mot de passe
                  </button>
                </form>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/* Reusable field row component */
function FieldRow({ label, value, editMode, editValue, onChange, valueColor, inputMode, pattern }: {
  label: string;
  value?: string;
  editMode?: boolean;
  editValue?: string;
  onChange?: (v: string) => void;
  valueColor?: string;
  inputMode?: React.HTMLAttributes<HTMLInputElement>["inputMode"];
  pattern?: string;
}) {
  return (
    <div>
      <label style={{ display: "block", fontSize: "0.72rem", fontWeight: 700, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "0.4rem" }}>{label}</label>
      {editMode && onChange ? (
        <input
          value={editValue}
          onChange={e => onChange(e.target.value)}
          inputMode={inputMode}
          pattern={pattern}
          style={{ width: "100%", padding: "0.75rem 1rem", borderRadius: "12px", border: "2px solid var(--border-color)", outline: "none", fontSize: "0.95rem", transition: "border-color 0.2s", background: "var(--white)", color: "var(--text-dark)" }}
        />
      ) : (
        <p style={{ fontSize: "1rem", fontWeight: 600, color: valueColor || "var(--text-dark)", margin: 0 }}>{value}</p>
      )}
    </div>
  );
}
