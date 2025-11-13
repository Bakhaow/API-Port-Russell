# Guide de Workflow Git pour les Milestones

## ✅ Milestone 1 : Terminé et mergé dans `main`

Le Milestone 1 a été mergé directement dans `main` car c'était le premier commit avec du contenu réel. Le dépôt GitHub est maintenant initialisé avec tout le code du Milestone 1.

## 🔄 Workflow pour les prochains Milestones

Pour les prochains milestones (2, 3, 4, etc.), suivez ce workflow :

### 1. Créer une branche pour le milestone

```bash
# Assurez-vous d'être sur main et à jour
git checkout main
git pull origin main

# Créer une nouvelle branche pour le milestone
git checkout -b milestone-2-modelisation
```

### 2. Développer sur la branche

```bash
# Faire vos modifications
# ... développer le code ...

# Ajouter les fichiers modifiés
git add .

# Créer un commit
git commit -m "feat: Milestone 2 - Modélisation et import des données

- Créer les schémas Mongoose
- Importer les données initiales
- ..."

# Pousser la branche
git push -u origin milestone-2-modelisation
```

### 3. Créer une Pull Request

1. Allez sur GitHub : [https://github.com/Bakhaow/API-Port-Russell](https://github.com/Bakhaow/API-Port-Russell)
2. Cliquez sur "Compare & pull request"
3. Remplissez la description de la PR
4. Assignez-vous ou demandez une revue si nécessaire
5. Mergez la PR dans `main`

### 4. Mettre à jour votre branche locale

```bash
# Retourner sur main
git checkout main

# Récupérer les changements
git pull origin main

# Supprimer l'ancienne branche (optionnel)
git branch -d milestone-2-modelisation
```

## 📋 Résumé du Milestone 1

- ✅ Branche créée : `milestone-1-initialisation`
- ✅ Code développé et commité
- ✅ Mergé dans `main` (merge commit créé)
- ✅ Tag créé : `v1.0.0-milestone-1`
- ✅ Poussé sur GitHub

## 🏷️ Tags Git

Pour marquer chaque milestone terminé, créez un tag :

```bash
# Créer un tag annoté
git tag -a v1.0.0-milestone-2 -m "Milestone 2: Modélisation et import des données"

# Pousser le tag
git push origin v1.0.0-milestone-2
```

## 📝 Messages de commit

Utilisez des messages de commit clairs et descriptifs :

```
feat: Milestone X - Description

- Tâche 1 complétée
- Tâche 2 complétée
- ...

Milestone X terminé ✅
```

## 🔍 Commandes Git utiles

```bash
# Voir l'historique des commits
git log --oneline --graph --all

# Voir les branches
git branch -a

# Voir l'état actuel
git status

# Voir les différences
git diff

# Voir les tags
git tag -l
```

## 🚀 Prochaines étapes

1. **Milestone 2** : Créer la branche `milestone-2-modelisation`
2. **Milestone 3** : Créer la branche `milestone-3-api-crud`
3. **Milestone 4** : Créer la branche `milestone-4-frontend`
4. **Milestone 5** : Créer la branche `milestone-5-documentation`
5. **Milestone 6** : Créer la branche `milestone-6-deploiement`

## 📚 Ressources

- [Documentation Git](https://git-scm.com/doc)
- [GitHub Flow](https://guides.github.com/introduction/flow/)
- [Conventional Commits](https://www.conventionalcommits.org/)
