import { Text, View } from '@/components/Themed';
import React, { useEffect, useState } from 'react';
import { Link, Redirect, Stack } from 'expo-router';
import { supabase } from '../../lib/supabase-client';
import { Session } from '@supabase/supabase-js';
import { useAuth } from '@/context/auth';
import { fetchAllReviews } from '@/services/services';
import { useReviews } from '@/context/ReviewContext';

const Feed = () => {
  const { session } = useAuth();
  const { reviews, loading, error, fetchGeneralReviews } = useReviews();

  useEffect(() => {
    fetchGeneralReviews();
  }, [fetchGeneralReviews]);

  if (loading) {
    return <Text>Loading...</Text>; // Display a loading indicator
  }

  if (error) {
    return <Text>Error: {error}</Text>; // Display error message
  }

  return (
    <View>
      <Text style={{ fontSize: 24, fontWeight: 'bold' }}>Feed</Text>
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

export default Feed;
