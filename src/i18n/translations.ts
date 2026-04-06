export type Locale = "fr" | "en";

export interface Translations {
  common: {
    accueil: string;
    connexion: string;
    deconnexion: string;
    profil: string;
    configurations: string;
    langue: string;
    bienvenue: string;
    mutuelle: string;
    enspy: string;
    navigation: string;
    gestionFinanciere: string;
    tontines: string;
    nomUtilisateur: string;
    motDePasse: string;
    seConnecter: string;
    connexionEnCours: string;
    erreurIdentifiants: string;
    marquerCommeLu: string;
    contacterAdmin: string;
    contact: string;
    maDette: string;
    mesPaiements: string;
    mesEpargnes: string;
    mesEmprunts: string;
    mesContributions: string;
    payer: string;
    confirmationDeconnexion: string;
    etesVousSurDeconnexion: string;
    ouiMeDeconnecter: string;
    non: string;
    monProfil: string;
    actualites: string;
    votreCompte: string;
    fondSocialDisponible: string;
    epargneTotale: string;
    empruntEnCours: string;
    contributions: string;
    versements: string;
    chargement: string;
  };
  admin: {
    menuPrincipal: string;
    tableauDeBord: string;
    membres: string;
    administrateurs: string;
    typesAide: string;
    agape: string;
    typesTontine: string;
    communication: string;
    chat: string;
    parametres: string;
    exercices: string;
    sessions: string;
    epargnes: string;
    emprunts: string;
    remboursements: string;
    tontine: string;
    dettes: string;
    aides: string;
    gestionAcces: string;
    ajouterAdmin: string;
    solidariteMembres: string;
    objectif: string;
    collecte: string;
    contribuer: string;
  };
  login: {
    titreAdmin: string;
    titreMembre: string;
    descAdmin: string;
    descMembre: string;
    titreModalAdmin: string;
    titreModalMembre: string;
    erreurAccesAdmin: string;
    erreurAccesMembre: string;
  };
  dashboard: {
    sessionActive: string;
    aucuneSession: string;
    demarrerSession: string;
    cloturerSession: string;
    modifierSession: string;
    nouvelleSession: string;
    inscriptions: string;
    fondSocial: string;
    epargnes: string;
    emprunts: string;
    aidesActives: string;
    empruntsActifs: string;
    voirTout: string;
    details: string;
    creerAide: string;
    annuler: string;
    valider: string;
    tauxInteret: string;
    anneeExercice: string;
    montantInscription: string;
    montantFondSocial: string;
    dateSession: string;
    creerExercice: string;
    montantADonner: string;
    description: string;
    beneficiaire: string;
    type: string;
    statut: string;
    actions: string;
    rechercher: string;
    enregistrer: string;
    modifier: string;
    supprimer: string;
    cloturer: string;
    ouvrir: string;
    enCours: string;
    termine: string;
    active: string;
    inactive: string;
    montant: string;
    date: string;
    justificatif: string;
  };
  membres: {
    titre: string;
    sousTitre: string;
    nouveau: string;
    rechercher: string;
    details: string;
    modifier: string;
    activer: string;
    desactiver: string;
    epargne: string;
    emprunt: string;
    dette: string;
    statut: string;
    actif: string;
    inactif: string;
    numeroMatricule: string;
    telephone: string;
    adresse: string;
    email: string;
  };
  exercices: {
    titre: string;
    creer: string;
    cloturer: string;
    annee: string;
    taux: string;
    statut: string;
  };
  sessions: {
    titre: string;
    creer: string;
    cloturer: string;
    date: string;
    exercice: string;
  };
  epargnes: {
    titre: string;
    depot: string;
    retrait: string;
    historique: string;
    balance: string;
  };
  emprunts: {
    titre: string;
    demande: string;
    remboursement: string;
    restant: string;
    total: string;
  };
  superAdmin: {
    titre: string;
    sousTitre: string;
    tableauDeBord: string;
    gestionAdmins: string;
    gestionMembres: string;
    motsDePasse: string;
    totalMembres: string;
    membresActifs: string;
    membresEnRegle: string;
    membresNonEnRegle: string;
    caisses: string;
    ajouterAdmin: string;
    nomAdmin: string;
    prenomAdmin: string;
    emailAdmin: string;
    usernameAdmin: string;
    motDePasseAdmin: string;
    roleAdmin: string;
    secretaireGenerale: string;
    president: string;
    tresorier: string;
    desactiverAdmin: string;
    supprimerAdmin: string;
    supprimerMembre: string;
    changerMotDePasse: string;
    nouveauMotDePasse: string;
    confirmerSuppression: string;
    confirmerDesactivation: string;
    confirmDeleteAdmin: string;
    confirmDeleteMember: string;
    confirmDeactivateAdmin: string;
    activerAdmin: string;
    confirmerActivation: string;
    confirmActivateAdmin: string;
    actif: string;
    inactif: string;
    voirProfil: string;
    idUtilisateur: string;
    confirmer: string;
    succes: string;
    erreur: string;
    aucunAdmin: string;
    selectionnerRole: string;
  };
}

export const translations: Record<Locale, Translations> = {
  fr: {
    common: {
      accueil: "Accueil",
      connexion: "Connexion",
      deconnexion: "Déconnexion",
      profil: "Profil",
      configurations: "Configurations",
      langue: "Français",
      bienvenue: "Bienvenue à la Mutuelle",
      mutuelle: "des Enseignants de l'ENSPY",
      enspy: "ENSPY",
      navigation: "Navigation",
      gestionFinanciere: "Gestion Financière",
      tontines: "Les Tontines",
      nomUtilisateur: "Nom d'utilisateur",
      motDePasse: "Mot de passe",
      seConnecter: "SE CONNECTER",
      connexionEnCours: "Connexion...",
      erreurIdentifiants: "Identifiants incorrects",
      marquerCommeLu: "Marquer comme lu",
      contacterAdmin: "Contacter l'Admin",
      contact: "Contact",
      maDette: "Ma dette",
      mesPaiements: "Mes paiements",
      mesEpargnes: "Mes épargnes",
      mesEmprunts: "Mes emprunts",
      mesContributions: "Mes contributions",
      payer: "Payer",
      confirmationDeconnexion: "Confirmation de déconnexion",
      etesVousSurDeconnexion: "Êtes-vous sûr(e) de vouloir vous déconnecter ?",
      ouiMeDeconnecter: "Oui, me déconnecter",
      non: "Non",
      monProfil: "Mon Profil",
      actualites: "Actualités de la Mutuelle",
      votreCompte: "Votre Compte",
      fondSocialDisponible: "Fonds Social Disponible",
      epargneTotale: "Épargne totale",
      empruntEnCours: "Emprunt en cours",
      contributions: "Contributions",
      versements: "versements",
      chargement: "Chargement",
    },
    admin: {
      menuPrincipal: "Menu Principal",
      tableauDeBord: "Tableau de bord",
      membres: "Membres",
      administrateurs: "Administrateurs",
      typesAide: "Type d'aides",
      agape: "Agape",
      typesTontine: "Types de Tontines",
      communication: "Communication",
      chat: "Chat",
      parametres: "Paramètres",
      exercices: "Exercices",
      sessions: "Sessions",
      epargnes: "Épargnes",
      emprunts: "Emprunts",
      remboursements: "Remboursements",
      tontine: "Tontine",
      dettes: "Dettes",
      aides: "Aides",
      gestionAcces: "Gestion des accès et rôles administratifs",
      ajouterAdmin: "Ajouter un administrateur",
      solidariteMembres: "Solidarité et aides aux membres",
      objectif: "Objectif",
      collecte: "Collecté",
      contribuer: "Contribuer",
    },
    login: {
      titreAdmin: "Administrateur",
      titreMembre: "Membre",
      descAdmin: "Les administrateurs ont le droit d'enregistrer des entrées, et des sorties d'argent.",
      descMembre: "Les membres peuvent voir les informations sur leurs comptes ainsi que les informations générales de la mutuelle.",
      titreModalAdmin: "Connexion Admin",
      titreModalMembre: "Connexion Membre",
      erreurAccesAdmin: "Accès refusé. Veuillez utiliser la section Membre.",
      erreurAccesMembre: "Accès refusé. Veuillez utiliser la section Administrateur.",
    },
    dashboard: {
      sessionActive: "Session active",
      aucuneSession: "Aucune session active",
      demarrerSession: "Démarrez une nouvelle session pour commencer",
      cloturerSession: "Clôturer la session",
      modifierSession: "Modifier la session",
      nouvelleSession: "Nouvelle session",
      inscriptions: "Inscriptions",
      fondSocial: "Fond Social",
      epargnes: "Épargnes",
      emprunts: "Emprunts",
      aidesActives: "Aides actives",
      empruntsActifs: "Emprunts actifs",
      voirTout: "Voir tout",
      details: "Détails",
      creerAide: "Créer une nouvelle aide",
      annuler: "Annuler",
      valider: "Valider",
      tauxInteret: "Taux d'intérêt (%)",
      anneeExercice: "Année de l'exercice",
      montantInscription: "Montant de l'inscription (XAF)",
      montantFondSocial: "Montant du fond social (XAF)",
      dateSession: "Date de la première session",
      creerExercice: "Créer l'exercice",
      montantADonner: "Montant à donner",
      description: "Description",
      beneficiaire: "Bénéficiaire",
      type: "Type",
      statut: "Statut",
      actions: "Actions",
      rechercher: "Rechercher",
      enregistrer: "Enregistrer",
      modifier: "Modifier",
      supprimer: "Supprimer",
      cloturer: "Clôturer",
      ouvrir: "Ouvrir",
      enCours: "En cours",
      termine: "Terminé",
      active: "Active",
      inactive: "Inactive",
      montant: "Montant",
      date: "Date",
      justificatif: "Justificatif",
    },
    membres: {
      titre: "Membres",
      sousTitre: "membres enregistrés",
      nouveau: "Nouveau membre",
      rechercher: "Rechercher un membre...",
      details: "Voir détails",
      modifier: "Modifier",
      activer: "Activer",
      desactiver: "Désactiver",
      epargne: "Épargne",
      emprunt: "Emprunt",
      dette: "Dette",
      statut: "Statut",
      actif: "Actif",
      inactif: "Inactif",
      numeroMatricule: "N° Matricule",
      telephone: "Téléphone",
      adresse: "Adresse",
      email: "Email",
    },
    exercices: {
      titre: "Gestion des Exercices",
      creer: "Créer un exercice",
      cloturer: "Clôturer",
      annee: "Année",
      taux: "Taux",
      statut: "Statut",
    },
    sessions: {
      titre: "Sessions",
      creer: "Nouvelle Session",
      cloturer: "Clôturer",
      date: "Date",
      exercice: "Exercice",
    },
    epargnes: {
      titre: "Épargnes",
      depot: "Dépôt",
      retrait: "Retrait",
      historique: "Historique",
      balance: "Balance",
    },
    emprunts: {
      titre: "Emprunts",
      demande: "Demande de prêt",
      remboursement: "Remboursement",
      restant: "Restant",
      total: "Total",
    },
    superAdmin: {
      titre: "Super Administrateur",
      sousTitre: "Panneau de contrôle principal",
      tableauDeBord: "Tableau de bord",
      gestionAdmins: "Gestion des Administrateurs",
      gestionMembres: "Gestion des Membres",
      motsDePasse: "Mots de passe",
      totalMembres: "Total Membres",
      membresActifs: "Membres Actifs",
      membresEnRegle: "Membres en règle",
      membresNonEnRegle: "Membres non en règle",
      caisses: "Caisses",
      ajouterAdmin: "Ajouter un administrateur",
      nomAdmin: "Nom",
      prenomAdmin: "Prénom",
      emailAdmin: "Email",
      usernameAdmin: "Nom d'utilisateur",
      motDePasseAdmin: "Mot de passe",
      roleAdmin: "Rôle administratif",
      secretaireGenerale: "Secrétaire Générale",
      president: "Président",
      tresorier: "Trésorier",
      desactiverAdmin: "Désactiver",
      supprimerAdmin: "Supprimer l'administrateur",
      supprimerMembre: "Supprimer le membre",
      changerMotDePasse: "Changer le mot de passe",
      nouveauMotDePasse: "Nouveau mot de passe",
      confirmerSuppression: "Confirmer la suppression",
      confirmerDesactivation: "Confirmer la désactivation",
      confirmDeleteAdmin: "Êtes-vous sûr de vouloir supprimer cet administrateur ? Cette action est irréversible.",
      confirmDeleteMember: "Êtes-vous sûr de vouloir supprimer définitivement ce membre ? Cette action est irréversible.",
      confirmDeactivateAdmin: "Êtes-vous sûr de vouloir désactiver cet administrateur ?",
      activerAdmin: "Activer",
      confirmerActivation: "Confirmer l'activation",
      confirmActivateAdmin: "Êtes-vous sûr de vouloir réactiver cet administrateur ?",
      actif: "Actif",
      inactif: "Inactif",
      voirProfil: "Voir le profil",
      idUtilisateur: "Email / Nom d'utilisateur",
      confirmer: "Confirmer",
      succes: "Opération réussie",
      erreur: "Une erreur est survenue",
      aucunAdmin: "Aucun administrateur enregistré",
      selectionnerRole: "Sélectionner un rôle",
    },
  },
  en: {
    common: {
      accueil: "Home",
      connexion: "Login",
      deconnexion: "Logout",
      profil: "Profile",
      configurations: "Settings",
      langue: "English",
      bienvenue: "Welcome to the Mutual",
      mutuelle: "of ENSPY Teachers",
      enspy: "ENSPY",
      navigation: "Navigation",
      gestionFinanciere: "Financial Management",
      tontines: "The Tontines",
      nomUtilisateur: "Username",
      motDePasse: "Password",
      seConnecter: "LOGIN",
      connexionEnCours: "Connecting...",
      erreurIdentifiants: "Incorrect credentials",
      marquerCommeLu: "Mark as read",
      contacterAdmin: "Contact Admin",
      contact: "Contact",
      maDette: "My Debt",
      mesPaiements: "My Payments",
      mesEpargnes: "My Savings",
      mesEmprunts: "My Loans",
      mesContributions: "My Contributions",
      payer: "Pay",
      confirmationDeconnexion: "Logout Confirmation",
      etesVousSurDeconnexion: "Are you sure you want to log out?",
      ouiMeDeconnecter: "Yes, log me out",
      non: "No",
      monProfil: "My Profile",
      actualites: "Mutual News",
      votreCompte: "Your Account",
      fondSocialDisponible: "Social Fund Available",
      epargneTotale: "Total savings",
      empruntEnCours: "Current loan",
      contributions: "Contributions",
      versements: "payments",
      chargement: "Loading",
    },
    admin: {
      menuPrincipal: "Main Menu",
      tableauDeBord: "Dashboard",
      membres: "Members",
      administrateurs: "Admins",
      typesAide: "Aid Types",
      agape: "Agape",
      typesTontine: "Tontine Types",
      communication: "Communication",
      chat: "Chat",
      parametres: "Settings",
      exercices: "Exercises",
      sessions: "Sessions",
      epargnes: "Savings",
      emprunts: "Loans",
      remboursements: "Refunds",
      tontine: "Tontine",
      dettes: "Debts",
      aides: "Aids",
      gestionAcces: "Management of administrative access and roles",
      ajouterAdmin: "Add an administrator",
      solidariteMembres: "Solidarity and member aid",
      objectif: "Goal",
      collecte: "Collected",
      contribuer: "Contribute",
    },
    login: {
      titreAdmin: "Administrator",
      titreMembre: "Member",
      descAdmin: "Administrators have the right to record inflows and outflows of money.",
      descMembre: "Members can view information on their accounts as well as general mutual information.",
      titreModalAdmin: "Admin Login",
      titreModalMembre: "Member Login",
      erreurAccesAdmin: "Access denied. Please use the Member section.",
      erreurAccesMembre: "Access denied. Please use the Administrator section.",
    },
    dashboard: {
      sessionActive: "Active session",
      aucuneSession: "No active session",
      demarrerSession: "Start a new session to begin",
      cloturerSession: "Close session",
      modifierSession: "Modify session",
      nouvelleSession: "New session",
      inscriptions: "Inscriptions",
      fondSocial: "Social Fund",
      epargnes: "Savings",
      emprunts: "Loans",
      aidesActives: "Active aids",
      empruntsActifs: "Active loans",
      voirTout: "View all",
      details: "Details",
      creerAide: "Create new aid",
      annuler: "Cancel",
      valider: "Validate",
      tauxInteret: "Interest rate (%)",
      anneeExercice: "Exercise year",
      montantInscription: "Inscription amount (XAF)",
      montantFondSocial: "Social fund amount (XAF)",
      dateSession: "First session date",
      creerExercice: "Create exercise",
      montantADonner: "Amount to give",
      description: "Description",
      beneficiaire: "Beneficiary",
      type: "Type",
      statut: "Status",
      actions: "Actions",
      rechercher: "Search",
      enregistrer: "Save",
      modifier: "Edit",
      supprimer: "Delete",
      cloturer: "Close",
      ouvrir: "Open",
      enCours: "In progress",
      termine: "Completed",
      active: "Active",
      inactive: "Inactive",
      montant: "Amount",
      date: "Date",
      justificatif: "Receipt",
    },
    membres: {
      titre: "Members",
      sousTitre: "registered members",
      nouveau: "New member",
      rechercher: "Search a member...",
      details: "View details",
      modifier: "Edit",
      activer: "Activate",
      desactiver: "Deactivate",
      epargne: "Saving",
      emprunt: "Loan",
      dette: "Debt",
      statut: "Status",
      actif: "Active",
      inactif: "Inactive",
      numeroMatricule: "Registration No.",
      telephone: "Phone",
      adresse: "Address",
      email: "Email",
    },
    exercices: {
      titre: "Exercise Management",
      creer: "Create exercise",
      cloturer: "Close",
      annee: "Year",
      taux: "Rate",
      statut: "Status",
    },
    sessions: {
      titre: "Sessions",
      creer: "New Session",
      cloturer: "Close",
      date: "Date",
      exercice: "Exercise",
    },
    epargnes: {
      titre: "Savings",
      depot: "Deposit",
      retrait: "Withdrawal",
      historique: "History",
      balance: "Balance",
    },
    emprunts: {
      titre: "Loans",
      demande: "Loan Request",
      remboursement: "Refund",
      restant: "Remaining",
      total: "Total",
    },
    superAdmin: {
      titre: "Super Administrator",
      sousTitre: "Main control panel",
      tableauDeBord: "Dashboard",
      gestionAdmins: "Administrator Management",
      gestionMembres: "Member Management",
      motsDePasse: "Passwords",
      totalMembres: "Total Members",
      membresActifs: "Active Members",
      membresEnRegle: "Members in good standing",
      membresNonEnRegle: "Members not in good standing",
      caisses: "Cash boxes",
      ajouterAdmin: "Add an administrator",
      nomAdmin: "Last name",
      prenomAdmin: "First name",
      emailAdmin: "Email",
      usernameAdmin: "Username",
      motDePasseAdmin: "Password",
      roleAdmin: "Administrative role",
      secretaireGenerale: "General Secretary",
      president: "President",
      tresorier: "Treasurer",
      desactiverAdmin: "Deactivate",
      supprimerAdmin: "Delete administrator",
      supprimerMembre: "Delete member",
      changerMotDePasse: "Change password",
      nouveauMotDePasse: "New password",
      confirmerSuppression: "Confirm deletion",
      confirmerDesactivation: "Confirm deactivation",
      confirmDeleteAdmin: "Are you sure you want to delete this administrator? This action is irreversible.",
      confirmDeleteMember: "Are you sure you want to permanently delete this member? This action is irreversible.",
      confirmDeactivateAdmin: "Are you sure you want to deactivate this administrator?",
      activerAdmin: "Activate",
      confirmerActivation: "Confirm activation",
      confirmActivateAdmin: "Are you sure you want to reactivate this administrator?",
      actif: "Active",
      inactif: "Inactive",
      voirProfil: "View profile",
      idUtilisateur: "Email / Username",
      confirmer: "Confirm",
      succes: "Operation successful",
      erreur: "An error occurred",
      aucunAdmin: "No administrators registered",
      selectionnerRole: "Select a role",
    },
  },
};
