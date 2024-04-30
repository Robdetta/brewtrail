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
    return <Redirect href='/(modals)/login' />;
  }

  const handleLogout = async () => {
    await signOut();
  };

  return (
    <View style={styles.container}>
      <Text style={styles.displayName}>Welcome, {userProfile.name}!</Text>
      <Button
        title='Logout'
        onPress={handleLogout}
        buttonStyle={styles.buttonStyle}
        containerStyle={styles.buttonContainer} // Apply the container style here
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
  displayName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000000', // Sets the text color to black
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
  },
  subtitle: {
    fontSize: 18,
    marginTop: 10,
  },
  buttonContainer: {
    alignSelf: 'center', // Aligns the button container to the center horizontally
    width: '50%', // Sets the width of the button to 50% of its container's width
    marginTop: 20, // Adds some margin on the top for spacing
  },
  buttonStyle: {
    backgroundColor: '#264653', // Dark blue color
    borderRadius: 10,
  },
});

export default Profile;
