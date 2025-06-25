# Guide de Dépannage CORS

## Problème actuel
```
Access to XMLHttpRequest at 'https://full-stack-form-server-hkwdzvvv0-sinclqirs-projects.vercel.app//register' 
from origin 'https://sinclqir.github.io' has been blocked by CORS policy: 
Response to preflight request doesn't pass access control check: 
Redirect is not allowed for a preflight request.
```

## Solutions appliquées

### 1. ✅ Correction du double slash
- **Problème** : URL avec double slash `//register`
- **Solution** : Ajout de la logique dans `src/config/api.js` pour supprimer le slash final

### 2. ✅ Configuration CORS améliorée
- **Ajout** : Headers CORS explicites
- **Ajout** : Route OPTIONS pour les requêtes preflight
- **Ajout** : Route de test CORS `/cors-test`
- **Ajout** : Cache preflight (24h)

### 3. ✅ Origines autorisées étendues
```python
allow_origins=[
    "http://localhost:3000",
    "http://localhost:5173", 
    "http://localhost:4173",
    "https://sinclqir.github.io",
    "https://*.github.io",  # Tous les sous-domaines GitHub Pages
    "https://full-stack-form-server.vercel.app",
    "https://*.vercel.app",  # Tous les sous-domaines Vercel
    "*"  # Temporaire pour debug
]
```

## Étapes de test

### 1. Redéployer le serveur
```bash
# Dans le dossier server/
vercel --prod
```

### 2. Tester la configuration CORS
1. Ouvrez `test-cors.html` dans votre navigateur
2. Vérifiez les résultats dans la console
3. Testez directement l'URL : `https://full-stack-form-server-hkwdzvvv0-sinclqirs-projects.vercel.app/cors-test`

### 3. Vérifier les headers de réponse
Dans la console du navigateur, vérifiez que les headers CORS sont présents :
```
Access-Control-Allow-Origin: https://sinclqir.github.io
Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS, HEAD
Access-Control-Allow-Headers: Accept, Accept-Language, Content-Language, Content-Type, Authorization, X-Requested-With, Origin, Access-Control-Request-Method, Access-Control-Request-Headers
```

## Problèmes courants et solutions

### Problème 1: "Redirect is not allowed for a preflight request"
**Cause** : Le serveur redirige les requêtes OPTIONS
**Solution** : Route OPTIONS explicite ajoutée

### Problème 2: "No 'Access-Control-Allow-Origin' header"
**Cause** : Origine non autorisée
**Solution** : Ajout de `"*"` temporairement pour debug

### Problème 3: Double slash dans l'URL
**Cause** : URL mal formée
**Solution** : Logique de nettoyage dans `src/config/api.js`

## Configuration Vercel

### Vercel.json
```json
{
    "version": 2,
    "builds": [
      {
        "src": "main.py",
        "use": "@vercel/python",
        "config": {
          "entrypoint": "main.app"
        }
      }
    ],
    "routes": [
      {
        "src": "/(.*)",
        "dest": "main.py"
      }
    ],
    "env": {
      "PYTHONPATH": "."
    }
}
```

### Variables d'environnement Vercel
Assurez-vous que toutes les variables d'environnement sont configurées dans Vercel :
- `MYSQL_HOST`
- `MYSQL_DATABASE`
- `MYSQL_USER`
- `MYSQL_PASSWORD`
- `JWT_SECRET_KEY`
- `ADMIN_EMAIL`
- `ADMIN_PASSWORD`

## Debug avancé

### 1. Vérifier les logs Vercel
```bash
vercel logs
```

### 2. Tester avec curl
```bash
# Test OPTIONS
curl -X OPTIONS \
  -H "Origin: https://sinclqir.github.io" \
  -H "Access-Control-Request-Method: POST" \
  -H "Access-Control-Request-Headers: Content-Type" \
  https://full-stack-form-server-hkwdzvvv0-sinclqirs-projects.vercel.app/register

# Test POST
curl -X POST \
  -H "Origin: https://sinclqir.github.io" \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"test123"}' \
  https://full-stack-form-server-hkwdzvvv0-sinclqirs-projects.vercel.app/register
```

### 3. Vérifier la configuration en production
```bash
# Vérifier les variables d'environnement
vercel env ls

# Redéployer avec les nouvelles variables
vercel --prod
```

## Prochaines étapes

1. **Redéployer le serveur** avec la nouvelle configuration CORS
2. **Tester avec le fichier HTML** de test
3. **Vérifier que l'application fonctionne** sur GitHub Pages
4. **Retirer `"*"`** de la configuration CORS une fois que tout fonctionne
5. **Nettoyer les fichiers de test** (`test-cors.html`)

## Fichiers modifiés
- `server/main.py` - Configuration CORS améliorée
- `src/config/api.js` - Correction du double slash
- `test-cors.html` - Fichier de test (à supprimer après)
- `CORS_TROUBLESHOOTING.md` - Ce guide 