"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import styles from "./membre.module.css";
import { useTranslation } from "@/context/LanguageContext";
import ThemeSwitcher from "@/components/ThemeSwitcher";
import { useAuth } from "@/context/AuthContext";
import ProtectedRoute from "@/components/auth/ProtectedRoute";

export default function MembreLayout({ children }: { children: React.ReactNode }) {
  const { t, locale, setLocale } = useTranslation();
  const { user, loading, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [showLogout, setShowLogout] = useState(false);
  const [langOpen, setLangOpen] = useState(false);

  const role = user?.role?.toUpperCase();
  const subRole = user?.subRole?.toUpperCase();


  const sidebarMenu = [
    {
      title: t.common.navigation,
      items: [
        { label: "Dashboard", icon: "fas fa-chart-line", href: "/membre" },
        { label: "Finances", icon: "fas fa-wallet", href: "/membre/finances" },
        { label: "Emprunts", icon: "fas fa-hand-holding-usd", href: "/membre/emprunts" },
        { label: "Aides", icon: "fas fa-hand-holding-heart", href: "/membre/aides" },
        { label: "Messages", icon: "fas fa-comments", href: "/membre/messages" },
        { label: t.common.profil, icon: "fas fa-user-circle", href: "/membre/profil" },
      ],
    },
  ];

  // Logic to show admin links in Member sidebar
  const adminLinks = [];
  if (role === "ADMIN") {
    if (subRole === "PRESIDENT") {
      adminLinks.push({ label: "Console Président", icon: "fas fa-user-shield", href: "/president" });
    } else if (subRole === "TRESORIER") {
      adminLinks.push({ label: "Console Trésorier", icon: "fas fa-vault", href: "/treasurer" });
    } else if (subRole === "SECRETAIRE_GENERALE") {
      adminLinks.push({ label: "Console Secrétaire G.", icon: "fas fa-user-edit", href: "/admin" });
    }
  } else if (role === "SUPER_ADMIN") {
    adminLinks.push({ label: "Console Super Admin", icon: "fas fa-crown", href: "/super-admin" });
  }

  // Super Admin should not see regular member navigation
  const filteredMenu = role === "SUPER_ADMIN" ? [] : sidebarMenu;

  const handleLogout = () => {
    logout();
    router.push("/connexion");
  };

  return (
    <ProtectedRoute requiredRole={["ROLE_MEMBER", "ROLE_ADMIN", "ROLE_SUPER_ADMIN", "ROLE_PRESIDENT", "ROLE_TRESORIER", "ROLE_SECRETAIRE_GENERALE"]}>
      <div className={styles.layout}>
        {/* Sidebar ... (reste du code) */}
        <aside className={`${styles.sidebar} ${sidebarOpen ? styles.sidebarOpen : ""}`}>
          <div className={styles.sidebarHeader}>
            <Link href="/membre" className={styles.sidebarLogo} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "1rem" }}>
              <div className={styles.avatarPlaceholder} style={{ 
                width: "60px", height: "60px", fontSize: "1.5rem",
                overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' 
              }}>
                {(() => {
                  const photo = user?.avatar || (user as any)?.photoUrl;
                  if (!photo) return <i className="fas fa-user"></i>;
                  const baseUrl = "http://localhost:8080";
                  const src = photo.startsWith('http') ? photo : (photo.startsWith('/') ? baseUrl + photo : `${baseUrl}/${photo}`);
                  return <img src={src} alt="Avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />;
                })()}
              </div>
              {t.common.enspy}
            </Link>
          </div>
          <nav className={styles.sidebarNav}>
            {filteredMenu.map((section) => (
              <div key={section.title} className={styles.menuSection}>
                <span className={styles.menuTitle}>{section.title}</span>
                {section.items.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`${styles.menuItem} ${pathname === item.href ? styles.menuItemActive : ""}`}
                    onClick={() => setSidebarOpen(false)}
                  >
                    <i className={item.icon}></i>
                    <span>{item.label}</span>
                  </Link>
                ))}
              </div>
            ))}

            {adminLinks.length > 0 && (
              <div className={styles.menuSection}>
                <span className={styles.menuTitle}>ADMINISTRATION</span>
                {adminLinks.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`${styles.menuItem} ${pathname === item.href ? styles.menuItemActive : ""}`}
                    onClick={() => setSidebarOpen(false)}
                  >
                    <i className={item.icon}></i>
                    <span>{item.label}</span>
                  </Link>
                ))}
              </div>
            )}

            <div className={styles.menuSection}>
              <span className={styles.menuTitle}>{t.common.profil}</span>
              <Link
                href="/membre/profil"
                className={`${styles.menuItem} ${pathname === "/membre/profil" ? styles.menuItemActive : ""}`}
                onClick={() => setSidebarOpen(false)}
              >
                <i className="fas fa-user-circle"></i>
                <span>{t.common.monProfil}</span>
              </Link>
              <button className={styles.menuItem} onClick={() => setShowLogout(true)}>
                <i className="fas fa-sign-out-alt"></i>
                <span>{t.common.deconnexion}</span>
              </button>
            </div>
          </nav>
        </aside>

        {/* Overlay */}
        {sidebarOpen && (
          <div className={styles.overlay} onClick={() => setSidebarOpen(false)}></div>
        )}

        {/* Main Area */}
        <div className={styles.mainArea}>
          <header className={styles.topbar}>
            <div className={styles.topbarLeft}>
              <button className={styles.webToggle} onClick={() => setSidebarOpen(!sidebarOpen)}>
                <i className="fas fa-bars"></i>
              </button>
            </div>
            <div className={styles.topbarRight}>
              <div style={{ marginRight: "0.5rem" }}>
                <ThemeSwitcher />
              </div>
              {/* Language Switcher */}
              <div className={styles.profileDropdown} style={{ marginRight: "1rem" }}>
                <button className={styles.profileBtn} onClick={() => setLangOpen(!langOpen)}>
                  <i className="fas fa-globe"></i>
                  <span className={styles.profileName}>{locale.toUpperCase()}</span>
                  <i className="fas fa-chevron-down" style={{ fontSize: "0.7rem" }}></i>
                </button>
                {langOpen && (
                  <div className={styles.dropdownMenu}>
                    <button 
                      className={styles.dropdownItem} 
                      onClick={() => { setLocale("fr"); setLangOpen(false); }}
                    >
                      Français
                    </button>
                    <button 
                      className={styles.dropdownItem} 
                      onClick={() => { setLocale("en"); setLangOpen(false); }}
                    >
                      English
                    </button>
                  </div>
                )}
              </div>

              <div className={styles.profileDropdown}>
                <button className={styles.profileBtn} onClick={() => setProfileOpen(!profileOpen)}>
                  <div className={styles.avatarPlaceholder} style={{ overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    {(() => {
                      const photo = user?.avatar || (user as any)?.photoUrl;
                      if (!photo) return <i className="fas fa-user"></i>;
                      const baseUrl = "http://localhost:8080";
                      const src = photo.startsWith('http') ? photo : (photo.startsWith('/') ? baseUrl + photo : `${baseUrl}/${photo}`);
                      return <img src={src} alt="Avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />;
                    })()}
                  </div>
                  <span className={styles.profileName}>@{user?.username || user?.email?.split('@')[0]}</span>
                  <i className="fas fa-chevron-down" style={{ fontSize: "0.7rem" }}></i>
                </button>
                {profileOpen && (
                  <div className={styles.dropdownMenu}>
                    <Link href="/membre/profil" className={styles.dropdownItem} onClick={() => setProfileOpen(false)}>
                      <i className="fas fa-user-cog"></i>
                      {t.common.monProfil}
                    </Link>
                    <div className={styles.dropdownDivider}></div>
                    <button className={styles.dropdownItem} onClick={() => { setProfileOpen(false); setShowLogout(true); }}>
                      <i className="fas fa-sign-out-alt"></i>
                      {t.common.deconnexion}
                    </button>
                  </div>
                )}
              </div>
            </div>
          </header>

          <main className={styles.content}>
            {children}
          </main>
        </div>

        {/* Logout Modal */}
        {showLogout && (
          <div className={styles.modalOverlay} onClick={() => setShowLogout(false)}>
            <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
              <div className={styles.modalHeader}>
                <h3>{t.common.confirmationDeconnexion}</h3>
                <button className={styles.modalClose} onClick={() => setShowLogout(false)}>
                  <i className="fas fa-times"></i>
                </button>
              </div>
              <div className={styles.modalBody}>
                <div className={styles.modalIcon}>
                  <i className="fas fa-sign-out-alt"></i>
                </div>
                <p className={styles.modalText}>{t.common.etesVousSurDeconnexion}</p>
                <div className={styles.modalActions}>
                  <button className={styles.cancelBtn} onClick={() => setShowLogout(false)}>
                    {t.common.non}
                  </button>
                  <button className={styles.confirmBtn} onClick={handleLogout}>
                    {t.common.ouiMeDeconnecter}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </ProtectedRoute>
  );
}
