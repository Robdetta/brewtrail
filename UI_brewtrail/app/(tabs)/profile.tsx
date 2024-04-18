import React, { useState } from 'react';
import { Alert, StyleSheet, View } from 'react-native';
import { supabase } from '../../lib/supabase-client';
import { Button, Input, Text } from 'react-native-elements';
import { useAuth } from '@/context/auth';
import { Redirect } from 'expo-router';
import { fetchUserProfile } from '@/services/services';
import { UserProfile } from '@/types/types';

const Profile: React.FC = () => {
  const { userProfile, signOut } = useAuth();

  if (!userProfile) {
    return <Text>Please log in to view your profile.</Text>;
  }

  const handleLogout = async () => {
    await signOut();
  };

  return (
    <View>
      <Text>Profile Page: Welcome, {userProfile.name}!</Text>
      <Button
        title='Logout'
        onPress={handleLogout}
      />
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
    fontSize: 22,
    fontWeight: 'bold',
  },
  subtitle: {
    fontSize: 18,
    marginTop: 10,
  },
});

export default Profile;
