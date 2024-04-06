import React, { useEffect, useState } from 'react';
import { View, Text, Button, Alert } from 'react-native';
import * as WebBrowser from 'expo-web-browser';
import * as Google from 'expo-auth-session/providers/google';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { CLIENT_ID } from '@env';

import { useAuthRequest } from 'expo-auth-session';
import { processGoogleUser } from '../../services/services'; // Assuming services.js is in the same directory

WebBrowser.maybeCompleteAuthSession();

const Page = () => {
  const [userInfo, setUserInfo] = useState(null);

  const [request, response, promptAsync] = Google.useAuthRequest({
    webClientId: CLIENT_ID,
  });

  useEffect(() => {
    if (response?.type === 'success') {
      const accessToken = response.authentication.accessToken;
      getUserInfo(accessToken)
        .then((userInfo) => {
          AsyncStorage.setItem('@user', JSON.stringify(userInfo));
          setUserInfo(userInfo);
          processGoogleUser(userInfo)
            .then((backendResponse) => {
              // Handle backend response, e.g., storing a session token
              console.log('Backend response:', backendResponse);
              // Example: AsyncStorage.setItem('@session_token', backendResponse.sessionToken);
            })
            .catch((error) => {
              console.error('Failed to process user info on backend:', error);
              Alert.alert('Login Error', 'Could not log in. Please try again.');
            });
        })
        .catch((error) => {
          console.error('Failed to fetch user info:', error);
          Alert.alert('Login Error', 'Could not log in. Please try again.');
        });
    }
  }, [response]);

  const getUserInfo = async (token) => {
    const response = await fetch('https://www.googleapis.com/userinfo/v2/me', {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!response.ok) {
      throw new Error('Google API request failed');
    }
    return await response.json();
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
