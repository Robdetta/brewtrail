import * as React from 'react';
import { Friendship, FriendshipStatus } from '@/types/types';
import { useAuth } from '@/context/auth';
import { Link } from 'expo-router';
import { useFriends } from '@/context/FriendsContex';
import {
  fetchFriendships,
  acceptFriendRequest,
  rejectFriendRequest,
} from '@/services/services';
import SimpleModal from './FriendModal';
import { useNavigation } from 'expo-router';
import { ActivityIndicator } from 'react-native';

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
  const { handleFriendRequest, pendingRequests, loadFriends } = useFriends();
  const [friends, setFriends] = React.useState<Friendship[]>([]);
  const [loading, setLoading] = React.useState(false);
  const [message, setMessage] = React.useState('');
  const [modalVisible, setModalVisible] = React.useState(false);
  const [modalMessage, setModalMessage] = React.useState('');
  const { refreshFriends } = useFriends();
  const navigation = useNavigation();

  React.useEffect(() => {
    const loadFriends = async () => {
      setLoading(true);
      const unsubscribe = navigation.addListener('focus', () => {
        // This will be triggered when the user navigates to this screen
        refreshFriends(); // Refresh the friends list
      });
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
      return unsubscribe;
    };

    // Load friends when the component mounts
    loadFriends();
  }, [navigation, refreshFriends, userId, token, userProfile.id]);

  const handleRequestAction = async (
    action: 'accept' | 'reject',
    requestId: number,
  ) => {
    try {
      // // Optimistically update the UI
      // const updatedFriends = friends.map((friend) => {
      //   if (friend.id === requestId && action === 'accept') {
      //     return { ...friend, status: FriendshipStatus.ACCEPTED };
      //   } else if (friend.id === requestId && action === 'reject') {
      //     return { ...friend, status: FriendshipStatus.REJECTED }; // Assuming there's a rejected status
      //   }
      //   return friend;
      // });

      // setFriends(updatedFriends); // Set the optimistic update

      const result = await handleFriendRequest(
        action,
        userProfile.id,
        requestId,
        false,
      );

      if (result && typeof result === 'string') {
        setModalMessage(`Friend request ${action}ed successfully!`);
        setModalVisible(true);
      } else if (result && typeof result === 'object') {
        setModalMessage(result.message || 'Action completed with warnings.');
        setModalVisible(true);
      } else {
        setModalMessage('Failed to perform the action.');
        setModalVisible(true);
      }
    } catch (error) {
      const errorMessage = (error as Error).message;

      setMessage(`Failed to ${action} the friend request: ${errorMessage}`);
      setModalMessage(errorMessage);
      setModalVisible(true);

      // If error, revert to the original friends state
      loadFriends(userProfile.id, FriendshipStatus.ACCEPTED, token);
    }
    console.log(
      'Action:',
      action,
      'Request ID:',
      requestId,
      'User ID:',
      userProfile.id,
    );
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
      <SimpleModal
        message={modalMessage}
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
      />
      {loading ? (
        <ActivityIndicator
          size='large'
          color='#0000ff'
        /> // Display a loading spinner
      ) : (
        <>
          <h2>Accepted Friends</h2>
          <ul>
            {friends
              .filter((friend) => friend.status === FriendshipStatus.ACCEPTED)
              .map((friend) => (
                <li key={friend.id}>
                  <Link href={`/userProfile/${friend.friendId}`}>
                    {friend.friendName}
                  </Link>
                </li>
              ))}
          </ul>

          <h2>Pending Requests</h2>
          <ul>
            {friends
              .filter(
                (friend) =>
                  friend.status === FriendshipStatus.PENDING &&
                  friend.addressee.id === userId,
              )
              .map((friend) => (
                <li key={friend.id}>
                  <Link href={`/userProfile/${friend.friendId}`}>
                    {friend.friendName} - Pending
                  </Link>
                  <button
                    onClick={() => handleRequestAction('accept', friend.id)}
                  >
                    Accept
                  </button>
                  <button
                    onClick={() => handleRequestAction('reject', friend.id)}
                  >
                    Reject
                  </button>
                </li>
              ))}
          </ul>
        </>
      )}
    </>
  );
};

export default FriendsListComponent;
