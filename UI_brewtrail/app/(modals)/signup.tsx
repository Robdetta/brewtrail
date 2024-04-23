import React, { useState } from 'react';
import { Alert, StyleSheet, View } from 'react-native';
import { Button, Input, Text } from 'react-native-elements';
import { supabase } from '@/lib/supabase-client'; // Ensure this path is correct
import { useAuth } from '@/context/auth';
import SimpleModal from '@/friends/FriendModal';
import { router } from 'expo-router';

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

    setLoading(true);
    setErrorMessage('');
    try {
      await signUp(email, password, username);
      setModalMessage(
        'Signup Successful, Please check your inbox for email verification!',
      );
      setModalVisible(true);
      // Navigation or additional success logic can be handled within the signUp function if needed
    } catch (error) {
      setModalMessage(errorMessage);
      setModalVisible(true);
    }

    setLoading(false);
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

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Sign Up</Text>
      <Input
        label='Email'
        leftIcon={{ type: 'font-awesome', name: 'envelope' }}
        onChangeText={setEmail}
        value={email}
        placeholder='email@address.com'
        autoCapitalize='none'
        errorMessage={errorMessage.includes('email') ? errorMessage : ''}
      />
      <Input
        label='Username'
        leftIcon={{ type: 'font-awesome', name: 'user' }}
        onChangeText={setUsername}
        value={username}
        placeholder='Username'
        autoCapitalize='none'
      />
      <Input
        label='Password'
        leftIcon={{ type: 'font-awesome', name: 'lock' }}
        onChangeText={setPassword}
        value={password}
        secureTextEntry={true}
        placeholder='Password'
        autoCapitalize='none'
        errorMessage={errorMessage.includes('Password') ? errorMessage : ''}
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
      />
      <Button
        title='Sign Up'
        loading={loading}
        onPress={validateAndSignUp}
      />
      <Button
        title='Already have an account? Login'
        type='clear'
        onPress={() => router.push('/(modals)/login')}
      />
      <SimpleModal
        visible={modalVisible}
        message={modalMessage}
        onClose={() => setModalVisible(false)}
      />
    </View>
  );
}

// Reuse the styles from the Login component
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
});
