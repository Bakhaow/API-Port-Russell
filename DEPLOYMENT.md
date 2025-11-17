# Guide de Déploiement - API Port Russell

Ce guide explique comment déployer l'API Port Russell sur différentes plateformes.

## 📋 Prérequis

- Compte GitHub avec le dépôt cloné
- Compte sur une plateforme de déploiement (Heroku, Railway, Render, etc.)
- MongoDB Atlas configuré (recommandé pour la production)

## 🚀 Déploiement sur Heroku

### 1. Installation de Heroku CLI

```bash
# Windows (avec Chocolatey)
choco install heroku-cli

# Ou télécharger depuis https://devcenter.heroku.com/articles/heroku-cli
```

### 2. Connexion à Heroku

```bash
heroku login
```

### 3. Créer une nouvelle application

```bash
heroku create api-port-russell
# Remplacez "api-port-russell" par le nom de votre choix
```

### 4. Configurer les variables d'environnement

```bash
heroku config:set MONGODB_URI="votre_uri_mongodb_atlas"
heroku config:set JWT_SECRET="votre_secret_jwt_aleatoire"
heroku config:set JWT_EXPIRE="7d"
heroku config:set NODE_ENV="production"
```

### 5. Déployer

```bash
git push heroku main
```

### 6. Vérifier le déploiement

```bash
heroku open
```

## 🚂 Déploiement sur Railway

### 1. Créer un compte Railway

Allez sur [Railway.app](https://railway.app) et créez un compte.

### 2. Créer un nouveau projet

1. Cliquez sur "New Project"
2. Sélectionnez "Deploy from GitHub repo"
3. Choisissez votre dépôt `API-Port-Russell`

### 3. Configurer les variables d'environnement

Dans les paramètres du projet, ajoutez :
- `MONGODB_URI` : Votre URI MongoDB Atlas
- `JWT_SECRET` : Votre secret JWT
- `JWT_EXPIRE` : `7d`
- `NODE_ENV` : `production`
- `PORT` : Railway définit automatiquement le port

### 4. Déployer

Railway déploie automatiquement à chaque push sur la branche main.

## 🎨 Déploiement sur Render

### 1. Créer un compte Render

Allez sur [Render.com](https://render.com) et créez un compte.

### 2. Créer un nouveau Web Service

1. Cliquez sur "New" > "Web Service"
2. Connectez votre dépôt GitHub
3. Sélectionnez le dépôt `API-Port-Russell`

### 3. Configuration

- **Name** : `api-port-russell`
- **Environment** : `Node`
- **Build Command** : `npm install`
- **Start Command** : `npm start`
- **Plan** : Free ou Paid selon vos besoins

### 4. Variables d'environnement

Ajoutez dans "Environment" :
- `MONGODB_URI`
- `JWT_SECRET`
- `JWT_EXPIRE` : `7d`
- `NODE_ENV` : `production`

### 5. Déployer

Cliquez sur "Create Web Service" pour déployer.

## 🔧 Configuration MongoDB Atlas pour la production

### 1. Créer un cluster MongoDB Atlas

1. Allez sur [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Créez un cluster gratuit (M0)
3. Configurez un utilisateur avec mot de passe
4. Ajoutez l'IP `0.0.0.0/0` dans "Network Access" pour autoriser toutes les IPs (ou spécifiez l'IP de votre plateforme)

### 2. Obtenir l'URI de connexion

1. Cliquez sur "Connect" > "Connect your application"
2. Copiez l'URI (format `mongodb+srv://...`)
3. Remplacez `<password>` par votre mot de passe
4. Remplacez `<database>` par `port-russell` ou le nom de votre choix

### 3. Encoder l'email dans l'URI

Si votre username est un email, encodez le `@` en `%40` :
```
mongodb+srv://user%40example.com:password@cluster0.xxxxx.mongodb.net/port-russell
```

## 📝 Variables d'environnement requises

| Variable | Description | Exemple |
|----------|-------------|---------|
| `MONGODB_URI` | URI de connexion MongoDB | `mongodb+srv://...` |
| `JWT_SECRET` | Secret pour signer les tokens JWT | `votre_secret_aleatoire` |
| `JWT_EXPIRE` | Durée de validité du token | `7d` |
| `NODE_ENV` | Environnement d'exécution | `production` |
| `PORT` | Port du serveur (optionnel, défini automatiquement) | `3000` |

## ✅ Vérification du déploiement

Une fois déployé, testez les endpoints :

1. **Page d'accueil** : `https://votre-app.herokuapp.com/`
2. **Documentation Swagger** : `https://votre-app.herokuapp.com/api-docs`
3. **API** : `https://votre-app.herokuapp.com/api/users/register`

## 🔒 Sécurité en production

- ✅ Utilisez un `JWT_SECRET` fort et aléatoire
- ✅ Ne commitez jamais le fichier `.env`
- ✅ Utilisez HTTPS (automatique sur Heroku/Railway/Render)
- ✅ Configurez correctement les IPs autorisées dans MongoDB Atlas
- ✅ Utilisez des variables d'environnement pour tous les secrets

## 🐛 Dépannage

### Erreur de connexion MongoDB

- Vérifiez que l'IP de votre plateforme est autorisée dans MongoDB Atlas
- Vérifiez que l'URI est correcte et que le mot de passe est encodé
- Vérifiez que le cluster MongoDB est actif

### Erreur de port

- La plupart des plateformes définissent automatiquement le port via `process.env.PORT`
- Vérifiez que votre code utilise `process.env.PORT || 3000`

### Erreur de build

- Vérifiez que toutes les dépendances sont dans `dependencies` et non `devDependencies`
- Vérifiez que le script `start` est défini dans `package.json`

## 📚 Ressources

- [Documentation Heroku](https://devcenter.heroku.com/)
- [Documentation Railway](https://docs.railway.app/)
- [Documentation Render](https://render.com/docs)
- [MongoDB Atlas Setup](./MONGODB_ATLAS_SETUP.md)

