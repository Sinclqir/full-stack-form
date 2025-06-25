// Configuration de l'API
// Supporte les deux noms de variables d'environnement pour la compatibilité
const rawApiUrl = import.meta.env.VITE_API_URL || 
                  import.meta.env.VITE_REACT_APP_API_URL || 
                  'http://localhost:8000';

// Supprime le slash final s'il y en a un (pour éviter les // dans les URLs)
const API_BASE_URL = rawApiUrl.endsWith('/') ? rawApiUrl.slice(0, -1) : rawApiUrl;

export const API_ENDPOINTS = {
  LOGIN: `${API_BASE_URL}/login`,
  REGISTER: `${API_BASE_URL}/register`,
  USERS: `${API_BASE_URL}/users`,
  PUBLIC_USERS: `${API_BASE_URL}/public-users`,
  USER_ME: `${API_BASE_URL}/users/me`,
  HEALTH: `${API_BASE_URL}/health`
};

export default API_BASE_URL;
