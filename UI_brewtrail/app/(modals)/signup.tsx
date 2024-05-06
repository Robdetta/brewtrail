import React, { useState } from 'react';
import { Dimensions, StyleSheet, View } from 'react-native';
import { Button, Input, Text } from 'react-native-elements';
import { supabase } from '@/lib/supabase-client'; // Ensure this path is correct
import { useAuth } from '@/context/auth';
import SimpleModal from '@/friends/FriendModal';
import { router } from 'expo-router';

const windowWidth = Dimensions.get('window').width;
const formWidth = Math.min(windowWidth * 0.8, 400);

export default function SignUp() {
  const { signUp } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [username, setUsername] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  const [usernameError, setUsernameError] = useState('');

  const validateAndSignUp = async () => {
    if (!isValidEmail(email)) {
      setErrorMessage('Please enter a valid email address.');
      return;
    }
    if (!isValidPassword(password)) {
      setErrorMessage(
        'Password must be at least 8 characters long and include at least one number and one special character.',
      );
      return;
    }
    if (password !== confirmPassword) {
      setErrorMessage('Passwords do not match');
      return;
    }

    if (!username.trim()) {
      // Check if username is not empty or just whitespace
      setErrorMessage('Username cannot be empty.');
      return;
    }

    setLoading(true);
    setErrorMessage('');
    try {
      const { data, error } = await signUp(email, password, username);
      if (error) {
        setModalMessage(
          error.message || 'An unexpected error occurred during signup.',
        );
      } else {
        // Assuming signup is successful regardless of session presence
        setModalMessage(
          'Signup Successful, Please check your inbox for email verification!',
        );
        // Set a timeout to redirect to the login page after 5 seconds
        setTimeout(() => {
          router.push('/(modals)/login');
        }, 5000);
      }
    } catch (error: any) {
      setModalMessage(error.message || 'An unexpected error occurred');
    } finally {
      setModalVisible(true);
      setLoading(false);
    }
  };
  const isValidEmail = (email: string) => {
    const re =
      /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
  };

  const isValidPassword = (password: string) => {
    return (
      password.length >= 8 &&
      /[0-9]/.test(password) && // checks for at least one digit
      /[!@#$%^&*(),.?":{}|<>]/.test(password)
    ); // checks for at least one special character
  };

  const handleUsernameChange = (text: string): void => {
    setUsername(text);
    if (text.length < 3) {
      setUsernameError('Username must be at least 3 characters long.');
    } else if (text.length > 15) {
      setUsernameError('Username must be under 15 characters.');
    } else {
      setUsername(text);
      setUsernameError('');
    }
  };

  return (
    <View style={styles.centeredView}>
      <View style={styles.modalView}>
        <Text style={styles.modalText}>Sign Up</Text>
        <Input
          label='Email'
          leftIcon={{ type: 'font-awesome', name: 'envelope' }}
          onChangeText={setEmail}
          value={email}
          placeholder='email@address.com'
          maxLength={25}
          autoCapitalize='none'
          errorMessage={errorMessage.includes('email') ? errorMessage : ''}
          containerStyle={styles.input}
        />
        <Input
          label='Username'
          leftIcon={{ type: 'font-awesome', name: 'user' }}
          onChangeText={handleUsernameChange}
          value={username}
          placeholder='Username'
          maxLength={15}
          errorMessage={usernameError}
          autoCapitalize='none'
          containerStyle={styles.input}
        />
        <Input
          label='Password'
          leftIcon={{ type: 'font-awesome', name: 'lock' }}
          onChangeText={setPassword}
          value={password}
          secureTextEntry={true}
          placeholder='Password'
          maxLength={20}
          autoCapitalize='none'
          errorMessage={errorMessage.includes('Password') ? errorMessage : ''}
          containerStyle={styles.input}
        />
        <Input
          label='Confirm Password'
          leftIcon={{ type: 'font-awesome', name: 'lock' }}
          onChangeText={setConfirmPassword}
          value={confirmPassword}
          secureTextEntry={true}
          placeholder='Confirm Password'
          autoCapitalize='none'
          errorMessage={
            password !== confirmPassword && confirmPassword
              ? 'Passwords do not match.'
              : ''
          }
          containerStyle={styles.input}
        />
        <Button
          title='Sign Up'
          loading={loading}
          onPress={validateAndSignUp}
          buttonStyle={styles.button}
        />
        <Button
          title='Already have an account? Login'
          type='clear'
          onPress={() => router.push('/(modals)/login')}
          buttonStyle={styles.button}
        />
        <SimpleModal
          visible={modalVisible}
          message={modalMessage}
          onClose={() => setModalVisible(false)}
        />
      </View>
    </View>
  );
}

// Reuse the styles from the Login component
const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22,
  },
  modalView: {
    margin: 25,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 45,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalText: {
    marginBottom: 15,
    textAlign: 'center',
  },
  input: {
    width: '120%', // Ensure inputs take the full width of the modal
    marginBottom: 10,
  },
  button: {
    marginTop: 10,
    width: '100%', // Ensure buttons take the full width of the modal
  },
  errorText: {
    color: 'red',
    fontSize: 14,
    marginBottom: 10,
  },
  error: {
    color: 'red',
    fontSize: 14,
    marginTop: 2,
    marginBottom: 2,
  },
});
