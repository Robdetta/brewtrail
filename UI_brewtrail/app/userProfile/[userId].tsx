import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Button, ScrollView } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { fetchUserReviews, fetchUserDetailsById } from '@/services/services';
import { UserProfile, Review, FriendshipStatus } from '@/types/types';
import { useAuth } from '@/context/auth';
import { useFriends } from '@/context/FriendsContex';
import SimpleModal from '@/friends/FriendModal';

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
  } = useFriends();

  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  const normalizedUserId = parseInt(Array.isArray(userId) ? userId[0] : userId);

  useEffect(() => {
    console.log('normalizedUserId:', normalizedUserId);
    console.log('pendingRequests:', pendingRequests);
    console.log('friends:', friends);
    if (!session?.access_token || !normalizedUserId) {
      setModalMessage('Invalid user ID format or missing authentication token');
      setModalVisible(true);
      setLoading(false);
      return;
    }

    const fetchData = async () => {
      try {
        console.log('Fetching user details...');
        const userProfileData = await fetchUserDetailsById(
          normalizedUserId,
          session.access_token,
        );
        console.log('User profile data:', userProfileData);
        setUserProfile(userProfileData);
        const userReviews = await fetchUserReviews(
          normalizedUserId,
          session.access_token,
        );
        setReviews(userReviews || []);
      } catch (e) {
        console.log('Failed to load user details:', e);
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

    console.log('Sending friend request...');
    addPendingRequest(normalizedUserId); // Add pending request
    const result = await handleFriendRequest(
      'request',
      userProfile.id,
      normalizedUserId,
      false, // Do not add to pending requests
    );
    if (result === 'Friend request sent.') {
      setModalMessage('Friend request sent successfully!');
      // loadFriends(
      //   userProfile.id,
      //   FriendshipStatus.ACCEPTED,
      //   session.access_token,
      // );
    } else {
      setModalMessage('Failed to send friend request');
      removePendingRequest(normalizedUserId);
    }
    setModalVisible(true);
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
      {isPending(normalizedUserId) ? (
        <Text style={styles.pendingRequest}>Request Pending...</Text>
      ) : (
        !isFriend(normalizedUserId) && (
          <Button
            title='Send Friend Request'
            onPress={handleSendFriendRequest}
          />
        )
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
  pendingRequest: {
    color: 'orange',
    fontSize: 18,
    marginTop: 10,
  },
});

export default UserProfilePage;
