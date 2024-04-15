import { Brewery, Review, ApiResponse } from '../types/types';
import { supabase } from '../lib/supabase-client';

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
    const response = await fetch(
      `http://localhost:8080/api/reviews/brewery/${breweryId}`,
    );
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

// export const sendTokenToBackend = async (token: string) => {
//   try {
//     await fetch(`${BASE_URL}/auth/token`, {
//       method: 'POST',
//       headers: {
//         Authorization: `Bearer ${token}`,
//         'Content-Type': 'application/json',
//       },
//       credentials: 'include', // Necessary for cookies to be handled correctly in web environments
//     });
//   } catch (error) {
//     console.error('Error sending token to backend:', error);
//   }
// };
