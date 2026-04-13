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
          <p style={{ color: "#858796", fontSize: "0.95rem" }}>Soutenez vos collègues dans les moments importants.</p>
        </div>
      </header>

      {/* KPI Summary */}
      <div className={`${styles.dashboardGrid} stagger-children`} style={{ marginBottom: "2.5rem" }}>
        <div className={styles.statCard}>
          <div className={styles.statIcon} style={{ background: "rgba(78,115,223,0.1)", color: "#4e73df" }}>
            <i className="fas fa-hands-helping"></i>
          </div>
          <div className={styles.statInfo}>
            <span className={styles.statLabel}>Aides Actives</span>
            <span className={styles.statValue}>{activeHelps.length}</span>
          </div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statIcon} style={{ background: "rgba(28,200,138,0.1)", color: "#1cc88a" }}>
            <i className="fas fa-donate"></i>
          </div>
          <div className={styles.statInfo}>
            <span className={styles.statLabel}>Total Collecté</span>
            <span className={styles.statValue}>{formatAmount(activeHelps.reduce((s, h) => s + (h.currentAmount || 0), 0))} <small>XAF</small></span>
          </div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statIcon} style={{ background: "rgba(246,194,62,0.1)", color: "#f6c23e" }}>
            <i className="fas fa-bullseye"></i>
          </div>
          <div className={styles.statInfo}>
            <span className={styles.statLabel}>Objectif Total</span>
            <span className={styles.statValue}>{formatAmount(activeHelps.reduce((s, h) => s + (h.targetAmount || 0), 0))} <small>XAF</small></span>
          </div>
        </div>
      </div>

      {/* Active Helps */}
      <section className="fade-in-up" style={{ marginBottom: "3rem", animationDelay: "0.2s" }}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>Aides en cours</h2>
          <span className={styles.statusBadge} style={{ background: "rgba(28,200,138,0.08)", color: "#1cc88a" }}>
            {activeHelps.length} active{activeHelps.length > 1 ? "s" : ""}
          </span>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(340px, 1fr))", gap: "1.5rem" }}>
          {activeHelps.map((help, index) => {
            const progress = Math.min(100, Math.round(((help.currentAmount || 0) / (help.targetAmount || 1)) * 100));
            return (
              <div key={help.id} className={styles.dataCard} style={{ animationDelay: `${index * 0.1}s` }}>
                 <div style={{ display: "flex", gap: "1rem", marginBottom: "1.5rem" }}>
                    <div style={{ width: "50px", height: "50px", borderRadius: "14px", background: "linear-gradient(135deg, rgba(78,115,223,0.12), rgba(33,147,176,0.12))", color: "#4e73df", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.2rem", flexShrink: 0 }}>
                      <i className="fas fa-hand-holding-heart"></i>
                    </div>
                    <div style={{ minWidth: 0 }}>
                      <h3 style={{ fontSize: "1rem", fontWeight: 700, margin: 0 }}>{help.type?.name}</h3>
                      <span style={{ fontSize: "0.85rem", color: "#858796" }}>Pour {help.beneficiary?.user?.firstName} {help.beneficiary?.user?.name}</span>
                    </div>
                 </div>
                 
                 <div className={styles.progressContainer}>
                    <div className={styles.progressHeader}>
                       <span>Progression</span>
                       <span style={{ color: progress >= 100 ? "#1cc88a" : "#4e73df" }}>{progress}%</span>
                    </div>
                    <div className={styles.progressTrack}>
                       <div className={styles.progressFill} style={{ width: `${progress}%`, background: progress >= 100 ? "linear-gradient(90deg, #1cc88a, #36e7b0)" : "linear-gradient(90deg, #4e73df, #6d8cef)" }}></div>
                    </div>
                 </div>

                 <div className={styles.kpiRow}>
                    <div className={styles.kpiItem}>
                       <span className={styles.kpiItemLabel}>Objectif</span>
                       <span className={styles.kpiItemValue}>{formatAmount(help.targetAmount)} <small style={{ fontSize: "0.7em", opacity: 0.7 }}>XAF</small></span>
                    </div>
                    <div className={styles.kpiItem}>
                       <span className={styles.kpiItemLabel}>Collecté</span>
                       <span className={styles.kpiItemValue} style={{ color: "#1cc88a" }}>{formatAmount(help.currentAmount)} <small style={{ fontSize: "0.7em", opacity: 0.7 }}>XAF</small></span>
                    </div>
                 </div>

                 <button 
                  className={styles.confirmBtn} 
                  style={{ width: "100%", justifyContent: "center", marginTop: "1.25rem", background: "linear-gradient(135deg, #4e73df, #224abe)", boxShadow: "0 4px 15px rgba(78,115,223,0.2)" }}
                  onClick={() => setSelectedHelp(help)}
                 >
                    <i className="fas fa-heart"></i> Contribuer à cette aide
                 </button>
              </div>
            );
          })}
          {activeHelps.length === 0 && (
            <div className="empty-state" style={{ gridColumn: "1 / -1" }}>
              <i className="fas fa-heart"></i>
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

      {/* Contribution Modal */}
      {selectedHelp && (
        <div className={styles.modalOverlay} onClick={() => setSelectedHelp(null)}>
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h3>Faire une contribution</h3>
              <button className={styles.modalClose} onClick={() => setSelectedHelp(null)}>
                <i className="fas fa-times"></i>
              </button>
            </div>
            <form onSubmit={handleContribute} className={styles.modalBody}>
              <div style={{ textAlign: "center", marginBottom: "2rem" }}>
                <div style={{ width: "60px", height: "60px", borderRadius: "50%", background: "rgba(78,115,223,0.1)", color: "#4e73df", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.5rem", margin: "0 auto 1rem" }}>
                  <i className="fas fa-heart"></i>
                </div>
                 <p style={{ color: "#858796", fontSize: "0.9rem", marginBottom: "0.25rem" }}>Vous allez contribuer à l&apos;aide :</p>
                 <h4 style={{ fontSize: "1.2rem", color: "#2e3b4e", marginBottom: "0.25rem" }}>{selectedHelp.type?.name}</h4>
                 <p style={{ fontSize: "0.85rem", color: "#4e73df", fontWeight: 700 }}>Bénéficiaire : {selectedHelp.beneficiary?.user?.firstName} {selectedHelp.beneficiary?.user?.name}</p>
              </div>

              <div style={{ textAlign: "left", marginBottom: "1.5rem" }}>
                 <label style={{ display: "block", fontSize: "0.85rem", fontWeight: 700, color: "#4e73df", marginBottom: "0.5rem" }}>Montant de votre contribution (XAF)</label>
                 <input 
                    type="number" 
                    className={styles.input}
                    value={contributionAmount}
                    onChange={(e) => setContributionAmount(e.target.value)}
                    placeholder="Ex: 5000"
                    required
                 />
              </div>
              <div className={styles.modalActions}>
                <button type="button" className={styles.cancelBtn} onClick={() => setSelectedHelp(null)}>Annuler</button>
                <button type="submit" className={styles.confirmBtn} style={{ background: "linear-gradient(135deg, #1cc88a, #13855c)" }}>
                  <i className="fas fa-check"></i> Confirmer ma contribution
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
