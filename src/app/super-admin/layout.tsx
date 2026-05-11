"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import styles from "./superadmin.module.css";
import { useTranslation } from "@/context/LanguageContext";
import ThemeSwitcher from "@/components/ThemeSwitcher";
import { useAuth } from "@/context/AuthContext";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import { useNotification } from "@/context/NotificationContext";

export default function SuperAdminLayout({ children }: { children: React.ReactNode }) {
  const { t, locale, setLocale } = useTranslation();
  const { user, loading, logout } = useAuth();
  const { confirm } = useNotification();
  const pathname = usePathname();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [langOpen, setLangOpen] = useState(false);


  const sidebarMenu = [
    {
      title: t.superAdmin.sousTitre,
      items: [
        { label: t.superAdmin.tableauDeBord, icon: "fas fa-chart-pie", href: "/super-admin" },
        { label: t.superAdmin.gestionAdmins, icon: "fas fa-user-shield", href: "/super-admin/administrateurs" },
      ],
    },
    {
      title: t.superAdmin.motsDePasse,
      items: [
        { label: t.superAdmin.changerMotDePasse, icon: "fas fa-key", href: "/super-admin/mot-de-passe" },
      ],
    },
    {
      title: "Développement",
      items: [
        { label: "Outils Dev", icon: "fas fa-flask", href: "/super-admin/developpement" },
      ],
    },
  ];

  return (
    <ProtectedRoute requiredRole="ROLE_SUPER_ADMIN">
      <div className={styles.layout}>
        {/* Sidebar ... (reste du code) */}
        <aside className={`${styles.sidebar} ${sidebarOpen ? styles.sidebarOpen : ""}`}>
          <div className={styles.sidebarHeader}>
            <Link href="/super-admin" className={styles.sidebarLogo}>
              {t.common.enspy}
            </Link>
          </div>
          <nav className={styles.sidebarNav}>
            {sidebarMenu.map((section) => (
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
          </nav>
          <div className={styles.sidebarFooter}>
            <Link
              href="/membre/profil"
              className={`${styles.menuItem} ${pathname === "/membre/profil" ? styles.menuItemActive : ""}`}
              onClick={() => setSidebarOpen(false)}
            >
              <i className="fas fa-user-circle"></i>
              <span>{t.common.monProfil}</span>
            </Link>
            <button
              className={styles.menuItem}
              onClick={() => { 
                confirm({
                  title: t.common.deconnexion,
                  message: "Êtes-vous sûr de vouloir vous déconnecter du portail Super Admin ?",
                  confirmText: "Déconnexion",
                  cancelText: "Annuler",
                  type: "danger",
                  onConfirm: () => {
                    logout(); 
                    router.push("/connexion"); 
                  }
                });
              }}
            >
              <i className="fas fa-sign-out-alt"></i>
              <span>{t.common.deconnexion}</span>
            </button>
          </div>
        </aside>

        {/* Overlay for Web */}
        {sidebarOpen && (
          <div className={styles.overlay} onClick={() => setSidebarOpen(false)}></div>
        )}

        {/* Main area */}
        <div className={styles.mainArea}>
          {/* Top Navbar */}
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
                      style={{ background: "none", border: "none", width: "100%", cursor: "pointer" }}
                    >
                      Français
                    </button>
                    <button
                      className={styles.dropdownItem}
                      onClick={() => { setLocale("en"); setLangOpen(false); }}
                      style={{ background: "none", border: "none", width: "100%", cursor: "pointer" }}
                    >
                      English
                    </button>
                  </div>
                )}
              </div>

              <div className={styles.profileDropdown}>
                <button className={styles.profileBtn} onClick={() => setProfileOpen(!profileOpen)}>
                  <div className={styles.avatarPlaceholder} style={{ 
                    background: user?.avatar 
                      ? `url(${user.avatar.startsWith('http') ? user.avatar : 'http://localhost:8080' + user.avatar}) center/cover` 
                      : undefined 
                  }}>
                    {!user?.avatar && <i className="fas fa-crown"></i>}
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
                    <button className={styles.dropdownItem} onClick={() => { 
                      setProfileOpen(false);
                      confirm({
                        title: t.common.deconnexion,
                        message: "Êtes-vous sûr de vouloir vous déconnecter du portail Super Admin ?",
                        confirmText: "Déconnexion",
                        cancelText: "Annuler",
                        type: "danger",
                        onConfirm: () => {
                          logout(); 
                          router.push("/connexion"); 
                        }
                      });
                    }}>
                      <i className="fas fa-sign-out-alt"></i>
                      {t.common.deconnexion}
                    </button>
                  </div>
                )}
              </div>
            </div>
          </header>

          {/* Content */}
          <main className={styles.content}>{children}</main>
        </div>
      </div>
    </ProtectedRoute>
  );
}
