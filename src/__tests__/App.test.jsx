process.env.VITE_API_URL = 'http://localhost:8000';
import { render, screen } from '@testing-library/react';
import App from '../app';

// Mock pour les modules CSS
jest.mock('*.css', () => ({}));

describe('App', () => {
  it('renders without crashing', () => {
    render(<App />);
    // Vérifie que l'App se rend correctement
    expect(document.querySelector('.App')).toBeInTheDocument();
  });

  it('renders Home component on root path', () => {
    render(<App />);
    // Vérifie que le composant Home est rendu (via la présence d'éléments caractéristiques)
    expect(document.querySelector('.home')).toBeInTheDocument();
  });
}); 