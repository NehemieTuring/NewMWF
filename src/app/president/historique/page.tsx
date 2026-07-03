"use client";

import { useEffect, useState } from "react";
import { presidentService } from "../../../services/presidentService";
import styles from "../president-dashboard.module.css";

export default function PresidentHistorique() {
    const [exercises, setExercises] = useState<any[]>([]);
    const [sessions, setSessions] = useState<any[]>([]);
    const [selectedExerciseId, setSelectedExerciseId] = useState<number | null>(null);
    const [selectedSessionId, setSelectedSessionId] = useState<number | null>(null);

    const [transactions, setTransactions] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    // Initial load
    useEffect(() => {
        async function init() {
            try {
                const [exData, sessData] = await Promise.all([
                    presidentService.getExercises(),
                    presidentService.getSessions()
                ]);
                setExercises(Array.isArray(exData) ? exData : []);
                setSessions(Array.isArray(sessData) ? sessData : []);

                if (exData && exData.length > 0) {
                    const active = exData.find((e: any) => e.status === "ACTIVE") || exData[0];
                    setSelectedExerciseId(active.id);
                }
            } catch (err) {
                console.error("Init history error:", err);
            } finally {
                setLoading(false);
            }
        }
        init();
    }, []);

    // Effect to load transactions when filters change
    useEffect(() => {
        async function loadTransactions() {
            if (!selectedExerciseId && !selectedSessionId) return;

            setLoading(true);
            try {
                let data;
                if (selectedSessionId) {
                    // Si une session est sélectionnée, on prend son bilan spécifique
                    data = await presidentService.getSessionBilan(selectedSessionId);
                } else {
                    // Sinon on prend le bilan de l'exercice (qui contient les transactions globales de l'ex)
                    data = await presidentService.getExerciseBilan(selectedExerciseId as number);
                }

                setTransactions(Array.isArray(data.recentTransactions) ? data.recentTransactions : []);
            } catch (err) {
                console.error("Failed to load transactions:", err);
                setTransactions([]);
            } finally {
                setLoading(false);
            }
        }
        loadTransactions();
    }, [selectedExerciseId, selectedSessionId]);

    const filteredSessions = sessions.filter(s => s.exercise?.id === selectedExerciseId || !selectedExerciseId);

    const formatFull = (num: number) => {
        return Number(num || 0).toLocaleString();
    };

    return (
        <div className={styles.dashboard}>
            <header className={styles.header}>
                <div className={styles.titleSection}>
                    <h1>Historique des Transactions</h1>
                    <p>Consultez l&apos;intégralité des flux financiers par période</p>
                </div>
            </header>

            {/* 🔍 Filtres */}
            <div className={styles.listCard} style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap', alignItems: 'center' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    <label style={{ fontSize: '0.8rem', fontWeight: 700, color: '#666' }}>Exercice</label>
                    <select
                        value={selectedExerciseId || ""}
                        onChange={(e) => {
                            setSelectedExerciseId(Number(e.target.value));
                            setSelectedSessionId(null); // Reset session when exercise changes
                        }}
                        style={{ padding: '0.6rem', borderRadius: '8px', border: '1px solid #ddd', minWidth: '150px' }}
                    >
                        {exercises.map(ex => (
                            <option key={ex.id} value={ex.id}>{ex.year}</option>
                        ))}
                    </select>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    <label style={{ fontSize: '0.8rem', fontWeight: 700, color: '#666' }}>Session (Optionnel)</label>
                    <select
                        value={selectedSessionId || ""}
                        onChange={(e) => setSelectedSessionId(e.target.value ? Number(e.target.value) : null)}
                        style={{ padding: '0.6rem', borderRadius: '8px', border: '1px solid #ddd', minWidth: '200px' }}
                    >
                        <option value="">Toutes les sessions</option>
                        {filteredSessions.map(sess => (
                            <option key={sess.id} value={sess.id}>
                                {sess.name || `Session ${sess.sessionNumber}`} ({new Date(sess.date).toLocaleDateString()})
                            </option>
                        ))}
                    </select>
                </div>
            </div>

            {/* 📊 Liste des Transactions */}
            <div className={styles.listCard}>
                <span className={styles.listCardTitle}>
                    {selectedSessionId ? "Transactions de la session" : "Dernières transactions de l'exercice"}
                </span>

                <div style={{ overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <thead>
                            <tr style={{ textAlign: 'left', borderBottom: '2px solid #eee' }}>
                                <th style={{ padding: '1rem' }}>Date</th>
                                <th style={{ padding: '1rem' }}>Description</th>
                                <th style={{ padding: '1rem' }}>Membre</th>
                                <th style={{ padding: '1rem', textAlign: 'right' }}>Montant</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr>
                                    <td colSpan={4} style={{ textAlign: 'center', padding: '3rem' }}>
                                        <i className="fas fa-circle-notch fa-spin"></i> Chargement...
                                    </td>
                                </tr>
                            ) : transactions.length > 0 ? (
                                transactions.map((tx: any) => (
                                    <tr key={tx.id} style={{ borderBottom: '1px solid #f5f5f5' }}>
                                        <td style={{ padding: '1rem', fontSize: '0.9rem', color: '#666' }}>
                                            {new Date(tx.date).toLocaleDateString()}
                                        </td>
                                        <td style={{ padding: '1rem', fontWeight: 600 }}>
                                            {tx.description}
                                        </td>
                                        <td style={{ padding: '1rem', color: '#555' }}>
                                            {(() => {
                                                if (tx.memberName && tx.memberName !== "Système" && tx.memberName !== "Système / Inconnu") {
                                                    return tx.memberName;
                                                }
                                                // Fallback: essayer de trouver le nom dans la description (ex: "pour Nom Prénom")
                                                const match = tx.description?.match(/pour\s+([A-Za-zÀ-ÖØ-öø-ÿ\s\-]+)/i);
                                                if (match && match[1]) return match[1].trim();

                                                return tx.memberName || "Système";
                                            })()}
                                        </td>
                                        <td style={{
                                            padding: '1rem',
                                            textAlign: 'right',
                                            fontWeight: 800,
                                            color: tx.amount < 0 ? '#d32f2f' : '#2e7d32'
                                        }}>
                                            {tx.amount > 0 ? "+" : ""}{formatFull(tx.amount)} FCFA
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={4} style={{ textAlign: 'center', padding: '3rem', color: '#999' }}>
                                        Aucune transaction trouvée pour cette période.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
