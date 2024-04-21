import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Button, ScrollView } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { fetchUserReviews, fetchUserDetailsById } from '@/services/services';
import { UserProfile, Review } from '@/types/types';
import { useAuth } from '@/context/auth';
import { useFriends } from '@/context/FriendsContex';

const UserProfilePage: React.FC = () => {
  const { userId } = useLocalSearchParams();
  const { session } = useAuth();
  const { handleFriendRequest, friends } = useFriends();

  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const normalizedUserId = parseInt(Array.isArray(userId) ? userId[0] : userId);

  useEffect(() => {
    if (!session?.access_token || !normalizedUserId) {
      setError('Invalid user ID format or missing authentication token');
      setLoading(false);
      return;
    }

    const fetchData = async () => {
      try {
        const userProfileData = await fetchUserDetailsById(
          normalizedUserId,
          session.access_token,
        );
        setUserProfile(userProfileData);
        const userReviews = await fetchUserReviews(
          normalizedUserId,
          session.access_token,
        );
        setReviews(userReviews || []);
      } catch (e) {
        console.error('Failed to load data:', e);
        setError('Failed to load user details');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [normalizedUserId, session?.access_token]);

  const isAlreadyFriend = friends.some(
    (friend) =>
      (friend.requester.id === normalizedUserId ||
        friend.addressee.id === normalizedUserId) &&
      friend.status === 'ACCEPTED',
  );

  const handleSendFriendRequest = async () => {
    if (!userProfile) {
      alert('User profile is not loaded.');
      return;
    }

    const result = await handleFriendRequest(
      'request',
      userProfile.id,
      normalizedUserId,
    );
    if (result === 'Success') {
      alert('Friend request sent successfully!');
    } else {
      alert('Failed to send friend request');
    }
  };

  if (!userId) {
    return <Text>Error: No user ID provided.</Text>;
  }

  if (loading) {
    return <Text>Loading...</Text>;
  }

  if (error) {
    return <Text>{error}</Text>;
  }

  if (!userProfile) {
    return <Text>User not found.</Text>;
  }

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>User Profile: {userProfile.name}</Text>
      <Text>Email: {userProfile.email}</Text>
      {reviews.map((review, index) => (
        <View
          key={index}
          style={styles.review}
        >
          <Text>
            {review.comment} - Rating: {review.rating}
          </Text>
        </View>
      ))}
      {!isAlreadyFriend && (
        <Button
          title='Send Friend Request'
          onPress={handleSendFriendRequest}
        />
      )}
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
  review: {
    marginTop: 10,
    padding: 10,
    backgroundColor: '#eaeaea',
  },
});

export default UserProfilePage;
