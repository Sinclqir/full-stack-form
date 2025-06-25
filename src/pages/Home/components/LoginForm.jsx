import { useState } from 'react';
import axios from 'axios';
import { API_ENDPOINTS } from '../../../config/api';
import './LoginForm.css';

const LoginForm = ({ onLoginSuccess, onSwitchToRegistration }) => {
  const [loginData, setLoginData] = useState({
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setLoginData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      console.log('Tentative de connexion avec:', loginData.email);
      const response = await axios.post(API_ENDPOINTS.LOGIN, {
        email: loginData.email,
        password: loginData.password
      });

      console.log('Réponse de l\'API:', response.data);
      const { access_token, user } = response.data;
      
      console.log('Token extrait:', access_token);
      console.log('User extrait:', user);
      
      localStorage.setItem('token', access_token);
      localStorage.setItem('user', JSON.stringify(user));
      
      setLoginData({ email: '', password: '' });
      
      console.log('Utilisateur connecté:', user);
      
      if (onLoginSuccess) {
        onLoginSuccess(access_token, user);
      }
      
    } catch (err) {
      console.error('Erreur de connexion:', err.response?.data || err.message);
      setError(err.response?.data?.detail || 'Erreur de connexion');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-form">
      <form onSubmit={handleSubmit} className="login-content">
        <div className="form-group">
          <label htmlFor="login-email" className="form-label">
            Email
          </label>
          <input
            type="email"
            id="login-email"
            name="email"
            className="form-input"
            placeholder="votre@email.com"
            value={loginData.email}
            onChange={handleInputChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="login-password" className="form-label">
            Mot de passe
          </label>
          <input
            type="password"
            id="login-password"
            name="password"
            className="form-input"
            placeholder="••••••••"
            value={loginData.password}
            onChange={handleInputChange}
            required
          />
        </div>

        <button type="submit" disabled={loading} className="submit-btn">
          {loading ? 'Connexion...' : 'Se connecter'}
        </button>
      </form>
    </div>
  );
};

export default LoginForm; 