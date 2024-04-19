import React, { useEffect, useState } from 'react';
import { View, Text, Button, StyleSheet, Linking } from 'react-native';
import {
  fetchBreweryDetails,
  fetchReviewsForBrewery,
} from '@/services/services';
import { useLocalSearchParams } from 'expo-router';
import ReviewModal from '../(modals)/reviewModal';
import { useReviews } from '@/context/ReviewContext';
import { Review } from '@/types/types';

interface Brewery {
  name: string;
  city: string;
  stateProvince: string;
  breweryType: string;
  address1: string;
  phone?: string;
  websiteUrl?: string;
}

// interface Review {
//   rating: number;
//   comment: string;
// }

const BreweryDetailsScreen = () => {
  const { breweryId } = useLocalSearchParams();
  const [brewery, setBrewery] = useState<Brewery | null>(null);
  const { breweryReviews, addReview, fetchBreweryReviews } = useReviews();
  const [modalVisible, setModalVisible] = useState(false);
  const breweryIdString = Array.isArray(breweryId) ? breweryId[0] : breweryId;

  useEffect(() => {
    if (breweryIdString) {
      fetchBreweryDetails(breweryIdString).then(setBrewery);
      fetchBreweryReviews(breweryIdString);
    }
  }, [breweryIdString, fetchBreweryReviews]);

  const reviews = breweryReviews[breweryIdString] || [];

  console.log(`Brewery ID from URL: ${breweryId}`);

  if (!breweryId) {
    return <Text>No brewery ID provided</Text>;
  }

  const openURL = (url: string) => {
    Linking.openURL(url).catch((err) =>
      console.error('An error occurred', err),
    );
  };

  return (
    <View style={styles.container}>
      {brewery && (
        <View>
          <Text style={styles.title}>{brewery.name}</Text>
          <Text>City: {brewery.city}</Text>
          <Text>State: {brewery.stateProvince}</Text>
          <Text>Type: {brewery.breweryType}</Text>
          <Text>Address: {brewery.address1}</Text>
          {brewery.phone && <Text>Phone: {brewery.phone}</Text>}
          {brewery.websiteUrl && (
            <Text
              style={styles.link}
              onPress={() => openURL(brewery.websiteUrl!)}
            >
              Visit Website
            </Text>
          )}
        </View>
      )}

      <View style={styles.reviewsSection}>
        <Text style={styles.subtitle}>Reviews</Text>
        {reviews.length > 0 ? (
          reviews.map(
            (review, index) => (
              fetchReviewsForBrewery(breweryId),
              console.log(reviews),
              (
                <View
                  key={index}
                  style={styles.review}
                >
                  <Text>Rating: {review.rating}</Text>
                  <Text>Comment: {review.comment}</Text>
                  <Text>Posted by: {review.userName}</Text>
                  {/* Display the username */}
                </View>
              )
            ),
          )
        ) : (
          <Text>No reviews yet.</Text>
        )}
      </View>

      <ReviewModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        onReviewSubmitted={(review) => {
          addReview(review); // Add review to context
          fetchBreweryReviews(review.breweryId); // Optionally refetch reviews for the brewery
        }} // Passing the function as a prop
        breweryId={breweryIdString}
      />

      <Button
        title='Write Review'
        onPress={() => setModalVisible(true)}
      />
    </View>
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
  link: {
    color: 'blue',
    marginTop: 5,
  },
});

export default BreweryDetailsScreen;
