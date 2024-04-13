import React, { useEffect, useState, useContext } from 'react';
import { View, Text, Button, Alert, StyleSheet, TextInput } from 'react-native';
import * as WebBrowser from 'expo-web-browser';
import * as Google from 'expo-auth-session/providers/google';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { supabase } from '../../lib/supabase-client';
import { Tables } from '@/types/supabase';
import { StatusBar } from 'expo-status-bar';

WebBrowser.maybeCompleteAuthSession();

const ProfilePage = () => {
  const [userInfo, setUserInfo] = useState<Tables<'app_users'> | null>(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [request, response, promptAsync] = Google.useAuthRequest({
    webClientId: process.env.EXPO_PUBLIC_CLIENT_ID,
  });

  const handleEmailSignUp = async () => {
    const { user, session, error } = await supabase.auth.signUp({
      email: email,
      password: password,
    });

    if (error) console.error('Error signing in:', error);
    else {
      console.log('Authentication success, user:', user);
      // Send the session token to your backend
      sendTokenToBackend(session.access_token);
    }
  };

  async function handleEmailSignIn() {
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({
      email: email,
      password: password,
    });

    if (error) Alert.alert(error.message);
    setLoading(false);
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{JSON.stringify(userInfo)}</Text>
      {!userInfo ? (
        <>
          <TextInput
            style={styles.input}
            placeholder='Email'
            value={email}
            onChangeText={setEmail}
          />
          <TextInput
            style={styles.input}
            placeholder='Password'
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />
          <Button
            title='Sign In'
            onPress={handleEmailSignIn}
            disabled={loading}
          />
          <Button
            title='Sign Up'
            onPress={handleEmailSignUp}
            disabled={loading}
          />
          <Button
            title='Sign In with Google'
            onPress={() => promptAsync()}
            disabled={!request || loading}
          />

          <Button
            title='Delete Local Storage'
            onPress={() => {
              AsyncStorage.removeItem('@user');
            }}
          />
          <StatusBar style='auto' />
        </>
      ) : (
        <Text>Welcome, {userInfo.name}</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
  },
  input: {
    width: '100%',
    height: 40,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: 'gray',
    padding: 10,
  },
});

export default ProfilePage;
