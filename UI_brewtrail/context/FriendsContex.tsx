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
    requesterId: number,
    addresseeId: number,
    addToPendingRequests: boolean = true, // Add this parameter with a default value
  ): Promise<string | Friendship | null> => {
    const token = session?.access_token || '';
    let result: string | Friendship | null = null;

    try {
      if (addToPendingRequests && action !== 'accept') {
        addPendingRequest(addresseeId); // Add pending request only if specified and not accepting
      }

      switch (action) {
        case 'request':
          result = await sendFriendRequest(token, addresseeId);
          break;
        case 'accept':
          result = await acceptFriendRequest(token, requesterId);
          if (result === 'Success') {
            removePendingRequest(requesterId);
          }
          break;
        case 'reject':
          result = await rejectFriendRequest(token, requesterId);
          break;
      }

      loadFriends(userProfile.id, FriendshipStatus.ACCEPTED, token);
    } catch (error) {
      console.error(`Error processing friend request (${action}):`, error);
    }
    console.log('Frontend Response Message:', result);
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

  const parseResponse = (
    response: string | null,
  ): Friendship | string | null => {
    if (response) {
      try {
        return JSON.parse(response); // Parse the JSON response
      } catch (error) {
        console.error('Error parsing response:', error);
        return null;
      }
    } else {
      return null;
    }
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
