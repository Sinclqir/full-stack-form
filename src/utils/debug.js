// Utilitaire pour déboguer la configuration de l'API
import API_BASE_URL, { API_ENDPOINTS } from '../config/api';

export const debugApiConfig = () => {
  console.log('=== Configuration API Debug ===');
  console.log('VITE_API_URL:', import.meta.env.VITE_API_URL);
  console.log('VITE_REACT_APP_API_URL:', import.meta.env.VITE_REACT_APP_API_URL);
  console.log('API_BASE_URL (utilisé):', API_BASE_URL);
  console.log('API_ENDPOINTS:', API_ENDPOINTS);
  console.log('================================');
};

export default debugApiConfig; 