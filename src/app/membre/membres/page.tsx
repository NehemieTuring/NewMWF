"use client";

import { useState } from "react";
import styles from "./membres.module.css";
import { useTranslation } from "@/context/LanguageContext";

const mockMembres = [
  { id: 1, firstName: "Jean", lastName: "Dupont", email: "jean.dupont@enspy.cm", tel: "699000000", matricule: "ENSPY-237" },
  { id: 2, firstName: "Alice", lastName: "Ngo", email: "alice.ngo@enspy.cm", tel: "699000001", matricule: "ENSPY-238" },
  { id: 3, firstName: "Pierre", lastName: "Essomba", email: "pierre.essomba@enspy.cm", tel: "699000002", matricule: "ENSPY-239" },
];

export default function MemberMembresPage() {
  const { t } = useTranslation();
  const [search, setSearch] = useState("");

  const filtered = mockMembres.filter(m => 
    `${m.firstName} ${m.lastName}`.toLowerCase().includes(search.toLowerCase()) ||
    m.matricule.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <h1 className={styles.title}>{t.admin.membres}</h1>
        <p className={styles.subtitle}>Retrouvez vos collègues membres de la mutuelle</p>
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

      <div className={styles.grid}>
        {filtered.map((m) => (
          <div key={m.id} className={styles.card}>
            <div className={styles.cardHeader}>
              <div className={styles.avatar}>{m.firstName.charAt(0)}{m.lastName.charAt(0)}</div>
              <h3>{m.firstName} {m.lastName}</h3>
            </div>
            <div className={styles.cardBody}>
              <div className={styles.infoRow}>
                <i className="fas fa-id-card"></i>
                <span>{m.matricule}</span>
              </div>
              <div className={styles.infoRow}>
                <i className="fas fa-envelope"></i>
                <span>{m.email}</span>
              </div>
            </div>
            <div className={styles.cardFooter}>
              <button className={styles.contactBtn}>Contacter</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
