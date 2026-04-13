"use client";

import { useEffect, useState } from "react";
import styles from "./depenses.module.css";
import { useTranslation } from "@/context/LanguageContext";
import { treasurerService } from "@/services/treasurerService";
import { useNotification } from "@/context/NotificationContext";

export default function TreasurerDepensesPage() {
  const { locale } = useTranslation();
  const { showToast, confirm } = useNotification();
  const [expenses, setExpenses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [newExp, setNewExp] = useState({ amount: "", reason: "", category: "FONCTIONNEMENT" });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadExpenses();
  }, []);

  async function loadExpenses() {
    setLoading(true);
    try {
      const data = await treasurerService.getAllExpenses();
      setExpenses(data || []);
    } catch (err) {
      console.error("Failed to load expenses", err);
    } finally {
      setLoading(false);
    }
  }

  async function handleAddExpense(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    try {
      await treasurerService.recordExpenditure(parseFloat(newExp.amount), newExp.reason, newExp.category);
      setNewExp({ amount: "", reason: "", category: "FONCTIONNEMENT" });
      setShowModal(false);
      loadExpenses();
      showToast("Dépense enregistrée avec succès !", "success");
    } catch (err) {
      showToast("Erreur lors de l'enregistrement de la dépense.", "error");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: number) {
    confirm({
      title: "Supprimer la dépense",
      message: "Voulez-vous vraiment supprimer cette dépense ?",
      type: "danger",
      confirmText: "Supprimer",
      onConfirm: async () => {
        try {
          await treasurerService.deleteExpense(id);
          showToast("Dépense supprimée avec succès !", "success");
          loadExpenses();
        } catch (err) {
          showToast("Erreur lors de la suppression.", "error");
        }
      }
    });
  }

  function formatAmount(n: number) {
    return (n || 0).toLocaleString(locale === "fr" ? "fr-FR" : "en-US");
  }

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <h1 className={styles.title}>Dépenses de Fonctionnement</h1>
        <p className={styles.subtitle}>Enregistrez et suivez les flux sortants de la mutuelle.</p>
        <button className={styles.addBtn} onClick={() => setShowModal(true)}>
           <i className="fas fa-plus"></i> Nouvelle Dépense
        </button>
      </header>

      <div className={styles.tableCard}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Date</th>
              <th>Motif</th>
              <th>Catégorie</th>
              <th style={{ textAlign: "right" }}>Montant</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
                <tr><td colSpan={5} style={{ textAlign: "center", padding: "2rem" }}>Chargement...</td></tr>
            ) : expenses.length > 0 ? (
                expenses.map((ex) => (
                <tr key={ex.id}>
                  <td>{new Date(ex.expenseDate).toLocaleDateString()}</td>
                  <td className={styles.reasonCol}>{ex.reason}</td>
                  <td><span className={styles.catBadge}>{ex.category}</span></td>
                  <td style={{ textAlign: "right", fontWeight: 700, color: "#e74c3c" }}>
                    - {formatAmount(ex.amount)} XAF
                  </td>
                  <td>
                    <button className={styles.deleteBtn} onClick={() => handleDelete(ex.id)}>
                        <i className="fas fa-trash"></i>
                    </button>
                  </td>
                </tr>
              ))
            ) : (
                <tr><td colSpan={5} className={styles.empty}>Aucune dépense enregistrée.</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {showModal && (
          <div className={styles.modalOverlay}>
              <div className={styles.modal}>
                  <h3>Enregistrer une dépense</h3>
                  <form onSubmit={handleAddExpense}>
                      <div className={styles.formGroup}>
                          <label>Montant (XAF)</label>
                          <input 
                            type="number" 
                            required 
                            value={newExp.amount} 
                            onChange={(e) => setNewExp({...newExp, amount: e.target.value})} 
                          />
                      </div>
                      <div className={styles.formGroup}>
                          <label>Motif / Justification</label>
                          <input 
                            type="text" 
                            required 
                            value={newExp.reason} 
                            onChange={(e) => setNewExp({...newExp, reason: e.target.value})} 
                          />
                      </div>
                      <div className={styles.formGroup}>
                          <label>Catégorie</label>
                          <select 
                            value={newExp.category} 
                            onChange={(e) => setNewExp({...newExp, category: e.target.value})}
                          >
                              <option value="FONCTIONNEMENT">Fonctionnement</option>
                              <option value="AGAPE">Agapè</option>
                              <option value="AUTRE">Autre</option>
                          </select>
                      </div>
                      <div className={styles.modalActions}>
                          <button type="button" className={styles.cancelBtn} onClick={() => setShowModal(false)}>Annuler</button>
                          <button type="submit" className={styles.saveBtn} disabled={saving}>
                              {saving ? "Enregistrement..." : "Valider"}
                          </button>
                      </div>
                  </form>
              </div>
          </div>
      )}
    </div>
  );
}
