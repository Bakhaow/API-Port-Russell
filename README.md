# API Port Russell

API REST pour la gestion d'un port de plaisance avec système de réservation de catways.

## 🚀 Installation

### Prérequis

- Node.js (v18 ou supérieur)
- MongoDB (local ou Atlas)

### Installation des dépendances

```bash
npm install
```

### Configuration

1. Créez un fichier `.env` à la racine du projet avec vos paramètres :

```bash
# Sur Windows PowerShell
New-Item -Path .env -ItemType File
```

2. Ajoutez vos paramètres dans le fichier `.env` :

**Pour MongoDB local :**

```env
PORT=3000
MONGODB_URI=mongodb://localhost:27017/port-russell
JWT_SECRET=your-secret-key-here
NODE_ENV=development
```

**Pour MongoDB Atlas :**

1. **Obtenez votre URI de connexion depuis MongoDB Atlas :**

   - Connectez-vous à [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
   - Cliquez sur votre cluster
   - Cliquez sur "Connect" > "Connect your application"
   - Copiez l'URI de connexion (format `mongodb+srv://...`)
   - Remplacez `<password>` par votre mot de passe
   - Remplacez `<database>` par le nom de votre base de données (ex: `api` ou `port-russell`)

2. **Configurez votre fichier `.env` :**

```env
PORT=3000
# Si votre username est un email, encodez @ en %40
# Exemple avec un cluster réel : cluster0.xxxxx.mongodb.net
MONGODB_URI=mongodb+srv://username%40example.com:password@cluster0.xxxxx.mongodb.net/port-russell
JWT_SECRET=your-secret-key-here
JWT_EXPIRE=7d
NODE_ENV=development
```

**Exemple d'URI MongoDB Atlas valide :**

```
mongodb+srv://user%40example.com:password@cluster0.abc123.mongodb.net/port-russell?retryWrites=true&w=majority
```

⚠️ **Important :**

- Les URI `mongodb+srv://` (MongoDB Atlas) ne peuvent **PAS** contenir de port. Le format correct est `mongodb+srv://user:pass@host/database` (sans `:27017` ou autre port).
- **Si votre username est une adresse email** (contient `@`), vous **DEVEZ** encoder le `@` en `%40` dans votre fichier `.env` :

  - ❌ **Incorrect** : `MONGODB_URI=mongodb+srv://user@gmail.com:password@host/database`
  - ✅ **Correct** : `MONGODB_URI=mongodb+srv://user%40gmail.com:password@host/database`

  **Exemple** : `safwanechahboune@gmail.com` devient `safwanechahboune%40gmail.com`

### Démarrage

```bash
# Mode développement
npm run dev

# Mode production
npm start
```

Le serveur sera accessible sur `http://localhost:3000`

### Import des données initiales

Après avoir configuré votre connexion MongoDB, vous pouvez importer les données initiales (catways et réservations) :

```bash
npm run import
```

Ce script va :
- Importer tous les catways depuis `neededs/api/catways.json`
- Importer toutes les réservations depuis `neededs/api/reservations.json`
- Mettre à jour automatiquement la disponibilité des catways selon les réservations

⚠️ **Note :** Le script supprime toutes les données existantes avant l'import. Si vous voulez conserver vos données, modifiez le script `scripts/importData.js`.

## 📁 Structure du projet

```
api/
├── config/          # Configuration (database, etc.)
├── controllers/     # Contrôleurs (logique métier)
├── middleware/      # Middlewares (auth, validation, etc.)
├── models/          # Modèles Mongoose (User, Catway, Reservation)
├── routes/          # Routes API
├── scripts/         # Scripts utilitaires (import de données, etc.)
├── index.js         # Point d'entrée de l'application
└── package.json     # Dépendances du projet
```

## 🎯 Milestones

### ✅ Milestone 1 : Initialisation du projet

- [x] Initialiser le projet Node.js avec Express
- [x] Configurer la connexion MongoDB
- [x] Ajouter les dépendances essentielles
- [x] Préparer la structure de base du projet

### ✅ Milestone 2 : Modélisation et import des données

- [x] Créer les schémas Mongoose pour utilisateurs, catways, réservations
- [x] Importer les données initiales des catways et réservations dans MongoDB

### ✅ Milestone 3 : API CRUD et authentification

- [x] Implémenter les routes CRUD pour catways, réservations, utilisateurs
- [x] Mettre en place l'authentification JWT
- [x] Ajouter les middlewares de protection des routes

### 🎨 Milestone 4 : Frontend simple

- [ ] Créer la page d'accueil avec connexion et documentation API
- [ ] Développer le tableau de bord avec affichage des données et formulaires CRUD
- [ ] Ajouter la déconnexion

### 📚 Milestone 5 : Documentation et versionnage

- [ ] Documenter l'API (ex : Swagger)
- [x] Initialiser le dépôt GitHub, ajouter README, .gitignore
- [x] Valider la structure et pousser le code

### 🚢 Milestone 6 : Déploiement final

- [ ] Préparer l'app pour le déploiement
- [ ] Déployer sur plateforme (Heroku / autre)
- [ ] Tester l'application en conditions réelles

## 📝 API Endpoints

### Auth & Utilisateurs
- `POST /api/users/register` : créer un compte (nom, email, mot de passe)
- `POST /api/users/login` : se connecter et recevoir un token JWT
- `GET /api/users/me` : récupérer son profil (header `Authorization: Bearer <token>`)
- `GET /api/users` : lister tous les utilisateurs (admin)
- `PUT /api/users/:id` : mettre à jour un utilisateur (admin)
- `DELETE /api/users/:id` : supprimer un utilisateur (admin)

### Catways
- `GET /api/catways` : lister les catways (filtres `?type=short|long&available=true|false`)
- `GET /api/catways/:catwayNumber` : consulter un catway précis
- `POST /api/catways` : créer un catway (admin)
- `PUT /api/catways/:catwayNumber` : mettre à jour un catway (admin)
- `DELETE /api/catways/:catwayNumber` : supprimer un catway (admin)

### Réservations
- `GET /api/reservations` : lister les réservations (toutes pour admin, personnelles sinon)
- `GET /api/reservations/:id` : consulter une réservation
- `POST /api/reservations` : créer une réservation (met à jour la dispo du catway)
- `PUT /api/reservations/:id` : modifier une réservation (dates, bateau, statut…)
- `DELETE /api/reservations/:id` : supprimer/canceler une réservation

## 🔐 Authentification

- Enregistrez un utilisateur via `POST /api/users/register` ou utilisez un compte existant.
- Connectez-vous avec `POST /api/users/login` pour recevoir un token JWT.
- Ajoutez le header `Authorization: Bearer <votre_token>` pour toutes les routes protégées.
- Les rôles disponibles sont `user` (par défaut) et `admin`. Seuls les admins peuvent gérer les utilisateurs et les catways.
- Le token expire selon la variable `JWT_EXPIRE` (par défaut `7d`). Assurez-vous que `JWT_SECRET` est défini dans votre `.env`.

## 📄 License

UNLICENSED - Course purpose only

## 👤 Auteur

Bakhaow
