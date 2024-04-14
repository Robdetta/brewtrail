// Assuming you have a similar `useSession` hook as defined in earlier steps
import { Redirect } from 'expo-router';
import { View, Text } from 'react-native';
import React from 'react';
import { useAuth } from '@/context/auth';

const Friends = () => {
  const { session } = useAuth();
  if (!session) {
    // Redirect to the login screen if the user is not authenticated
    return <Redirect href='/(modals)/login' />;
  }

  // If authenticated, show the Friends content
  return (
    <View>
      {session ? (
        <Text>Welcome to Friends, {session.user?.user_metadata.username}!</Text>
      ) : (
        <Text>You need to login to view this page.</Text>
      )}
    </View>
  );
};

export default Friends;
