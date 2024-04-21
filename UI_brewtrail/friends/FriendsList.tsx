import * as React from 'react';
import {
  acceptFriendRequest,
  rejectFriendRequest,
  fetchFriendships,
} from '@/services/services';
import { Friendship, FriendshipStatus } from '@/types/types';
import { useAuth } from '@/context/auth';

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
  const { userProfile } = useAuth();
  const [friends, setFriends] = React.useState<Friendship[]>([]);
  const [loading, setLoading] = React.useState(false);
  const [message, setMessage] = React.useState('');

  React.useEffect(() => {
    const loadFriends = async () => {
      setLoading(true);
      try {
        const fetchedFriends =
          (await fetchFriendships(userId, FriendshipStatus.ACCEPTED, token)) ||
          [];
        const fetchedPendingRequests =
          (await fetchFriendships(userId, FriendshipStatus.PENDING, token)) ||
          [];
        const transformedFriends = transformFriendshipsData(
          [...fetchedFriends, ...fetchedPendingRequests],
          userProfile.id,
        );
        setFriends(transformedFriends);
      } catch (error) {
        console.error('Error loading friendships:', error);
      }
      setLoading(false);
    };

    loadFriends();
  }, [userId, token, userProfile.id]);

  const handleRequestAction = async (
    action: 'accept' | 'reject',
    requestId: number,
  ) => {
    setLoading(true);
    try {
      const result = await (action === 'accept'
        ? acceptFriendRequest(token, requestId)
        : rejectFriendRequest(token, requestId));
      if (result === 'Success') {
        setMessage('Action was successful!');
        setTimeout(() => setMessage(''), 5000); // Clear message after 5 seconds
      } else {
        setMessage('Failed to perform the action.');
      }
    } catch (error) {
      console.error('Error processing friend request:', error);
      setMessage(`Failed to perform the action: ${error}`);
    }
    setLoading(false);
  };

  function transformFriendshipsData(
    friendships: Friendship[],
    currentUserId: number,
  ) {
    return friendships.map((friendship) => ({
      ...friendship,
      friendId:
        friendship.requester.id === currentUserId
          ? friendship.addressee.id
          : friendship.requester.id,
      friendName:
        friendship.requester.id === currentUserId
          ? friendship.addressee.name
          : friendship.requester.name,
    }));
  }

  return (
    <>
      {loading && <p>Loading...</p>}
      {message && <p>{message}</p>}

      <h2>Accepted Friends</h2>
      <ul>
        {friends
          .filter((friend) => friend.status === FriendshipStatus.ACCEPTED)
          .map((friend) => (
            <li key={friend.id}>
              <a href={`/userProfile/${friend.friendId}`}>
                {friend.friendName} - {friend.status}
              </a>
            </li>
          ))}
      </ul>
      <h2>Pending Requests</h2>
      <ul>
        {friends
          .filter(
            (friend) =>
              friend.status === FriendshipStatus.PENDING &&
              friend.addressee === userId,
          )
          .map((friend) => (
            <li key={friend.id}>
              <a href={`/userProfile/${friend.friendId}`}>
                {friend.friendName} - Pending
              </a>
              <button onClick={() => handleRequestAction('accept', friend.id)}>
                Accept
              </button>
              <button onClick={() => handleRequestAction('reject', friend.id)}>
                Reject
              </button>
            </li>
          ))}
      </ul>
    </>
  );
};

export default FriendsListComponent;
