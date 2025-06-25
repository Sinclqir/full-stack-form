import { useState, useEffect } from 'react';
import axios from 'axios';
import { Users, Mail, Calendar, MapPin, Hash } from 'lucide-react';
import { API_ENDPOINTS } from '../../../config/api';
import './UsersList.css';

const UsersList = ({ currentUser, token }) => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [deletingUser, setDeletingUser] = useState(null);

  const isAdmin = currentUser?.role === 'admin';

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError('');

      console.log('Fetching users...');
      console.log('Current user:', currentUser);
      console.log('Token:', token);
      console.log('Is admin:', isAdmin);

      if (isAdmin) {
        // Admin : récupère tous les utilisateurs
        console.log('Récupération en tant qu\'admin...');
        const response = await axios.get(API_ENDPOINTS.USERS, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        console.log('Réponse utilisateurs (admin):', response.data);
        setUsers(response.data);
      } else {
        console.log('Récupération en tant qu\'utilisateur...');
        const response = await axios.get(API_ENDPOINTS.PUBLIC_USERS);
        console.log('Réponse utilisateurs (public):', response.data);
        setUsers(response.data);
      }
    } catch (err) {
      console.error('Erreur lors du fetch des utilisateurs:', err.response?.data || err.message);
      setError(err.response?.data?.detail || 'Erreur lors du chargement des utilisateurs');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteUser = async (userId) => {
    if (!isAdmin) return;

    if (!window.confirm('Êtes-vous sûr de vouloir supprimer cet utilisateur ?')) {
      return;
    }

    try {
      setDeletingUser(userId);
      await axios.delete(`${API_ENDPOINTS.USERS}/${userId}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      setUsers(users.filter(user => user.id !== userId));
    } catch (err) {
      alert(err.response?.data?.detail || 'Erreur lors de la suppression');
    } finally {
      setDeletingUser(null);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Non renseigné';
    return new Date(dateString).toLocaleDateString('fr-FR');
  };

  if (loading) {
    return (
      <div className="users-list">
        <div className="users-header">
          <div className="users-title-section">
            <Users className="users-icon" />
            <h2 className="users-title">Gestion des utilisateurs</h2>
          </div>
        </div>
        <div className="loading-container">
          <p className="loading-text">Chargement en cours...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="users-list">
        <div className="users-header">
          <div className="users-title-section">
            <Users className="users-icon" />
            <h2 className="users-title">Gestion des utilisateurs</h2>
          </div>
        </div>
        <div className="error-container">
          <div className="error-message">{error}</div>
          <button onClick={fetchUsers} className="retry-btn">
            Réessayer
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="users-list">
      <div className="users-header">
        <div className="users-title-section">
          <Users className="users-icon" />
          <h2 className="users-title">Gestion des utilisateurs</h2>
        </div>
        <div className="users-count-badge">
          {users.length} utilisateur{users.length > 1 ? 's' : ''}
        </div>
      </div>

      {users.length === 0 ? (
        <div className="no-users-card">
          <div className="no-users-content">
            <Users className="no-users-icon" />
            <p className="no-users-text">Aucun utilisateur trouvé.</p>
          </div>
        </div>
      ) : (
        <div className="users-grid">
          {users.map((user) => (
            <div key={user.id} className="user-card">
              <div className="user-card-header">
                <div className="user-header-content">
                  <h3 className="user-name">
                    {user.first_name} {user.last_name}
                  </h3>
                  <span className={`role-badge ${user.role}`}>
                    {user.role === 'admin' ? 'Admin' : 'Utilisateur'}
                  </span>
                </div>
              </div>

              <div className="user-card-content">
                <div className="user-details">
                  <div className="user-detail-item">
                    <Mail className="detail-icon" />
                    <span>{user.email}</span>
                  </div>

                  {isAdmin && (
                    <>
                      {user.birth_date && (
                        <div className="user-detail-item">
                          <Calendar className="detail-icon" />
                          <span>{formatDate(user.birth_date)}</span>
                        </div>
                      )}

                      {user.city && (
                        <div className="user-detail-item">
                          <MapPin className="detail-icon" />
                          <span>{user.city}</span>
                        </div>
                      )}

                      {user.postal_code && (
                        <div className="user-detail-item">
                          <Hash className="detail-icon" />
                          <span>{user.postal_code}</span>
                        </div>
                      )}

                      {user.created_at && (
                        <>
                          <div className="detail-separator"></div>
                          <p className="detail-date">Inscrit le {formatDate(user.created_at)}</p>
                        </>
                      )}
                    </>
                  )}
                </div>
              </div>

              {isAdmin && user.id !== currentUser?.id && (
                <div className="user-card-footer">
                  <button
                    onClick={() => handleDeleteUser(user.id)}
                    disabled={deletingUser === user.id}
                    className="delete-btn"
                  >
                    {deletingUser === user.id ? 'Suppression...' : 'Supprimer l\'utilisateur'}
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default UsersList; 