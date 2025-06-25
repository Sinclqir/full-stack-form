import { useState, useEffect } from 'react';
import axios from 'axios';
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
        const response = await axios.get('http://localhost:8000/users', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        console.log('Réponse utilisateurs (admin):', response.data);
        setUsers(response.data);
      } else {
        // Utilisateur normal : récupère la liste publique
        console.log('Récupération en tant qu\'utilisateur...');
        const response = await axios.get('http://localhost:8000/public-users');
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
      await axios.delete(`http://localhost:8000/users/${userId}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      // Mettre à jour la liste
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
        <h2>Liste des utilisateurs</h2>
        <div className="loading">Chargement en cours...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="users-list">
        <h2>Liste des utilisateurs</h2>
        <div className="error-message">{error}</div>
        <button onClick={fetchUsers} className="retry-btn">
          Réessayer
        </button>
      </div>
    );
  }

  return (
    <div className="users-list">
      <h2>Liste des utilisateurs</h2>
      
      {users.length === 0 ? (
        <div className="no-users">
          <p>Aucun utilisateur trouvé.</p>
        </div>
      ) : (
        <div className="users-grid">
          {users.map((user) => (
            <div key={user.id} className="user-card">
              {isAdmin ? (
                // Vue admin : toutes les informations
                <>
                  <div className="user-header">
                    <h3>{user.first_name} {user.last_name}</h3>
                    <span className={`role-badge ${user.role}`}>
                      {user.role === 'admin' ? 'Admin' : 'Utilisateur'}
                    </span>
                  </div>
                  
                  <div className="user-details">
                    <p><strong>Email:</strong> {user.email}</p>
                    <p><strong>Date de naissance:</strong> {formatDate(user.birth_date)}</p>
                    <p><strong>Ville:</strong> {user.city}</p>
                    <p><strong>Code postal:</strong> {user.postal_code}</p>
                    <p><strong>Inscrit le:</strong> {formatDate(user.created_at)}</p>
                  </div>

                  {user.id !== currentUser?.id && (
                    <button
                      onClick={() => handleDeleteUser(user.id)}
                      disabled={deletingUser === user.id}
                      className="delete-btn"
                    >
                      {deletingUser === user.id ? 'Suppression...' : 'Supprimer'}
                    </button>
                  )}
                </>
              ) : (
                // Vue utilisateur : informations limitées
                <>
                  <div className="user-header">
                    <h3>{user.first_name} {user.last_name}</h3>
                  </div>
                  <div className="user-details">
                    <p><strong>Email:</strong> {user.email}</p>
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      )}

      <div className="users-info">
        <p>
          {isAdmin 
            ? `Affichage de ${users.length} utilisateur(s) (vue administrateur)`
            : `Affichage de ${users.length} utilisateur(s) (vue publique)`
          }
        </p>
      </div>
    </div>
  );
};

export default UsersList; 