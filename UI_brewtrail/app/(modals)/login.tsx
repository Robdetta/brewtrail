import { Text, View } from '@/components/Themed';
import React, { useEffect, useState } from 'react';
import EditScreenInfo from '@/components/EditScreenInfo';
import { StyleSheet, Dimensions } from 'react-native';
import { Button, Input } from 'react-native-elements';
import { supabase } from '@/lib/supabase-client';
import { useRouter } from 'expo-router';
import { useAuth } from '@/context/auth';

const windowWidth = Dimensions.get('window').width;
const formWidth = Math.min(windowWidth * 0.8, 400);

export default function Login() {
  const { signIn } = useAuth();
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  // Store error messages from login attempts

  async function signInWithEmail(): Promise<void> {
    if (!isValidEmail(email)) {
      setErrorMessage('Please enter a valid email address.');
      return;
    }
    if (!isValidPassword(password)) {
      setErrorMessage('Password must be at least 6 characters long.');
      return;
    }

    setLoading(true);
    setErrorMessage(''); // Clear previous error messages
    const result = await signIn(email, password);
    setLoading(false);
    if (!result.success) {
      setErrorMessage(
        'Invalid login credentials' || 'An error occurred during sign-in.',
      ); // Display server error message
    } else {
      closeModal(); // Close modal on successful login
    }
  }

  const goToSignUp = () => {
    router.push('/(modals)/signup');
  };

  const closeModal = () => {
    router.dismissAll();
    setTimeout(() => {
      router.push('/');
    }, 0);
  };

  const isValidEmail = (email: string) => {
    const re =
      /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
  };

  const isValidPassword = (password: string) => {
    return password.length >= 6;
  };

  return (
    <View style={styles.container}>
      <View style={styles.formContainer}>
        <Text style={styles.title}>Login</Text>
        <Input
          label='Email'
          leftIcon={{ type: 'font-awesome', name: 'envelope' }}
          onChangeText={(text) => {
            setEmail(text);
            setErrorMessage('');
          }} // Clear error message on edit
          value={email}
          placeholder='email@address.com'
          testID='emailInput'
          autoCapitalize='none'
          errorMessage={errorMessage.includes('email') ? errorMessage : ''}
        />
        <Input
          label='Password'
          leftIcon={{ type: 'font-awesome', name: 'lock' }}
          onChangeText={(text) => {
            setPassword(text);
            setErrorMessage('');
          }} // Clear error message on edit
          value={password}
          secureTextEntry={true}
          placeholder='Password'
          autoCapitalize='none'
          errorMessage={errorMessage.includes('Password') ? errorMessage : ''}
          testID='passwordInput'
        />
        {errorMessage &&
          !errorMessage.includes('email') &&
          !errorMessage.includes('Password') && (
            <Text
              style={styles.errorText}
              testID='errorMessage'
            >
              {errorMessage}
            </Text>
          )}
        <Button
          title='Login'
          loading={loading}
          onPress={signInWithEmail}
          testID='loginButton'
        />
        <Button
          title="Don't have an account? Sign Up"
          type='clear'
          onPress={goToSignUp}
        />
        <Button
          title='Close'
          type='outline'
          onPress={closeModal}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center', // Center align items horizontally
    padding: 12,
  },
  formContainer: {
    width: formWidth, // Use calculated width for the form
    backgroundColor: 'white', // Consistent background color for modals
    padding: 20,
    borderRadius: 20, // Rounded corners for the form container
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5, // Elevate the form to give some depth
    alignItems: 'stretch', // Align children to stretch to the width of the form container
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center', // Center align the title
  },
  errorText: {
    color: 'red',
    fontSize: 14,
    marginBottom: 10,
    textAlign: 'center', // Center align error messages
  },
  input: {
    marginBottom: 10, // Space between input fields
  },
  button: {
    marginTop: 10, // Space above each button
    width: '100%', // Buttons should fill the container width
  },
});
