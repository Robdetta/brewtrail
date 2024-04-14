import React, { useState } from 'react';
import { Alert, StyleSheet, View } from 'react-native';
import { Button, Input, Text } from 'react-native-elements';
import { supabase } from '@/lib/supabase-client'; // Ensure this path is correct
import { useAuth } from '@/context/auth';

export default function SignUp() {
  const { signUp } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [username, setUsername] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const validateAndSignUp = async () => {
    if (password !== confirmPassword) {
      setErrorMessage('Passwords do not match');
      return;
    }
    setLoading(true);

    try {
      await signUp(email, password, username);
      // Navigation or additional success logic can be handled within the signUp function if needed
    } catch (error) {
      setErrorMessage(errorMessage);
    }

    setLoading(false);

    // if (error) {
    //   Alert.alert('Signup Failed', error.message);
    //   return;
    // }

    // if (data.user) {
    //   Alert.alert(
    //     'Signup Successful',
    //     'Please check your inbox for email verification!',
    //   );
    // }
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
      />
      <Input
        label='Confirm Password'
        leftIcon={{ type: 'font-awesome', name: 'lock' }}
        onChangeText={setConfirmPassword}
        value={confirmPassword}
        secureTextEntry={true}
        placeholder='Confirm Password'
        autoCapitalize='none'
      />
      <Button
        title='Sign Up'
        loading={loading}
        onPress={validateAndSignUp}
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
