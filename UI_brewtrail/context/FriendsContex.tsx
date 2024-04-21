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

const FriendsContext = createContext(
  {} as {
    friends: Friendship[];
    setFriends: React.Dispatch<React.SetStateAction<Friendship[]>>;
    handleFriendRequest: (
      action: 'request' | 'accept' | 'reject',
      requesterId: number,
      addresseeId: number,
    ) => Promise<string | null>;
    searchResults: User[];
    setSearchResults: React.Dispatch<React.SetStateAction<User[]>>;
    handleSearchUsers: (searchTerm: string) => Promise<void>;
    loadFriends: (
      userId: number,
      status: FriendshipStatus,
      token: string,
    ) => Promise<void>;
  },
);

export const useFriends = () => useContext(FriendsContext);

export const FriendsProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const { session, userProfile } = useAuth();
  const [friends, setFriends] = useState<Friendship[]>([]);
  const [searchResults, setSearchResults] = useState<User[]>([]);

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
    const pendingRequests = await fetchFriendships(
      userId,
      FriendshipStatus.PENDING,
      token,
    );
    const acceptedFriends = await fetchFriendships(
      userId,
      FriendshipStatus.ACCEPTED,
      token,
    );
    const combinedFriends = [
      ...(acceptedFriends || []),
      ...(pendingRequests || []),
    ];
    setFriends(combinedFriends);
  };

  const handleFriendRequest = async (
    action: 'request' | 'accept' | 'reject',
    requesterId: number,
    addresseeId: number,
  ) => {
    const token = session?.access_token || '';
    try {
      let result;
      switch (action) {
        case 'request':
          result = await sendFriendRequest(token, addresseeId);
          break;
        case 'accept':
          result = await acceptFriendRequest(token, requesterId);
          break;
        case 'reject':
          result = await rejectFriendRequest(token, requesterId);
          break;
        default:
          throw new Error('Invalid action');
      }
      // Optionally, refresh friends list here
      loadFriends(userProfile.id, FriendshipStatus.ACCEPTED, token);
      return result ? 'Success' : 'Failure';
    } catch (error) {
      console.error(`Error processing friend request (${action}):`, error);
      return null;
    }
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
      }}
    >
      {children}
    </FriendsContext.Provider>
  );
};
