"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import styles from "./superadmin.module.css";
import { useTranslation } from "@/context/LanguageContext";
import ThemeSwitcher from "@/components/ThemeSwitcher";
import { useAuth } from "@/context/AuthContext";

export default function SuperAdminLayout({ children }: { children: React.ReactNode }) {
  const { t, locale, setLocale } = useTranslation();
  const { user, loading, logout } = useAuth();
  const pathname = usePathname();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [langOpen, setLangOpen] = useState(false);

  useEffect(() => {
    if (!loading && (!user || user.role.toUpperCase() !== "SUPER_ADMIN")) {
      router.push("/connexion");
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div style={{ display: "flex", height: "100vh", alignItems: "center", justifyContent: "center", background: "#f8f9fc" }}>
        <div className="fas fa-spinner fa-spin" style={{ fontSize: "2rem", color: "#4e73df" }}></div>
      </div>
    );
  }

  if (!user || user.role.toUpperCase() !== "SUPER_ADMIN") {
    return null;
  }

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
  ];

  return (
    <div className={styles.layout}>
      {/* Sidebar */}
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
      </aside>

      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div className={styles.overlay} onClick={() => setSidebarOpen(false)}></div>
      )}

      {/* Main area */}
      <div className={styles.mainArea}>
        {/* Top Navbar */}
        <header className={styles.topbar}>
          <div className={styles.topbarLeft}>
            <button className={styles.mobileToggle} onClick={() => setSidebarOpen(!sidebarOpen)}>
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
                <div className={styles.avatarPlaceholder}>
                  <i className="fas fa-crown"></i>
                </div>
                <span className={styles.profileName}>@{user?.username || user?.email?.split('@')[0]}</span>
                <i className="fas fa-chevron-down" style={{ fontSize: "0.7rem" }}></i>
              </button>
              {profileOpen && (
                <div className={styles.dropdownMenu}>
                  <div className={styles.dropdownDivider}></div>
                  <Link href="/connexion" className={styles.dropdownItem} onClick={() => { logout(); setProfileOpen(false); }}>
                    <i className="fas fa-sign-out-alt"></i>
                    {t.common.deconnexion}
                  </Link>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Content */}
        <main className={styles.content}>{children}</main>
      </div>
    </div>
  );
}
