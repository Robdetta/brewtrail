import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  Button,
  TextInput,
  StyleSheet,
  ScrollView,
} from 'react-native';
import {
  fetchBreweryDetails,
  fetchReviewsForBrewery,
  submitReview,
} from '../services/BreweryService';

const BreweryDetailsScreen = ({ route, navigation }) => {
  const { brewery } = route.params;
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const fetchedReviews = await fetchReviewsForBrewery(brewery.id);
        setReviews(fetchedReviews);
      } catch (error) {
        console.error('Error fetching reviews:', error);
      }
    };

    fetchReviews();
  }, [brewery.id]);

  const handleWriteReview = () => {
    navigation.navigate('Review', {
      breweryId: brewery.id,
      onGoBack: () => fetchReviews(), // Callback to refetch reviews after submitting a new one
    });
  };

  return (
    <ScrollView style={styles.container}>
      <View>
        <Text style={styles.title}>{brewery.name}</Text>
        <Text>City: {brewery.city}</Text>
        <Text>State: {brewery.state}</Text>
        {/* Display more brewery details here */}
      </View>

      <View style={styles.reviewsSection}>
        <Text style={styles.subtitle}>Reviews</Text>
        {reviews.length > 0 ? (
          reviews.map((review, index) => (
            <View
              key={index}
              style={styles.review}
            >
              <Text>Rating: {review.rating}</Text>
              <Text>{review.comment}</Text>
            </View>
          ))
        ) : (
          <Text>No reviews yet.</Text>
        )}
      </View>

      <Button
        title='Write Review'
        onPress={handleWriteReview}
      />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  subtitle: {
    fontSize: 20,
    marginTop: 20,
    marginBottom: 10,
  },
  reviewsSection: {
    marginTop: 20,
  },
  review: {
    marginBottom: 10,
  },
  // Add styles for city, state, and other details
});

export default BreweryDetailsScreen;
