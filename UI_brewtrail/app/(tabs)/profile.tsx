import React, { useEffect, useState } from 'react';
import { View, Text, Button, Alert } from 'react-native';
import * as WebBrowser from 'expo-web-browser';
import * as Google from 'expo-auth-session/providers/google';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { CLIENT_ID, SUPABASE_URL, SUPABASE_ANON_KEY } from '@env';
import { createClient } from '@supabase/supabase-js';

WebBrowser.maybeCompleteAuthSession();

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

const Page = () => {
  const [userInfo, setUserInfo] = useState(null);
  const [request, response, promptAsync] = Google.useAuthRequest({
    webClientId: CLIENT_ID,
  });

  useEffect(() => {
    if (response?.type === 'success') {
      const { accessToken } = response.authentication;
      handleGoogleSignIn(accessToken);
    }
  }, [response]);

  const handleGoogleSignIn = async (accessToken) => {
    try {
      const { user, session, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        accessToken, // Pass the accessToken to Supabase for OAuth handling
      });

      if (error) throw new Error(error.message);

      // Assuming your users table is named 'users' and has columns 'id', 'email', and 'name'
      const { data: userData, error: userDataError } = await supabase
        .from('users')
        .upsert(
          {
            id: user.id,
            email: user.email,
            name: user.user_metadata.full_name,
          },
          {
            returning: 'minimal', // or 'representation' if you need the data back
          },
        );

      if (userDataError) throw new Error(userDataError.message);

      setUserInfo({
        email: user.email,
        name: user.user_metadata.full_name,
      });

      AsyncStorage.setItem(
        '@user',
        JSON.stringify({
          email: user.email,
          name: user.user_metadata.full_name,
        }),
      );
    } catch (error) {
      console.error('Login Error:', error);
      Alert.alert('Login Error', error.message);
    }
  };

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Profile</Text>
      <Button
        disabled={!request}
        title='Login with Google'
        onPress={() => promptAsync()}
      />
      {userInfo && <Text>Welcome, {userInfo.name}!</Text>}
    </View>
  );
};

export default Page;
