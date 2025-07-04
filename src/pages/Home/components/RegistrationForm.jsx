import { useState } from 'react';
import axios from 'axios';
import { API_ENDPOINTS } from '../../../config/api';
import './RegistrationForm.css';

const RegistrationForm = ({ onRegistrationSuccess, onSwitchToLogin }) => {
  const [formData, setFormData] = useState({
    last_name: '',
    first_name: '',
    email: '',
    password: '',
    birth_date: '',
    city: '',
    postal_code: '',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const response = await axios.post(API_ENDPOINTS.REGISTER, {
        last_name: formData.last_name,
        first_name: formData.first_name,
        email: formData.email,
        password: formData.password,
        birth_date: formData.birth_date,
        city: formData.city,
        postal_code: formData.postal_code,
        role: 'user'
      });

      setSuccess('Inscription réussie ! Vous pouvez maintenant vous connecter.');
      setFormData({
        last_name: '',
        first_name: '',
        email: '',
        password: '',
        birth_date: '',
        city: '',
        postal_code: '',
      });

      if (onRegistrationSuccess) {
        onRegistrationSuccess();
      }
    } catch (err) {
      setError(err.response?.data?.detail || 'Erreur lors de l\'inscription');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="registration-form">
      {error && <div className="alert error">{error}</div>}
      {success && <div className="alert success">{success}</div>}

      <form onSubmit={handleSubmit} className="registration-content">
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="last_name" className="form-label">
              Nom *
            </label>
            <input
              type="text"
              id="last_name"
              name="last_name"
              className="form-input"
              placeholder="Nom"
              value={formData.last_name}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="first_name" className="form-label">
              Prénom *
            </label>
            <input
              type="text"
              id="first_name"
              name="first_name"
              className="form-input"
              placeholder="Prénom"
              value={formData.first_name}
              onChange={handleInputChange}
              required
            />
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="email" className="form-label">
            Email *
          </label>
          <input
            type="email"
            id="email"
            name="email"
            className="form-input"
            placeholder="votre@email.com"
            value={formData.email}
            onChange={handleInputChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="password" className="form-label">
            Mot de passe *
          </label>
          <input
            type="password"
            id="password"
            name="password"
            className="form-input"
            placeholder="••••••••"
            value={formData.password}
            onChange={handleInputChange}
            required
            minLength="6"
          />
        </div>

        <div className="form-group">
          <label htmlFor="birth_date" className="form-label">
            Date de naissance *
          </label>
          <input
            type="date"
            id="birth_date"
            name="birth_date"
            className="form-input"
            value={formData.birth_date}
            onChange={handleInputChange}
            required
          />
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="city" className="form-label">
              Ville *
            </label>
            <input
              type="text"
              id="city"
              name="city"
              className="form-input"
              placeholder="Ville"
              value={formData.city}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="postal_code" className="form-label">
              Code postal *
            </label>
            <input
              type="text"
              id="postal_code"
              name="postal_code"
              className="form-input"
              placeholder="75001"
              value={formData.postal_code}
              onChange={handleInputChange}
              required
              pattern="[0-9]{5}"
              title="Code postal à 5 chiffres"
            />
          </div>
        </div>

        <button type="submit" disabled={loading} className="submit-btn">
          {loading ? 'Inscription en cours...' : 'S\'inscrire'}
        </button>
      </form>

      <div className="form-switch">
        <p>
          Déjà inscrit ?{' '}
          <button type="button" onClick={onSwitchToLogin} className="link-btn">
            Se connecter
          </button>
        </p>
      </div>
    </div>
  );
};

export default RegistrationForm; 