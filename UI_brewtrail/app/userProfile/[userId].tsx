import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Button } from 'react-native';
import { Redirect, useLocalSearchParams } from 'expo-router';
import { fetchUserProfile, fetchUserDetailsById } from '@/services/services';
import { UserProfile } from '@/types/types';
import { useAuth } from '@/context/auth';

const UserProfilePage: React.FC<UserProfile> = () => {
  const { userId } = useLocalSearchParams();
  const { session } = useAuth();
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!userId) {
      setError('No user ID provided');
      setLoading(false);
      return;
    }

    if (!session?.access_token) {
      setError('No access token available');
      setLoading(false);
      return;
    }

    const fetchProfile = async () => {
      try {
        // Here we can be sure that userId and session.access_token are defined,
        // because we return early above if they are not.
        const profile = await fetchUserDetailsById(
          Number(userId),
          session.access_token,
        );
        if (profile) {
          setUserProfile(profile);
        } else {
          setError('User not found');
        }
      } catch (e) {
        console.error('Failed to fetch user details', e);
        setError('Failed to load user details');
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [userId, session?.access_token]);

  if (!userId) {
    return <Text>Error: No user ID provided.</Text>;
  }

  if (loading) {
    return <Text>Loading...</Text>;
  }

  if (!userProfile) {
    return <Text>User not found.</Text>;
  }

  console.log('userProfile', userProfile);
  return (
    <View style={styles.container}>
      <Text style={styles.title}>User Profile: {userProfile.name}</Text>
      <Text>Email: {userProfile.email}</Text>
      <Button
        title='Send Friend Request'
        onPress={() => {
          /* Add functionality to send friend request */
        }}
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
});

export default UserProfilePage;
