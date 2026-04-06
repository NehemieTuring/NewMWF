# Documentation des Endpoints de l'API Backend

Cette documentation liste tous les points de terminaison disponibles dans le backend, catégorisés par rôle d'accès.

## 1. Authentification (Public)
Ces endpoints sont ouverts au public pour la connexion et l'inscription initiale.

| Méthode | Endpoint | Description |
|:---|:---|:---|
| `POST` | `/auth/login` | Authentifie un utilisateur et retourne un jeton JWT avec son rôle. |
| `POST` | `/auth/register` | Permet à un nouveau membre de s'enregistrer sur la plateforme (simplifié). |

---

## 2. Secrétaire Générale (`/admin`)
Accès complet à la gestion opérationnelle de la mutuelle.

### Gestion des Membres
| Méthode | Endpoint | Description |
|:---|:---|:---|
| `GET` | `/admin/members` | Liste tous les membres enregistrés dans la mutuelle. |
| `POST` | `/admin/members` | Enregistre un nouveau membre avec ses informations complètes. |
| `GET` | `/admin/members/{id}` | Récupère les informations détaillées d'un membre spécifique. |
| `PUT` | `/admin/members/{id}` | Met à jour les informations personnelles d'un membre. |
| `PUT` | `/admin/members/{id}/deactivate` | Désactive temporairement le compte d'un membre. |
| `GET` | `/admin/members/{id}/status` | Vérifie le statut actuel (Actif/Inactif) d'un membre. |
| `GET` | `/admin/members/{id}/debts` | Liste toutes les dettes (prêts, solidarité) d'un membre. |

### Solidarité
| Méthode | Endpoint | Description |
|:---|:---|:---|
| `POST` | `/admin/solidarity/payments` | Enregistre un versement de solidarité pour un membre. |
| `GET` | `/admin/solidarity/members/{id}/debt` | Calcule la dette de solidarité actuelle d'un membre. |
| `GET` | `/admin/solidarity/members/{id}/history` | Affiche l'historique des paiements de solidarité d'un membre. |

### Épargne & Emprunts
| Méthode | Endpoint | Description |
|:---|:---|:---|
| `POST` | `/admin/savings/deposit` | Effectue un dépôt d'épargne sur le compte d'un membre. |
| `POST` | `/admin/savings/withdrawal` | Effectue un retrait d'épargne pour un membre. |
| `GET` | `/admin/savings/members/{id}/balance` | Récupère le solde total de l'épargne d'un membre. |
| `POST` | `/admin/borrowings/request` | Crée une nouvelle demande de prêt pour un membre. |
| `GET` | `/admin/borrowings` | Liste tous les emprunts en cours dans la mutuelle. |
| `POST` | `/admin/borrowings/{id}/refund` | Enregistre un remboursement partiel ou total pour un prêt spécifique. |

### Aides & Aides de Secours
| Méthode | Endpoint | Description |
|:---|:---|:---|
| `GET` | `/admin/helps/types` | Liste les différents types d'aides disponibles. |
| `POST` | `/admin/helps` | Crée une nouvelle demande d'aide pour un bénéficiaire. |
| `GET` | `/admin/helps/active` | Liste toutes les aides en cours de collecte. |
| `POST` | `/admin/helps/{id}/contribute` | Enregistre la contribution d'un membre à une aide spécifique. |

### Sessions & Exercices
| Méthode | Endpoint | Description |
|:---|:---|:---|
| `GET` | `/admin/exercises` | Liste tous les exercices financiers (années) créés. |
| `POST` | `/admin/exercises` | Ouvre un nouvel exercice financier pour la mutuelle. |
| `POST` | `/admin/sessions` | Planifie une nouvelle session de réunion ou de collecte. |
| `PUT` | `/admin/sessions/{id}/close` | Clôture officiellement une session en cours. |

### Communication & Dashboard
| Méthode | Endpoint | Description |
|:---|:---|:---|
| `GET` | `/admin/dashboard/transactions` | Récupère les statistiques globales des transactions financières. |
| `GET` | `/admin/dashboard/cashboxes` | Affiche l'état actuel des différentes caisses de la mutuelle. |
| `GET` | `/admin/chat/conversations` | Liste toutes les discussions actives de l'administrateur. |
| `POST` | `/admin/chat/send` | Envoie un message instantané à un autre utilisateur. |
| `GET` | `/admin/profile` | Récupère les informations de profil de l'administrateur connecté. |

---

## 3. Membres (`/member`)
Accès personnel pour chaque enseignant.

| Méthode | Endpoint | Description |
|:---|:---|:---|
| `GET` | `/member/profile` | Récupère les informations personnelles du membre connecté. |
| `PUT` | `/member/profile` | Permet au membre de mettre à jour ses propres informations. |
| `GET` | `/member/status` | Affiche le statut actuel du membre vis-à-vis de la mutuelle. |
| `GET` | `/member/debts` | Permet au membre de consulter l'ensemble de ses dettes. |
| `GET` | `/member/savings/balance` | Affiche le solde actuel de l'épargne du membre. |
| `POST` | `/member/borrowings/request` | Permet au membre de soumettre une demande de prêt. |
| `POST` | `/member/chat/send` | Permet au membre d'envoyer un message au secrétariat ou aux collègues. |

---

## 4. Président (`/president`)
Accès en lecture seule pour le suivi et la supervision.

| Méthode | Endpoint | Description |
|:---|:---|:---|
| `GET` | `/president/members` | Consulte la liste complète de tous les membres. |
| `GET` | `/president/borrowings` | Supervise tous les emprunts records de la mutuelle. |
| `GET` | `/president/dashboard/transactions` | Accède aux bilans financiers globaux en temps réel. |
| `GET` | `/president/dashboard/cashboxes` | Vérifie l'état des liquidités dans les caisses. |
| `GET` | `/president/profile` | Consulte son propre profil présidentiel. |

---

## 5. Trésorier (`/treasurer`)
Focus sur la comptabilité et les rapports financiers.

| Méthode | Endpoint | Description |
|:---|:---|:---|
| `GET` | `/treasurer/penalties` | Liste toutes les pénalités infligées aux membres. |
| `GET` | `/treasurer/reports/daily` | Génère un rapport financier pour la journée en cours. |
| `POST` | `/treasurer/expenditure` | Enregistre une dépense de fonctionnement de la mutuelle. |
| `GET` | `/treasurer/dashboard/cashboxes` | Contrôle rigoureux des différents fonds en caisse. |

---

## 6. Super Administrateur (`/admin/super`)
Endpoints critiques de maintenance et gestion du système.

| Méthode | Endpoint | Description |
|:---|:---|:---|
| `POST` | `/admin/super/admins` | Crée un nouveau compte d'administrateur (SG, Président, Trésorier). |
| `GET` | `/admin/super/admins` | Liste tous les administrateurs du système. |
| `DELETE` | `/admin/super/admins/{id}` | Supprime définitivement un compte administrateur. |
| `PUT` | `/admin/super/users/password` | Force la réinitialisation du mot de passe d'un utilisateur par son email. |
| `DELETE` | `/admin/super/members/{id}` | Supprime définitivement un membre de la base de données. |
| `GET` | `/admin/super/dashboard` | Accès au tableau de bord complet avec statistiques avancées. |
