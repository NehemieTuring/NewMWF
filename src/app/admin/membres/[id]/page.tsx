"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { secretaryService } from "@/services/secretaryService";
import styles from "../membres.module.css";
import { useTranslation } from "@/context/LanguageContext";
import { useNotification } from "@/context/NotificationContext";

export default function MemberDetailsPage() {
  const { id } = useParams();
  const router = useRouter();
  const { t, locale } = useTranslation();
  const { showToast, confirm } = useNotification();
  const [member, setMember] = useState<any>(null);
  const [debts, setDebts] = useState<any>(null);
  const [savings, setSavings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadMemberData() {
      if (!id) return;
      try {
        const memberId = Number(id);
        const [memberData, debtsData, savingsData] = await Promise.all([
          secretaryService.getMemberById(memberId),
          secretaryService.getMemberDebts(memberId),
          secretaryService.getMemberSavings(memberId),
        ]);
        setMember(memberData);
        setDebts(debtsData);
        setSavings(savingsData);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    loadMemberData();
  }, [id]);

  function formatAmount(n: number) {
    return (n || 0).toLocaleString(locale === "fr" ? "fr-FR" : "en-US");
  }

  const handleDeactivate = async () => {
    const fullName = `${member?.user?.firstName} ${member?.user?.name}`;
    confirm({
      title: "Confirmer la désactivation",
      message: `Voulez-vous vraiment désactiver le membre ${fullName} ? Celui-ci ne pourra plus se connecter.`,
      type: "danger",
      confirmText: "Désactiver",
      requiredConfirmValue: fullName,
      onConfirm: async () => {
        try {
          await secretaryService.deactivateMember(Number(id));
          showToast("Membre désactivé avec succès", "success");
          setTimeout(() => window.location.reload(), 1000);
        } catch (err: any) {
          showToast("Erreur: " + err.message, "error");
        }
      }
    });
  };

  const handleActivate = async () => {
    confirm({
      title: "Confirmer l'activation",
      message: "Voulez-vous vraiment activer ce membre ?",
      type: "success",
      confirmText: "Activer",
      onConfirm: async () => {
        try {
          await secretaryService.activateMember(Number(id));
          showToast("Membre activé avec succès", "success");
          setTimeout(() => window.location.reload(), 1000);
        } catch (err: any) {
          showToast("Erreur: " + err.message, "error");
        }
      }
    });
  };

  if (loading) return <div className={styles.loading}>Chargement des détails...</div>;
  if (error) return <div className={styles.error}>Erreur: {error}</div>;
  if (!member) return <div className={styles.error}>Membre introuvable</div>;

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <div className={styles.memberProfileHeader}>
          <div className={styles.avatarLarge}>
            {member.user?.firstName?.[0]}{member.user?.name?.[0]}
          </div>
          <div className={styles.titleSection}>
            <h1 className={styles.title}>{member.user?.firstName} {member.user?.name}</h1>
            <p className={styles.subtitle}>
              <i className="fas fa-user-tag"></i> Nom d'utilisateur: <strong>{member.username}</strong> |
              <i className="fas fa-calendar-check" style={{ marginLeft: '0.75rem' }}></i> Membre depuis le {new Date(member.createdAt).toLocaleDateString()}
            </p>
          </div>
        </div>
        <div className={styles.actions}>
          <button className={styles.backBtn} onClick={() => router.push("/admin/membres")}>
            <i className="fas fa-arrow-left"></i> Retour à la liste
          </button>
        </div>
      </header>

      <div className={styles.detailsGrid}>
        {/* Info Card */}
        <div className={styles.detailCard}>
          <h3><i className="fas fa-info-circle"></i> Informations Personnelles</h3>
          <div className={styles.detailList}>
            <div className={styles.detailItem}><span>Email</span> <strong>{member.user?.email}</strong></div>
            <div className={styles.detailItem}><span>Téléphone</span> <strong>{member.user?.tel}</strong></div>
            <div className={styles.detailItem}><span>Statut du Compte</span> <span className={`${styles.badge} ${member.active ? styles.badgeActive : styles.badgeInactive}`}>{member.active ? "Actif" : "Désactivé"}</span></div>
            <div className={styles.detailItem}><span>Statut Financier</span> <span className={`${styles.badge} ${member.calculatedStatus === 'EN_REGLE' ? styles.badgeActive : (member.calculatedStatus === 'INACTIF' ? styles.badgeInactive : styles.badgePending)}`}>{member.calculatedStatus || "INACTIF"}</span></div>
          </div>
        </div>

        {/* Financial Summary */}
        <div className={styles.detailCard}>
          <h3><i className="fas fa-hand-holding-usd"></i> Récapitulatif Financier</h3>
          <div className={styles.statBoxes}>
            <div className={styles.statBox}>
              <span>Total Épargnes</span>
              <strong>{formatAmount(member.savingsTotal || savings.reduce((acc, s) => s.type === 'INFLOW' ? acc + s.amount : acc - s.amount, 0))} FCFA</strong>
            </div>
            <div className={styles.statBox}>
              <span>Dette Actuelle</span>
              <strong className={styles.textRed}>{formatAmount(debts?.totalDebts)} FCFA</strong>
            </div>
          </div>
        </div>

        {/* Savings History (Partial) */}
        <div className={`${styles.detailCard} ${styles.fullWidth}`}>
          <h3><i className="fas fa-history"></i> Historique des Épargnes</h3>
          <div className={styles.tableWrapper}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Type</th>
                  <th>Montant</th>
                </tr>
              </thead>
              <tbody>
                {savings.map((saving) => (
                  <tr key={saving.id}>
                    <td>{saving.createdAt ? new Date(saving.createdAt).toLocaleDateString() : 'N/A'}</td>
                    <td>
                      <span className={saving.type === 'INFLOW' ? styles.badgeSuccess : styles.badgeDanger}>
                        {saving.type === 'INFLOW' ? 'DÉPÔT' : 'RETRAIT'}
                      </span>
                    </td>
                    <td className={styles.amount} style={{ fontWeight: 800 }}>
                      {saving.type === 'INFLOW' ? '+' : '-'} {formatAmount(saving.amount)} FCFA
                    </td>
                  </tr>
                ))}
                {savings.length === 0 && <tr><td colSpan={3} className={styles.empty}>Aucune épargne enregistrée</td></tr>}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
