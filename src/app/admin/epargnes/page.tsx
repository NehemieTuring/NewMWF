"use client";

import { useState } from "react";
import styles from "./epargnes.module.css";
import { useTranslation } from "@/context/LanguageContext";

const mockEpargnes = [
  { id: 1, member: "Jean Dupont", amount: 50000, date: "2026-03-15", type: "DEPOSIT" },
  { id: 2, member: "Marie Kamga", amount: 25000, date: "2026-03-15", type: "DEPOSIT" },
  { id: 3, member: "Pierre Essomba", amount: 10000, date: "2026-03-15", type: "WITHDRAWAL" },
  { id: 4, member: "Alice Ngo", amount: 50000, date: "2026-03-15", type: "DEPOSIT" },
];

export default function EpargnesPage() {
  const { t, locale } = useTranslation();
  const [search, setSearch] = useState("");

  const filtered = mockEpargnes.filter(e => e.member.toLowerCase().includes(search.toLowerCase()));

  function formatAmount(n: number) {
    return n.toLocaleString(locale === "fr" ? "fr-FR" : "en-US");
  }

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>{t.epargnes.titre}</h1>
          <p className={styles.subtitle}>Gestion des dépôts et retraits d'épargne</p>
        </div>
        <div className={styles.actions}>
          <button className={styles.addBtn}>
            <i className="fas fa-plus"></i>
            {t.epargnes.depot}
          </button>
          <button className={`${styles.addBtn} ${styles.withdrawBtn}`}>
            <i className="fas fa-minus"></i>
            {t.epargnes.retrait}
          </button>
        </div>
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
              <th>{t.membres.titre.substring(0, 6)}</th>
              <th>{t.dashboard.montant.substring(0, 7)}</th>
              <th>Date</th>
              <th>Type</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((e) => (
              <tr key={e.id}>
                <td className={styles.memberName}>{e.member}</td>
                <td className={e.type === "DEPOSIT" ? styles.deposit : styles.withdrawal}>
                  {e.type === "DEPOSIT" ? "+" : "-"}{formatAmount(e.amount)} XAF
                </td>
                <td>{new Date(e.date).toLocaleDateString(locale === "fr" ? "fr-FR" : "en-US")}</td>
                <td>
                  <span className={`${styles.badge} ${e.type === "DEPOSIT" ? styles.badgeDeposit : styles.badgeWithdrawal}`}>
                    {e.type === "DEPOSIT" ? t.epargnes.depot.toUpperCase() : t.epargnes.retrait.toUpperCase()}
                  </span>
                </td>
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
