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
  userId: number, // Add userId as a parameter
  rating: number,
  comment: string,
) => {
  const url = `${BASE_URL}/reviews`; // Adjust the endpoint as needed based on your backend API
  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        // Include any other headers your API requires, such as authentication tokens
      },
      body: JSON.stringify({
        openBreweryDbId: breweryId, // Ensure the field name matches what your backend expects
        userId, // Include userId in the request body
        rating,
        comment,
        // Include 'userId' if necessary, or handle user identification on the backend
      }),
    });

    if (!response.ok) {
      const errorBody = await response.text(); // Or response.json() if the response is in JSON format
      console.error(
        'Failed to submit review, server responded with:',
        response.status,
        errorBody,
      );
      throw new Error(
        `Failed to submit review: ${response.status} ${errorBody}`,
      );
    }
    console.log('Submitting review to URL:', url);
    console.log(
      'Request body:',
      JSON.stringify({ openBreweryDbId: breweryId, rating, comment }),
    );

    const data = await response.json();
    console.log('Review submitted successfully:', data);
    return data; // Return the response data for further handling if needed
  } catch (error) {
    console.error('Error submitting review:', error);
    throw error; // Rethrow the error for handling in the component
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

export const sendTokenToBackend = async (token: string) => {
  try {
    await fetch(`${BASE_URL}/auth/token`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      credentials: 'include', // Necessary for cookies to be handled correctly in web environments
    });
  } catch (error) {
    console.error('Error sending token to backend:', error);
  }
};
