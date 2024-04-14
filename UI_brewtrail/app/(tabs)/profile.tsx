import React, { useState } from 'react';
import { Alert, StyleSheet, View } from 'react-native';
import { supabase } from '../../lib/supabase-client';
import { Button, Input } from 'react-native-elements';

export default function Auth() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [username, setUsername] = useState('');
  const [loading, setLoading] = useState(false);

  async function signInWithEmail() {
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({
      email: email,
      password: password,
    });
    setLoading(false);
    if (error) Alert.alert(error.message);
  }

  const validateAndSignUp = async () => {
    if (password !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match');
      return;
    }

    setLoading(true);
    const { data, error } = await supabase.auth.signUp({
      email: email,
      password: password,
      options: {
        data: {
          username: usernameRef.current?.value,
        },
      },
    });

    setLoading(false);
    if (error) {
      Alert.alert('Signup Failed', error.message);
      return;
    }

    if (data.user) {
      // Ensure the ID is a number if your database expects it to be a number
      const userId = parseInt(data.user.id); // Convert to number if id is a string
      if (isNaN(userId)) {
        Alert.alert('Signup Error', 'Invalid user ID.');
        return;
      }

      const profileData = {
        id: userId, // Ensure this is a number if your schema expects a number
        username: username,
        email: email,
        isAdmin: false, // Assuming `isAdmin` needs to be set, default to false
      };

      const { error: profileError } = await supabase
        .from('app_users')
        .insert([profileData]);

      if (profileError) {
        Alert.alert('Signup Error', profileError.message);
      } else {
        Alert.alert(
          'Signup Successful',
          'Please check your inbox for email verification!',
        );
      }
    } else {
      Alert.alert('Please check your inbox for email verification!');
    }
  };

  return (
    <View style={styles.container}>
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
        title='Sign in'
        disabled={loading}
        onPress={signInWithEmail}
      />
      <Button
        title='Sign up'
        disabled={loading}
        onPress={validateAndSignUp}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 40,
    padding: 12,
  },
  verticallySpaced: {
    paddingTop: 4,
    paddingBottom: 4,
    alignSelf: 'stretch',
  },
  mt20: {
    marginTop: 20,
  },
});
