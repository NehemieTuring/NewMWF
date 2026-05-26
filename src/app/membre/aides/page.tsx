"use client";

import { useEffect, useState } from "react";
import styles from "../membre.module.css";
import { useTranslation } from "@/context/LanguageContext";
import { memberService } from "@/services/memberService";
import { useNotification } from "@/context/NotificationContext";

export default function AidesPage() {
  const { t, locale } = useTranslation();
  const { showToast } = useNotification();
  const [activeHelps, setActiveHelps] = useState<any[]>([]);
  const [helpTypes, setHelpTypes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Contribution modal
  const [selectedHelp, setSelectedHelp] = useState<any>(null);
  const [contributionAmount, setContributionAmount] = useState("");

  useEffect(() => {
    async function loadAides() {
      try {
        const [helps, types] = await Promise.all([
          memberService.getActiveHelps(),
          memberService.getHelpTypes()
        ]);
        setActiveHelps(helps || []);
        setHelpTypes(types || []);
      } catch (err) {
        console.error("Failed to load helps", err);
      } finally {
        setLoading(false);
      }
    }
    loadAides();
  }, []);

  const handleContribute = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedHelp || !contributionAmount) return;
    try {
      await memberService.contributeToHelp(selectedHelp.id, Number(contributionAmount));
      showToast("Contribution enregistrée avec succès !", "success");
      setSelectedHelp(null);
      setContributionAmount("");
      // Refresh
      const updated = await memberService.getActiveHelps();
      setActiveHelps(updated);
    } catch (err: any) {
      showToast(err.message || "Erreur lors de la contribution", "error");
    }
  };

  function formatAmount(n: number) {
    return (n || 0).toLocaleString(locale === "fr" ? "fr-FR" : "en-US");
  }

  if (loading) return (
    <div className={styles.container}>
      <div className={styles.loadingContainer}>
        <div className={styles.loadingSpinner}></div>
        <span className={styles.loadingText}>Chargement des aides...</span>
      </div>
    </div>
  );

  return (
    <div className={styles.container}>
      <header className="fade-in-up" style={{ marginBottom: "2rem", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <h1 style={{ fontSize: "1.8rem", fontWeight: 800, color: "#2e3b4e", letterSpacing: "-0.02em" }}>
            Solidarité & <span className="text-gradient">Aides</span>
          </h1>
          <p style={{ color: "#858796", fontSize: "0.95rem" }}>Consultez les aides en cours financées par le Fonds Social.</p>
        </div>
      </header>


      {/* Active Helps */}
      <section className="fade-in-up" style={{ marginBottom: "3rem", animationDelay: "0.2s" }}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>Aides en cours</h2>
          <span className={styles.statusBadge} style={{ background: "rgba(28,200,138,0.08)", color: "#1cc88a" }}>
            {activeHelps.length} active{activeHelps.length > 1 ? "s" : ""}
          </span>
        </div>
        <div className={styles.tableWrapper}>
          <table className={styles.table}>
            <colgroup>
              <col style={{ width: "20%" }} />
              <col style={{ width: "30%" }} />
              <col style={{ width: "15%" }} />
              <col style={{ width: "15%" }} />
              <col style={{ width: "20%" }} />
            </colgroup>
            <thead>
              <tr>
                <th>Type d&apos;Aide</th>
                <th>Bénéficiaire</th>
                <th>Montant</th>
                <th>Collecté</th>
                <th>Progression</th>
              </tr>
            </thead>
            <tbody>
              {activeHelps.map((help, index) => {
                const progress = Math.min(100, Math.round(((help.collectedAmount || 0) / (help.targetAmount || 1)) * 100));
                return (
                  <tr key={help.id} style={{ animationDelay: `${index * 0.1}s` }} className="fade-in">
                    <td>
                      <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
                        <div style={{ width: "42px", height: "42px", borderRadius: "12px", background: "linear-gradient(135deg, rgba(78,115,223,0.1), rgba(33,147,176,0.1))", color: "#4e73df", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1rem" }}>
                          <i className="fas fa-hand-holding-heart"></i>
                        </div>
                        <span style={{ fontWeight: 800, color: "#2d3748", fontSize: "0.95rem" }}>{help.helpType?.name}</span>
                      </div>
                    </td>
                    <td>
                      <div className={styles.beneficiaryCell}>
                        <span className={styles.beneficiaryName}>{help.member?.user?.firstName} {help.member?.user?.name}</span>
                      </div>
                    </td>
                    <td>
                      <div className={styles.amountCell}>
                        {formatAmount(help.targetAmount)} <span className={styles.amountXAF}>XAF</span>
                      </div>
                    </td>
                    <td>
                      <div className={styles.amountCell} style={{ color: "#1cc88a" }}>
                        {formatAmount(help.collectedAmount)} <span className={styles.amountXAF}>XAF</span>
                      </div>
                    </td>
                    <td>
                      <div style={{ width: "160px" }}>
                        <div className={styles.progressLabel}>
                          <span style={{ color: progress >= 100 ? "#1cc88a" : "#4e73df" }}>{progress >= 100 ? "Versé" : "Financement"}</span>
                          <span>{progress}%</span>
                        </div>
                        <div style={{ height: "6px", background: "#f1f4f8", borderRadius: "10px", overflow: "hidden" }}>
                          <div style={{ width: `${progress}%`, height: "100%", background: progress >= 100 ? "linear-gradient(90deg, #1cc88a, #36e7b0)" : "linear-gradient(90deg, #4e73df, #6d8cef)", borderRadius: "10px", transition: "width 1s ease-out" }}></div>
                        </div>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          {activeHelps.length === 0 && (
            <div className="empty-state" style={{ padding: "3rem" }}>
              <i className="fas fa-heart" style={{ fontSize: "2rem", opacity: 0.1, marginBottom: "1rem" }}></i>
              <p>Aucune aide active pour le moment.</p>
            </div>
          )}
        </div>
      </section>

      {/* Help Types */}
      <section className="fade-in-up" style={{ animationDelay: "0.3s" }}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>Types d&apos;aides disponibles</h2>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "1rem" }}>
          {helpTypes.map((type, index) => (
            <div key={type.id} className={styles.dataCard} style={{ display: "flex", alignItems: "center", gap: "1rem", padding: "1.25rem" }}>
              <div style={{ width: "44px", height: "44px", borderRadius: "12px", background: "rgba(78,115,223,0.08)", color: "#4e73df", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.1rem", flexShrink: 0 }}>
                <i className="fas fa-check-circle"></i>
              </div>
              <div>
                <h4 style={{ margin: 0, fontSize: "0.95rem", fontWeight: 700 }}>{type.name}</h4>
                <p style={{ margin: 0, fontSize: "0.8rem", color: "#858796" }}>Montant forfaitaire: <strong style={{ color: "#2e3b4e" }}>{formatAmount(type.defaultAmount)} XAF</strong></p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
