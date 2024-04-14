import { View, Text } from 'react-native';
import React from 'react';
import { useAuth } from '@/context/auth';
import { Redirect } from 'expo-router';

const Page = () => {
  const { session } = useAuth();
  if (!session) {
    // Redirect to the login screen if the user is not authenticated
    return <Redirect href='/(modals)/login' />;
  }

  return (
    <View>
      <Text>Reviews</Text>
    </View>
  );
};

export default Page;
