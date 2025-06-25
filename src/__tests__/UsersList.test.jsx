import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import UsersList from '../components/UsersList';
import axios from 'axios';

jest.mock('axios');

describe('UsersList', () => {
  const adminUser = { id: 1, role: 'admin', email: 'admin@example.com' };
  const regularUser = { id: 2, role: 'user', email: 'user@example.com' };

  const mockUsers = [
    { id: 2, email: 'user1@example.com', birth_date: '1990-01-01', city: 'Paris', postal_code: '75001', created_at: '2023-01-01' },
    { id: 3, email: 'user2@example.com' },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('fetches and displays users list for admin', async () => {
    axios.get.mockResolvedValueOnce({ data: mockUsers });

    render(<UsersList currentUser={adminUser} token="fake-token" />);

    expect(screen.getByText(/chargement en cours/i)).toBeInTheDocument();

    await waitFor(() => {
      expect(axios.get).toHaveBeenCalledWith(expect.anything(), expect.objectContaining({
        headers: { Authorization: 'Bearer fake-token' }
      }));
    });

    mockUsers.forEach(user => {
      expect(screen.getByText(user.email)).toBeInTheDocument();
    });
  });

  it('fetches and displays users list for regular user', async () => {
    axios.get.mockResolvedValueOnce({ data: mockUsers });

    render(<UsersList currentUser={regularUser} />);

    await waitFor(() => {
      expect(axios.get).toHaveBeenCalledWith(expect.anything());
    });

    mockUsers.forEach(user => {
      expect(screen.getByText(user.email)).toBeInTheDocument();
    });
  });

  it('displays error message on fetch failure and retries', async () => {
    axios.get.mockRejectedValueOnce({ response: { data: { detail: 'Erreur fetch' } } });

    render(<UsersList currentUser={adminUser} token="token" />);

    await waitFor(() => {
      expect(screen.getByText(/erreur fetch/i)).toBeInTheDocument();
    });

    axios.get.mockResolvedValueOnce({ data: mockUsers });
    fireEvent.click(screen.getByRole('button', { name: /réessayer/i }));

    await waitFor(() => {
      mockUsers.forEach(user => expect(screen.getByText(user.email)).toBeInTheDocument());
    });
  });

  it('admin can delete a user', async () => {
    window.confirm = jest.fn(() => true); // simulate confirm OK
    axios.get.mockResolvedValueOnce({ data: mockUsers });
    axios.delete.mockResolvedValueOnce({});

    render(<UsersList currentUser={adminUser} token="token" />);

    await waitFor(() => {
      expect(screen.getByText('user1@example.com')).toBeInTheDocument();
    });

    const deleteButtons = screen.getAllByRole('button', { name: /supprimer l'utilisateur/i });
    fireEvent.click(deleteButtons[0]);

    await waitFor(() => {
      expect(axios.delete).toHaveBeenCalledWith(expect.stringContaining('/2'), expect.anything());
      expect(screen.queryByText('user1@example.com')).not.toBeInTheDocument();
    });
  });

  it('non-admin cannot delete user', async () => {
    axios.get.mockResolvedValueOnce({ data: mockUsers });

    render(<UsersList currentUser={regularUser} />);

    await waitFor(() => {
      expect(screen.queryByRole('button', { name: /supprimer l'utilisateur/i })).not.toBeInTheDocument();
    });
  });
});
