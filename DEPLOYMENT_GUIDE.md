# Guide de Déploiement - Résolution des Erreurs CORS

## Problème initial

Votre application rencontrait des erreurs CORS lors du déploiement sur GitHub Pages car elle utilisait des URLs en dur (`http://localhost:8000`) pour les appels API.

## Solution implémentée

### 1. Configuration centralisée de l'API

✅ **Fichier créé** : `src/config/api.js`
- Centralise toutes les URLs d'API
- Utilise les variables d'environnement Vite
- Supporte la compatibilité avec Docker

### 2. Variables d'environnement

✅ **Variables supportées** :
- `VITE_API_URL` (recommandé)
- `VITE_REACT_APP_API_URL` (compatibilité Docker)

### 3. Fichiers modifiés

✅ **Tous les appels API ont été mis à jour** :
- `src/pages/Home/Home.jsx`
- `src/pages/Home/components/RegistrationForm.jsx`
- `src/pages/Home/components/UsersList.jsx`

## Étapes pour déployer sur GitHub Pages

### Étape 1 : Déployer votre API backend

1. **Déployez votre API FastAPI** sur une plateforme comme :
   - Vercel (recommandé)
   - Railway
   - Render
   - Heroku

2. **Notez l'URL de votre API déployée** (ex: `https://votre-api.vercel.app`)

### Étape 2 : Configurer GitHub Pages

1. **Allez dans votre repository GitHub**
2. **Settings > Pages**
3. **Source** : Sélectionnez "GitHub Actions"
4. **Créer un workflow GitHub Actions** :

```yaml
# .github/workflows/deploy.yml
name: Deploy to GitHub Pages

on:
  push:
    branches: [ main ]
  pull_request:
    branches: [ main ]

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    
    steps:
    - uses: actions/checkout@v3
    
    - name: Setup Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '18'
        cache: 'npm'
    
    - name: Install dependencies
      run: npm ci
    
    - name: Build
      run: npm run build
      env:
        VITE_API_URL: ${{ secrets.VITE_API_URL }}
    
    - name: Deploy to GitHub Pages
      uses: peaceiris/actions-gh-pages@v3
      with:
        github_token: ${{ secrets.GITHUB_TOKEN }}
        publish_dir: ./dist
```

### Étape 3 : Configurer les secrets GitHub

1. **Allez dans Settings > Secrets and variables > Actions**
2. **Ajoutez un nouveau secret** :
   - **Name** : `VITE_API_URL`
   - **Value** : `https://votre-api.vercel.app` (remplacez par votre URL)

### Étape 4 : Vérifier le déploiement

1. **Poussez vos modifications** sur GitHub
2. **Vérifiez les Actions** dans l'onglet Actions de votre repository
3. **Testez votre application** sur GitHub Pages

## Configuration pour différents environnements

### Développement local
```env
VITE_API_URL=http://localhost:8000
```

### Production (GitHub Pages)
```env
VITE_API_URL=https://votre-api.vercel.app
```

### Docker
```env
VITE_REACT_APP_API_URL=http://localhost:8000
```

## Vérification

Pour vérifier que la configuration fonctionne :

1. **Ouvrez la console du navigateur**
2. **Regardez les logs de debug** qui affichent :
   - `VITE_API_URL`
   - `API_BASE_URL (utilisé)`
   - `API_ENDPOINTS`

## Résolution des problèmes

### Erreur CORS persistante
- Vérifiez que votre API backend autorise les requêtes depuis `https://sinclqir.github.io`
- Ajoutez votre domaine dans la configuration CORS du serveur

### Variable d'environnement non reconnue
- Vérifiez que le nom de la variable commence par `VITE_`
- Redémarrez le serveur de développement après modification du `.env`

### API non accessible
- Vérifiez que votre API backend est bien déployée et accessible
- Testez l'URL de l'API directement dans le navigateur

## Fichiers importants

- `src/config/api.js` - Configuration centralisée
- `src/utils/debug.js` - Outil de débogage
- `.env` - Variables locales (à créer)
- `README_ENV.md` - Documentation détaillée 