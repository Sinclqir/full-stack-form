process.env.VITE_API_URL = 'http://localhost:8000';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import RegistrationForm from '../pages/Home/components/RegistrationForm';
import axios from 'axios';

jest.mock('axios');

describe('RegistrationForm', () => {
  const fillAndSubmitForm = async () => {
    fireEvent.change(screen.getByLabelText(/^nom/i), { target: { value: 'Doe' } });
    fireEvent.change(screen.getByLabelText(/^prénom/i), { target: { value: 'John' } });
    fireEvent.change(screen.getByLabelText(/^email/i), { target: { value: 'john.doe@example.com' } });
    fireEvent.change(screen.getByLabelText(/mot de passe/i), { target: { value: 'password123' } });
    fireEvent.change(screen.getByLabelText(/date de naissance/i), { target: { value: '1990-01-01' } });
    fireEvent.change(screen.getByLabelText(/^ville/i), { target: { value: 'Paris' } });
    fireEvent.change(screen.getByLabelText(/code postal/i), { target: { value: '75001' } });

    fireEvent.click(screen.getByRole('button', { name: /s'inscrire/i }));
  };

  it('renders all input fields', () => {
    render(<RegistrationForm />);
    expect(screen.getByLabelText(/^nom/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/^prénom/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/^email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/mot de passe/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/date de naissance/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/^ville/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/code postal/i)).toBeInTheDocument();
  });

  it('calls API and triggers onRegistrationSuccess on successful submit', async () => {
    axios.post.mockResolvedValueOnce({ data: {} });
    const onRegistrationSuccess = jest.fn();

    render(<RegistrationForm onRegistrationSuccess={onRegistrationSuccess} />);

    await fillAndSubmitForm();

    await waitFor(() => {
      expect(onRegistrationSuccess).toHaveBeenCalled();
      expect(screen.getByText(/inscription réussie/i)).toBeInTheDocument();
    });
  });

  it('shows error message on API failure', async () => {
    axios.post.mockRejectedValueOnce({ response: { data: { detail: 'Erreur spécifique' } } });

    render(<RegistrationForm />);

    await fillAndSubmitForm();

    await waitFor(() => {
      expect(screen.getByText(/erreur spécifique/i)).toBeInTheDocument();
    });
  });
});