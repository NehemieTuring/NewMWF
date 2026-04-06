"use client";

import { useState } from "react";
import styles from "./dettes.module.css";
import { useTranslation } from "@/context/LanguageContext";

const mockDebts = [
  { id: 1, member: "Pierre Essomba", amount: 175000, type: "RESTANT_PRET", dueDate: "2026-04-15" },
  { id: 2, member: "Alice Ngo", amount: 215000, type: "RESTANT_PRET", dueDate: "2026-05-15" },
  { id: 3, member: "Jean Dupont", amount: 5000, type: "PENALITE", dueDate: "2026-03-31" },
];

export default function DettesPage() {
  const { t, locale } = useTranslation();
  const [search, setSearch] = useState("");

  const filtered = mockDebts.filter(d => d.member.toLowerCase().includes(search.toLowerCase()));

  function formatAmount(n: number) {
    return n.toLocaleString(locale === "fr" ? "fr-FR" : "en-US");
  }

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <h1 className={styles.title}>{t.admin.dettes}</h1>
        <p className={styles.subtitle}>Liste de toutes les créances de la mutuelle</p>
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

      <div className={styles.tableCard}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Membre</th>
              <th>Type</th>
              <th>Montant</th>
              <th>Échéance</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((d) => (
              <tr key={d.id}>
                <td><span className={styles.memberName}>{d.member}</span></td>
                <td>
                  <span className={`${styles.badge} ${d.type === "PENALITE" ? styles.badgePenalty : styles.badgeLoan}`}>
                    {d.type === "PENALITE" ? "PÉNALITÉ" : "PRÊT"}
                  </span>
                </td>
                <td><span className={styles.amount}>{formatAmount(d.amount)} XAF</span></td>
                <td>{new Date(d.dueDate).toLocaleDateString(locale === "fr" ? "fr-FR" : "en-US")}</td>
                <td>
                  <button className={styles.actionBtn}>
                    <i className="fas fa-eye"></i>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
