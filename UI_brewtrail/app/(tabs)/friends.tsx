// Assuming you have a similar `useSession` hook as defined in earlier steps
import { Redirect } from 'expo-router';
import { View, Text } from 'react-native';
import React from 'react';
import { useAuth } from '@/context/auth';

const Friends = () => {
  const { user } = useAuth();

  if (!user) {
    // Redirect to the login screen if the user is not authenticated
    return <Redirect href='/(modals)/login' />;
  }

  // If authenticated, show the Friends content
  return (
    <View>
      <Text>Friends</Text>
    </View>
  );
};

export default Friends;
