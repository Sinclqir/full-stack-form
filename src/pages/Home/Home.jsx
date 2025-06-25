import { useState, useEffect } from 'react';
import { Leaf, User, LogOut } from 'lucide-react';
import LoginForm from './components/LoginForm';
import RegistrationForm from './components/RegistrationForm';
import UsersList from './components/UsersList';
import './Home.css';

const Home = () => {
  const [currentUser, setCurrentUser] = useState(null);
  const [token, setToken] = useState(null);
  const [showRegistration, setShowRegistration] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

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
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      }
    }
  }, []);

  const handleLoginSuccess = (accessToken, user) => {
    setToken(accessToken);
    setCurrentUser(user);
    setError('');
    setSuccess('');
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setToken(null);
    setCurrentUser(null);
    setError('');
    setSuccess('');
  };

  const handleRegistrationSuccess = () => {
    setShowRegistration(false);
    setError('');
    setSuccess('Inscription réussie ! Vous pouvez maintenant vous connecter.');
    setTimeout(() => setSuccess(''), 3000);
  };

  const switchToLogin = () => {
    setShowRegistration(false);
    setError('');
    setSuccess('');
  };

  const switchToRegistration = () => {
    setShowRegistration(true);
    setError('');
    setSuccess('');
  };

  return (
    <div className="home">
      <header className="header">
        <div className="header-content">
          <div className="logo">
            <h1>
              Green<span className="green-text">City</span>
            </h1>
            <Leaf className="logo-icon" />
          </div>

          {currentUser && (
            <div className="user-info">
              <div className="user-details">
                <User className="user-icon" />
                <span className="user-email">{currentUser.email}</span>
                <span className={`role-badge ${currentUser.role}`}>
                  {currentUser.role === 'admin' ? 'Admin' : 'Utilisateur'}
                </span>
              </div>
              <button onClick={handleLogout} className="logout-btn">
                <LogOut className="logout-icon" />
                Déconnexion
              </button>
            </div>
          )}
        </div>
      </header>

      <main className="main-content">
        {!currentUser ? (
          <div className="auth-container">
            <div className="auth-card">
              <div className="auth-header">
                <h2 className="auth-title">{showRegistration ? 'Inscription' : 'Connexion'}</h2>
                <p className="auth-description">
                  {showRegistration ? 'Créez votre compte pour commencer' : 'Connectez-vous à votre compte'}
                </p>
              </div>

              <div className="auth-content">
                {error && <div className="alert error">{error}</div>}
                {success && <div className="alert success">{success}</div>}

                {!showRegistration ? (
                  <LoginForm onLoginSuccess={handleLoginSuccess} />
                ) : (
                  <RegistrationForm 
                    onRegistrationSuccess={handleRegistrationSuccess} 
                    onSwitchToLogin={switchToLogin} 
                  />
                )}
              </div>

              <div className="auth-footer">
                <hr className="separator" />
                <p className="switch-text">
                  {!showRegistration ? (
                    <>
                      Pas encore de compte ?{' '}
                      <button type="button" onClick={switchToRegistration} className="switch-btn">
                        S'inscrire
                      </button>
                    </>
                  ) : (
                    <>
                      Déjà inscrit ?{' '}
                      <button type="button" onClick={switchToLogin} className="switch-btn">
                        Se connecter
                      </button>
                    </>
                  )}
                </p>

                {!showRegistration && (
                  <div className="admin-demo-card">
                    <h4 className="admin-demo-title">Compte de test Admin</h4>
                    <p className="admin-demo-text">Email: loise.fenoll@ynov.com</p>
                    <p className="admin-demo-text">Mot de passe: PvdrTAzTeR247sDnAZBr</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        ) : (
          <UsersList currentUser={currentUser} token={token} />
        )}
      </main>
    </div>
  );
};

export default Home;
