import { supabase } from '../lib/supabase-client';
import {
  UserProfile,
  Friendship,
  FriendshipStatus,
  User,
  Review,
  Brewery,
  ApiResponse,
} from '../types/types';

const BASE_URL = process.env.EXPO_PUBLIC_BASE_URL as string;

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

    const responseBody = await response.json(); // Change from json() to text() to see raw response
    // console.log('Raw response:', responseBody);

    if (!response.ok) {
      throw new Error(
        `A review with the same brewery and user already exists.`,
      );
    }

    return responseBody; // Manually parse the JSON after checking
  } catch (error) {
    // console.error('Error submitting review:', error);
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

export const updateReview = async (
  reviewId: number,
  token: string,
  reviewData: { rating: number; comment: string; openBreweryDbId: string },
): Promise<Review | null> => {
  const url = `${BASE_URL}/reviews/${reviewId}`;
  try {
    const response = await fetch(url, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(reviewData),
    });

    if (!response.ok) {
      const errorBody = await response.text();
      console.error(
        `Failed to update review: ${response.status}, ${errorBody}`,
      );
      throw new Error(
        `Failed to update review: ${response.status}, ${errorBody}`,
      );
    }

    const updatedReview = await response.json();
    console.log('Update response:', updatedReview); // Log the response from the server
    return updatedReview;
  } catch (error) {
    console.error('Error updating review:', error);
    return null;
  }
};

export const deleteReview = async (
  reviewId: number,
  token: string,
): Promise<void> => {
  const url = `${BASE_URL}/reviews/${reviewId}`;
  try {
    const response = await fetch(url, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const errorBody = await response.text();
      throw new Error(
        `Failed to delete review: ${response.status}, ${errorBody}`,
      );
    }
    console.log('Review deleted successfully');
  } catch (error) {
    console.error('Error deleting review:', error);
    throw error; // rethrow to handle it in the component
  }
};

export const sendFriendRequest = async (
  token: string,
  addresseeId: number,
): Promise<string | null> => {
  const url = `${BASE_URL}/friendships/request?addresseeId=${addresseeId}`; // Ensure addresseeId is included in the URL as a query parameter
  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });
    const data = await response.json(); // Get the response as text

    if (!response.ok) {
      throw new Error(
        `Failed to send friend request: ${response.status}, body: ${
          data.error || data.message
        }`,
      );
    }
    return data.message;
  } catch (error) {
    console.error('Error sending friend request:', error);
    return null;
  }
};

export const acceptFriendRequest = async (
  token: string,
  requestId: number,
): Promise<string | null> => {
  const url = `${BASE_URL}/friendships/accept/${requestId}`;
  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });
    if (!response.ok) {
      const errorResponse = await response.text();
      throw new Error(
        `Failed to accept friend request: ${response.status}, body: ${errorResponse}`,
      );
    }
    const jsonResponse = await response.json();
    console.log('Response Status:', jsonResponse);
    return jsonResponse.message; // Assuming the message is in the response JSON
  } catch (error) {
    console.error('Error accepting friend request:', error);
    return null;
  }
};

export const rejectFriendRequest = async (
  token: string,
  requestId: number,
): Promise<string | null> => {
  const url = `${BASE_URL}/friendships/reject/${requestId}`;
  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });
    if (!response.ok) {
      const errorResponse = await response.text();
      throw new Error('Failed to reject friend request');
    }
    const jsonResponse = await response.json();
    console.log('Response Status:', jsonResponse);
    return jsonResponse.message;
  } catch (error) {
    console.error('Error rejecting friend request:', error);
    throw error;
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

export const fetchPendingFriendRequests = async (
  userId: number,
  token: string,
) => {
  const url = `${BASE_URL}/friendships/requests?userId=${userId}&status=Pending`;
  try {
    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });
    if (!response.ok) {
      throw new Error(
        `Failed to fetch pending friend requests: ${response.status}`,
      );
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching pending friend requests:', error);
    return []; // Return an empty array in case of error to maintain component functionality
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
