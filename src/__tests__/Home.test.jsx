// Mock complet de localStorage pour Jest
const localStorageMock = (() => {
  let store = {};
  return {
    getItem: jest.fn((key) => store[key] || null),
    setItem: jest.fn((key, value) => { store[key] = value + ''; }),
    removeItem: jest.fn((key) => { delete store[key]; }),
    clear: jest.fn(() => { store = {}; }),
  };
})();
Object.defineProperty(window, 'localStorage', { value: localStorageMock });

process.env.VITE_API_URL = 'http://localhost:8000';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import Home from '../pages/Home/Home';
import axios from 'axios';

// Mock pour les modules CSS
jest.mock('*.css', () => ({}));

// Mock axios
jest.mock('axios');

describe('Home', () => {
  beforeEach(() => {
    axios.post.mockClear();
    axios.get.mockClear();
    // Mock axios.get pour éviter les erreurs dans les tests
    axios.get.mockResolvedValue({ data: [] });
  });

  it('renders login form when no user is logged in', () => {
    localStorage.getItem.mockReturnValue(null);
    render(<Home />);
    expect(screen.getByText('Connexion')).toBeInTheDocument();
    expect(screen.getByText('Connectez-vous à votre compte')).toBeInTheDocument();
  });

  it('loads user from localStorage on mount', () => {
    const mockUser = { email: 'test@test.com', role: 'user' };
    const mockToken = 'mock-token';
    localStorage.getItem
      .mockReturnValueOnce(mockToken)
      .mockReturnValueOnce(JSON.stringify(mockUser));
    render(<Home />);
    // Vérifier que l'utilisateur est connecté en cherchant le bouton de déconnexion
    expect(screen.getByRole('button', { name: /déconnexion/i })).toBeInTheDocument();
  });

  it('handles invalid user data in localStorage', () => {
    localStorage.getItem
      .mockReturnValueOnce('mock-token')
      .mockReturnValueOnce('invalid-json');
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    render(<Home />);
    expect(consoleSpy).toHaveBeenCalledWith(
      'Erreur lors du parsing des données utilisateur:',
      expect.any(Error)
    );
    expect(localStorage.removeItem).toHaveBeenCalledWith('token');
    expect(localStorage.removeItem).toHaveBeenCalledWith('user');
    consoleSpy.mockRestore();
  });

  it('switches to registration form', () => {
    localStorage.getItem.mockReturnValue(null);
    render(<Home />);
    fireEvent.click(screen.getByText("S'inscrire"));
    expect(screen.getByText('Inscription')).toBeInTheDocument();
    expect(screen.getByText('Créez votre compte pour commencer')).toBeInTheDocument();
  });

  it('switches back to login form', () => {
    localStorage.getItem.mockReturnValue(null);
    render(<Home />);
    // Switch to registration first
    fireEvent.click(screen.getByText("S'inscrire"));
    expect(screen.getByText('Inscription')).toBeInTheDocument();
    // Switch back to login using the first "Se connecter" button
    const loginButtons = screen.getAllByText('Se connecter');
    fireEvent.click(loginButtons[0]);
    expect(screen.getByText('Connexion')).toBeInTheDocument();
  });

  it('handles logout', () => {
    const mockUser = { email: 'test@test.com', role: 'user' };
    const mockToken = 'mock-token';
    localStorage.getItem
      .mockReturnValueOnce(mockToken)
      .mockReturnValueOnce(JSON.stringify(mockUser));
    render(<Home />);
    // User should be logged in (check for logout button)
    expect(screen.getByRole('button', { name: /déconnexion/i })).toBeInTheDocument();
    // Click logout
    fireEvent.click(screen.getByRole('button', { name: /déconnexion/i }));
    // User should be logged out
    expect(screen.getByText('Connexion')).toBeInTheDocument();
    expect(localStorage.removeItem).toHaveBeenCalledWith('token');
    expect(localStorage.removeItem).toHaveBeenCalledWith('user');
  });

  it('shows admin badge for admin user', () => {
    const mockUser = { email: 'admin@test.com', role: 'admin' };
    const mockToken = 'mock-token';
    localStorage.getItem
      .mockReturnValueOnce(mockToken)
      .mockReturnValueOnce(JSON.stringify(mockUser));
    render(<Home />);
    // Check for admin badge
    expect(screen.getByText('Admin')).toBeInTheDocument();
  });

  it('shows user badge for regular user', () => {
    const mockUser = { email: 'user@test.com', role: 'user' };
    const mockToken = 'mock-token';
    localStorage.getItem
      .mockReturnValueOnce(mockToken)
      .mockReturnValueOnce(JSON.stringify(mockUser));
    render(<Home />);
    // Check for user badge
    expect(screen.getByText('Utilisateur')).toBeInTheDocument();
  });

  it('shows admin demo card on login form', () => {
    localStorage.getItem.mockReturnValue(null);
    render(<Home />);
    expect(screen.getByText('Compte de test Admin')).toBeInTheDocument();
    expect(screen.getByText('Email: loise.fenoll@ynov.com')).toBeInTheDocument();
    expect(screen.getByText('Mot de passe: PvdrTAzTeR247sDnAZBr')).toBeInTheDocument();
  });

  it('does not show admin demo card on registration form', () => {
    localStorage.getItem.mockReturnValue(null);
    render(<Home />);
    // Switch to registration
    fireEvent.click(screen.getByText("S'inscrire"));
    expect(screen.queryByText('Compte de test Admin')).not.toBeInTheDocument();
  });

  it('handles null user data in localStorage', () => {
    localStorage.getItem
      .mockReturnValueOnce('mock-token')
      .mockReturnValueOnce('null');
    render(<Home />);
    expect(screen.getByText('Connexion')).toBeInTheDocument();
  });

  it('handles undefined user data in localStorage', () => {
    localStorage.getItem
      .mockReturnValueOnce('mock-token')
      .mockReturnValueOnce('undefined');
    render(<Home />);
    expect(screen.getByText('Connexion')).toBeInTheDocument();
  });

  it('shows success message after registration', () => {
    localStorage.getItem.mockReturnValue(null);
    render(<Home />);
    // Switch to registration
    fireEvent.click(screen.getByText("S'inscrire"));
    // Simulate registration success
    const registrationForm = screen.getByText('Inscription').closest('.auth-card');
    expect(registrationForm).toBeInTheDocument();
  });
}); 