import { View, Text } from 'react-native';
import React, { useEffect, useState } from 'react';
import { useAuth } from '@/context/auth';
import { Redirect } from 'expo-router';

const BASE_URL = 'http://localhost:8080/api';

const Page = () => {
  const { session } = useAuth();
  const [reviews, setReviews] = useState([]);

  const fetchReviewsByCurrentUser = async () => {
    if (!session) {
      console.error('No session found');
      return;
    }
    try {
      const token = session.access_token; // Ensure the token is correctly retrieved
      const response = await fetch(`${BASE_URL}/user/reviews`, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch reviews');
      }

      const data = await response.json();
      setReviews(data);
    } catch (error) {
      console.error('Error fetching reviews:', error);
    }
  };

  useEffect(() => {
    if (session?.access_token) {
      fetchReviewsByCurrentUser();
    }
  }, [session?.access_token]); // Depend on access_token for changes

  if (!session) {
    // Redirect to the login screen if the user is not authenticated
    return <Redirect href='/(modals)/login' />;
  }

  return (
    <View>
      <Text style={{ fontSize: 24, fontWeight: 'bold' }}>Your Reviews</Text>
      {reviews.length > 0 ? (
        reviews.map((review, index) => (
          <View
            key={index}
            style={{ padding: 10 }}
          >
            <Text>Rating: {review.rating}</Text>
            <Text>Comment: {review.comment}</Text>
          </View>
        ))
      ) : (
        <Text>No reviews found.</Text>
      )}
    </View>
  );
};

export default Page;
