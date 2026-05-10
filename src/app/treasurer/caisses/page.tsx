"use client";

import { useEffect, useState } from "react";
import { treasurerService } from "@/services/treasurerService";
import { useNotification } from "@/context/NotificationContext";
import dashboardStyles from "../../admin/dashboard.module.css";
import styles from "../treasurer.module.css";

export default function TreasurerCaisses() {
  const { showToast } = useNotification();
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadCaisses() {
      try {
        const data = await treasurerService.getCashboxes();
        setStats(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    loadCaisses();
  }, []);

  if (loading) return <div>Chargement...</div>;

  return (
    <div className={dashboardStyles.dashboard}>
      <header className={dashboardStyles.header}>
        <div className={dashboardStyles.headerInfo}>
          <h1 className={dashboardStyles.title}>Gestion des Caisses</h1>
          <p className={dashboardStyles.subtitle}>Suivi des soldes et des opérations par caisse en temps réel</p>
        </div>
      </header>

      <div className={styles.cashboxGrid}>
        {stats?.cashboxes?.map((box: any) => (
          <div key={box.name} className={styles.cashboxCard}>
             <div className={styles.cashboxHeader}>
                <h3>{box.name}</h3>
                <i className="fas fa-vault"></i>
             </div>
             <div className={styles.cashboxValue}>
                {box.balance?.toLocaleString()} <span>XAF</span>
             </div>
             <div className={styles.cashboxFooter}>
                <i className="fas fa-clock"></i>
                <span>Dernière opération: Aujourd'hui</span>
             </div>
          </div>
        ))}
      </div>

      <div className={dashboardStyles.cardSection} style={{ marginTop: "3rem" }}>
         <div className={dashboardStyles.sectionHeader} style={{ marginBottom: "1.5rem" }}>
            <h2 className={dashboardStyles.sectionTitle}>
              <i className="fas fa-minus-circle" style={{ color: "#e74a3b", marginRight: "0.75rem" }}></i>
              Enregistrer une Dépense
            </h2>
            <p className={dashboardStyles.sectionSubtitle}>Saisissez les détails de la dépense pour mettre à jour les caisses</p>
         </div>
         
         <form className={styles.expenditureForm} onSubmit={(e) => {
           e.preventDefault();
           const amount = (e.target as any).amount.value;
           const reason = (e.target as any).reason.value;
           treasurerService.recordExpenditure(amount, reason, "Général")
             .then(() => {
                showToast("Dépense enregistrée avec succès !", "success");
                (e.target as any).reset();
             })
             .catch((err) => showToast("Erreur: " + err.message, "error"));
         }}>
            <div className={styles.formRow}>
               <div className={styles.inputGroup}>
                  <label htmlFor="amount">Montant</label>
                  <input 
                    type="number" 
                    id="amount"
                    name="amount" 
                    className={styles.formInput}
                    placeholder="Ex: 5000" 
                    required 
                  />
               </div>
               <div className={styles.inputGroup}>
                  <label htmlFor="reason">Motif de la dépense</label>
                  <input 
                    type="text" 
                    id="reason"
                    name="reason" 
                    className={styles.formInput}
                    placeholder="Description de l'opération..." 
                    required 
                  />
               </div>
               <button type="submit" className={styles.submitBtn}>
                 <i className="fas fa-check-circle"></i>
                 Valider la Dépense
               </button>
            </div>
         </form>
      </div>
    </div>
  );
}
