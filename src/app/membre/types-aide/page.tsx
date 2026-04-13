"use client";

import { useState, useEffect } from "react";
import styles from "./typesAide.module.css";
import { useTranslation } from "@/context/LanguageContext";
import { memberService } from "@/services/memberService";

export default function MemberTypesAidePage() {
  const { t } = useTranslation();
  const [aidTypes, setAidTypes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadTypes = async () => {
      try {
        const data = await memberService.getHelpTypes();
        setAidTypes(data);
      } catch (err: any) {
        console.error("Failed to load aid types:", err);
        setError(err.message || "Failed to load aid types");
      } finally {
        setLoading(false);
      }
    };
    loadTypes();
  }, []);

  if (loading) return (
    <div className={styles.loadingContainer}>
      <div className={styles.loader}></div>
      <p>Chargement des types d'aides...</p>
    </div>
  );

  if (error) return (
    <div className={styles.errorContainer}>
      <i className="fas fa-exclamation-circle"></i>
      <p>{error}</p>
      <button onClick={() => window.location.reload()} className={styles.retryBtn}>Réessayer</button>
    </div>
  );

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <h1 className={styles.title}>{t.admin.typesAide}</h1>
        <p className={styles.subtitle}>Consultez les différents types d'aides que vous pouvez solliciter</p>
      </div>

      <div className={styles.grid}>
        {aidTypes.length > 0 ? (
          aidTypes.map((type) => (
            <div key={type.id} className={styles.card}>
              <div className={styles.cardHeader}>
                <div className={styles.icon}><i className="fas fa-hand-holding-heart"></i></div>
                <h3>{type.name}</h3>
              </div>
              <div className={styles.cardBody}>
                <p className={styles.description}>{type.description || "Aucune description disponible"}</p>
                <div className={styles.limitBox}>
                  <span className={styles.limitLabel}>Montant Plafond</span>
                  <span className={styles.limitValue}>
                    {type.defaultAmount ? type.defaultAmount.toLocaleString() : "0"} XAF
                  </span>
                </div>
              </div>
              <div className={styles.cardFooter}>
                <button className={styles.requestBtn}>
                  <i className="fas fa-paper-plane"></i> Solliciter une aide
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className={styles.empty}>
            <i className="fas fa-heart-broken" style={{ display: 'block', fontSize: '3rem', marginBottom: '1rem', opacity: 0.3 }}></i>
            Aucun type d'aide disponible pour le moment.
          </div>
        )}
      </div>
    </div>
  );
}
