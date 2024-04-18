import { Redirect } from 'expo-router';
import { View, Text } from 'react-native';
import * as React from 'react';
import { useAuth } from '@/context/auth';
import { fetchFriendships } from '@/services/services';
import { Friendship, FriendshipStatus } from '@/types/types';

const Friends = ({ userId, token }: { userId: number; token: string }) => {
  const { session, userProfile } = useAuth();
  const [friends, setFriends] = React.useState<Friendship[]>([]);
  if (!session) {
    // Redirect to the login screen if the user is not authenticated
    return <Redirect href='/(modals)/login' />;
  }

  React.useEffect(() => {
    if (session && session.access_token) {
      const loadFriends = async () => {
        const fetchedFriends = await fetchFriendships(
          userProfile?.id, // Assuming the user ID is needed and available here
          FriendshipStatus.ACCEPTED,
          session.access_token,
        );
        if (fetchedFriends) {
          setFriends(fetchedFriends);
        }
      };
      loadFriends();
    }
  }, [session]);
  // If authenticated, show the Friends content

  return (
    <div>
      {friends.map((friend) => (
        <div key={friend.id}>
          <p>
            {friend.addressee.name} ({friend.status})
          </p>
        </div>
      ))}
    </div>
  );
};
export default Friends;
