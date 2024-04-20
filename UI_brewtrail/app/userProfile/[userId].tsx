import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Button, ScrollView } from 'react-native';
import { Redirect, useLocalSearchParams } from 'expo-router';
import { fetchUserReviews, fetchUserDetailsById } from '@/services/services';
import { UserProfile, Review } from '@/types/types';
import { useAuth } from '@/context/auth';

const UserProfilePage: React.FC<UserProfile> = () => {
  const { userId } = useLocalSearchParams();
  const { session } = useAuth();
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const numericUserId = Array.isArray(userId) ? userId[0] : userId;

  useEffect(() => {
    if (!numericUserId || !session?.access_token) {
      setError('Invalid user ID or missing authentication token');
      setLoading(false);
      return;
    }

    const userIdNumber = parseInt(numericUserId, 10); // Convert to number here
    if (isNaN(userIdNumber)) {
      // Check for a valid conversion
      setError('Invalid user ID format');
      setLoading(false);
      return;
    }

    const fetchData = async () => {
      if (userId && session?.access_token) {
        try {
          const userProfileData = await fetchUserDetailsById(
            userIdNumber,
            session.access_token,
          );
          const userReviews = await fetchUserReviews(
            userIdNumber,
            session.access_token,
          );
          setUserProfile(userProfileData);
          setReviews(userReviews || []); // Ensure fallback to an empty array if null is returned
        } catch (e) {
          console.error('Failed to load data:', e);
          setError('Failed to load user details');
        } finally {
          setLoading(false);
        }
      }
    };

    fetchData();
  }, [numericUserId, session?.access_token]);

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
    <ScrollView style={styles.container}>
      <Text style={styles.title}>User Profile: {userProfile?.name}</Text>
      <Text>Email: {userProfile?.email}</Text>
      {reviews.map((review, index) => (
        <Text key={index}>
          {review.comment} - Rating: {review.rating}
        </Text>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
  },
});
export default UserProfilePage;
