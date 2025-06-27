# Guide de Déploiement

Ce projet est configuré pour déployer :
- **Backend** : Sur Vercel (Python FastAPI)
- **Frontend** : Sur GitHub Pages (React)

## Configuration

### Backend (Vercel)
- **URL** : `https://full-stack-form-server.vercel.app`
- **Configuration** : `server/vercel.json`
- **CORS** : Configuré pour accepter les requêtes depuis GitHub Pages

### Frontend (GitHub Pages)
- **URL** : `https://sinclqir.github.io/full-stack-form`
- **Configuration** : `.github/workflows/deploy-frontend.yml`
- **API URL** : Configurée pour pointer vers le backend Vercel

## Déploiement

### Backend
Le backend se déploie automatiquement via GitHub Actions quand vous poussez sur `main`.

### Frontend
Le frontend se déploie automatiquement sur GitHub Pages via le workflow `.github/workflows/deploy-frontend.yml`.

## Variables d'environnement

### Backend (Vercel)
- `MYSQL_HOST`
- `MYSQL_DATABASE`
- `MYSQL_USER`
- `MYSQL_PASSWORD`
- `MYSQL_ROOT_PASSWORD`
- `PORT`
- `ADMIN_EMAIL`
- `ADMIN_PASSWORD`
- `JWT_SECRET_KEY`

### Frontend (GitHub Pages)
- `VITE_API_URL`: `https://full-stack-form-server.vercel.app`

## Secrets GitHub

Ajoutez ces secrets dans votre repository GitHub :
- `VERCEL_TOKEN`
- `VERCEL_ORG_ID`
- `VERCEL_PROJECT_ID`

## URLs

- **Frontend** : https://sinclqir.github.io/full-stack-form
- **Backend** : https://full-stack-form-server.vercel.app
- **API Endpoints** :
  - Login : `https://full-stack-form-server.vercel.app/login`
  - Register : `https://full-stack-form-server.vercel.app/register`
  - Users : `https://full-stack-form-server.vercel.app/users`
  - Public Users : `https://full-stack-form-server.vercel.app/public-users` 