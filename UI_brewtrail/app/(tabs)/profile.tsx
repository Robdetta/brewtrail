import React, { useState } from 'react';
import { Alert, StyleSheet, View } from 'react-native';
import { supabase } from '../../lib/supabase-client';
import { Button, Input, Text } from 'react-native-elements';
import { useAuth } from '@/context/auth';
import { Redirect } from 'expo-router';

const Profile: React.FC = () => {
  const { session } = useAuth();

  if (!session) {
    // Redirect to login if not authenticated
    return <Redirect href='/(modals)/login' />;
  }

  return (
    <View>
      {session ? (
        <Text>
          Profile Page: Welcome, {session.user?.user_metadata.username}!
        </Text>
      ) : (
        <Text>Please log in to view your profile.</Text>
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
    fontSize: 22,
    fontWeight: 'bold',
  },
  subtitle: {
    fontSize: 18,
    marginTop: 10,
  },
});

export default Profile;
