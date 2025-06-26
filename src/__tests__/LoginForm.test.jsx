process.env.VITE_API_URL = 'http://localhost:8000';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import LoginForm from '../pages/Home/components/LoginForm';
import axios from 'axios';

jest.mock('axios');

describe('LoginForm', () => {
  beforeEach(() => {
    axios.post.mockClear();
  });

  it('should render email and password inputs', () => {
    render(<LoginForm />);
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/mot de passe/i)).toBeInTheDocument();
  });

  it('calls API and triggers onLoginSuccess on successful submit', async () => {
    const mockResponse = {
      data: {
        access_token: 'token123',
        user: { email: 'test@test.com', role: 'user' }
      }
    };
    axios.post.mockResolvedValueOnce(mockResponse);
    const onLoginSuccess = jest.fn();

    render(<LoginForm onLoginSuccess={onLoginSuccess} />);

    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'test@test.com' } });
    fireEvent.change(screen.getByLabelText(/mot de passe/i), { target: { value: 'password123' } });
    fireEvent.click(screen.getByRole('button', { name: /se connecter/i }));

    await waitFor(() => {
      expect(onLoginSuccess).toHaveBeenCalledWith('token123', { email: 'test@test.com', role: 'user' });
    });
  });

  it('handles API response without user data', async () => {
    const mockResponse = {
      data: {
        access_token: 'token123'
        // Pas de user dans la réponse
      }
    };
    axios.post.mockResolvedValueOnce(mockResponse);
    const onLoginSuccess = jest.fn();

    render(<LoginForm onLoginSuccess={onLoginSuccess} />);

    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'test@test.com' } });
    fireEvent.change(screen.getByLabelText(/mot de passe/i), { target: { value: 'password123' } });
    fireEvent.click(screen.getByRole('button', { name: /se connecter/i }));

    await waitFor(() => {
      expect(onLoginSuccess).toHaveBeenCalledWith('token123', undefined);
    });
  });

  it('sets loading state during API call', async () => {
    axios.post.mockImplementation(() => new Promise(() => {})); // Never resolves
    const onLoginSuccess = jest.fn();

    render(<LoginForm onLoginSuccess={onLoginSuccess} />);

    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'test@test.com' } });
    fireEvent.change(screen.getByLabelText(/mot de passe/i), { target: { value: 'password123' } });
    fireEvent.click(screen.getByRole('button', { name: /se connecter/i }));

    // Button should show loading state
    expect(screen.getByRole('button', { name: /connexion/i })).toBeInTheDocument();
  });

  it('clears form data on successful login', async () => {
    const mockResponse = {
      data: {
        access_token: 'token123',
        user: { email: 'test@test.com', role: 'user' }
      }
    };
    axios.post.mockResolvedValueOnce(mockResponse);
    const onLoginSuccess = jest.fn();

    render(<LoginForm onLoginSuccess={onLoginSuccess} />);

    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByLabelText(/mot de passe/i);

    fireEvent.change(emailInput, { target: { value: 'test@test.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    fireEvent.click(screen.getByRole('button', { name: /se connecter/i }));

    await waitFor(() => {
      expect(emailInput.value).toBe('');
      expect(passwordInput.value).toBe('');
    });
  });
});
