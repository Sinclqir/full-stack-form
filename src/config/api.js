// src/config/api.js
function getApiUrl() {
  // Vite injecte import.meta.env, sinon fallback sur process.env (pour Jest)
  try {
    // Utilise une fonction dynamique pour éviter que Jest/Babel parse 'import.meta'
    // eslint-disable-next-line no-new-func
    const viteEnv = new Function('return typeof import !== "undefined" && import.meta && import.meta.env && import.meta.env.VITE_API_URL ? import.meta.env.VITE_API_URL : undefined;')();
    if (viteEnv) return viteEnv;
  } catch (e) {
    // ignore, fallback below
  }
  if (typeof process !== 'undefined' && process.env && process.env.VITE_API_URL) {
    return process.env.VITE_API_URL;
  }
  
  // URL par défaut pour la production (Vercel)
  if (typeof window !== 'undefined' && window.location.hostname !== 'localhost') {
    return 'https://full-stack-form-server.vercel.app';
  }
  
  return 'http://localhost:8000';
}

export const API_URL = getApiUrl();

export const API_ENDPOINTS = {
  REGISTER: `${API_URL}/register`,
  LOGIN: `${API_URL}/login`,
  USERS: `${API_URL}/users`,
  PUBLIC_USERS: `${API_URL}/public-users`,
};
