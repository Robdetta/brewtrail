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
    setLoading(true);
    try {
      await signIn(email, password);
    } catch (error) {
      setErrorMessage(errorMessage);
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

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login</Text>
      <Input
        label='Email'
        leftIcon={{ type: 'font-awesome', name: 'envelope' }}
        onChangeText={setEmail}
        value={email}
        placeholder='email@address.com'
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
});
function setErrorMessage(message: string) {
  throw new Error('Function not implemented.');
}
