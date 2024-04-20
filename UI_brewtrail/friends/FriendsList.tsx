import * as React from 'react';
import {
  fetchFriendships,
  sendFriendRequest,
  acceptFriendRequest,
  rejectFriendRequest,
} from '@/services/services';
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
        token,
      );
      if (fetchedFriends) {
        setFriends(fetchedFriends);
      }
    };

    loadFriends();
  }, [userId, token]);

  // Handling friend request actions
  const handleRequestAction = async (
    action: 'send' | 'accept' | 'reject',
    targetId: number,
  ) => {
    if (action === 'send') {
      await sendFriendRequest(token, targetId);
    } else if (action === 'accept') {
      await acceptFriendRequest(token, targetId);
    } else if (action === 'reject') {
      await rejectFriendRequest(token, targetId);
    }
    // Reload friend list to reflect updated status
    loadFriends();
  };

  return (
    <ul>
      {friends.map((friend) => (
        <li key={friend.id}>
          <a href={`/userProfile/${friend.requester.id}`}>
            {friend.requester.name} - {friend.status}
          </a>
          {friend.status === 'PENDING' && (
            <>
              <button onClick={() => handleRequestAction('accept', friend.id)}>
                Accept
              </button>
              <button onClick={() => handleRequestAction('reject', friend.id)}>
                Reject
              </button>
            </>
          )}
          {friend.status === 'NONE' && (
            <button onClick={() => handleRequestAction('send', friend.id)}>
              Send Request
            </button>
          )}
        </li>
      ))}
    </ul>
  );
};

export default FriendsListComponent;
function loadFriends() {
  throw new Error('Function not implemented.');
}
