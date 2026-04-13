"use client";

import { useEffect, useState } from "react";
import styles from "../admin.module.css";
import { treasurerService } from "@/services/treasurerService";
import { useNotification } from "@/context/NotificationContext";
import { useTranslation } from "@/context/LanguageContext";

export default function TresoreriePage() {
  const { locale } = useTranslation();
  const { showToast } = useNotification();
  const [cashboxes, setCashboxes] = useState<any[]>([]);
  const [expenses, setExpenses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Modal Expense
  const [showAddExpense, setShowAddExpense] = useState(false);
  const [expenseData, setExpenseData] = useState({ amount: "", reason: "", category: "OFFICE" });

  useEffect(() => {
    async function loadData() {
      try {
        const [cashData, expenseData] = await Promise.all([
          treasurerService.getCashboxes(),
          treasurerService.getAllExpenses().catch(() => []),
        ]);
        setCashboxes(cashData || []);
        setExpenses(expenseData || []);
      } catch (err) {
        console.error("Failed to load treasury data", err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const handleAddExpense = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await treasurerService.recordExpenditure(
        Number(expenseData.amount),
        expenseData.reason,
        expenseData.category
      );
      showToast("Dépense enregistrée avec succès", "success");
      setShowAddExpense(false);
      setExpenseData({ amount: "", reason: "", category: "OFFICE" });
      // Refresh
      const updated = await treasurerService.getAllExpenses();
      setExpenses(updated);
    } catch (err: any) {
      showToast(err.message || "Erreur lors de l'enregistrement", "error");
    }
  };

  function formatAmount(n: number) {
    return (n || 0).toLocaleString(locale === "fr" ? "fr-FR" : "en-US");
  }

  if (loading) return <div className="fas fa-spinner fa-spin" style={{ fontSize: "2rem", color: "#4e73df", margin: "5rem auto", display: "block" }}></div>;

  return (
    <div className={styles.container}>
      <header style={{ marginBottom: "2rem", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <h1 style={{ fontSize: "1.8rem", fontWeight: 800, color: "#2e3b4e" }}>Trésorerie & Comptabilité</h1>
          <p style={{ color: "#858796" }}>Surveillance des caisses mutuelles et gestion des dépenses administratives.</p>
        </div>
        <button className={styles.confirmBtn} onClick={() => setShowAddExpense(true)} style={{ background: "linear-gradient(135deg, #e74a3b, #be2617)" }}>
          <i className="fas fa-minus-circle"></i> Enregistrer une dépense
        </button>
      </header>

      {/* Cashboxes Grid */}
      <h2 style={{ fontSize: "1.1rem", fontWeight: 700, marginBottom: "1.25rem" }}>État des Caisses</h2>
      <div className={styles.dashboardGrid} style={{ marginBottom: "2.5rem" }}>
        {cashboxes.map((cb, i) => (
          <div key={i} className={styles.statCard}>
            <div className={styles.statIcon} style={{ background: "rgba(28,200,138,0.1)", color: "#1cc88a" }}>
              <i className="fas fa-vault"></i>
            </div>
            <div className={styles.statInfo}>
              <span className={styles.statLabel}>{cb.name || "Caisse Locale"}</span>
              <span className={styles.statValue}>{formatAmount(cb.balance)} <small>XAF</small></span>
            </div>
          </div>
        ))}
        {cashboxes.length === 0 && <p style={{ color: "#858796" }}>Aucune caisse configurée.</p>}
      </div>

      {/* Expenses Table */}
      <section>
        <h2 style={{ fontSize: "1.1rem", fontWeight: 700, marginBottom: "1.25rem" }}>Dépenses Récentes</h2>
        <div style={{ background: "white", borderRadius: "16px", border: "1px solid #e3e6f0", overflow: "hidden" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead style={{ background: "#f8f9fc" }}>
              <tr>
                <th style={{ padding: "1rem 1.5rem", textAlign: "left", fontSize: "0.7rem", fontWeight: 800, color: "#858796", textTransform: "uppercase" }}>Date</th>
                <th style={{ padding: "1rem 1.5rem", textAlign: "left", fontSize: "0.7rem", fontWeight: 800, color: "#858796", textTransform: "uppercase" }}>Motif / Raison</th>
                <th style={{ padding: "1rem 1.5rem", textAlign: "left", fontSize: "0.7rem", fontWeight: 800, color: "#858796", textTransform: "uppercase" }}>Catégorie</th>
                <th style={{ padding: "1rem 1.5rem", textAlign: "right", fontSize: "0.7rem", fontWeight: 800, color: "#858796", textTransform: "uppercase" }}>Montant</th>
              </tr>
            </thead>
            <tbody>
              {expenses.map((exp) => (
                <tr key={exp.id} style={{ borderBottom: "1px solid #f8f9fc" }}>
                  <td style={{ padding: "1rem 1.5rem", fontSize: "0.85rem", color: "#858796" }}>{new Date(exp.createdAt).toLocaleDateString()}</td>
                  <td style={{ padding: "1rem 1.5rem", fontWeight: 600 }}>{exp.reason}</td>
                  <td style={{ padding: "1rem 1.5rem" }}>
                    <span style={{ padding: "0.25rem 0.75rem", borderRadius: "50px", fontSize: "0.65rem", fontWeight: 800, background: "#f8f9fc", color: "#4e73df" }}>
                      {exp.category}
                    </span>
                  </td>
                  <td style={{ padding: "1rem 1.5rem", textAlign: "right", fontWeight: 700, color: "#e74a3b" }}>-{formatAmount(exp.amount)} XAF</td>
                </tr>
              ))}
            </tbody>
          </table>
          {expenses.length === 0 && <div style={{ padding: "3rem", textAlign: "center", color: "#858796" }}>Aucune dépense enregistrée.</div>}
        </div>
      </section>

      {/* Modal Add Expense */}
      {showAddExpense && (
        <div className={styles.modalOverlay} onClick={() => setShowAddExpense(false)}>
          <div className={styles.modal} style={{ maxWidth: "450px" }} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h3>Enregistrer une dépense</h3>
              <button className={styles.modalClose} onClick={() => setShowAddExpense(false)}><i className="fas fa-times"></i></button>
            </div>
            <form onSubmit={handleAddExpense} className={styles.modalBody} style={{ textAlign: "left" }}>
              <div style={{ marginBottom: "1.5rem" }}>
                <label style={{ display: "block", fontSize: "0.85rem", fontWeight: 700, color: "#4e73df", marginBottom: "0.5rem" }}>Motif de la dépense</label>
                <input 
                  type="text" 
                  value={expenseData.reason}
                  onChange={(e) => setExpenseData({...expenseData, reason: e.target.value})}
                  placeholder="Ex: Achat fournitures bureau"
                  style={{ width: "100%", padding: "0.75rem", borderRadius: "10px", border: "1px solid #e3e6f0", outline: "none" }}
                  required
                />
              </div>
              <div style={{ marginBottom: "1.5rem" }}>
                <label style={{ display: "block", fontSize: "0.85rem", fontWeight: 700, color: "#4e73df", marginBottom: "0.5rem" }}>Montant (XAF)</label>
                <input 
                  type="number" 
                  value={expenseData.amount}
                  onChange={(e) => setExpenseData({...expenseData, amount: e.target.value})}
                  placeholder="Ex: 15000"
                  style={{ width: "100%", padding: "0.75rem", borderRadius: "10px", border: "1px solid #e3e6f0", outline: "none" }}
                  required
                />
              </div>
              <div style={{ marginBottom: "2rem" }}>
                <label style={{ display: "block", fontSize: "0.85rem", fontWeight: 700, color: "#4e73df", marginBottom: "0.5rem" }}>Catégorie</label>
                <select 
                  value={expenseData.category}
                  onChange={(e) => setExpenseData({...expenseData, category: e.target.value})}
                  style={{ width: "100%", padding: "0.75rem", borderRadius: "10px", border: "1px solid #e3e6f0", outline: "none" }}
                >
                  <option value="OFFICE">Fournitures</option>
                  <option value="RENT">Loyer / Charges</option>
                  <option value="SOCIAL">Social / Aide</option>
                  <option value="OTHER">Autre</option>
                </select>
              </div>
              <div className={styles.modalActions}>
                <button type="button" className={styles.cancelBtn} onClick={() => setShowAddExpense(false)}>Annuler</button>
                <button type="submit" className={styles.confirmBtn} style={{ background: "#e74a3b" }}>Confirmer la dépense</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
