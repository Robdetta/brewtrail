// FriendsContext.js
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './auth';
import {
  fetchFriendships,
  sendFriendRequest,
  acceptFriendRequest,
  rejectFriendRequest,
  searchUsers,
} from '@/services/services';
import { Friendship, FriendshipStatus, User } from '@/types/types';

interface FriendsContextType {
  friends: Friendship[];
  setFriends: React.Dispatch<React.SetStateAction<Friendship[]>>;
  handleFriendRequest: (
    action: 'request' | 'accept' | 'reject',
    requesterId: number,
    addresseeId: number,
    addToPendingRequests?: boolean,
  ) => Promise<string | Friendship | null>;
  searchResults: User[];
  setSearchResults: React.Dispatch<React.SetStateAction<User[]>>;
  handleSearchUsers: (searchTerm: string) => Promise<void>;
  loadFriends: (
    userId: number,
    status: FriendshipStatus,
    token: string,
  ) => Promise<void>;
  isFriend: (userId: number) => boolean;
  addPendingRequest: (userId: number) => void;
  removePendingRequest: (userId: number) => void;
  pendingRequests: number[];
  isPending: (userId: number) => boolean;
}

const FriendsContext = createContext<FriendsContextType>(null!); // Use null! to assert non-null at initialization

export const useFriends = () => useContext(FriendsContext);

export const FriendsProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const { session, userProfile } = useAuth();
  const [friends, setFriends] = useState<Friendship[]>([]);
  const [searchResults, setSearchResults] = useState<User[]>([]);
  const [pendingRequests, setPendingRequests] = useState<number[]>([]);

  useEffect(() => {
    if (session && session.access_token && userProfile) {
      loadFriends(
        userProfile.id,
        FriendshipStatus.ACCEPTED,
        session.access_token,
      );
    }
  }, [session, userProfile]);

  const loadFriends = async (
    userId: number,
    status: FriendshipStatus,
    token: string,
  ) => {
    const fetchedFriends = await fetchFriendships(userId, status, token);
    setFriends(fetchedFriends || []);
  };

  const handleFriendRequest = async (
    action: 'request' | 'accept' | 'reject',
    requesterId: number, // For 'request' and 'accept', this should be the ID of the user initiating or accepting.
    requestId: number, // For 'reject' (or unfriend), this should be the actual ID of the friendship request.
    addToPendingRequests: boolean = true,
  ): Promise<string | Friendship | null> => {
    const token = session?.access_token || '';
    let result: string | Friendship | null = null;

    try {
      if (addToPendingRequests && action === 'request') {
        addPendingRequest(requesterId); // Only add to pending when making a new friend request.
      }

      switch (action) {
        case 'request':
          result = await sendFriendRequest(token, requesterId);
          break;
        case 'accept':
          result = await acceptFriendRequest(token, requestId); // requestId is used because it should be the ID of the friendship.
          if (result === 'Success') {
            removePendingRequest(requestId);
          }
          break;
        case 'reject':
          result = await rejectFriendRequest(token, requestId); // Use requestId for unfriending.
          if (result && !addToPendingRequests) {
            removePendingRequest(requestId); // Remove from pending requests if needed.
            loadFriends(userProfile.id, FriendshipStatus.ACCEPTED, token); // Refresh friends list after unfriend
          }
          break;
      }

      // Optionally, refresh the friends list after any action.
      loadFriends(userProfile.id, FriendshipStatus.ACCEPTED, token); // Assuming ALL can fetch every status type.
    } catch (error) {
      console.error(`Error processing friend request (${action}):`, error);
    }
    return result;
  };

  const addPendingRequest = (userId: number) => {
    console.log('Adding pending request:', userId);
    setPendingRequests((prev) => [...prev, userId]);
  };

  const removePendingRequest = (userId: number) => {
    console.log('removing pending request:', userId);
    setPendingRequests((prev) => prev.filter((id) => id !== userId));
  };

  const isFriend = (userId: number): boolean => {
    return friends.some(
      (friend) =>
        (friend.requester.id === userId || friend.addressee.id === userId) &&
        friend.status === FriendshipStatus.ACCEPTED,
    );
  };

  const isPending = (userId: number): boolean => {
    return pendingRequests.includes(userId); // assuming pendingRequests is a Set for efficiency
  };

  const handleSearchUsers = async (searchTerm: string) => {
    const results = await searchUsers(searchTerm, session?.access_token || '');
    setSearchResults(results || []);
  };

  return (
    <FriendsContext.Provider
      value={{
        friends,
        setFriends,
        handleFriendRequest,
        searchResults,
        setSearchResults,
        handleSearchUsers,
        loadFriends,
        isFriend,
        addPendingRequest,
        removePendingRequest,
        pendingRequests,
        isPending,
      }}
    >
      {children}
    </FriendsContext.Provider>
  );
};
