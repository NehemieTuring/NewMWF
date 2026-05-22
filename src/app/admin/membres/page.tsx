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
        <div className={styles.tableCard} style={{ background: "white", borderRadius: "20px", border: "1px solid #e3e6f0", overflow: "hidden", padding: "0.5rem" }}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th style={{ width: "60px" }}></th>
                <th>Membre</th>
                <th>Nom d'utilisateur</th>
                <th>Téléphone</th>
                <th>Épargne</th>
                <th>Statut</th>
                <th style={{ textAlign: "right" }}>Actions</th>
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
                      <span style={{ fontWeight: 700, color: "#2e3b4e" }}>{member.user?.firstName} {member.user?.name}</span>
                      <span style={{ fontSize: "0.75rem", color: "#858796" }}>{member.user?.email || "Pas d'email"}</span>
                    </div>
                  </td>
                  <td>
                    <code style={{ background: "#f8f9fc", padding: "0.2rem 0.5rem", borderRadius: "4px", fontSize: "0.85rem", color: "#4e73df" }}>
                      {member.username}
                    </code>
                  </td>
                  <td style={{ fontSize: "0.9rem", color: "#4a5568" }}>
                    {member.user?.tel || "N/A"}
                  </td>
                  <td>
                    <strong className={styles.savingsValue}>{formatAmount(member.savingsTotal)} XAF</strong>
                  </td>
                  <td>
                    <span className={`${styles.badge} ${member.calculatedStatus === 'EN_REGLE' ? styles.badgeActive : (member.calculatedStatus === 'INACTIF' ? styles.badgeInactive : styles.badgePending)}`}>
                      {member.calculatedStatus === 'EN_REGLE' ? 'En Règle' : (member.calculatedStatus === 'INACTIF' ? 'Inactif' : 'Insolvable')}
                    </span>
                  </td>
                  <td>
                    <div style={{ display: "flex", justifyContent: "flex-end" }}>
                      <a href={`/admin/membres/${member.id}`} className={styles.viewBtn} style={{ padding: "0.5rem 1rem", minWidth: "auto" }}>
                        <i className="fas fa-eye"></i> {t.membres.details}
                      </a>
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
          <h3>{members.length === 0 ? "Aucun membre inscrit" : "Aucun résultat trouvé"}</h3>
          <p>{members.length === 0 ? "Commencez par inscrire un nouveau membre à la mutuelle." : "Essayez de rechercher avec un autre nom ou identifiant."}</p>
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

