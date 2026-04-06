"use client";

import { useEffect, useState } from "react";
import styles from "./typesAide.module.css";
import { useTranslation } from "@/context/LanguageContext";
import { secretaryService } from "@/services/secretaryService";

export default function TypesAidePage() {
  const { t, locale } = useTranslation();
  const [aidTypes, setAidTypes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");

  useEffect(() => {
    async function loadAidTypes() {
      try {
        const data = await secretaryService.getHelpTypes();
        setAidTypes(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    loadAidTypes();
  }, []);

  const filtered = aidTypes.filter(type => 
    type.name?.toLowerCase().includes(search.toLowerCase()) ||
    type.description?.toLowerCase().includes(search.toLowerCase())
  );

  function formatAmount(n: number) {
    return (n || 0).toLocaleString(locale === "fr" ? "fr-FR" : "en-US");
  }

  if (loading) return (
    <div className={styles.loading}>
      <i className="fas fa-spinner fa-spin"></i>
      <span>Chargement des types d'aide...</span>
    </div>
  );
  if (error) return <div className={styles.error}>Erreur: {error}</div>;

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <div className={styles.titleSection}>
          <h1 className={styles.title}>{t.admin.typesAide}</h1>
          <p className={styles.subtitle}>Définition des aides disponibles et montants plafonds</p>
        </div>
        <button className={styles.addBtn}>
          <i className="fas fa-plus-circle"></i> Nouveau type d'aide
        </button>
      </header>

      {/* Search Bar */}
      <div className={styles.searchBar}>
        <i className="fas fa-search"></i>
        <input 
          type="text" 
          placeholder="Rechercher un type d'aide..." 
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {filtered.length > 0 ? (
        <div className={styles.grid}>
          {filtered.map((type) => (
            <div key={type.id} className={styles.card}>
              <div className={styles.cardHeader}>
                <div className={styles.iconContainer}>
                  <i className="fas fa-hand-holding-heart"></i>
                </div>
                <div>
                  <h3 className={styles.typeName}>{type.name}</h3>
                  <span className={styles.typeBadge}>Aide active</span>
                </div>
              </div>
              <div className={styles.cardBody}>
                <p className={styles.desc}>{type.description}</p>
                <div className={styles.statsGrid}>
                  <div className={styles.statBox}>
                    <span className={styles.statLabel}>Montant Plafond</span>
                    <strong className={styles.statValue}>{formatAmount(type.amount)} XAF</strong>
                  </div>
                </div>
              </div>
              <div className={styles.cardFooter}>
                <button className={styles.editBtn}>
                  <i className="fas fa-edit"></i> Modifier
                </button>
                <button className={styles.deleteBtn}>
                  <i className="fas fa-trash-alt"></i>
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className={styles.emptyState}>
          <div className={styles.emptyIcon}>
            <i className="fas fa-hand-holding-medical"></i>
          </div>
          <h3>{aidTypes.length === 0 ? "Aucun type d'aide enregistré" : "Aucun résultat pour votre recherche"}</h3>
          <p>{aidTypes.length === 0 ? "Définissez ici les différents types d'aides que la mutuelle peut octroyer." : "Vérifiez l'orthographe ou essayez un autre mot-clé."}</p>
          {aidTypes.length === 0 && (
            <button className={styles.addBtn} style={{ marginTop: '1rem' }}>
              <i className="fas fa-plus"></i> Créer le premier type
            </button>
          )}
        </div>
      )}
    </div>
  );
}

