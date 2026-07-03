"use client";

import { useEffect, useState } from "react";
import styles from "./bilans.module.css";
import { useTranslation } from "@/context/LanguageContext";
import { treasurerService } from "@/services/treasurerService";

export default function TreasurerBilansPage() {
  const { t, locale } = useTranslation();
  const [exercises, setExercises] = useState<any[]>([]);
  const [sessions, setSessions] = useState<any[]>([]);
  const [selectedExercise, setSelectedExercise] = useState<string>("");
  const [selectedSession, setSelectedSession] = useState<string>("");
  const [bilan, setBilan] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function loadInitialData() {
      try {
        const exData = await treasurerService.getExercises();
        setExercises(exData || []);

        const sessData = await treasurerService.getSessions();
        setSessions(sessData || []);

        if (exData && exData.length > 0) {
          const active = exData.find((e: any) => e.active);
          if (active) setSelectedExercise(active.id.toString());
        }
      } catch (err) {
        console.error("Failed to load initial data", err);
      }
    }
    loadInitialData();
  }, []);

  useEffect(() => {
    if (selectedExercise) {
      loadExerciseBilan(parseInt(selectedExercise));
    }
  }, [selectedExercise]);

  async function loadExerciseBilan(id: number) {
    setLoading(true);
    try {
      const data = await treasurerService.getExerciseBilan(id);
      setBilan(data);
    } catch (err) {
      console.error("Failed to load bilan", err);
    } finally {
      setLoading(false);
    }
  }

  async function loadSessionBilan(id: number) {
    setLoading(true);
    try {
      const data = await treasurerService.getSessionBilan(id);
      setBilan(data);
    } catch (err) {
      console.error("Failed to load session bilan", err);
    } finally {
      setLoading(false);
    }
  }

  function formatAmount(n: number) {
    return (n || 0).toLocaleString(locale === "fr" ? "fr-FR" : "en-US");
  }

  const handlePrint = () => {
    window.print();
  };

  // Math computations of inflows/outflows
  const transactions = bilan?.recentTransactions || [];
  const members = bilan?.members || [];
  const inRuleMembers = members.filter((m: any) => m.calculatedStatus === "EN_REGLE");

  const totalInflows = transactions
    .filter((t: any) => t.amount > 0)
    .reduce((acc: number, t: any) => acc + t.amount, 0);

  const totalOutflows = transactions
    .filter((t: any) => t.amount < 0)
    .reduce((acc: number, t: any) => acc + t.amount, 0);

  const netBalance = totalInflows + totalOutflows;

  // Group transactions by member
  const memberActivity = members.map((m: any) => {
    const mTx = transactions.filter((t: any) => t.memberId === m.id);
    const inflows = mTx.filter((t: any) => t.amount > 0).reduce((acc: number, t: any) => acc + t.amount, 0);
    const outflows = mTx.filter((t: any) => t.amount < 0).reduce((acc: number, t: any) => acc + t.amount, 0);
    return {
      member: m,
      transactions: mTx,
      inflows,
      outflows,
      net: inflows + outflows
    };
  }).filter((act: any) => act.transactions.length > 0);

  const systemTransactions = transactions.filter((t: any) => !t.memberId);

  const activePeriodLabel = selectedSession
    ? `Session en date du ${sessions.find(s => s.id.toString() === selectedSession) ? new Date(sessions.find(s => s.id.toString() === selectedSession).date).toLocaleDateString() : 'Inconnue'}`
    : selectedExercise
      ? `Exercice Annuel ${exercises.find(e => e.id.toString() === selectedExercise)?.year || ''}`
      : "Bilan global";

  return (
    <div className={styles.page}>
      {/* Styles spécifique pour l'impression */}
      <style jsx global>{`
        @media print {
          body {
            background: white !important;
            color: black !important;
          }
          nav, aside, footer, header, .no-print {
            display: none !important;
          }
          .print-header {
            display: block !important;
          }
          .page {
            padding: 0 !important;
            margin: 0 !important;
            box-shadow: none !important;
          }
          .card, .tableCard, .cashboxCard {
            box-shadow: none !important;
            border: 1px solid #e2e8f0 !important;
            background: transparent !important;
            page-break-inside: avoid;
          }
          .table {
            border-collapse: collapse !important;
            width: 100% !important;
          }
          .table th, .table td {
            border: 1px solid #cbd5e0 !important;
            padding: 6px 10px !important;
            font-size: 0.85rem !important;
          }
          .section-block {
            page-break-inside: avoid;
            margin-top: 2rem !important;
          }
        }
      `}</style>

      {/* Header exclusif pour l'impression */}
      <div className="print-header" style={{ display: "none", marginBottom: "2rem", borderBottom: "3px double #1a365d", paddingBottom: "1.5rem" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <h1 style={{ fontSize: "2rem", fontWeight: 800, color: "#1a365d", margin: 0 }}>MUTUELLE WEB</h1>
            <p style={{ margin: "4px 0 0 0", color: "#4a5568", fontSize: "0.9rem" }}>Solidarité • Épargne • Crédit</p>
          </div>
          <div style={{ textAlign: "right" }}>
            <h2 style={{ fontSize: "1.2rem", fontWeight: 700, margin: 0 }}>BILAN FINANCIER</h2>
            <p style={{ margin: "4px 0 0 0", color: "#718096", fontSize: "0.85rem" }}>{activePeriodLabel}</p>
            <p style={{ margin: "2px 0 0 0", color: "#a0aec0", fontSize: "0.75rem" }}>Généré le {new Date().toLocaleDateString()}</p>
          </div>
        </div>
      </div>

      <header className={`${styles.header} no-print`}>
        <h1 className={styles.title}>Bilans Financiers du Trésorier</h1>
        <p className={styles.subtitle}>Suivi comptable rigoureux des flux et états financiers de la mutuelle.</p>
      </header>

      <div className={`${styles.filters} no-print`}>
        <div className={styles.filterGroup}>
          <label><i className="fas fa-calendar-alt" style={{ marginRight: '0.4rem', color: '#4e73df' }}></i> Période (Exercice)</label>
          <select
            value={selectedExercise}
            onChange={(e) => {
              setSelectedExercise(e.target.value);
              setSelectedSession("");
            }}
            style={{ borderRadius: "10px", border: "1px solid #cbd5e0", padding: "0.75rem" }}
          >
            <option value="">Sélectionner un exercice</option>
            {exercises.map(ex => (
              <option key={ex.id} value={ex.id}>Exercice {ex.year}</option>
            ))}
          </select>
        </div>
        <div className={styles.filterGroup}>
          <label><i className="fas fa-clock" style={{ marginRight: '0.4rem', color: '#1cc88a' }}></i> OU Filtrer par Session</label>
          <select
            value={selectedSession}
            onChange={(e) => {
              setSelectedSession(e.target.value);
              setSelectedExercise("");
              if (e.target.value) loadSessionBilan(parseInt(e.target.value));
            }}
            style={{ borderRadius: "10px", border: "1px solid #cbd5e0", padding: "0.75rem" }}
          >
            <option value="">Sélectionner une session</option>
            {sessions.map(s => (
              <option key={s.id} value={s.id}>Session #{s.sessionNumber || s.id} ({new Date(s.date).toLocaleDateString()})</option>
            ))}
          </select>
        </div>
      </div>

      {loading ? (
        <div className={styles.loading} style={{ display: "flex", flexDirection: "column", gap: "1rem", alignItems: "center", padding: "5rem" }}>
          <i className="fas fa-spinner fa-spin" style={{ fontSize: "2.5rem", color: "#4e73df" }}></i>
          <span style={{ fontWeight: 700, color: "#4a5568" }}>Chargement des données comptables...</span>
        </div>
      ) : bilan ? (
        <div className={styles.bilanGrid}>
          {/* Métriques globales haut de page */}
          <div className="section-block" style={{ marginBottom: "2rem" }}>
            <h2 style={{ fontSize: "1.35rem", fontWeight: 800, color: "#1a365d", borderLeft: "4px solid #4e73df", paddingLeft: "0.75rem", marginBottom: "1rem" }}>
              1. Détail Global des Flux Financiers
            </h2>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "1.25rem" }}>
              <div style={{ background: "linear-gradient(135deg, #e3f9e5, #c1f2c6)", padding: "1.5rem", borderRadius: "16px", border: "1px solid #a3e8ab" }}>
                <div style={{ fontSize: "0.8rem", color: "#137333", textTransform: "uppercase", fontWeight: 800 }}>Total Entrées</div>
                <div style={{ fontSize: "1.8rem", fontWeight: 900, color: "#137333", marginTop: "0.5rem" }}>
                  +{formatAmount(totalInflows)} <span style={{ fontSize: "1rem" }}>XAF</span>
                </div>
              </div>

              <div style={{ background: "linear-gradient(135deg, #ffebee, #ffcdd2)", padding: "1.5rem", borderRadius: "16px", border: "1px solid #ef9a9a" }}>
                <div style={{ fontSize: "0.8rem", color: "#c5221f", textTransform: "uppercase", fontWeight: 800 }}>Total Sorties</div>
                <div style={{ fontSize: "1.8rem", fontWeight: 900, color: "#c5221f", marginTop: "0.5rem" }}>
                  {formatAmount(totalOutflows)} <span style={{ fontSize: "1rem" }}>XAF</span>
                </div>
              </div>

              <div style={{ background: netBalance >= 0 ? "linear-gradient(135deg, #e8f0fe, #d2e3fc)" : "linear-gradient(135deg, #fff5f5, #feb2b2)", padding: "1.5rem", borderRadius: "16px", border: "1px solid #adc1eb" }}>
                <div style={{ fontSize: "0.8rem", color: netBalance >= 0 ? "#1a73e8" : "#c5221f", textTransform: "uppercase", fontWeight: 800 }}>Solde Net de Période</div>
                <div style={{ fontSize: "1.8rem", fontWeight: 900, color: netBalance >= 0 ? "#174ea6" : "#c5221f", marginTop: "0.5rem" }}>
                  {netBalance >= 0 ? "+" : ""}{formatAmount(netBalance)} <span style={{ fontSize: "1rem" }}>XAF</span>
                </div>
              </div>

              <div style={{ background: "linear-gradient(135deg, #f3e5f5, #e1bee7)", padding: "1.5rem", borderRadius: "16px", border: "1px solid #ce93d8" }}>
                <div style={{ fontSize: "0.8rem", color: "#7b1fa2", textTransform: "uppercase", fontWeight: 800 }}>Membres En Règle</div>
                <div style={{ fontSize: "1.8rem", fontWeight: 900, color: "#7b1fa2", marginTop: "0.5rem" }}>
                  {inRuleMembers.length} / {members.length}
                </div>
              </div>
            </div>
          </div>

          {/* État des Caisses */}
          <div className="section-block" style={{ marginBottom: "2rem" }}>
            <h3 style={{ fontSize: "1.2rem", fontWeight: 800, color: "#2d3748", marginBottom: "1rem" }}>
              <i className="fas fa-wallet" style={{ marginRight: "0.5rem", color: "#4e73df" }}></i> Solde des Caisses de la Mutuelle
            </h3>
            <div className={styles.cashboxGrid}>
              {bilan.cashboxes?.map((cb: any) => (
                <div key={cb.id} className={styles.cashboxCard}>
                  <div className={styles.cbName}>{cb.name.replace('_', ' ')}</div>
                  <div className={styles.cbBalance}>{formatAmount(cb.balance)} <small>XAF</small></div>
                  <div className={styles.indicatorTrack}>
                    <div className={styles.indicatorFill} style={{ width: "100%" }}></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Tableau des transactions globales */}
          <div className="section-block" style={{ marginBottom: "2.5rem" }}>
            <h2 style={{ fontSize: "1.35rem", fontWeight: 800, color: "#1a365d", borderLeft: "4px solid #1cc88a", paddingLeft: "0.75rem", marginBottom: "1.2rem" }}>
              2. Tableau Complet des Transactions (Global)
            </h2>
            <div className={styles.tableCard} style={{ background: "white", padding: "1.5rem", borderRadius: "16px", border: "1px solid #e2e8f0" }}>
              <table className="table" style={{ width: "100%", borderCollapse: "collapse", textAlign: "left" }}>
                <thead>
                  <tr style={{ background: "#f8fafc", borderBottom: "2px solid #e2e8f0" }}>
                    <th style={{ padding: "0.75rem", fontWeight: 700, color: "#4a5568" }}>Date / Heure</th>
                    <th style={{ padding: "0.75rem", fontWeight: 700, color: "#4a5568" }}>Bénéficiaire / Acteur</th>
                    <th style={{ padding: "0.75rem", fontWeight: 700, color: "#4a5568" }}>Catégorie</th>
                    <th style={{ padding: "0.75rem", fontWeight: 700, color: "#4a5568" }}>Description de l'Opération</th>
                    <th style={{ padding: "0.75rem", fontWeight: 700, color: "#4a5568", textAlign: "right" }}>Montant (XAF)</th>
                  </tr>
                </thead>
                <tbody>
                  {transactions.length === 0 ? (
                    <tr>
                      <td colSpan={5} style={{ textAlign: "center", padding: "2rem", color: "#a0aec0" }}>
                        Aucune transaction sur cette période.
                      </td>
                    </tr>
                  ) : (
                    transactions.map((tx: any) => (
                      <tr key={tx.id} style={{ borderBottom: "1px solid #edf2f7" }}>
                        <td style={{ padding: "0.85rem", fontSize: "0.85rem" }}>
                          {new Date(tx.date).toLocaleString()}
                        </td>
                        <td style={{ padding: "0.85rem", fontWeight: 600, color: "#2d3748" }}>
                          {tx.memberName}
                        </td>
                        <td style={{ padding: "0.85rem" }}>
                          <span style={{ fontSize: "0.75rem", textTransform: "uppercase", background: "#e2e8f0", padding: "0.2rem 0.5rem", borderRadius: "6px" }}>
                            {tx.typeLabel || tx.type}
                          </span>
                        </td>
                        <td style={{ padding: "0.85rem", fontSize: "0.85rem", color: "#4a5568" }}>
                          {tx.description}
                        </td>
                        <td style={{ padding: "0.85rem", fontWeight: 800, textAlign: "right", color: tx.amount < 0 ? "#c5221f" : "#137333" }}>
                          {tx.amount > 0 ? "+" : ""}{formatAmount(tx.amount)}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Liste des membres à jour */}
          <div className="section-block" style={{ marginBottom: "2.5rem" }}>
            <h2 style={{ fontSize: "1.35rem", fontWeight: 800, color: "#1a365d", borderLeft: "4px solid #f6ad55", paddingLeft: "0.75rem", marginBottom: "1.2rem" }}>
              3. Liste des Membres En Règle (À Jour)
            </h2>
            <div className={styles.tableCard} style={{ background: "white", padding: "1.5rem", borderRadius: "16px", border: "1px solid #e2e8f0" }}>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))", gap: "1rem" }}>
                {inRuleMembers.length === 0 ? (
                  <div style={{ gridColumn: "1/-1", textAlign: "center", color: "#a0aec0", padding: "1rem" }}>
                    Aucun membre n'est actuellement en règle pour cet exercice.
                  </div>
                ) : (
                  inRuleMembers.map((m: any) => (
                    <div key={m.id} style={{ border: "1px solid #c6f6d5", background: "#f0fff4", padding: "1rem", borderRadius: "12px", display: "flex", gap: "0.75rem", alignItems: "center" }}>
                      <div style={{ width: "36px", height: "36px", borderRadius: "50%", background: "#38a169", color: "white", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700 }}>
                        {m.user?.firstName?.charAt(0)}{m.user?.name?.charAt(0)}
                      </div>
                      <div>
                        <div style={{ fontWeight: 700, color: "#276749" }}>{m.user?.firstName} {m.user?.name}</div>
                        <div style={{ fontSize: "0.75rem", color: "#48bb78" }}>@{m.username} • En règle</div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* Liste des transaction par membre */}
          <div className="section-block" style={{ marginBottom: "2.5rem" }}>
            <h2 style={{ fontSize: "1.35rem", fontWeight: 800, color: "#1a365d", borderLeft: "4px solid #b7791f", paddingLeft: "0.75rem", marginBottom: "1.2rem" }}>
              4. Relevé des Transactions par Membre
            </h2>
            <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
              {memberActivity.length === 0 ? (
                <div style={{ background: "white", padding: "2rem", textAlign: "center", borderRadius: "16px", color: "#a0aec0", border: "1px solid #e2e8f0" }}>
                  Aucune activité de transaction attribuée à un membre sur la période choisie.
                </div>
              ) : (
                memberActivity.map((act: any) => (
                  <div key={act.member.id} className="card" style={{ background: "white", padding: "1.5rem", borderRadius: "16px", border: "1px solid #e2e8f0" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid #edf2f7", paddingBottom: "0.75rem", marginBottom: "1rem" }}>
                      <div>
                        <strong style={{ fontSize: "1.1rem", color: "#2d3748" }}>{act.member.user?.firstName} {act.member.user?.name}</strong>
                        <span style={{ fontSize: "0.75rem", color: "#718096", marginLeft: "1rem" }}>(@{act.member.username})</span>
                      </div>
                      <div style={{ textAlign: "right" }}>
                        <span style={{ fontSize: "0.8rem", color: "#4a5568" }}>Activité Net : </span>
                        <strong style={{ color: act.net >= 0 ? "#137333" : "#c5221f" }}>
                          {act.net >= 0 ? "+" : ""}{formatAmount(act.net)} XAF
                        </strong>
                      </div>
                    </div>

                    <ul style={{ margin: 0, paddingLeft: "1.2rem", fontSize: "0.85rem", color: "#4a5568" }}>
                      {act.transactions.map((tx: any) => (
                        <li key={tx.id} style={{ marginBottom: "0.4rem" }}>
                          <span style={{ color: "#718096" }}>{new Date(tx.date).toLocaleDateString()}</span> - {tx.description} : {" "}
                          <strong style={{ color: tx.amount < 0 ? "#c5221f" : "#137333" }}>
                            {tx.amount > 0 ? "+" : ""}{formatAmount(tx.amount)} XAF
                          </strong>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Action de signature / bas de rapport pour PDF */}
          <div className="print-header" style={{ display: "none", marginTop: "4rem" }}>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <div style={{ width: "200px", textAlign: "center" }}>
                <p style={{ fontWeight: 700, margin: 0 }}>Le Trésorier</p>
                <div style={{ height: "80px" }}></div>
                <p style={{ borderTop: "1px solid #cbd5e0", paddingTop: "0.5rem", fontSize: "0.8rem", color: "#718096" }}>Signature & Cachet</p>
              </div>
              <div style={{ width: "200px", textAlign: "center" }}>
                <p style={{ fontWeight: 700, margin: 0 }}>Le Président du Conseil</p>
                <div style={{ height: "80px" }}></div>
                <p style={{ borderTop: "1px solid #cbd5e0", paddingTop: "0.5rem", fontSize: "0.8rem", color: "#718096" }}>Visa & Approbation</p>
              </div>
            </div>
          </div>

          <div className={`${styles.actions} no-print`}>
            <button className={styles.exportBtn} onClick={handlePrint} style={{ background: "linear-gradient(135deg, #1cc88a, #13855c)", color: "white", padding: "1rem 2rem", fontSize: "1.05rem", fontWeight: 700, outline: "none", display: "flex", gap: "0.5rem" }}>
              <i className="fas fa-file-pdf"></i> Imprimer le Bilan en PDF
            </button>
          </div>
        </div>
      ) : (
        <div className={styles.empty} style={{ background: "#edf2f7", padding: "4rem", textAlign: "center", borderRadius: "16px", color: "#718096", fontSize: "1.1rem" }}>
          <i className="fas fa-chart-bar" style={{ fontSize: "3rem", color: "#a0aec0", marginBottom: "1rem", display: "block" }}></i>
          Veuillez sélectionner un exercice ou une session ci-dessus pour générer le bilan financier comptable.
        </div>
      )}
    </div>
  );
}
