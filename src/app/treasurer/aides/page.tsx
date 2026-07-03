"use client";

import { useEffect, useState } from "react";
import { presidentService } from "@/services/presidentService";
import styles from "../../treasurer/treasurer.module.css";
import Link from "next/link";

export default function TreasurerHelps() {
    const [helps, setHelps] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function loadHelps() {
            try {
                const data = await presidentService.getAllHelps();
                setHelps(Array.isArray(data) ? data : []);
            } catch (err: any) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        }
        loadHelps();
    }, []);

    const fmt = (n: any) => Number(n || 0).toLocaleString();

    if (loading) return <div className={styles.container}><i className="fas fa-spinner fa-spin"></i> Chargement des aides...</div>;

    return (
        <div className={styles.container}>
            <header className={styles.header}>
                <h1>Aides & Secours</h1>
                <p style={{ color: '#888' }}>Suivi des collectes et déboursements pour la solidarité</p>
            </header>

            <div className={styles.transactionsCard} style={{ padding: 0 }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                        <tr style={{ background: '#f9f8f5', borderBottom: '1px solid #eee' }}>
                            <th style={{ padding: '1rem', textAlign: 'left' }}>Motif / Type</th>
                            <th style={{ padding: '1rem', textAlign: 'left' }}>Bénéficiaire</th>
                            <th style={{ padding: '1rem', textAlign: 'right' }}>Objectif</th>
                            <th style={{ padding: '1rem', textAlign: 'right' }}>Collecté</th>
                            <th style={{ padding: '1rem', textAlign: 'center' }}>Statut</th>
                        </tr>
                    </thead>
                    <tbody>
                        {helps.map((help: any) => (
                            <tr key={help.id} style={{ borderBottom: '1px solid #f5f3ef' }}>
                                <td style={{ padding: '1rem' }}>
                                    <div style={{ fontWeight: 600 }}>{help.helpType?.name || "Aide"}</div>
                                    <div style={{ fontSize: '0.8rem', color: '#888' }}>{help.motive}</div>
                                </td>
                                <td style={{ padding: '1rem' }}>
                                    {help.member?.user?.firstName} {help.member?.user?.name}
                                </td>
                                <td style={{ padding: '1rem', textAlign: 'right', fontWeight: 600 }}>{fmt(help.targetAmount)}</td>
                                <td style={{ padding: '1rem', textAlign: 'right', color: '#2b7a4d', fontWeight: 700 }}>{fmt(help.collectedAmount)}</td>
                                <td style={{ padding: '1rem', textAlign: 'center' }}>
                                    <span className={`${styles.statusBadge} ${help.status === 'ACTIVE' ? styles.badgeOpen : styles.badgePartial}`}>
                                        {help.status === 'ACTIVE' ? 'Ouvert' : help.status === 'COMPLETED' ? 'Terminé' : help.status}
                                    </span>
                                </td>
                            </tr>
                        ))}
                        {helps.length === 0 && (
                            <tr>
                                <td colSpan={5} style={{ padding: '3rem', textAlign: 'center', color: '#888' }}>Aucune aide enregistrée</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
