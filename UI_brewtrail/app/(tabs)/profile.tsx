// import React, { useEffect, useState } from 'react';
// import { View, Text, Button, Alert } from 'react-native';
// import * as WebBrowser from 'expo-web-browser';
// import * as Google from 'expo-auth-session/providers/google';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import { CLIENT_ID, SUPABASE_URL, SUPABASE_ANON_KEY } from '@env';
// import { createClient } from '@supabase/supabase-js';

// WebBrowser.maybeCompleteAuthSession();

// const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// const Page = () => {
//   const [userInfo, setUserInfo] = useState(null);
//   const [request, response, promptAsync] = Google.useAuthRequest({
//     webClientId: CLIENT_ID,
//   });

//   useEffect(() => {
//     if (response?.type === 'success') {
//       const { accessToken } = response.authentication;
//       handleGoogleSignIn(accessToken);
//     }
//   }, [response]);

//   const handleGoogleSignIn = async (accessToken) => {
//     try {
//       const { user, session, error } = await supabase.auth.signInWithOAuth({
//         provider: 'google',
//         accessToken, // Pass the accessToken to Supabase for OAuth handling
//       });

//       if (error) throw new Error(error.message);

//       // Assuming your users table is named 'users' and has columns 'id', 'email', and 'name'
//       const { data: userData, error: userDataError } = await supabase
//         .from('users')
//         .upsert(
//           {
//             id: user.id,
//             email: user.email,
//             name: user.user_metadata.full_name,
//           },
//           {
//             returning: 'minimal', // or 'representation' if you need the data back
//           },
//         );

//       if (userDataError) throw new Error(userDataError.message);

//       setUserInfo({
//         email: user.email,
//         name: user.user_metadata.full_name,
//       });

//       AsyncStorage.setItem(
//         '@user',
//         JSON.stringify({
//           email: user.email,
//           name: user.user_metadata.full_name,
//         }),
//       );
//     } catch (error) {
//       console.error('Login Error:', error);
//       Alert.alert('Login Error', error.message);
//     }
//   };

//   return (
//     <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
//       <Text>Profile</Text>
//       <Button
//         disabled={!request}
//         title='Login with Google'
//         onPress={() => promptAsync()}
//       />
//       {userInfo && <Text>Welcome, {userInfo.name}!</Text>}
//     </View>
//   );
// };

// export default Page;
import React, { useEffect, useState } from 'react';
import { View, Text, Button, Alert, StyleSheet, TextInput } from 'react-native';
import * as WebBrowser from 'expo-web-browser';
import * as Google from 'expo-auth-session/providers/google';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { supabase } from '../lib/supabase-client';
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

  React.useEffect(() => {
    handleGoogleSignIn();
  }, [response]);

  async function handleGoogleSignIn() {
    const user = await AsyncStorage.getItem('@user');
    if (!user) {
      if (response?.type === 'success' && response.authentication) {
        await getUserInfo(response.authentication.accessToken);
      }
    } else {
      setUserInfo(JSON.parse(user));
    }
  }

  const getUserInfo = async (token: string) => {
    if (!token) return;
    try {
      const response = await fetch(
        'https://www.googleapis.com/userinfo/v2/me',
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      const user = await response.json();
      await AsyncStorage.setItem('@user', JSON.stringify(user));
    } catch (error) {
      console.error(error);
    }
  };

  const handleEmailSignIn = async () => {
    setLoading(true);
    try {
      const { error, user } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error as Error;

      setUserInfo(user);
      setLoading(false);
    } catch (error) {
      Alert.alert('Login Error', (error as Error).message);
      setLoading(false);
    }
  };

  const handleEmailSignUp = async () => {
    setLoading(true);
    try {
      const { error, user } = await supabase.auth.signUp({ email, password });

      if (error) throw error as Error;

      setUserInfo(user);
      setLoading(false);
    } catch (error) {
      Alert.alert('Sign Up Error', (error as Error).message);
      setLoading(false);
    }
  };

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
