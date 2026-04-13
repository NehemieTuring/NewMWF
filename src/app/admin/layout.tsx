"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import styles from "./admin.module.css";
import { useTranslation } from "@/context/LanguageContext";
import ThemeSwitcher from "@/components/ThemeSwitcher";
import { useAuth } from "@/context/AuthContext";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
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
  
  // Resilient authorization check
  const isAuthorizedFull = role === "SUPER_ADMIN" || 
                          (role === "ADMIN" && (subRole === "SECRETAIRE_GENERALE" || subRole === "TRESORIER" || subRole === "PRESIDENT" || !subRole)) ||
                          role === "SECRETAIRE_GENERALE";

  useEffect(() => {
    if (!loading) {
      if (!user) {
        router.push("/connexion");
      } else if (role === "SUPER_ADMIN") {
        router.push("/super-admin");
      } else if (!isAuthorizedFull) {
        // Only redirect if we ARE on an admin page but NOT authorized
        if (role === "ADMIN") {
          if (subRole === "PRESIDENT") router.push("/president");
          else if (subRole === "TRESORIER") router.push("/treasurer");
          else router.push("/connexion");
        } else if (role === "MEMBER") {
          router.push("/membre");
        } else {
          router.push("/connexion");
        }
      }
    }
  }, [user, loading, router, isAuthorizedFull, role, subRole]);

  if (loading) {
    return (
      <div style={{ display: "flex", height: "100vh", alignItems: "center", justifyContent: "center", background: "#f8f9fc" }}>
        <div className="fas fa-spinner fa-spin" style={{ fontSize: "2rem", color: "#4e73df" }}></div>
      </div>
    );
  }

  if (!user || !isAuthorizedFull) {
    return null;
  }

  const sidebarMenu = [
    {
      title: "Back-Office " + (subRole === "SECRETAIRE_GENERALE" ? "SG" : "Président"),
      items: [
        { label: "Tableau de Bord", icon: "fas fa-chart-line", href: "/admin" },
        { label: "Gestion des Membres", icon: "fas fa-users", href: "/admin/membres" },
        { label: "Sessions & Exercices", icon: "fas fa-cog", href: "/admin/parametres" },
        ...(subRole === "SECRETAIRE_GENERALE" ? [
          { label: "Enregistrements", icon: "fas fa-exchange-alt", href: "/admin/operations" },
          { label: "Agape", icon: "fas fa-utensils", href: "/admin/agape" },
          { label: "Dossiers d'Aide", icon: "fas fa-hand-holding-heart", href: "/admin/aides" },
          { label: "Paramètres Globaux", icon: "fas fa-sliders-h", href: "/admin/parametres-globaux" }
        ] : []),
        ...(subRole === "TRESORIER" ? [
          { label: "Trésorerie & Dépenses", icon: "fas fa-vault", href: "/admin/tresorerie" }
        ] : []),
      ],
    },
    {
      title: "Usage Personnel",
      items: [
        { label: "Mes Finances", icon: "fas fa-wallet", href: "/membre/finances" },
        { label: "Mes Emprunts", icon: "fas fa-hand-holding-usd", href: "/membre/emprunts" },
        { label: "Solidarité & Aides", icon: "fas fa-hand-holding-heart", href: "/membre/aides" },
        { label: "Messagerie", icon: "fas fa-comments", href: "/membre/messages" },
        { label: "Mon Profil", icon: "fas fa-user-circle", href: "/membre/profil" },
      ],
    },
  ];

  const handleLogout = () => {
    logout();
    router.push("/connexion");
  };

  return (
    <div className={styles.layout}>
      {/* Sidebar */}
      <aside className={`${styles.sidebar} ${sidebarOpen ? styles.sidebarOpen : ""}`}>
        <div className={styles.sidebarHeader}>
          <Link href="/admin" className={styles.sidebarLogo}>
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
          <div className={styles.menuSection}>
            <span className={styles.menuTitle}>{t.common.profil}</span>
            <Link href="/membre" className={styles.menuItem}>
              <i className="fas fa-arrow-left"></i>
              <span>Portail Membre</span>
            </Link>
            <Link href="/membre/profil" className={styles.menuItem}>
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

      <div className={styles.mainArea}>
        <header className={styles.topbar}>
          <div className={styles.topbarLeft}>
            <button className={styles.webToggle} onClick={() => setSidebarOpen(!sidebarOpen)}>
              <i className="fas fa-bars"></i>
            </button>
          </div>
          <div className={styles.topbarRight}>
            <div style={{ marginRight: "1rem" }}>
              <ThemeSwitcher />
            </div>

            <div className={styles.profileDropdown}>
              <button className={styles.profileBtn} onClick={() => setProfileOpen(!profileOpen)}>
                <div className={styles.avatarPlaceholder}>
                  <i className="fas fa-user-circle"></i>
                </div>
                <span className={styles.profileName}>@{user?.username || user?.email?.split('@')[0]}</span>
                <i className={`fas fa-chevron-${profileOpen ? 'up' : 'down'}`} style={{ fontSize: "0.7rem", opacity: 0.5 }}></i>
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

        <main className={styles.content}>{children}</main>
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
              <div className={styles.modalIcon}><i className="fas fa-sign-out-alt"></i></div>
              <p className={styles.modalText}>{t.common.etesVousSurDeconnexion}</p>
              <div className={styles.modalActions}>
                <button className={styles.cancelBtn} onClick={() => setShowLogout(false)}>{t.common.non}</button>
                <button className={styles.confirmBtn} onClick={handleLogout}>{t.common.ouiMeDeconnecter}</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
