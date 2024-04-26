import React, { useState, useEffect } from 'react';
import { Text, StyleSheet, Button, ScrollView, View } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { fetchFriendships, fetchUserDetailsById } from '@/services/services';
import {
  UserProfile,
  Review,
  FriendshipStatus,
  Friendship,
} from '@/types/types';
import { useAuth } from '@/context/auth';
import { useFriends } from '@/context/FriendsContex';
import SimpleModal from '@/friends/FriendModal';
import { useReviews } from '@/context/ReviewContext';
import ReviewsList from '@/listing/ReviewList';

const UserProfilePage: React.FC = () => {
  const { userId } = useLocalSearchParams();
  const { session, userProfile } = useAuth();
  const {
    isFriend,
    loadFriends,
    friends,
    handleFriendRequest,
    setFriends,
    isPending,
  } = useFriends();

  const [viewedUserProfile, viewSetUserProfile] = useState<UserProfile | null>(
    null,
  );
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  const [isRequestPending, setIsRequestPending] = useState(false); // Local state for pending status
  const normalizedUserId = parseInt(Array.isArray(userId) ? userId[0] : userId);
  const [pendingCheckDone, setPendingCheckDone] = useState(false); // New state to track if the pending check is complete
  const [viewedUserReviews, setViewedUserReviews] = useState<Review[]>([]);
  const { fetchReviewsForUser } = useReviews();

  useEffect(() => {
    const fetchData = async () => {
      if (!session || !session.access_token || !normalizedUserId) {
        setModalMessage('Invalid session or user ID format.');
        setModalVisible(true);
        setLoading(false);
        return;
      }

      try {
        const userProfileData = await fetchUserDetailsById(
          normalizedUserId,
          session.access_token,
        );
        viewSetUserProfile(userProfileData);
        const reviews = await fetchReviewsForUser(normalizedUserId); // Fetch reviews for the viewed user
        setViewedUserReviews(reviews);
      } catch (error) {
        setModalMessage('Failed to load user details or reviews');
        setModalVisible(true);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [normalizedUserId, session]);

  useEffect(() => {
    const checkPendingStatus = async () => {
      if (session && viewedUserProfile) {
        const pendingStatus = await fetchFriendships(
          viewedUserProfile.id,
          FriendshipStatus.PENDING,
          session.access_token,
        );
        setIsRequestPending(
          pendingStatus?.some(
            (f) =>
              (f.requester.id === userProfile.id &&
                f.addressee.id === viewedUserProfile.id) ||
              (f.addressee.id === userProfile.id &&
                f.requester.id === viewedUserProfile.id),
          ) ?? false,
        );
        setPendingCheckDone(true); // Mark the pending check as done
      }
    };

    if (viewedUserProfile) {
      checkPendingStatus();
    }
  }, [viewedUserProfile, session]);

  const handleSendFriendRequest = async () => {
    if (!viewedUserProfile || !session) {
      setModalMessage('User profile is not loaded or session is expired.');
      setModalVisible(true);
      return;
    }

    const result = await handleFriendRequest(
      'request',
      viewedUserProfile.id,
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
      fromUserId: viewedUserProfile?.id,
      toUserId: normalizedUserId,
    });

    if (!viewedUserProfile || !session) {
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
        viewedUserProfile.id,
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
      viewedUserProfile.id,
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

  if (loading || !pendingCheckDone) {
    // Also wait for pending check to complete before rendering
    return <Text>Loading...</Text>;
  }

  if (!viewedUserProfile) {
    return <Text>User not found.</Text>;
  }

  console.log(viewedUserProfile.id);
  console.log(viewedUserProfile);

  return (
    <View style={styles.container}>
      <SimpleModal
        message={modalMessage}
        visible={modalVisible}
        onClose={handleCloseModal}
      />
      <Text style={styles.title}>User Profile: {viewedUserProfile?.name}</Text>
      <Text>Email: {viewedUserProfile?.email}</Text>
      {viewedUserReviews.length > 0 ? (
        <ReviewsList reviews={viewedUserReviews} />
      ) : (
        <Text style={styles.emptyText}>No reviews found.</Text>
      )}
      <View style={styles.actionContainer}>
        {isRequestPending ? (
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
      </View>
    </View>
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
  actionContainer: {
    marginTop: 20, // Add some space above the action buttons
  },
});

export default UserProfilePage;
