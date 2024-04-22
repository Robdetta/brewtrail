import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Button, ScrollView } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { fetchUserReviews, fetchUserDetailsById } from '@/services/services';
import {
  UserProfile,
  Review,
  FriendshipStatus,
  Friendship,
} from '@/types/types';
import { useAuth } from '@/context/auth';
import { useFriends } from '@/context/FriendsContex';
import SimpleModal from '@/friends/FriendModal';

interface FriendshipExtended extends Friendship {
  requestId: number; // This represents the unique ID of the friendship.
}

const UserProfilePage: React.FC = () => {
  const { userId } = useLocalSearchParams();
  const { session } = useAuth();
  const {
    handleFriendRequest,
    isFriend,
    addPendingRequest,
    removePendingRequest,
    pendingRequests,
    loadFriends,
    friends,
    isPending,
    setFriends,
  } = useFriends();

  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  const normalizedUserId = parseInt(Array.isArray(userId) ? userId[0] : userId);

  useEffect(() => {
    if (!session?.access_token || !normalizedUserId) {
      setModalMessage('Invalid user ID format or missing authentication token');
      setModalVisible(true);
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
        setModalMessage('Failed to load user details');
        setModalVisible(true);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [normalizedUserId, session?.access_token]);

  const handleSendFriendRequest = async () => {
    if (!userProfile || !session) {
      setModalMessage('User profile is not loaded or session is expired.');
      setModalVisible(true);
      return;
    }

    const result = await handleFriendRequest(
      'request',
      userProfile.id,
      normalizedUserId,
    );
    if (result === 'Friend request sent.') {
      setModalMessage('Friend request sent successfully!');
    } else {
      setModalMessage('Failed to send friend request');
    }
    setModalVisible(true);
  };

  const handleUnfriend = async () => {
    console.log('Attempting to unfriend:', {
      fromUserId: userProfile?.id,
      toUserId: normalizedUserId,
    });

    if (!userProfile || !session) {
      setModalMessage('User profile is not loaded or session is expired.');
      setModalVisible(true);
      return;
    }

    const friendship = friends.find(
      (f) =>
        (f.requester.id === normalizedUserId ||
          f.addressee.id === normalizedUserId) &&
        f.status === FriendshipStatus.ACCEPTED,
    );

    if (!friendship) {
      setModalMessage('No active friendship found.');
      setModalVisible(true);
      return;
    }

    // Optimistically update the UI
    const updatedFriends = friends.filter((f) => f.id !== friendship.id);
    setFriends(updatedFriends); // Update state immediately
    console.log('Friends state updated:', updatedFriends);
    try {
      const result = await handleFriendRequest(
        'reject',
        userProfile.id,
        friendship.id,
        false,
      );
      if (!result) {
        // If the unfriend request fails, revert the changes
        setModalMessage('Failed to unfriend.');
        setFriends(friends); // Revert to original friends list
      } else {
        setModalMessage('Friendship has been ended successfully.');
      }
    } catch (error) {
      console.error('Error while unfriending:', error);
      setModalMessage('Failed to unfriend.');
      setFriends(friends); // Revert to original friends list
    }
    setModalVisible(true);
    setFriends([]);
    loadFriends(
      userProfile.id,
      FriendshipStatus.ACCEPTED,
      session.access_token,
    ).then(() => {});
  };

  const handleCloseModal = () => {
    setModalVisible(false);
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
      <SimpleModal
        message={modalMessage}
        visible={modalVisible}
        onClose={handleCloseModal}
      />
      <Text style={styles.title}>User Profile: {userProfile?.name}</Text>
      <Text>Email: {userProfile?.email}</Text>
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
      <>
        {isPending(normalizedUserId) ? (
          <Text style={styles.pendingRequest}>Request Pending...</Text>
        ) : isFriend(normalizedUserId) ? (
          <Button
            title='Unfriend'
            onPress={handleUnfriend}
          />
        ) : (
          <Button
            title='Send Friend Request'
            onPress={handleSendFriendRequest}
          />
        )}
      </>
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
  pendingRequest: {
    color: 'orange',
    fontSize: 18,
    marginTop: 10,
  },
});

export default UserProfilePage;
