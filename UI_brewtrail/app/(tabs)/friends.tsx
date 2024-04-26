import { Redirect } from 'expo-router';
import { View, Text, StyleSheet } from 'react-native';
import * as React from 'react';
import { useAuth } from '@/context/auth';
import { fetchFriendships, searchUsers } from '@/services/services';
import { Friendship, FriendshipStatus } from '@/types/types';
import SearchUsers from '@/friends/SearchUsers';
import FriendsList from '@/friends/FriendsList';

const FriendsTab = () => {
  const { session, userProfile } = useAuth();

  if (!session) {
    return <Redirect href='/(modals)/login' />;
  }

  const userId = userProfile.id;
  const token = session.access_token;

  if (!userId || !token) {
    return <Text>Error: Session is missing user details.</Text>;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Friends</Text>
      <SearchUsers />
      <FriendsList
        userId={userId}
        token={token}
      />
      {/* <FriendManagement />
      <FriendsFeed /> */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  header: {
    fontSize: 22,
    fontWeight: 'bold',
  },
});

export default FriendsTab;
