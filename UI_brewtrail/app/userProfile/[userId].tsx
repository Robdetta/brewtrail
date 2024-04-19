import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Button } from 'react-native';
import { Redirect, useLocalSearchParams, useSearchParams } from 'expo-router';
import { fetchUserProfile } from '@/services/services';
import { UserProfile as UserProfileType } from '@/types/types';

const UserProfile: React.FC = () => {
  const [userId] = useLocalSearchParams();
  const [userProfile, setUserProfile] = useState<UserProfileType | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (userId) {
      fetchUserProfile(userProfile?.id))
        .then((profile) => {
          setUserProfile(profile);
          setLoading(false);
        })
        .catch(() => {
          setLoading(false);
        });
    }
  }, [userId]);

  if (!userId) {
    return <Text>Error: No user ID provided.</Text>;
  }

  if (loading) {
    return <Text>Loading...</Text>;
  }

  if (!userProfile) {
    return <Text>User not found.</Text>;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>User Profile: {userProfile.name}</Text>
      <Text>Email: {userProfile.email}</Text>
      {/* Add more user details here */}
      <Button
        title='Send Friend Request'
        onPress={() => {
          /* Functionality to send friend request */
        }}
      />
      {/* More action buttons as needed */}
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
});

export default UserProfile;
