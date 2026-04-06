"use client";

import { useEffect, useState } from "react";
import styles from "./membres.module.css";
import { useTranslation } from "@/context/LanguageContext";
import { secretaryService } from "@/services/secretaryService";

export default function MembresPage() {
  const { t, locale } = useTranslation();
  const [members, setMembers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");

  useEffect(() => {
    async function loadMembers() {
      try {
        const data = await secretaryService.getAllMembers();
        setMembers(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    loadMembers();
  }, []);

  function formatAmount(n: number) {
    return (n || 0).toLocaleString(locale === "fr" ? "fr-FR" : "en-US");
  }

  const filtered = members.filter((m) =>
    `${m.user?.firstName} ${m.user?.name} ${m.username}`
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  if (loading) return <div className={styles.loading}>Chargement des membres...</div>;
  if (error) return <div className={styles.error}>Erreur: {error}</div>;

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>{t.membres.titre}</h1>
          <p className={styles.subtitle}>{members.length} {t.membres.sousTitre}</p>
        </div>
        <a href="/admin/membres/nouveau" className={styles.addBtn}>
          <i className="fas fa-plus"></i>
          {t.membres.nouveau}
        </a>
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
        <div className={styles.grid}>
          {filtered.map((member) => (
            <div key={member.id} className={styles.card}>
              <div className={styles.cardHeader}>
                <div className={styles.avatar}>
                  {member.user?.firstName?.[0]}{member.user?.name?.[0]}
                </div>
                <div className={styles.memberInfo}>
                  <h3>{member.user?.firstName} {member.user?.name}</h3>
                  <span className={`${styles.badge} ${member.active ? styles.badgeActive : styles.badgeInactive}`}>
                    <i className="fas fa-circle" style={{ fontSize: "0.4rem" }}></i>
                    {member.active ? t.membres.actif : t.membres.inactif}
                  </span>
                </div>
              </div>
              <div className={styles.cardBody}>
                <div className={styles.stat}>
                  <i className="fas fa-id-badge"></i>
                  <span>Matricule: <strong>{member.username}</strong></span>
                </div>
                <div className={styles.stat}>
                  <i className="fas fa-phone"></i>
                  <span>{member.user?.tel}</span>
                </div>
                <div className={styles.stat}>
                  <i className="fas fa-piggy-bank"></i>
                  <span>{t.membres.epargne}: <strong className={styles.savingsValue}>{formatAmount(member.savingsTotal)} XAF</strong></span>
                </div>
              </div>
              <div className={styles.cardFooter}>
                <a href={`/admin/membres/${member.id}`} className={styles.viewBtn}>
                  <i className="fas fa-eye"></i> {t.membres.details}
                </a>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className={styles.emptyState}>
          <div className={styles.emptyIcon}>
            <i className="fas fa-users"></i>
          </div>
          <h3>{members.length === 0 ? "Aucun membre inscrit" : "Aucun résultat trouvé"}</h3>
          <p>{members.length === 0 ? "Commencez par inscrire un nouveau membre à la mutuelle." : "Essayez de rechercher avec un autre nom ou matricule."}</p>
          {members.length === 0 && (
            <a href="/admin/membres/nouveau" className={styles.addBtn}>
              <i className="fas fa-plus"></i> Inscrire le premier membre
            </a>
          )}
        </div>
      )}

    </div>
  );
}

