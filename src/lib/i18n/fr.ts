/** Toutes les chaînes affichées dans l'espace adhérent */
export const fr = {
  // ─── Auth ──────────────────────────────────────────────────────────────────
  auth: {
    login: "Connexion",
    loginTitle: "Bienvenue",
    loginSubtitle: "Connectez-vous à votre espace adhérent",
    logout: "Déconnexion",
    register: "Créer un compte",
    registerTitle: "Rejoindre le club",
    registerSubtitle: "Créez votre espace adhérent personnel",
    forgotPassword: "Mot de passe oublié ?",
    resetPassword: "Réinitialiser le mot de passe",
    email: "Adresse email",
    username: "Nom d'utilisateur",
    password: "Mot de passe",
    confirmPassword: "Confirmer le mot de passe",
    firstName: "Prénom",
    lastName: "Nom",
    loginOrUsername: "Email ou nom d'utilisateur",
    pendingApproval: "Votre compte est en attente de validation par un administrateur.",
    suspended: "Votre compte a été suspendu. Contactez un administrateur.",
    invalidCredentials: "Identifiants incorrects.",
    accountCreated: "Compte créé ! Vous pouvez vous connecter dès que votre compte est validé.",
    resetEmailSent: "Si un compte correspond à cet email, vous recevrez un lien de réinitialisation.",
    passwordReset: "Mot de passe réinitialisé avec succès.",
  },

  // ─── Navigation ────────────────────────────────────────────────────────────
  nav: {
    dashboard: "Tableau de bord",
    documents: "Mes documents",
    profile: "Mon profil",
    forum: "Forum",
    committee: "Comité de direction",
    committeeDocuments: "Documents comité",
    admin: "Administration",
  },

  // ─── Documents ─────────────────────────────────────────────────────────────
  documents: {
    title: "Mes documents",
    upload: "Déposer un document",
    uploadTitle: "Nouveau document",
    noDocuments: "Aucun document déposé",
    noDocumentsDesc: "Déposez vos documents administratifs pour compléter votre dossier.",
    status: {
      PENDING: "En attente",
      APPROVED: "Validé",
      REJECTED: "Refusé",
    },
    type: {
      PIECE_IDENTITE: "Pièce d'identité",
      CERTIFICAT_MEDICAL: "Certificat médical",
      FORMULAIRE_ADHESION: "Formulaire d'adhésion",
      JUSTIFICATIF_DOMICILE: "Justificatif de domicile",
      AUTRE: "Autre",
      COMITE_INTERNE: "Document interne comité",
    },
    visibility: {
      PRIVATE: "Privé",
      COMITE: "Comité uniquement",
      PUBLIC: "Tous les adhérents",
    },
    deleteConfirm: "Supprimer ce document ?",
    deleteSuccess: "Document supprimé.",
    uploadSuccess: "Document déposé avec succès.",
    uploadError: "Erreur lors du dépôt.",
  },

  // ─── Forum ─────────────────────────────────────────────────────────────────
  forum: {
    title: "Forum",
    newPost: "Nouveau sujet",
    noPostsInCategory: "Aucun sujet dans cette catégorie.",
    noPostsDesc: "Soyez le premier à lancer la discussion !",
    viewCount: "vues",
    commentCount: "réponse",
    commentCountPlural: "réponses",
    pinned: "Épinglé",
    locked: "Verrouillé",
    postSuccess: "Sujet créé avec succès.",
    commentSuccess: "Réponse publiée.",
    postDeleteSuccess: "Sujet supprimé.",
    rateLimitPost: "Veuillez patienter avant de poster un nouveau sujet.",
    rateLimitComment: "Veuillez patienter avant de publier une nouvelle réponse.",
  },

  // ─── Commun ────────────────────────────────────────────────────────────────
  common: {
    save: "Enregistrer",
    cancel: "Annuler",
    delete: "Supprimer",
    edit: "Modifier",
    close: "Fermer",
    confirm: "Confirmer",
    loading: "Chargement…",
    error: "Une erreur est survenue.",
    retry: "Réessayer",
    search: "Rechercher…",
    submit: "Envoyer",
    back: "Retour",
    seeMore: "Voir plus",
    required: "Champ requis",
    optional: "Facultatif",
    by: "par",
    on: "le",
    at: "à",
  },
} as const;

export type I18nKey = typeof fr;
