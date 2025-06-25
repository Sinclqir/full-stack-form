# Changelog - Résolution des Erreurs CORS

## Version 1.1.0 - Configuration API Dynamique

### 🎯 Problème résolu
- **Erreurs CORS** lors du déploiement sur GitHub Pages
- **URLs en dur** (`http://localhost:8000`) dans le code frontend
- **Impossibilité** d'utiliser des variables d'environnement

### ✅ Modifications apportées

#### Nouveaux fichiers créés
- `src/config/api.js` - Configuration centralisée de l'API
- `src/utils/debug.js` - Outil de débogage de la configuration
- `.github/workflows/deploy.yml` - Workflow GitHub Actions
- `README_ENV.md` - Documentation des variables d'environnement
- `DEPLOYMENT_GUIDE.md` - Guide de déploiement complet
- `CHANGELOG.md` - Ce fichier

#### Fichiers modifiés
- `src/pages/Home/Home.jsx` - Utilise `API_ENDPOINTS.LOGIN`
- `src/pages/Home/components/RegistrationForm.jsx` - Utilise `API_ENDPOINTS.REGISTER`
- `src/pages/Home/components/UsersList.jsx` - Utilise `API_ENDPOINTS.USERS` et `API_ENDPOINTS.PUBLIC_USERS`

#### Variables d'environnement supportées
- `VITE_API_URL` (recommandé)
- `VITE_REACT_APP_API_URL` (compatibilité Docker)

### 🔧 Configuration requise

#### Pour le développement local
Créez un fichier `.env` à la racine :
```env
VITE_API_URL=http://localhost:8000
```

#### Pour la production (GitHub Pages)
1. Déployez votre API backend (Vercel, Railway, etc.)
2. Ajoutez le secret `VITE_API_URL` dans GitHub Actions
3. Configurez le workflow de déploiement

### 🚀 Avantages
- ✅ **Pas d'erreurs CORS** en production
- ✅ **Configuration flexible** selon l'environnement
- ✅ **Compatibilité Docker** maintenue
- ✅ **Déploiement automatisé** avec GitHub Actions
- ✅ **Documentation complète** pour le déploiement

### 📋 Prochaines étapes
1. Déployer votre API backend
2. Configurer le secret `VITE_API_URL` dans GitHub
3. Pousser les modifications pour déclencher le déploiement
4. Tester l'application sur GitHub Pages

### 🔍 Vérification
Pour vérifier que tout fonctionne :
1. Ouvrez la console du navigateur
2. Regardez les logs de debug (si activés)
3. Testez les fonctionnalités de connexion/inscription 