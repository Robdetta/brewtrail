import * as React from 'react';
import {
  acceptFriendRequest,
  rejectFriendRequest,
  fetchFriendships,
  fetchPendingFriendRequests,
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
  const [pendingRequests, setPendingRequests] = React.useState<Friendship[]>(
    [],
  );

  React.useEffect(() => {
    const loadFriends = async () => {
      const fetchedFriends = await fetchFriendships(
        userId,
        FriendshipStatus.ACCEPTED,
        token, // You may need to replace 'ACCEPTED' with FriendshipStatus.ACCEPTED if it's defined as such
      );
      const fetchedPendingRequests = await fetchFriendships(
        userId,
        FriendshipStatus.PENDING,
        token,
      );
      if (fetchedFriends) {
        setFriends(fetchedFriends);
        setPendingRequests(fetchedPendingRequests || []);
      }
    };

    loadFriends();
  }, [userId, token]);

  return (
    <>
      <h2>Accepted Friends</h2>
      <ul>
        {friends.map((friend) => (
          <li key={friend.id}>
            <a
              href={`/userProfile/${friend.requester.id}`}
              style={{ cursor: 'pointer' }}
            >
              {friend.requester.name} - {friend.status}
            </a>
          </li>
        ))}
      </ul>
      <h2>Pending Requests</h2>
      <ul>
        {pendingRequests.map((request) => (
          <li key={request.id}>
            <a
              href={`/userProfile/${request.requester.id}`}
              style={{
                cursor: 'pointer',
                textDecoration: 'none',
                color: 'blue',
              }}
            >
              {request.requester.name} - {request.status}
            </a>
            {/* Implement accept request functionality */}
            <button onClick={() => acceptFriendRequest(token, request.id)}>
              Accept
            </button>
          </li>
        ))}
      </ul>
    </>
  );
};

export default FriendsListComponent;
