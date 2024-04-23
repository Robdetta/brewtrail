import { Text, View } from '@/components/Themed';
import React, { useEffect, useState } from 'react';
import EditScreenInfo from '@/components/EditScreenInfo';
import { StyleSheet } from 'react-native';
import { Button, Input } from 'react-native-elements';
import { supabase } from '@/lib/supabase-client';
import { useRouter } from 'expo-router';
import { useAuth } from '@/context/auth';

export default function Login() {
  const { signIn } = useAuth();
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState(''); // Store error messages from login attempts

  async function signInWithEmail() {
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
    try {
      await signIn(email, password);
      closeModal(); // Close modal on successful login
    } catch (error) {
      console.error(error);
      setErrorMessage('Failed to sign in. Please check your credentials.');
    }
    setLoading(false);
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
      />
      {errorMessage &&
        !errorMessage.includes('email') &&
        !errorMessage.includes('Password') && (
          <Text style={styles.errorText}>{errorMessage}</Text>
        )}
      <Button
        title='Login'
        loading={loading}
        onPress={signInWithEmail}
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
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 12,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: '80%',
  },
  errorText: {
    color: 'red',
    fontSize: 14,
    marginBottom: 10,
  },
});
