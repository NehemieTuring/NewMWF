"use client";

import { useEffect, useState, useMemo } from "react";
import { presidentService } from "@/services/presidentService";
import styles from "./president-members.module.css";
import Link from "next/link";

export default function PresidentMembers() {
  const [members, setMembers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");

  // Detail Drawer State
  const [selectedMember, setSelectedMember] = useState<any>(null);
  const [memberDetails, setMemberDetails] = useState<{
    debts: any;
    savings: any[];
    solidarity: any;
    status: any;
  } | null>(null);
  const [loadingDetails, setLoadingDetails] = useState(false);

  useEffect(() => {
    async function fetchMembers() {
      try {
        const data = await presidentService.getAllMembers();
        setMembers(Array.isArray(data) ? data : []);
      } catch (err: any) {
        console.error("Fetch members error:", err);
        setError(err.message || "Impossible de récupérer la liste des membres");
      } finally {
        setLoading(false);
      }
    }
    fetchMembers();
  }, []);

  const fetchMemberDetails = async (member: any) => {
    setSelectedMember(member);
    setLoadingDetails(true);
    try {
      const [debts, savings, solidarity, status] = await Promise.all([
        presidentService.getMemberDebts(member.id),
        presidentService.getMemberSavings(member.id),
        presidentService.getSolidarityDebt(member.id),
        presidentService.getMemberStatus(member.id)
      ]);
      setMemberDetails({ debts, savings, solidarity, status });
    } catch (err) {
      console.error("Error fetching member details:", err);
    } finally {
      setLoadingDetails(false);
    }
  };

  const closeDrawer = () => {
    setSelectedMember(null);
    setMemberDetails(null);
  };

  const filteredMembers = useMemo(() => {
    return members.filter((m) => {
      const matchesSearch =
        `${m.user?.firstName} ${m.user?.name} ${m.username}`
          .toLowerCase()
          .includes(search.toLowerCase());

      const matchesStatus =
        statusFilter === "ALL" ||
        (statusFilter === "ACTIVE" && m.active) ||
        (statusFilter === "INACTIVE" && !m.active);

      return matchesSearch && matchesStatus;
    });
  }, [members, search, statusFilter]);

  if (loading) {
    return (
      <div className={styles.loading}>
        <i className={`fas fa-circle-notch ${styles.loadingSpinner}`}></i>
        <p>Chargement des membres...</p>
      </div>
    );
  }

  return (
    <div className={`${styles.container} ${selectedMember ? styles.drawerOpen : ""}`}>
      <header className={styles.header}>
        <div className={styles.titleSection}>
          <h1>Liste des Membres</h1>
          <p>{members.length} membres enregistrés au total</p>
        </div>
        <div className={styles.actions}>
          <button className={styles.selectInput} onClick={() => window.location.reload()}>
            <i className="fas fa-sync-alt" style={{ marginRight: '8px' }}></i> Actualiser
          </button>
        </div>
      </header>

      <div className={styles.filtersBar}>
        <div className={styles.searchWrapper}>
          <i className="fas fa-search"></i>
          <input
            type="text"
            className={styles.searchInput}
            placeholder="Rechercher par nom ou identifiant..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className={styles.filterGroup}>
          <label style={{ fontWeight: 700, color: '#718096', fontSize: '0.9rem' }}>Statut :</label>
          <select
            className={styles.selectInput}
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="ALL">Tous les membres</option>
            <option value="ACTIVE">Membres Actifs</option>
            <option value="INACTIVE">Membres Inactifs</option>
          </select>
        </div>
      </div>

      <div className={styles.tableCard}>
        <div className={styles.tableContainer}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Membre</th>
                <th>Identifiant</th>
                <th>Téléphone</th>
                <th>Adhésion</th>
                <th>Statut</th>
              </tr>
            </thead>
            <tbody>
              {filteredMembers.length > 0 ? (
                filteredMembers.map((member) => (
                  <tr key={member.id} onClick={() => fetchMemberDetails(member)} style={{ cursor: 'pointer' }}>
                    <td>
                      <div className={styles.memberCell}>
                        <div className={styles.avatar}>
                          {member.user?.firstName?.[0] || '?'}{member.user?.name?.[0] || '?'}
                        </div>
                        <div className={styles.memberInfo}>
                          <span className={styles.memberName}>{member.user?.firstName} {member.user?.name}</span>
                          <span className={styles.memberEmail}>{member.user?.email || "Aucun email"}</span>
                        </div>
                      </div>
                    </td>
                    <td>
                      <span className={styles.idCell}>@{member.username}</span>
                    </td>
                    <td>
                      <span className={styles.telCell}>{member.user?.tel || "N/A"}</span>
                    </td>
                    <td>
                      <span className={styles.dateCell}>
                        {member.createdAt ? new Date(member.createdAt).toLocaleDateString() : "Non définie"}
                      </span>
                    </td>
                    <td>
                      {!member.active ? (
                        <span className={`${styles.badge} ${styles.badgeInactive}`}>
                          DESACTIVE
                        </span>
                      ) : (
                        <span className={`${styles.badge} ${member.calculatedStatus === 'EN_REGLE' ? styles.badgeActive : (member.calculatedStatus === 'INACTIF' ? styles.badgeInactive : styles.badgePending)}`}>
                          {member.calculatedStatus === 'EN_REGLE' ? 'EN REGLE' : (member.calculatedStatus === 'INACTIF' ? 'INACTIF' : 'INSOLVABLE')}
                        </span>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5}>
                    <div className={styles.emptyState}>
                      <i className="fas fa-users-slash"></i>
                      <h3>Aucun membre trouvé</h3>
                      <p>Essayez de modifier vos critères de recherche ou de filtrage.</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Member Details Drawer */}
      <div className={styles.drawerOverlay} onClick={closeDrawer}></div>
      <aside className={styles.drawer}>
        {selectedMember && (
          <>
            <header className={styles.drawerHeader}>
              <div className={styles.drawerHeaderInfo}>
                <div className={styles.avatarLarge}>
                  {selectedMember.user?.firstName?.[0]}{selectedMember.user?.name?.[0]}
                </div>
                <div>
                  <h2 style={{ fontSize: '1.5rem', fontWeight: 800, margin: 0 }}>
                    {selectedMember.user?.firstName} {selectedMember.user?.name}
                  </h2>
                  <p style={{ margin: 0, opacity: 0.8, fontWeight: 600 }}>@{selectedMember.username}</p>
                </div>
              </div>
              <button className={styles.closeDrawer} onClick={closeDrawer}>
                <i className="fas fa-times"></i>
              </button>
            </header>

            <div className={styles.drawerContent}>
              {loadingDetails ? (
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '4rem' }}>
                  <i className="fas fa-circle-notch fa-spin" style={{ fontSize: '2rem', color: '#4e73df', marginBottom: '1rem' }}></i>
                  <p style={{ color: '#718096', fontWeight: 600 }}>Chargement des données...</p>
                </div>
              ) : (
                <>
                  <section className={styles.detailSection}>
                    <h3 className={styles.sectionTitle}><i className="fas fa-user"></i> Informations Personnelles</h3>
                    <div className={styles.infoGrid}>
                      <div className={styles.infoItem}>
                        <span className={styles.infoLabel}>Email</span>
                        <span className={styles.infoValue}>{selectedMember.user?.email || "N/A"}</span>
                      </div>
                      <div className={styles.infoItem}>
                        <span className={styles.infoLabel}>Téléphone</span>
                        <span className={styles.infoValue}>{selectedMember.user?.tel || "N/A"}</span>
                      </div>
                      <div className={styles.infoItem}>
                        <span className={styles.infoLabel}>Profession</span>
                        <span className={styles.infoValue}>{selectedMember.profession || "N/A"}</span>
                      </div>
                      <div className={styles.infoItem}>
                        <span className={styles.infoLabel}>Lieu de service</span>
                        <span className={styles.infoValue}>{selectedMember.servicePlace || "N/A"}</span>
                      </div>
                    </div>
                  </section>

                  <section className={styles.detailSection}>
                    <h3 className={styles.sectionTitle}><i className="fas fa-chart-line"></i> Résumé Financier</h3>
                    <div className={styles.financialSummary}>
                      <div className={`${styles.finCard} ${styles.finCardGreen}`}>
                        <span className={styles.finLabel}>Total Épargnes</span>
                        <span className={styles.finValue}>{selectedMember.savingsTotal?.toLocaleString() || 0} FCFA</span>
                      </div>
                      <div className={`${styles.finCard} ${styles.finCardRed}`}>
                        <span className={styles.finLabel}>Dette Totale</span>
                        <span className={styles.finValue}>{memberDetails?.debts?.totalDebts?.toLocaleString() || 0} FCFA</span>
                      </div>
                      <div className={`${styles.finCard} ${styles.finCardBlue}`}>
                        <span className={styles.finLabel}>Dette Solidarité</span>
                        <span className={styles.finValue}>{memberDetails?.solidarity?.amount?.toLocaleString() || 0} FCFA</span>
                      </div>
                      <div className={`${styles.finCard} ${styles.finCardBlue}`} style={{ background: '#f8f9fc', color: '#4a5568' }}>
                        <span className={styles.finLabel}>Statut Adhésion</span>
                        <span className={styles.finValue} style={{ fontSize: '1rem' }}>{memberDetails?.status?.status || "Inconnu"}</span>
                      </div>
                    </div>
                  </section>

                  <section className={styles.detailSection}>
                    <h3 className={styles.sectionTitle}><i className="fas fa-history"></i> Historique Récent</h3>
                    <div className={styles.tableWrapper}>
                      <table className={styles.historyTable}>
                        <thead>
                          <tr>
                            <th>Date</th>
                            <th>Description</th>
                            <th style={{ textAlign: 'right' }}>Montant</th>
                          </tr>
                        </thead>
                        <tbody>
                          {memberDetails?.savings && memberDetails.savings.length > 0 ? (
                            memberDetails.savings.slice(0, 5).map((s: any, idx: number) => (
                              <tr key={idx}>
                                <td>{new Date(s.date).toLocaleDateString()}</td>
                                <td>Épargne {s.type}</td>
                                <td style={{ textAlign: 'right', fontWeight: 700, color: '#38a169' }}>+{s.amount?.toLocaleString()}</td>
                              </tr>
                            ))
                          ) : (
                            <tr>
                              <td colSpan={3} style={{ textAlign: 'center', padding: '1rem', color: '#a0aec0' }}>Aucune transaction récente</td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                  </section>
                </>
              )}
            </div>
          </>
        )}
      </aside>
    </div>
  );
}
