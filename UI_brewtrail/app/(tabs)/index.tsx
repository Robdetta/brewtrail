import { Text, View } from '@/components/Themed';
import React, { useEffect, useState } from 'react';
import { Link, Redirect, Stack } from 'expo-router';
import { supabase } from '../../lib/supabase-client';
import { Session } from '@supabase/supabase-js';
import { useAuth } from '@/context/auth';
import { fetchAllReviews } from '@/services/services';
import { useReviews } from '@/context/ReviewContext';
import { FlatList, StyleSheet } from 'react-native';

const Feed = () => {
  const { session } = useAuth();
  const { generalReviews, loading, error, fetchGeneralReviews } = useReviews();

  useEffect(() => {
    fetchGeneralReviews();
  }, [fetchGeneralReviews]);

  if (loading) {
    return <Text>Loading...</Text>; // Display a loading indicator
  }

  if (error) {
    return <Text>Error: {error}</Text>; // Display error message
  }

  const sortedReviews = generalReviews.sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Feed</Text>
      <FlatList
        data={sortedReviews}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.ratingText}>Rating: {item.rating}</Text>
            <Text style={styles.commentText}>Comment: {item.comment}</Text>
            <Text style={styles.breweryText}>Brewery: {item.breweryName}</Text>
            <Text style={styles.userText}>Reviewed by: {item.userName}</Text>
            <Text style={styles.dateText}>
              Posted: {new Date(item.createdAt).toLocaleDateString()}
            </Text>
          </View>
        )}
        ListEmptyComponent={
          <Text style={styles.emptyText}>No reviews found.</Text>
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f5f5', // Background color for the feed
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  card: {
    backgroundColor: '#ffd700', // Beer color for the cards
    padding: 20,
    marginBottom: 20,
    borderRadius: 10,
  },
  ratingText: {
    fontSize: 16,
    marginBottom: 5,
  },
  commentText: {
    fontSize: 16,
    marginBottom: 5,
  },
  breweryText: {
    fontSize: 16,
    marginBottom: 5,
  },
  userText: {
    fontSize: 16,
    marginBottom: 5,
  },
  dateText: {
    fontSize: 16,
    marginBottom: 5,
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 20,
    fontSize: 16,
  },
});

export default Feed;
