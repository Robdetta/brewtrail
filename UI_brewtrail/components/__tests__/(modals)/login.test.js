import { render, fireEvent, waitFor } from '@testing-library/react-native';
import Login from '@/app/(modals)/login';

jest.mock('@/context/auth', () => ({
  useAuth: () => ({
    signIn: jest.fn().mockResolvedValue(true), // Ensure it's resolving as expected
  }),
}));

jest.mock('expo-router', () => ({
  useRouter: () => ({
    push: jest.fn(),
    dismissAll: jest.fn(),
  }),
}));

describe('Login Screen', () => {
  it('displays an error message when no password is entered', async () => {
    const { getByPlaceholderText, getByTestId, getByText } = render(<Login />);
    const emailInput = getByPlaceholderText('email@address.com');
    fireEvent.changeText(emailInput, 'user@example.com');

    const loginButton = getByTestId('loginButton'); // Use getByTestId to find the button
    fireEvent.press(loginButton);

    await waitFor(() => {
      expect(
        getByText('Password must be at least 6 characters long.'),
      ).toBeTruthy();
    });
  });

  it('displays an error message on failed login attempt', async () => {
    const signInMock = jest.spyOn(
      require('@/context/auth').useAuth(),
      'signIn',
    );
    signInMock.mockResolvedValue({
      success: false,
      error: 'Invalid login credentials',
    }); // Mock the server response

    const { getByTestId, findByText } = render(<Login />);
    const emailInput = getByTestId('emailInput');
    const passwordInput = getByTestId('passwordInput');
    const loginButton = getByTestId('loginButton');

    fireEvent.changeText(emailInput, 'user@example.com');
    fireEvent.changeText(passwordInput, 'wrongpassword');
    fireEvent.press(loginButton);

    const errorMessage = await findByText('Invalid login credentials'); // Ensure this matches exactly
    expect(errorMessage).toBeTruthy();
  });
});
