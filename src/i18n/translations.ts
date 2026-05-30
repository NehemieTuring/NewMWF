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
    erreurConnexion: string;
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
    tableauDeBord: string;
    modifier: string;
    confirmer: string;
    annuler: string;
    valider: string;
    enregistrer: string;
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
    featureAdmin1: string;
    featureAdmin2: string;
    featureAdmin3: string;
    featureMember1: string;
    featureMember2: string;
    featureMember3: string;
    tagline: string;
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
    chargement: string;
    solde: string;
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
    importerCsv: string;
    formatFichier: string;
    champsObligatoires: string;
    cliquezDeposez: string;
    chargementMembres: string;
    reussis: string;
    erreurs: string;
    aucunMembre: string;
    commencezInscription: string;
    premierMembre: string;
    nouveauMembre: string;
    inscrireEnseignant: string;
    infosPersonnelles: string;
    identifiantsSecurite: string;
    confirmation: string;
    remplirChamps: string;
    passwordsMismatch: string;
    passwordTooShort: string;
    nomLabel: string;
    prenomLabel: string;
    emailLabel: string;
    telLabel: string;
    adresseLabel: string;
    usernameLabel: string;
    passwordLabel: string;
    confirmPasswordLabel: string;
    suivant: string;
    retour: string;
    annuler: string;
    inscrireMembre: string;
    inscriptionEnCours: string;
    succesInscription: string;
    ajouteMutuelle: string;
    fraisRegles: string;
    inscrireAutre: string;
    voirListe: string;
  };
  exercices: {
    titre: string;
    creer: string;
    cloturer: string;
    annee: string;
    taux: string;
    statut: string;
    description: string;
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
    bienvenueMess: string;
    aucunAdmin: string;
    selectionnerRole: string;
  };
  operations: {
    titre: string;
    sousTitre: string;
    aucuneSession: string;
    sessionOuverte: string;
    sessionOuverteDesc: string;
    aucuneSessionDesc: string;
    collecteEpargne: string;
    remboursementDette: string;
    accorderPret: string;
    achatsMutuelle: string;
    collecteEpargneDesc: string;
    remboursementDetteDesc: string;
    accorderPretDesc: string;
    achatsMutuelleDesc: string;
    ouvrirModule: string;
    selectionMember: string;
    choisirMembre: string;
    montantOperation: string;
    queRemboursezVous: string;
    unPret: string;
    solidariteRenflouement: string;
    dettePretActuelle: string;
    detteSolidariteActuelle: string;
    nomArticle: string;
    justification: string;
    detailsOperation: string;
    annuler: string;
    confirmerOperation: string;
    traitement: string;
    historiqueTitre: string;
    aucuneOperation: string;
    date: string;
    membre: string;
    operation: string;
    montant: string;
    confirmMsgAchat: string;
    confirmMsgOp: string;
    confirmTitre: string;
    succesEpargne: string;
    succesRemboursement: string;
    succesSolidarite: string;
    succesPret: string;
    succesAchat: string;
    erreurSessionFermee: string;
    erreurMontantExcede: string;
  };
  tresorerie: {
    titre: string;
    sousTitre: string;
    etatCaisses: string;
    journalGlobal: string;
    bilansRapports: string;
    disponible: string;
    totalEpargnes: string;
    empruntsActifs: string;
    empruntsEnCours: string;
    generationRapports: string;
    generationDesc: string;
    exporterPDF: string;
    date: string;
    type: string;
    description: string;
    montant: string;
    depot: string;
    revenu: string;
    depense: string;
    confirmerDepense: string;
    confirmDepenseMsg: string;
    succesDepense: string;
    rapportTitre: string;
    situationGlobale: string;
    chargement: string;
  };
  aides: {
    titre: string;
    sousTitre: string;
    aidesEnCours: string;
    typesAide: string;
    ouvrirAide: string;
    nouveauType: string;
    beneficiaire: string;
    session: string;
    typeAide: string;
    montantCible: string;
    collecte: string;
    statut: string;
    aucuneAide: string;
    decaisser: string;
    accepter: string;
    rejeter: string;
    libelleAide: string;
    montantForfaitaire: string;
    caisseConcernee: string;
    aucunType: string;
    nouvelleAide: string;
    membreBeneficiaire: string;
    natureAide: string;
    montantAide: string;
    modifierType: string;
    enAttente: string;
    rejete: string;
    pret: string;
    decaissé: string;
    succesCreation: string;
    succesTypeCreation: string;
    confirmDecaissement: string;
    confirmDecaissementMsg: string;
    succesDecaissement: string;
    confirmAcceptation: string;
    confirmAcceptationMsg: string;
    succesAcceptation: string;
    confirmRejet: string;
    confirmRejetMsg: string;
    succesRejet: string;
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
      erreurConnexion: "Impossible de se connecter au serveur. Veuillez vérifier votre connexion internet.",
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
      tableauDeBord: "Tableau de Bord",
      modifier: "Modifier",
      confirmer: "Confirmer",
      annuler: "Annuler",
      valider: "Valider",
      enregistrer: "Enregistrer",
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
      descAdmin: "Réservé au Super Administrateur pour la gestion globale de la mutuelle.",
      descMembre: "Pour tous les membres (Membres, Bureau, Comité) : consultez vos comptes et gérez vos activités.",
      titreModalAdmin: "Connexion Super Administrateur",
      titreModalMembre: "Connexion Membre",
      erreurAccesAdmin: "Accès réservé au Super Administrateur. Veuillez utiliser la section Membre.",
      erreurAccesMembre: "Le Super Administrateur doit utiliser la section Administrateur.",
      featureAdmin1: "Gestion globale",
      featureAdmin2: "Configuration système",
      featureAdmin3: "Supervision complète",
      featureMember1: "Épargne & Emprunts",
      featureMember2: "Messagerie",
      featureMember3: "Suivi des activités",
      tagline: "Épargne · Solidarité · Croissance",
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
      chargement: "Chargement",
      solde: "Solde",
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
      importerCsv: "Importer des membres via CSV",
      formatFichier: "Format du fichier CSV",
      champsObligatoires: "Champs obligatoires :",
      cliquezDeposez: "Cliquez ou déposez votre fichier CSV",
      chargementMembres: "Chargement des membres...",
      reussis: "Réussis",
      erreurs: "Erreurs",
      aucunMembre: "Aucun membre inscrit",
      commencezInscription: "Commencez par inscrire un nouveau membre à la mutuelle.",
      premierMembre: "Inscrire le premier membre",
      nouveauMembre: "Nouveau Membre",
      inscrireEnseignant: "Inscrivez un nouvel enseignant à la mutuelle",
      infosPersonnelles: "Informations Personnelles",
      identifiantsSecurite: "Identifiants & Sécurité",
      confirmation: "Confirmation",
      remplirChamps: "Veuillez remplir tous les champs obligatoires.",
      passwordsMismatch: "Les mots de passe ne correspondent pas.",
      passwordTooShort: "Le mot de passe doit contenir au moins 4 caractères.",
      nomLabel: "Nom",
      prenomLabel: "Prénom",
      emailLabel: "Email",
      telLabel: "Téléphone",
      adresseLabel: "Adresse",
      usernameLabel: "Nom d'utilisateur",
      passwordLabel: "Mot de passe",
      confirmPasswordLabel: "Confirmer le mot de passe",
      suivant: "Suivant",
      retour: "Retour",
      annuler: "Annuler",
      inscrireMembre: "Inscrire le membre",
      inscriptionEnCours: "Inscription en cours...",
      succesInscription: "Membre inscrit avec succès !",
      ajouteMutuelle: "a été ajouté à la mutuelle.",
      fraisRegles: "Frais d'inscription réglés avec succès",
      inscrireAutre: "Inscrire un autre membre",
      voirListe: "Voir la liste des membres",
    },
    exercices: {
      titre: "Gestion des Exercices",
      creer: "Créer un exercice",
      cloturer: "Clôturer",
      annee: "Année",
      taux: "Taux",
      statut: "Statut",
      description: "Description",
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
      confirmDeleteAdmin: "Êtes-vous sûr de vouloir supprimer cet administrateur ? Son profil sera archivé mais ses données seront conservées.",
      confirmDeleteMember: "Êtes-vous sûr de vouloir supprimer ce membre ? Il sera désactivé et archivé, mais ses données historiques seront conservées.",
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
      bienvenueMess: "Opération réussie !",
    },
    operations: {
      titre: "Opérations Financières",
      sousTitre: "Interface opérationnelle pour la gestion des flux financiers quotidiens.",
      aucuneSession: "Aucune session active",
      sessionOuverte: "Session Active : ",
      sessionOuverteDesc: "La session est ouverte. Vous pouvez enregistrer les opérations financières courantes.",
      aucuneSessionDesc: "Vous devez ouvrir une session dans le module de gestion pour enregistrer des collectes d'épargne, des remboursements ou accorder des prêts.",
      collecteEpargne: "Collecter Épargne",
      remboursementDette: "Remboursement de Dette",
      accorderPret: "Accorder un Prêt",
      achatsMutuelle: "Achats Mutuelle",
      collecteEpargneDesc: "Enregistrer un versement d'épargne d'un membre.",
      remboursementDetteDesc: "Payer un prêt en cours ou une cotisation de solidarité (renflouement).",
      accorderPretDesc: "Valider et décaisser un nouvel emprunt pour un membre.",
      achatsMutuelleDesc: "Enregistrer un achat lié à la mutuelle (déduit du fonds social).",
      ouvrirModule: "OUVRIR LE MODULE",
      selectionMember: "Sélectionner le membre",
      choisirMembre: "-- Choisir un membre --",
      montantOperation: "Montant de l'opération (XAF)",
      queRemboursezVous: "Que remboursez-vous ?",
      unPret: "Un Prêt (Emprunt)",
      solidariteRenflouement: "Solidarité / Renflouement",
      dettePretActuelle: "Dette de prêt actuelle : ",
      detteSolidariteActuelle: "Dette Solidarité/Renflouement : ",
      nomArticle: "Nom de l'article acheté",
      justification: "Justification",
      detailsOperation: "Détails de l'opération...",
      annuler: "Annuler",
      confirmerOperation: "Confirmer l'opération",
      traitement: "Traitement...",
      historiqueTitre: "Dernières opérations enregistrées",
      aucuneOperation: "Aucune opération récente trouvée.",
      date: "Date",
      membre: "Membre",
      operation: "Opération",
      montant: "Montant",
      confirmMsgAchat: "Voulez-vous enregistrer cet achat de {amount} XAF ? Le montant sera déduit du Fonds Social.",
      confirmMsgOp: "Voulez-vous enregistrer cette opération de {amount} XAF pour {member} ? (Session: {session})",
      confirmTitre: "Confirmer ",
      succesEpargne: "Épargne enregistrée avec succès",
      succesRemboursement: "Remboursement de prêt enregistré",
      succesSolidarite: "Paiement Solidarité/Renflouement enregistré",
      succesPret: "Prêt accordé et décaissé avec succès",
      succesAchat: "Achat enregistré et déduit du fonds social",
      erreurSessionFermee: "Opération impossible : Aucune session de collecte n'est actuellement ouverte.",
      erreurMontantExcede: "Opération refusée : Le montant ({amount} XAF) excède la {limitLabel} ({limit} XAF).",
    },
    tresorerie: {
      titre: "Comptabilité & Trésorerie",
      sousTitre: "Interface analytique et gestion globale des flux financiers.",
      etatCaisses: "État des Caisses",
      journalGlobal: "Journal Global",
      bilansRapports: "Bilans & Rapports",
      disponible: "Disponible immédiatement",
      totalEpargnes: "Total Épargnes",
      empruntsActifs: "Emprunts Actifs",
      empruntsEnCours: "Emprunts en cours",
      generationRapports: "Génération de Rapports",
      generationDesc: "Les bilans de fin d'exercice et de session sont générés automatiquement ici.",
      exporterPDF: "Exporter en PDF",
      date: "Date",
      type: "Type",
      description: "Description",
      montant: "Montant",
      depot: "DÉPÔT",
      revenu: "REVENU",
      depense: "DÉPENSE",
      confirmerDepense: "Confirmer la dépense",
      confirmDepenseMsg: "Voulez-vous enregistrer une dépense de {amount} XAF pour : {reason} ?",
      succesDepense: "Dépense enregistrée !",
      rapportTitre: "Bilan de Trésorerie - Mutuelle Néhémie",
      situationGlobale: "Rapport de Situation Globale",
      chargement: "Chargement des données de trésorerie...",
    },
    aides: {
      titre: "Solidarité & Aides",
      sousTitre: "Gérez les assistances financières et la solidarité entre membres.",
      aidesEnCours: "Aides en cours/accordées",
      typesAide: "Types d'aide",
      ouvrirAide: "Ouvrir une Aide",
      nouveauType: "Nouveau Type d'Aide",
      beneficiaire: "Bénéficiaire",
      session: "Session",
      typeAide: "Type d'Aide",
      montantCible: "Montant Cible",
      collecte: "Collecté",
      statut: "Statut",
      aucuneAide: "Aucune aide accordée.",
      decaisser: "Décaisser",
      accepter: "Accepter",
      rejeter: "Rejeter",
      libelleAide: "Libellé de l'Aide",
      montantForfaitaire: "Montant Forfaitaire",
      caisseConcernee: "Caisse Concernée",
      aucunType: "Aucun type d'aide défini.",
      nouvelleAide: "Nouvelle Aide",
      membreBeneficiaire: "Membre Bénéficiaire",
      natureAide: "Nature de l'Aide",
      montantAide: "Montant de l'Aide (XAF)",
      modifierType: "Modifier le Type d'Aide",
      enAttente: "EN ATTENTE",
      rejete: "REJETÉ",
      pret: "PRÊT",
      decaissé: "DÉCAISSÉ",
      succesCreation: "Aide créée et entièrement financée par le Fonds Social.",
      succesTypeCreation: "Type d'aide configuré avec succès.",
      confirmDecaissement: "Confirmation de décaissement",
      confirmDecaissementMsg: "Voulez-vous décaisser cette aide ? Les dettes du membre seront prélevées automatiquement sur le montant reçu.",
      succesDecaissement: "Aide décaissée avec succès. Les dettes ont été régularisées.",
      confirmAcceptation: "Accepter la demande d'aide",
      confirmAcceptationMsg: "Voulez-vous approuver ce dossier ? Le financement sera prélevé sur le Fonds Social.",
      succesAcceptation: "Demande acceptée et financée !",
      confirmRejet: "Rejeter la demande",
      confirmRejetMsg: "Êtes-vous sûr de vouloir rejeter cette demande d'aide ?",
      succesRejet: "Dossier rejeté.",
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
      erreurConnexion: "Unable to connect to the server. Please check your internet connection.",
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
      tableauDeBord: "Dashboard",
      modifier: "Edit",
      confirmer: "Confirm",
      annuler: "Cancel",
      valider: "Validate",
      enregistrer: "Save",
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
      descAdmin: "Reserved for the Super Administrator for global management of the mutual.",
      descMembre: "For all members (Regular, Bureau, Committee): check your accounts and manage your activities.",
      titreModalAdmin: "Super Admin Login",
      titreModalMembre: "Member Login",
      erreurAccesAdmin: "Access reserved for Super Admin. Please use the Member section.",
      erreurAccesMembre: "Super Admin must use the Administrator section.",
      featureAdmin1: "Global management",
      featureAdmin2: "System configuration",
      featureAdmin3: "Full supervision",
      featureMember1: "Savings & Loans",
      featureMember2: "Messaging",
      featureMember3: "Activity tracking",
      tagline: "Savings · Solidarity · Growth",
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
      chargement: "Loading",
      solde: "Balance",
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
      importerCsv: "Import members via CSV",
      formatFichier: "CSV File Format",
      champsObligatoires: "Required fields:",
      cliquezDeposez: "Click or drop your CSV file",
      chargementMembres: "Loading members...",
      reussis: "Success",
      erreurs: "Errors",
      aucunMembre: "No registered members",
      commencezInscription: "Start by registering a new member to the mutual.",
      premierMembre: "Register the first member",
      nouveauMembre: "New Member",
      inscrireEnseignant: "Register a new teacher to the mutual",
      infosPersonnelles: "Personal Information",
      identifiantsSecurite: "Login & Security",
      confirmation: "Confirmation",
      remplirChamps: "Please fill in all required fields.",
      passwordsMismatch: "Passwords do not match.",
      passwordTooShort: "Password must be at least 4 characters long.",
      nomLabel: "Last Name",
      prenomLabel: "First Name",
      emailLabel: "Email",
      telLabel: "Phone",
      adresseLabel: "Address",
      usernameLabel: "Username",
      passwordLabel: "Password",
      confirmPasswordLabel: "Confirm Password",
      suivant: "Next",
      retour: "Back",
      annuler: "Cancel",
      inscrireMembre: "Register Member",
      inscriptionEnCours: "Registration in progress...",
      succesInscription: "Member registered successfully!",
      ajouteMutuelle: "has been added to the mutual.",
      fraisRegles: "Registration fees paid successfully",
      inscrireAutre: "Register another member",
      voirListe: "View member list",
    },
    exercices: {
      titre: "Exercise Management",
      creer: "Create exercise",
      cloturer: "Close",
      annee: "Year",
      taux: "Rate",
      statut: "Status",
      description: "Description",
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
      confirmDeleteAdmin: "Are you sure you want to delete this administrator? Their profile will be archived but their data will be preserved.",
      confirmDeleteMember: "Are you sure you want to delete this member? They will be deactivated and archived, but their historical data will be preserved.",
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
      bienvenueMess: "Operation successful!",
    },
    operations: {
      titre: "Financial Operations",
      sousTitre: "Operational interface for daily financial flow management.",
      aucuneSession: "No active session",
      sessionOuverte: "Active Session: ",
      sessionOuverteDesc: "The session is open. You can record current financial operations.",
      aucuneSessionDesc: "You must open a session in the management module to record savings collections, refunds or grant loans.",
      collecteEpargne: "Collect Savings",
      remboursementDette: "Debt Refund",
      accorderPret: "Grant a Loan",
      achatsMutuelle: "Mutual Purchases",
      collecteEpargneDesc: "Record a member's savings deposit.",
      remboursementDetteDesc: "Pay an outstanding loan or a solidarity contribution (refueling).",
      accorderPretDesc: "Validate and disburse a new loan for a member.",
      achatsMutuelleDesc: "Record a purchase related to the mutual (deducted from social fund).",
      ouvrirModule: "OPEN MODULE",
      selectionMember: "Select member",
      choisirMembre: "-- Choose a member --",
      montantOperation: "Operation amount (XAF)",
      queRemboursezVous: "What are you refunding?",
      unPret: "A Loan (Borrowing)",
      solidariteRenflouement: "Solidarity / Refueling",
      dettePretActuelle: "Current loan debt: ",
      detteSolidariteActuelle: "Solidarity/Refueling debt: ",
      nomArticle: "Purchased item name",
      justification: "Justification",
      detailsOperation: "Operation details...",
      annuler: "Cancel",
      confirmerOperation: "Confirm operation",
      traitement: "Processing...",
      historiqueTitre: "Latest recorded operations",
      aucuneOperation: "No recent operations found.",
      date: "Date",
      membre: "Member",
      operation: "Operation",
      montant: "Amount",
      confirmMsgAchat: "Do you want to record this purchase of {amount} XAF? The amount will be deducted from the Social Fund.",
      confirmMsgOp: "Do you want to record this operation of {amount} XAF for {member}? (Session: {session})",
      confirmTitre: "Confirm ",
      succesEpargne: "Savings recorded successfully",
      succesRemboursement: "Loan refund recorded",
      succesSolidarite: "Solidarity/Refueling payment recorded",
      succesPret: "Loan granted and disbursed successfully",
      succesAchat: "Purchase recorded and deducted from social fund",
      erreurSessionFermee: "Operation impossible: No collection session is currently open.",
      erreurMontantExcede: "Operation refused: The amount ({amount} XAF) exceeds the {limitLabel} ({limit} XAF).",
    },
    tresorerie: {
      titre: "Accounting & Treasury",
      sousTitre: "Analytical interface and global financial flow management.",
      etatCaisses: "Cashbox Status",
      journalGlobal: "Global Log",
      bilansRapports: "Reports & Balance",
      disponible: "Available immediately",
      totalEpargnes: "Total Savings",
      empruntsActifs: "Active Loans",
      empruntsEnCours: "Outstanding loans",
      generationRapports: "Report Generation",
      generationDesc: "Closing and session reports are automatically generated here.",
      exporterPDF: "Export to PDF",
      date: "Date",
      type: "Type",
      description: "Description",
      montant: "Amount",
      depot: "DEPOSIT",
      revenu: "REVENUE",
      depense: "EXPENSE",
      confirmerDepense: "Confirm expense",
      confirmDepenseMsg: "Do you want to record an expense of {amount} XAF for: {reason}?",
      succesDepense: "Expense recorded!",
      rapportTitre: "Treasury Report - Nehemie Mutual",
      situationGlobale: "Global Situation Report",
      chargement: "Loading treasury data...",
    },
    aides: {
      titre: "Solidarity & Financial Aid",
      sousTitre: "Manage financial assistance and member solidarity.",
      aidesEnCours: "Ongoing/granted aids",
      typesAide: "Aid Categories",
      ouvrirAide: "Open a New Aid",
      nouveauType: "New Aid Category",
      beneficiaire: "Beneficiary",
      session: "Session",
      typeAide: "Aid Category",
      montantCible: "Target Amount",
      collecte: "Collected",
      statut: "Status",
      aucuneAide: "No aids granted.",
      decaisser: "Disburse",
      accepter: "Accept",
      rejeter: "Reject",
      libelleAide: "Aid Label",
      montantForfaitaire: "Fixed Amount",
      caisseConcernee: "Related Cashbox",
      aucunType: "No aid category defined.",
      nouvelleAide: "New Aid File",
      membreBeneficiaire: "Beneficiary Member",
      natureAide: "Aid Nature",
      montantAide: "Aid Amount (XAF)",
      modifierType: "Modify Aid Category",
      enAttente: "PENDING",
      rejete: "REJECTED",
      pret: "READY",
      decaissé: "DISBURSED",
      succesCreation: "Aid created and fully funded by the Social Fund.",
      succesTypeCreation: "Aid category configured successfully.",
      confirmDecaissement: "Disbursement Confirmation",
      confirmDecaissementMsg: "Do you want to disburse this aid? Member debts will be automatically deducted from the received amount.",
      succesDecaissement: "Aid disbursed successfully. Debts have been settled.",
      confirmAcceptation: "Accept Aid Request",
      confirmAcceptationMsg: "Do you want to approve this file? Funding will be drawn from the Social Fund.",
      succesAcceptation: "Request accepted and funded!",
      confirmRejet: "Reject Request",
      confirmRejetMsg: "Are you sure you want to reject this aid request?",
      succesRejet: "File rejected.",
    },
  },
};
