import { useState, useEffect } from 'react';
import axios from 'axios';
import RegistrationForm from './components/RegistrationForm';
import UsersList from './components/UsersList';
import { API_ENDPOINTS } from '../../config/api';
import './Home.css';

const Home = () => {
  const [currentUser, setCurrentUser] = useState(null);
  const [token, setToken] = useState(null);
  const [showRegistration, setShowRegistration] = useState(false);
  const [loginData, setLoginData] = useState({
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Vérifier si l'utilisateur est déjà connecté au chargement
  useEffect(() => {
    const savedToken = localStorage.getItem('token');
    const savedUser = localStorage.getItem('user');
    
    if (savedToken && savedUser && savedUser !== 'null' && savedUser !== 'undefined') {
      try {
        const parsedUser = JSON.parse(savedUser);
        setToken(savedToken);
        setCurrentUser(parsedUser);
      } catch (error) {
        console.error('Erreur lors du parsing des données utilisateur:', error);
        // Nettoyer les données corrompues
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      }
    }
  }, []);

  const handleLogin = async (e) => {
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
      
      // Sauvegarder en localStorage
      localStorage.setItem('token', access_token);
      localStorage.setItem('user', JSON.stringify(user));
      
      setToken(access_token);
      setCurrentUser(user);
      setLoginData({ email: '', password: '' });
      
      console.log('Utilisateur connecté:', user);
      
    } catch (err) {
      console.error('Erreur de connexion:', err.response?.data || err.message);
      setError(err.response?.data?.detail || 'Erreur de connexion');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setToken(null);
    setCurrentUser(null);
    setError('');
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setLoginData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleRegistrationSuccess = () => {
    setShowRegistration(false);
    setError('');
  };

  const switchToLogin = () => {
    setShowRegistration(false);
    setError('');
  };

  const switchToRegistration = () => {
    setShowRegistration(true);
    setError('');
  };

  return (
    <div className="home">
      {/* Header avec informations utilisateur */}
      <header className="header">
        <h1>Gestion des Utilisateurs</h1>
        {currentUser && (
          <div className="user-info">
            <span>Connecté en tant que : {currentUser.email}</span>
            <button onClick={handleLogout} className="logout-btn">
              Se déconnecter
            </button>
          </div>
        )}
      </header>

      <main className="main-content">
        {!currentUser ? (
          // Affichage des formulaires de connexion/inscription
          <div className="auth-container">
            <div className="auth-forms">
              {!showRegistration ? (
                // Formulaire de connexion
                <div className="login-form">
                  <h2>Connexion</h2>
                  
                  {error && <div className="error-message">{error}</div>}

                  <form onSubmit={handleLogin}>
                    <div className="form-group">
                      <label htmlFor="login-email">Email</label>
                      <input
                        type="email"
                        id="login-email"
                        name="email"
                        value={loginData.email}
                        onChange={handleInputChange}
                        required
                      />
                    </div>

                    <div className="form-group">
                      <label htmlFor="login-password">Mot de passe</label>
                      <input
                        type="password"
                        id="login-password"
                        name="password"
                        value={loginData.password}
                        onChange={handleInputChange}
                        required
                      />
                    </div>

                    <button type="submit" disabled={loading} className="submit-btn">
                      {loading ? 'Connexion...' : 'Se connecter'}
                    </button>
                  </form>

                  <div className="form-divider">
                    <span>OU</span>
                  </div>

                  <div className="form-switch">
                    <p>
                      Pas encore de compte ?{' '}
                      <button type="button" onClick={switchToRegistration} className="link-btn">
                        S'inscrire
                      </button>
                    </p>
                  </div>

                  {/* Informations de connexion admin */}
                  <div className="admin-info">
                    <h3>Connexion Admin</h3>
                    <p>Email: loise.fenoll@ynov.com</p>
                    <p>Mot de passe: PvdrTAzTeR247sDnAZBr</p>
                  </div>
                </div>
              ) : (
                // Formulaire d'inscription
                <RegistrationForm
                  onRegistrationSuccess={handleRegistrationSuccess}
                  onSwitchToLogin={switchToLogin}
                />
              )}
            </div>
          </div>
        ) : (
          // Affichage de la liste des utilisateurs
          <UsersList currentUser={currentUser} token={token} />
        )}
      </main>
    </div>
  );
};

export default Home;
