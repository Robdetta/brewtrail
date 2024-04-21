import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Button, ScrollView } from 'react-native';
import { Redirect, useLocalSearchParams } from 'expo-router';
import {
  fetchUserReviews,
  fetchUserDetailsById,
  sendFriendRequest,
} from '@/services/services';
import { UserProfile, Review, FriendshipStatus } from '@/types/types';
import { useAuth } from '@/context/auth';
import { useFriends } from '@/context/FriendsContex';

const UserProfilePage: React.FC = () => {
  const { userId } = useLocalSearchParams();
  const { session } = useAuth();
  const { handleFriendRequest, friends, loadFriends } = useFriends();

  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isFriend, setIsFriend] = useState(false);
  const normalizedUserId = parseInt(Array.isArray(userId) ? userId[0] : userId);

  useEffect(() => {
    if (!normalizedUserId) {
      setError('Invalid user ID format');
      setLoading(false);
      return;
    }

    const fetchData = async () => {
      try {
        const userProfileData = await fetchUserDetailsById(
          normalizedUserId,
          session?.access_token,
        );
        const userReviews = await fetchUserReviews(
          normalizedUserId,
          session?.access_token,
        );
        setUserProfile(userProfileData);
        setReviews(userReviews || []);
        await loadFriends(
          userProfileData.id,
          FriendshipStatus.ACCEPTED,
          session?.access_token,
        );
      } catch (e) {
        console.error('Failed to load data:', e);
        setError('Failed to load user details');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [normalizedUserId, session?.access_token, loadFriends]);

  useEffect(() => {
    const alreadyFriend = friends.some(
      (friend) =>
        (friend.requester.id === normalizedUserId ||
          friend.addressee.id === normalizedUserId) &&
        friend.status === FriendshipStatus.ACCEPTED,
    );
    setIsFriend(alreadyFriend);
  }, [friends, normalizedUserId]);

  const handleSendFriendRequest = async () => {
    if (!session?.access_token || !userProfile) {
      alert('Authentication token missing or user profile not loaded');
      return;
    }

    try {
      const result = await handleFriendRequest(
        'request',
        userProfile.id,
        normalizedUserId,
      );
      if (result === 'Success') {
        alert('Friend request sent successfully!');
        setIsFriend(true);
      } else {
        throw new Error(result || 'Unknown error occurred');
      }
    } catch (error) {
      console.error('Failed to send friend request:', error);
      alert(`Failed to send friend request: ${error}`);
    }
  };

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
      {!isFriend && (
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
});

export default UserProfilePage;
