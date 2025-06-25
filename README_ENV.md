# Configuration des Variables d'Environnement

## Problème résolu

L'application utilisait des URLs en dur (`http://localhost:8000`) pour les appels API, ce qui causait des erreurs CORS lors du déploiement sur GitHub Pages.

## Solution

### 1. Variables d'environnement supportées

L'application supporte deux noms de variables d'environnement pour la compatibilité :

- `VITE_API_URL` (recommandé)
- `VITE_REACT_APP_API_URL` (pour la compatibilité avec Docker)

### 2. Configuration locale

Créez un fichier `.env` à la racine du projet :

```env
# Pour le développement local
VITE_API_URL=http://localhost:8000
```

### 3. Configuration pour GitHub Pages

Pour le déploiement sur GitHub Pages, vous devez :

1. **Déployer votre API backend** (par exemple sur Vercel, Railway, ou autre)
2. **Configurer la variable d'environnement** dans les paramètres de votre repository GitHub :

   - Allez dans Settings > Secrets and variables > Actions
   - Ajoutez une variable `VITE_API_URL` avec l'URL de votre API déployée
   - Exemple : `https://votre-api.vercel.app`

### 4. Configuration pour Vercel

Si vous déployez sur Vercel, ajoutez la variable d'environnement dans les paramètres du projet :

```env
VITE_API_URL=https://votre-api.vercel.app
```

### 5. Fichiers modifiés

Les fichiers suivants ont été modifiés pour utiliser la configuration centralisée :

- `src/config/api.js` (nouveau fichier de configuration)
- `src/pages/Home/Home.jsx`
- `src/pages/Home/components/RegistrationForm.jsx`
- `src/pages/Home/components/UsersList.jsx`

### 6. Utilisation

L'application utilise maintenant automatiquement la bonne URL selon l'environnement :

- **Développement local** : `http://localhost:8000`
- **Production** : URL configurée via `VITE_API_URL`

### 7. Vérification

Pour vérifier que la configuration fonctionne, vous pouvez ajouter ce code temporaire dans votre composant principal :

```javascript
console.log('API URL:', import.meta.env.VITE_API_URL);
console.log('API Base URL:', API_BASE_URL);
``` 