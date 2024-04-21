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
    requesterId: number,
    addresseeId: number,
  ): Promise<string | Friendship | null> => {
    const token = session?.access_token || '';
    let result: string | Friendship | null = null;

    try {
      switch (action) {
        case 'request':
          addPendingRequest(addresseeId);
          result = await sendFriendRequest(token, addresseeId);
          if ((result as any)?.status === 'Success') {
            // Assuming the result has a status property indicating success
            removePendingRequest(addresseeId);
          }
          break;
        case 'accept':
          result = await acceptFriendRequest(token, requesterId);
          break;
        case 'reject':
          result = await rejectFriendRequest(token, requesterId);
          break;
      }
      loadFriends(userProfile.id, FriendshipStatus.ACCEPTED, token);
    } catch (error) {
      console.error(`Error processing friend request (${action}):`, error);
    }
    return result;
  };

  const addPendingRequest = (userId: number) => {
    setPendingRequests((prev) => [...prev, userId]);
  };

  const removePendingRequest = (userId: number) => {
    setPendingRequests((prev) => prev.filter((id) => id !== userId));
  };

  const isFriend = (userId: number): boolean => {
    return friends.some(
      (friend) =>
        (friend.requester.id === userId || friend.addressee.id === userId) &&
        friend.status === FriendshipStatus.ACCEPTED,
    );
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
      }}
    >
      {children}
    </FriendsContext.Provider>
  );
};
