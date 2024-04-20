import { Brewery, Review, ApiResponse } from '../types/types';
import { supabase } from '../lib/supabase-client';
import {
  UserProfile,
  Friendship,
  FriendshipStatus,
  User,
} from '../types/types';

const BASE_URL = 'http://localhost:8080/api';

export const searchBreweries = async (city: string, state: string) => {
  const url = `${BASE_URL}/search?city=${encodeURIComponent(
    city,
  )}&state=${encodeURIComponent(state)}`;
  try {
    const response = await fetch(url);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error:', error);
    return [];
  }
};

export const submitReview = async (
  breweryId: string,
  userId: string,
  rating: number,
  comment: string,
  token: string, // Add token as a parameter to the function
) => {
  const url = `${BASE_URL}/reviews`;
  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`, // Using the token here
      },
      body: JSON.stringify({
        openBreweryDbId: breweryId,
        userId,
        rating,
        comment,
      }),
    });

    const responseBody = await response.text(); // Change from json() to text() to see raw response
    console.log('Raw response:', responseBody);

    if (!response.ok) {
      throw new Error(
        `Failed to submit review: ${response.status} ${responseBody}`,
      );
    }

    return JSON.parse(responseBody); // Manually parse the JSON after checking
  } catch (error) {
    console.error('Error submitting review:', error);
    throw error;
  }
};

export const fetchReviewsForBrewery = async (breweryId: string) => {
  try {
    const response = await fetch(`${BASE_URL}/reviews/brewery/${breweryId}`);
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    const reviews = await response.json();
    return reviews;
  } catch (error) {
    console.error('Error fetching reviews:', error);
    return [];
  }
};

export const fetchBreweryDetails = async (breweryId: string) => {
  const url = `${BASE_URL}/breweries/${breweryId}`; // Adjust the endpoint as per your backend API
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error('Failed to fetch brewery details');
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching brewery details:', error);
    throw error;
  }
};

export const fetchAllReviews = async () => {
  const response = await fetch(`${BASE_URL}/reviews/all`);
  if (!response.ok) {
    throw new Error('Failed to fetch reviews');
  }
  return response.json();
};

export const fetchUserReviews = async (
  userId: number,
  token: string,
): Promise<Review[] | null> => {
  const url = `${BASE_URL}/users/${userId}/reviews`;
  try {
    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`, // JWT token is passed for authentication
      },
    });
    if (!response.ok) {
      const errorBody = await response.text();
      console.error(
        `Failed to fetch user reviews, status: ${response.status}, body: ${errorBody}`,
      );
      throw new Error(
        `Failed to fetch user reviews, status: ${response.status}, body: ${errorBody}`,
      );
    }
    const reviews: Review[] = await response.json();
    return reviews;
  } catch (error) {
    console.error('Error fetching user reviews:', error);
    return null;
  }
};

export const fetchUserProfile = async (
  token: string,
): Promise<UserProfile | null> => {
  const url = `${BASE_URL}/users/profile`;
  try {
    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`, // JWT token is passed for authentication
      },
    });
    if (!response.ok) {
      const errorBody = await response.text();
      console.error(
        `Failed to fetch user profile, status: ${response.status}, body: ${errorBody}`,
      );
      throw new Error(
        `Failed to fetch user profile, status: ${response.status}, body: ${errorBody}`,
      );
    }
    const userProfile: UserProfile = await response.json();
    return userProfile;
  } catch (error) {
    console.error('Error fetching user profile:', error);
    return null;
  }
};

export const fetchFriendships = async (
  userId: number,
  status: FriendshipStatus,
  token: string,
): Promise<Friendship[] | null> => {
  const url = `${BASE_URL}/friendships?userId=${userId}&status=${status}`;
  try {
    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`, // Ensure the token is passed correctly
      },
    });
    if (!response.ok) {
      const errorBody = await response.text();
      throw new Error(
        `Failed to fetch friendships, status: ${response.status}, body: ${errorBody}`,
      );
    }
    const friendships: Friendship[] = await response.json();
    return friendships;
  } catch (error) {
    console.error('Error fetching friendships:', error);
    return null;
  }
};

export const manageFriendRequest = async (
  action: 'send' | 'accept' | 'reject',
  requesterId: number,
  addresseeId: number,
  token: string,
): Promise<string | null> => {
  const url = `${BASE_URL}/friendships/${action}`;
  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ requesterId, addresseeId }),
    });
    if (!response.ok) {
      const errorBody = await response.text();
      throw new Error(
        `Failed to ${action} friend request, status: ${response.status}, body: ${errorBody}`,
      );
    }
    return 'Success';
  } catch (error) {
    console.error(`Error ${action}ing friend request:`, error);
    return null;
  }
};

export const searchUsers = async (
  searchTerm: string,
  token: string,
): Promise<User[] | null> => {
  const url = `${BASE_URL}/users/search?query=${encodeURIComponent(
    searchTerm,
  )}`;
  try {
    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`, // Ensure the token is passed correctly
      },
    });
    if (!response.ok) {
      const errorBody = await response.text();
      throw new Error(
        `Failed to search users, status: ${response.status}, body: ${errorBody}`,
      );
    }
    const users: User[] = await response.json();
    return users;
  } catch (error) {
    console.error('Error searching users:', error);
    return null;
  }
};

export const fetchUserDetailsById = async (userId: number, token: string) => {
  const url = `${BASE_URL}/users/profile/${userId}`;
  try {
    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`, // Include if authentication is required
      },
    });
    if (!response.ok) {
      const errorBody = await response.text();
      throw new Error(
        `Failed to load user details, status: ${response.status}, body: ${errorBody}`,
      );
    }
    return await response.json(); // This should match the UserProfile structure
  } catch (error) {
    console.error('Error fetching user details:', error);
    throw error;
  }
};
