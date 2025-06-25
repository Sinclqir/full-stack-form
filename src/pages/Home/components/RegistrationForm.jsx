import { useState } from 'react';
import axios from 'axios';
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
    role: 'user'
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
      const response = await axios.post('http://localhost:8000/register', {
        last_name: formData.last_name,
        first_name: formData.first_name,
        email: formData.email,
        password: formData.password,
        birth_date: formData.birth_date,
        city: formData.city,
        postal_code: formData.postal_code,
        role: formData.role
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
        role: 'user'
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
      <h2>Inscription</h2>
      
      {error && <div className="error-message">{error}</div>}
      {success && <div className="success-message">{success}</div>}

      <form onSubmit={handleSubmit}>
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="last_name">Nom *</label>
            <input
              type="text"
              id="last_name"
              name="last_name"
              value={formData.last_name}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="first_name">Prénom *</label>
            <input
              type="text"
              id="first_name"
              name="first_name"
              value={formData.first_name}
              onChange={handleInputChange}
              required
            />
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="email">Email *</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="password">Mot de passe *</label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleInputChange}
            required
            minLength="6"
          />
        </div>

        <div className="form-group">
          <label htmlFor="birth_date">Date de naissance *</label>
          <input
            type="date"
            id="birth_date"
            name="birth_date"
            value={formData.birth_date}
            onChange={handleInputChange}
            required
          />
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="city">Ville *</label>
            <input
              type="text"
              id="city"
              name="city"
              value={formData.city}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="postal_code">Code postal *</label>
            <input
              type="text"
              id="postal_code"
              name="postal_code"
              value={formData.postal_code}
              onChange={handleInputChange}
              required
              pattern="[0-9]{5}"
              title="Code postal à 5 chiffres"
            />
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="role">Rôle</label>
          <select
            id="role"
            name="role"
            value={formData.role}
            onChange={handleInputChange}
          >
            <option value="user">Utilisateur</option>
            <option value="admin">Administrateur</option>
          </select>
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