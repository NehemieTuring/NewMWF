"use client";

import { useState } from "react";
import styles from "./remboursements.module.css";
import { useTranslation } from "@/context/LanguageContext";

const mockRefunds = [
  { id: 1, member: "Pierre Essomba", amount: 50000, date: "2026-03-15", loanId: "L-001" },
  { id: 2, member: "Alice Ngo", amount: 25000, date: "2026-03-15", loanId: "L-002" },
  { id: 3, member: "Jean Dupont", amount: 100000, date: "2026-03-14", loanId: "L-003" },
];

export default function RemboursementsPage() {
  const { t, locale } = useTranslation();
  const [search, setSearch] = useState("");

  const filtered = mockRefunds.filter(r => r.member.toLowerCase().includes(search.toLowerCase()));

  function formatAmount(n: number) {
    return n.toLocaleString(locale === "fr" ? "fr-FR" : "en-US");
  }

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>{t.admin.remboursements}</h1>
          <p className={styles.subtitle}>Enregistrement et historique des remboursements de prêts</p>
        </div>
        <button className={styles.addBtn}>
          <i className="fas fa-plus"></i>
          Nouveau Remboursement
        </button>
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
              <th>ID Prêt</th>
              <th>Membre</th>
              <th>Montant</th>
              <th>Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((r) => (
              <tr key={r.id}>
                <td><span className={styles.loanId}>{r.loanId}</span></td>
                <td><span className={styles.memberName}>{r.member}</span></td>
                <td><span className={styles.amount}>{formatAmount(r.amount)} XAF</span></td>
                <td>{new Date(r.date).toLocaleDateString(locale === "fr" ? "fr-FR" : "en-US")}</td>
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
