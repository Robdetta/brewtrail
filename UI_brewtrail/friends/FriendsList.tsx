import * as React from 'react';
import { fetchFriendships } from '@/services/services';
import { Friendship, FriendshipStatus } from '@/types/types';
import { useAuth } from '@/context/auth';
import { Redirect } from 'expo-router';

interface Friend {
  id: number;
  name: string;
  status: string;
}

interface FriendsListProps {
  userId: number;
  token: string;
}

const FriendsListComponent: React.FC<FriendsListProps> = ({
  userId,
  token,
}) => {
  const { session, userProfile } = useAuth();
  const [friends, setFriends] = React.useState<Friendship[]>([]);

  if (!session) {
    // Redirect to the login screen if the user is not authenticated
    return <Redirect href='/(modals)/login' />;
  }

  React.useEffect(() => {
    if (session && session.access_token && userProfile?.id) {
      const loadFriends = async () => {
        const fetchedFriends = await fetchFriendships(
          userProfile.id,
          FriendshipStatus.ACCEPTED, // You may need to replace 'ACCEPTED' with FriendshipStatus.ACCEPTED if it's defined as such
          session.access_token,
        );
        if (fetchedFriends) {
          setFriends(fetchedFriends);
        }
      };

      loadFriends();
    }
  }, [session, userProfile?.id]);

  return (
    <ul>
      {friends.map((friend) => (
        <li key={friend.id}>
          <a href={`/userProfile/${friend.requester.id}`}>
            {friend.requester.name} - {friend.status}
          </a>
        </li>
      ))}
    </ul>
  );
};

export default FriendsListComponent;
