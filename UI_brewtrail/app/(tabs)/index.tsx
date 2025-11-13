import { Text, View } from '@/components/Themed';
import React, { useEffect, useState } from 'react';
import { useReviews } from '@/context/ReviewContext';
import { StyleSheet, ActivityIndicator } from 'react-native';
import ReviewsList from '@/listing/ReviewList';
import { useIsFocused } from '@react-navigation/native';

const Feed = () => {
  const isFocused = useIsFocused();
  const { generalReviews, loading, error, fetchGeneralReviews } = useReviews();
  const [sortedReviews, setSortedReviews] = useState([]);

  useEffect(() => {
    if (isFocused) {
      fetchGeneralReviews();
    }
  }, [isFocused, fetchGeneralReviews]);

  useEffect(() => {
    // Sort reviews whenever the generalReviews array changes
    const sorted = [...generalReviews].sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    );
    setSortedReviews(sorted);
  }, [generalReviews]);

  if (loading) {
    return (
      <View style={styles.centeredView}>
        <ActivityIndicator
          size='large'
          color='#0000ff'
        />
      </View>
    ); // Display a loading spinner
  }

  if (error) {
    return <Text style={styles.errorText}>Error: {error}</Text>; // Display error message
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Feed</Text>
      {sortedReviews.length > 0 ? (
        <ReviewsList reviews={sortedReviews} />
      ) : (
        <Text style={styles.emptyText}>No reviews found.</Text>
      )}
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
    textAlign: 'center',
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
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    color: 'red',
    fontSize: 14,
    textAlign: 'center',
    marginTop: 20,
  },
});

export default Feed;
