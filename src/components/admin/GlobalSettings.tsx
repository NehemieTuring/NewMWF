"use client";

import { useEffect, useState } from "react";
import styles from "@/app/admin/admin.module.css";
import { secretaryService } from "@/services/secretaryService";
import { useNotification } from "@/context/NotificationContext";
import { useAuth } from "@/context/AuthContext";
import { useTranslation } from "@/context/LanguageContext";

export default function GlobalSettings() {
    const { t } = useTranslation();
    const { user } = useAuth();
    const { showToast } = useNotification();

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [exercise, setExercise] = useState<any>(null);

    // Controlled fields
    const [amounts, setAmounts] = useState({
        inscriptionAmount: 0,
        solidarityAmount: 0,
        agapeAmount: 0,
        penaltyAmount: 0,
        interestRate: 0
    });

    const subRole = user?.subRole?.toUpperCase();
    // Uniquement le secrétaire générale (ou admin/super_admin) a l'accès en écriture
    const canEdit = subRole === "SECGEN" || subRole === "SECRETAIRE_GENERALE" || user?.role?.toUpperCase() === "SUPER_ADMIN" || user?.role?.toUpperCase() === "ADMIN";

    useEffect(() => {
        loadSettings();
    }, []);

    async function loadSettings() {
        setLoading(true);
        try {
            const currentEx = await secretaryService.getCurrentExercise();
            if (currentEx) {
                setExercise(currentEx);
                setAmounts({
                    inscriptionAmount: currentEx.inscriptionAmount || 0,
                    solidarityAmount: currentEx.solidarityAmount || 0,
                    agapeAmount: currentEx.agapeAmount || 0,
                    penaltyAmount: currentEx.penaltyAmount || 0,
                    interestRate: currentEx.interestRate || 0
                });
            }
        } catch (err) {
            console.error(err);
            showToast("Erreur lors du chargement des paramètres.", "error");
        } finally {
            setLoading(false);
        }
    }

    const handleUpdate = async () => {
        if (!exercise) return;
        setSaving(true);
        try {
            await secretaryService.updateExercise(exercise.id, amounts);
            showToast("Paramètres mis à jour avec succès !", "success");
            loadSettings();
        } catch (err: any) {
            console.error(err);
            showToast(err.message || "Erreur lors de la mise à jour.", "error");
        } finally {
            setSaving(false);
        }
    };

    if (loading) return <div className="fas fa-spinner fa-spin" style={{ fontSize: "2rem", color: "#4e73df", margin: "5rem auto", display: "block" }}></div>;

    if (!exercise) return (
        <div style={{ textAlign: "center", padding: "5rem" }}>
            <i className="fas fa-exclamation-circle" style={{ fontSize: "3rem", color: "#e74a3b", marginBottom: "1rem" }}></i>
            <h2>Aucun exercice actif trouvé</h2>
            <p>Veuillez d'abord initialiser un exercice annuel.</p>
        </div>
    );

    return (
        <div className={styles.container}>
            <header className="fade-in-up" style={{ marginBottom: "2.5rem" }}>
                <h1 style={{ fontSize: "2.2rem", fontWeight: 900, color: "#1a365d", marginBottom: "0.5rem" }}>
                    Paramètres <span className="text-gradient">Globaux</span>
                </h1>
                <p style={{ color: "#718096", fontSize: "1.05rem" }}>
                    Configuration des montants de base pour l'exercice {exercise.year}.
                    {!canEdit && <span style={{ marginLeft: "1rem", color: "#e53e3e", fontWeight: "bold" }}>(Lecture seule - Secrétaire Générale uniquement)</span>}
                </p>
            </header>

            <div className="stagger-children" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(350px, 1fr))", gap: "2rem" }}>
                {/* Card: Cotisations */}
                <div className={styles.tableCard} style={{ padding: "2rem" }}>
                    <h3 style={{ marginBottom: "1.5rem", display: "flex", alignItems: "center", gap: "0.75rem" }}>
                        <i className="fas fa-wallet" style={{ color: "#4e73df" }}></i>
                        Cotisations Fixes
                    </h3>

                    <div className={styles.formField} style={{ marginBottom: "1.5rem" }}>
                        <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: 600 }}>Montant Adhésion (Inscription)</label>
                        <div style={{ position: "relative" }}>
                            <input
                                type="number"
                                className={styles.formInput}
                                value={amounts.inscriptionAmount}
                                onChange={(e) => setAmounts({ ...amounts, inscriptionAmount: Number(e.target.value) })}
                                disabled={!canEdit}
                                style={{ paddingRight: "3rem" }}
                            />
                            <span style={{ position: "absolute", right: "1rem", top: "50%", transform: "translateY(-50%)", color: "#a0aec0", fontWeight: 700 }}>XAF</span>
                        </div>
                    </div>

                    <div className={styles.formField}>
                        <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: 600 }}>Montant Solidarité (Fond Social)</label>
                        <div style={{ position: "relative" }}>
                            <input
                                type="number"
                                className={styles.formInput}
                                value={amounts.solidarityAmount}
                                onChange={(e) => setAmounts({ ...amounts, solidarityAmount: Number(e.target.value) })}
                                disabled={!canEdit}
                                style={{ paddingRight: "3rem" }}
                            />
                            <span style={{ position: "absolute", right: "1rem", top: "50%", transform: "translateY(-50%)", color: "#a0aec0", fontWeight: 700 }}>XAF</span>
                        </div>
                    </div>
                </div>

                {/* Card: Autres */}
                <div className={styles.tableCard} style={{ padding: "2rem" }}>
                    <h3 style={{ marginBottom: "1.5rem", display: "flex", alignItems: "center", gap: "0.75rem" }}>
                        <i className="fas fa-cogs" style={{ color: "#1cc88a" }}></i>
                        Paramètres Secondaires
                    </h3>

                    <div className={styles.formField} style={{ marginBottom: "1.5rem" }}>
                        <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: 600 }}>Taux d'Intérêt (%)</label>
                        <input
                            type="number"
                            className={styles.formInput}
                            value={amounts.interestRate}
                            onChange={(e) => setAmounts({ ...amounts, interestRate: Number(e.target.value) })}
                            disabled={!canEdit}
                            step="0.1"
                        />
                    </div>

                    <div className={styles.formField}>
                        <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: 600 }}>Pénalité de retard</label>
                        <div style={{ position: "relative" }}>
                            <input
                                type="number"
                                className={styles.formInput}
                                value={amounts.penaltyAmount}
                                onChange={(e) => setAmounts({ ...amounts, penaltyAmount: Number(e.target.value) })}
                                disabled={!canEdit}
                                style={{ paddingRight: "3rem" }}
                            />
                            <span style={{ position: "absolute", right: "1rem", top: "50%", transform: "translateY(-50%)", color: "#a0aec0", fontWeight: 700 }}>XAF</span>
                        </div>
                    </div>
                </div>
            </div>

            {canEdit && (
                <div style={{ marginTop: "3rem", display: "flex", justifyContent: "flex-end" }}>
                    <button
                        onClick={handleUpdate}
                        className={styles.confirmBtn}
                        style={{
                            background: "linear-gradient(135deg, #4e73df, #224abe)",
                            padding: "1rem 2.5rem",
                            fontSize: "1.1rem"
                        }}
                        disabled={saving}
                    >
                        {saving ? <i className="fas fa-spinner fa-spin"></i> : <i className="fas fa-save" style={{ marginRight: "0.5rem" }}></i>}
                        Enregistrer les modifications
                    </button>
                </div>
            )}
        </div>
    );
}
