import { View, Text } from 'react-native';
import React, { useEffect, useState } from 'react';
import { useAuth } from '@/context/auth';
import { Redirect } from 'expo-router';
import { useReviews } from '@/context/ReviewContext';

const BASE_URL = 'http://localhost:8080/api';

const ReviewsPage = () => {
  const { userReviews, loading, error, fetchUserReviews } = useReviews();
  const { session } = useAuth();

  useEffect(() => {
    if (session?.access_token) {
      fetchUserReviews();
    }
  }, [fetchUserReviews, session?.access_token]);

  if (!session) {
    // Redirect to the login screen if the user is not authenticated
    return <Redirect href='/(modals)/login' />;
  }

  if (loading) {
    return <Text>Loading...</Text>;
  }

  if (error) {
    return <Text>Error: {error}</Text>;
  }

  return (
    <View>
      <Text style={{ fontSize: 24, fontWeight: 'bold' }}>Your Reviews</Text>
      {userReviews.length > 0 ? (
        userReviews.map((review, index) => (
          <View
            key={index}
            style={{ padding: 10 }}
          >
            <Text>Rating: {review.rating}</Text>
            <Text>Comment: {review.comment}</Text>
            <Text>Posted: {review.datePosted?.toLocaleDateString()}</Text>
            <Text>By: {review.userName}</Text>
          </View>
        ))
      ) : (
        <Text>No reviews found.</Text>
      )}
    </View>
  );
};

export default ReviewsPage;
