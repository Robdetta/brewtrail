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
  const [friends, setFriends] = React.useState<Friendship[]>([]);

  React.useEffect(() => {
    const loadFriends = async () => {
      const fetchedFriends = await fetchFriendships(
        userId,
        FriendshipStatus.ACCEPTED,
        token, // You may need to replace 'ACCEPTED' with FriendshipStatus.ACCEPTED if it's defined as such
      );
      if (fetchedFriends) {
        setFriends(fetchedFriends);
      }
    };

    loadFriends();
  }, [userId, token]);

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
