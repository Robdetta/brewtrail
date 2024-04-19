// FriendsContext.js
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './auth';
import {
  fetchFriendships,
  manageFriendRequest,
  searchUsers,
} from '@/services/services';
import { Friendship, FriendshipStatus, User } from '@/types/types';

const FriendsContext = createContext(
  {} as {
    friends: Friendship[];
    setFriends: React.Dispatch<React.SetStateAction<Friendship[]>>;
    handleFriendRequest: (
      action: 'send' | 'accept' | 'reject',
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
    setFriends(fetchedFriends || []);
  };

  const handleFriendRequest = async (
    action: 'send' | 'accept' | 'reject',
    requesterId: number,
    addresseeId: number,
  ) => {
    return await manageFriendRequest(
      action,
      requesterId,
      addresseeId,
      session?.access_token || '',
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
      }}
    >
      {children}
    </FriendsContext.Provider>
  );
};
