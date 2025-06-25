import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import LoginForm from '../components/LoginForm';
import axios from 'axios';

jest.mock('axios');

describe('LoginForm', () => {
  it('should render email and password inputs', () => {
    render(<LoginForm />);
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/mot de passe/i)).toBeInTheDocument();
  });

  it('should call API on submit', async () => {
    const mockedResponse = { data: { access_token: 'token123', user: { email: 'test@test.com', role: 'user' } } };
    axios.post.mockResolvedValueOnce(mockedResponse);
    const onLoginSuccess = jest.fn();

    render(<LoginForm onLoginSuccess={onLoginSuccess} />);

    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'test@test.com' } });
    fireEvent.change(screen.getByLabelText(/mot de passe/i), { target: { value: 'password' } });
    fireEvent.click(screen.getByRole('button', { name: /se connecter/i }));

    await waitFor(() => expect(onLoginSuccess).toHaveBeenCalledWith('token123', mockedResponse.data.user));
  });
});
