"use client";

import { useEffect, useState } from "react";
import styles from "./paiements.module.css";
import { useTranslation } from "@/context/LanguageContext";
import { memberService } from "@/services/memberService";

export default function MemberPaiementsPage() {
  const { t, locale } = useTranslation();
  const [paiements, setPaiements] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadPaiements() {
      try {
        const data = await memberService.getMyPayments();
        setPaiements(data || []);
      } catch (err) {
        console.error("Failed to load payments", err);
      } finally {
        setLoading(false);
      }
    }
    loadPaiements();
  }, []);

  function formatAmount(n: number) {
    return n.toLocaleString(locale === "fr" ? "fr-FR" : "en-US");
  }

  if (loading) return <div className={styles.loading}>Chargement des transactions...</div>;

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <h1 className={styles.title}>{t.common.mesPaiements}</h1>
        <p className={styles.subtitle}>Historique complet de vos transactions financières</p>
      </div>

      <div className={styles.tableCard}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Type de Transaction</th>
              <th>Montant</th>
              <th>Date</th>
              <th>Méthode</th>
              <th>Statut</th>
            </tr>
          </thead>
          <tbody>
            {paiements.length > 0 ? (
              paiements.map((p) => (
                <tr key={p.id}>
                  <td className={styles.typeName}>{p.paymentType ? p.paymentType.replace('_', ' ') : "Transaction"} {p.session ? ` - Session ${p.session.id}` : ""}</td>
                  <td><span className={styles.amount}>{formatAmount(p.amount)} XAF</span></td>
                  <td>{new Date(p.paymentDate || p.createdAt).toLocaleDateString(locale === "fr" ? "fr-FR" : "en-US")}</td>
                  <td>{p.paymentMethod || "ESPÈCES"}</td>
                  <td>
                    <span className={`${styles.badge} ${p.status === 'VALIDATED' ? styles.badgeSuccess : ""}`}>{p.status || "CONFIRMÉ"}</span>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} className={styles.empty}>Aucune transaction enregistrée.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
