"use client";

import { useEffect, useState } from "react";
import styles from "../membre.module.css";
import { useTranslation } from "@/context/LanguageContext";
import { useAuth } from "@/context/AuthContext";
import { memberService } from "@/services/memberService";
import { secretaryService } from "@/services/secretaryService";
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

  // Editable fields
  const [editMode, setEditMode] = useState(false);
  const [editData, setEditData] = useState({ name: "", firstName: "", tel: "", address: "" });

  useEffect(() => {
    async function loadData() {
      try {
        const role = authUser?.role?.toUpperCase() || "";
        const subRole = authUser?.subRole?.toUpperCase() || "";
        // Operational admins (SG, President, Treasurer) have a subRole and should use secretaryService
        const isOperationalAdmin = role.includes("ADMIN") && !!subRole;
        
        let data;
        try {
          // Try preferred endpoint first
          data = isOperationalAdmin ? await secretaryService.getProfile() : await memberService.getProfile();
        } catch (err: any) {
          // If 403 Forbidden or 400 Bad Request (missing profile), try the other one
          if (err.message?.includes("403") || err.message?.includes("400")) {
            data = isOperationalAdmin ? await memberService.getProfile() : await secretaryService.getProfile();
          } else throw err;
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
    try {
      await memberService.updatePassword(newPassword);
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
  const memberAddress = memberData?.address || "Non renseignée";
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
    setEditData({ name: displayName, firstName: displayFirstName, tel: displayTel === "Non renseigné" ? "" : displayTel, address: memberAddress === "Non renseignée" ? "" : memberAddress });
    setEditMode(true);
  };

  const handleSaveProfile = async () => {
    try {
      const role = authUser?.role?.toUpperCase() || "";
      const subRole = authUser?.subRole?.toUpperCase() || "";
      const isOperationalAdmin = role.includes("ADMIN") && !!subRole;

      try {
        if (isOperationalAdmin) {
          await secretaryService.updateProfile({ ...editData, username: userData?.username || "" });
        } else {
          await memberService.updateProfile({ ...editData, username: userData?.username || "" });
        }
      } catch (err: any) {
        if (err.message?.includes("403") || err.message?.includes("400")) {
          if (isOperationalAdmin) {
            await memberService.updateProfile({ ...editData, username: userData?.username || "" });
          } else {
            await secretaryService.updateProfile({ ...editData, username: userData?.username || "" });
          }
        } else throw err;
      }

      showToast("Profil mis à jour avec succès", "success");
      setEditMode(false);
      
      // Refresh data
      let data;
      try {
        data = isOperationalAdmin ? await secretaryService.getProfile() : await memberService.getProfile();
      } catch (e: any) {
        if (e.message?.includes("403") || e.message?.includes("400")) {
          data = isOperationalAdmin ? await memberService.getProfile() : await secretaryService.getProfile();
        } else throw e;
      }
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

    try {
      const role = authUser?.role?.toUpperCase() || "";
      const subRole = authUser?.subRole?.toUpperCase() || "";
      const isOperationalAdmin = role.includes("ADMIN") && !!subRole;

      try {
        if (isOperationalAdmin) {
          await secretaryService.updateAvatar(file);
        } else {
          await memberService.updateAvatar(file);
        }
      } catch (err: any) {
        if (err.message?.includes("403") || err.message?.includes("400")) {
          if (isOperationalAdmin) {
            await memberService.updateAvatar(file);
          } else {
            await secretaryService.updateAvatar(file);
          }
        } else throw err;
      }
      
      showToast("Photo de profil mise à jour avec succès", "success");
      
      // Refresh profile data to get the absolute source of truth with fallback
      let data;
      try {
        data = isOperationalAdmin ? await secretaryService.getProfile() : await memberService.getProfile();
      } catch (e: any) {
        if (e.message?.includes("403") || e.message?.includes("400")) {
          data = isOperationalAdmin ? await memberService.getProfile() : await secretaryService.getProfile();
        } else throw e;
      }
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
                  <FieldRow label="Nom" value={displayName} editMode={editMode} editValue={editData.name} onChange={(v) => setEditData({...editData, name: v})} />
                  <FieldRow label="Prénom" value={displayFirstName} editMode={editMode} editValue={editData.firstName} onChange={(v) => setEditData({...editData, firstName: v})} />
                  <FieldRow label="Adresse Email" value={displayEmail} />
                  <FieldRow 
                    label="N° de téléphone" 
                    value={displayTel} 
                    editMode={editMode} 
                    editValue={editData.tel} 
                    onChange={(v) => {
                      const numericValue = v.replace(/[^0-9\s+]/g, "");
                      setEditData({...editData, tel: numericValue});
                    }} 
                    inputMode="tel"
                    pattern="[0-9\s+]*"
                  />
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
                  <FieldRow label="Adresse de résidence" value={memberAddress} editMode={editMode} editValue={editData.address} onChange={(v) => setEditData({...editData, address: v})} />
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
                    <input 
                      type="password" 
                      className={styles.input} 
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="••••••••"
                      required
                    />
                  </div>
                  <div>
                    <label style={{ display: "block", fontSize: "0.85rem", fontWeight: 600, marginBottom: "0.5rem", color: "var(--text-dark)" }}>Confirmer le mot de passe</label>
                    <input 
                      type="password" 
                      className={styles.input} 
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="••••••••"
                      required
                    />
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
