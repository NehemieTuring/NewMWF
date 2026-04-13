"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { secretaryService } from "@/services/secretaryService";
import styles from "../aides.module.css";
import { useTranslation } from "@/context/LanguageContext";
import { useNotification } from "@/context/NotificationContext";

export default function NewAidPage() {
  const router = useRouter();
  const { t } = useTranslation();
  const { showToast } = useNotification();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [members, setMembers] = useState<any[]>([]);
  const [aidTypes, setAidTypes] = useState<any[]>([]);

  const [formData, setFormData] = useState({
    beneficiaryId: "",
    typeId: "",
    amount: "",
  });

  useEffect(() => {
    async function loadInitialData() {
      try {
        const [membersData, typesData] = await Promise.all([
          secretaryService.getAllMembers(),
          secretaryService.getHelpTypes(),
        ]);
        setMembers(membersData);
        setAidTypes(typesData);
      } catch (err: any) {
        setError("Erreur de chargement des données: " + err.message);
      }
    }
    loadInitialData();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.beneficiaryId || !formData.typeId || !formData.amount) {
      setError("Veuillez remplir tous les champs");
      return;
    }

    setLoading(true);
    setError("");

    try {
      await secretaryService.createHelp(
        Number(formData.typeId),
        Number(formData.beneficiaryId),
        Number(formData.amount)
      );
      showToast("Aide créée avec succès !", "success");
      setTimeout(() => router.push("/admin/aides"), 1000);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <div>
          <h1 className={styles.title}>Nouveau Secours</h1>
          <p className={styles.subtitle}>Enregistrer un nouveau cas d'aide pour un membre</p>
        </div>
        <button className={styles.cancelBtn} onClick={() => router.back()}>
          Annuler
        </button>
      </header>

      <div className={styles.formCard}>
        <form onSubmit={handleSubmit}>
          {error && <div className={styles.errorMessage} style={{ color: "#e74a3b", background: "rgba(231,74,59,0.1)", padding: "1rem", borderRadius: "10px", marginBottom: "1.5rem" }}>{error}</div>}
          
          <div className={styles.formGrid}>
            <div className={`${styles.formGroup} ${styles.fullWidth}`}>
              <label>Membre Bénéficiaire</label>
              <select 
                name="beneficiaryId" 
                value={formData.beneficiaryId} 
                onChange={handleChange} 
                required
              >
                <option value="">Sélectionner un membre</option>
                {members.map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.user?.firstName} {m.user?.name} ({m.username})
                  </option>
                ))}
              </select>
            </div>
            
            <div className={styles.formGroup}>
              <label>Type de Secours</label>
              <select 
                name="typeId" 
                value={formData.typeId} 
                onChange={handleChange} 
                required
              >
                <option value="">Sélectionner le type</option>
                {aidTypes.map((type) => (
                  <option key={type.id} value={type.id}>
                    {type.name} (Plafond: {type.amount.toLocaleString()} XAF)
                  </option>
                ))}
              </select>
            </div>
            
            <div className={styles.formGroup}>
              <label>Montant accordé (XAF)</label>
              <input 
                type="number" 
                name="amount" 
                placeholder="Ex: 50000"
                value={formData.amount} 
                onChange={handleChange} 
                required 
              />
            </div>
          </div>

          <div className={styles.formActions}>
            <button type="submit" className={styles.addBtn} disabled={loading}>
              {loading ? "Chargement..." : "Créer le secours"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
