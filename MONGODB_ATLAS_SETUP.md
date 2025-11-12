# Configuration MongoDB Atlas

## Problème : Erreur `querySrv ENOTFOUND`

Si vous voyez l'erreur `querySrv ENOTFOUND _mongodb._tcp.dev.mongodb.net`, cela signifie que le nom du cluster MongoDB n'est pas correct.

## Solution : Obtenir la bonne URI depuis MongoDB Atlas

### Étape 1 : Connectez-vous à MongoDB Atlas

1. Allez sur [https://www.mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)
2. Connectez-vous avec votre compte MongoDB

### Étape 2 : Créez ou sélectionnez un cluster

1. Si vous n'avez pas de cluster, créez-en un (gratuit) :

   - Cliquez sur "Build a Database"
   - Choisissez "M0 FREE" (gratuit)
   - Choisissez votre région
   - Cliquez sur "Create"

2. Si vous avez déjà un cluster, sélectionnez-le

### Étape 3 : Obtenez l'URI de connexion

1. Cliquez sur votre cluster
2. Cliquez sur le bouton **"Connect"**
3. Sélectionnez **"Connect your application"**
4. Copiez l'URI de connexion (format `mongodb+srv://...`)

**Exemple d'URI :**

```
mongodb+srv://username:password@cluster0.abc123.mongodb.net/?retryWrites=true&w=majority
```

### Étape 4 : Configurez votre fichier `.env`

1. Ouvrez votre fichier `.env`
2. Remplacez l'URI MongoDB par celle que vous avez copiée
3. Remplacez `<password>` par votre mot de passe MongoDB
4. Remplacez le nom de la base de données (après le `/`) par `api` ou `port-russell`
5. **Si votre username est un email**, encodez le `@` en `%40`

**Exemple de fichier `.env` :**

```env
PORT=3000
# URI MongoDB Atlas (remplacez par votre URI réelle)
MONGODB_URI=mongodb+srv://safwanechahboune%40gmail.com:VOTRE_MOT_DE_PASSE@cluster0.abc123.mongodb.net/api?retryWrites=true&w=majority
JWT_SECRET=your-secret-key-here
JWT_EXPIRE=7d
NODE_ENV=development
```

### Étape 5 : Créez un utilisateur MongoDB (si nécessaire)

1. Dans MongoDB Atlas, allez dans "Database Access"
2. Cliquez sur "Add New Database User"
3. Créez un utilisateur avec un nom d'utilisateur et un mot de passe
4. Donnez les droits "Atlas admin" ou "Read and write to any database"
5. Cliquez sur "Add User"

### Étape 6 : Configurez l'accès réseau (si nécessaire)

1. Dans MongoDB Atlas, allez dans "Network Access"
2. Cliquez sur "Add IP Address"
3. Cliquez sur "Allow Access from Anywhere" (pour le développement)
   - Ou ajoutez votre IP spécifique pour la production
4. Cliquez sur "Confirm"

### Étape 7 : Testez la connexion

1. Démarrez votre application :

   ```bash
   npm start
   ```

2. Vous devriez voir :
   ```
   ✅ MongoDB Connected: cluster0.abc123.mongodb.net
   Server is running on port 3000
   ```

## Format d'URI MongoDB Atlas

**Format général :**

```
mongodb+srv://<username>:<password>@<cluster-host>/<database>?<options>
```

**Exemples valides :**

- `mongodb+srv://user:pass@cluster0.abc123.mongodb.net/api`
- `mongodb+srv://user%40email.com:pass@cluster0.abc123.mongodb.net/port-russell?retryWrites=true&w=majority`

**Format du hostname :**

- ✅ Correct : `cluster0.abc123.mongodb.net`
- ✅ Correct : `cluster1.xyz789.mongodb.net`
- ❌ Incorrect : `dev.mongodb.net`
- ❌ Incorrect : `localhost`
- ❌ Incorrect : `mongodb.net`

## Encodage des caractères spéciaux

Si votre username ou password contient des caractères spéciaux, encodez-les :

| Caractère | Encodage |
| --------- | -------- |
| `@`       | `%40`    |
| `:`       | `%3A`    |
| `/`       | `%2F`    |
| `?`       | `%3F`    |
| `#`       | `%23`    |
| `[`       | `%5B`    |
| `]`       | `%5D`    |

**Exemple :**

- Username : `user@example.com` → `user%40example.com`
- Password : `pass:123` → `pass%3A123`

## Dépannage

### Erreur : `querySrv ENOTFOUND`

- Vérifiez que le nom du cluster est correct
- Vérifiez que le cluster est actif dans MongoDB Atlas
- Vérifiez votre connexion internet

### Erreur : `authentication failed`

- Vérifiez votre nom d'utilisateur et mot de passe
- Vérifiez que l'utilisateur existe dans MongoDB Atlas
- Vérifiez que l'utilisateur a les droits d'accès

### Erreur : `IP not whitelisted`

- Ajoutez votre IP dans "Network Access" dans MongoDB Atlas
- Ou utilisez "Allow Access from Anywhere" pour le développement

## Ressources

- [Documentation MongoDB Atlas](https://docs.atlas.mongodb.com/)
- [Guide de connexion MongoDB Atlas](https://docs.atlas.mongodb.com/getting-started/)
- [URI de connexion MongoDB](https://docs.mongodb.com/manual/reference/connection-string/)
