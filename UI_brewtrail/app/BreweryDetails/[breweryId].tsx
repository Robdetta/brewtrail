import React, { useEffect, useState } from 'react';
import { View, Text, Button, StyleSheet, Linking } from 'react-native';
import {
  fetchBreweryDetails,
  fetchReviewsForBrewery,
} from '@/services/services';
import { useLocalSearchParams } from 'expo-router';
import ReviewModal from '../(modals)/reviewModal';

interface Brewery {
  name: string;
  city: string;
  stateProvince: string;
  breweryType: string;
  address1: string;
  phone?: string;
  websiteUrl?: string;
}

interface Review {
  rating: number;
  comment: string;
}

const BreweryDetailsScreen = () => {
  const { breweryId } = useLocalSearchParams();
  const [brewery, setBrewery] = useState<Brewery | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const breweryIdString = Array.isArray(breweryId) ? breweryId[0] : breweryId;

  useEffect(() => {
    const getBreweryDetails = async () => {
      const details = await fetchBreweryDetails(breweryIdString);
      console.log(details);
      setBrewery(details);
    };

    const getReviews = async () => {
      const fetchedReviews = await fetchReviewsForBrewery(breweryIdString);
      setReviews(fetchedReviews);
    };

    getBreweryDetails();
    getReviews();
  }, [breweryId]);
  console.log(`Brewery ID from URL: ${breweryId}`);

  const openURL = (url: string) => {
    Linking.openURL(url).catch((err) =>
      console.error('An error occurred', err),
    );
  };

  if (!breweryId) {
    return <Text>No brewery ID provided</Text>;
  }

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

      <ReviewModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        breweryId={breweryId}
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
