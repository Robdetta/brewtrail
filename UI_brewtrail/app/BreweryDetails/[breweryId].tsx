import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  Button,
  StyleSheet,
  Linking,
  FlatList,
  TouchableOpacity,
} from 'react-native';
import {
  fetchBreweryDetails,
  fetchReviewsForBrewery,
} from '@/services/services';
import { Link, useLocalSearchParams } from 'expo-router';
import ReviewModal from '../(modals)/reviewModal';
import { useReviews } from '@/context/ReviewContext';
import { Review, Brewery } from '@/types/types';
import { useAuth } from '@/context/auth';
import ReviewsList from '@/listing/ReviewList';

const BreweryDetailsScreen = () => {
  const { session } = useAuth();
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

  const sortedReviews =
    breweryReviews[breweryIdString]?.sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    ) || [];

  return (
    <View style={styles.container}>
      {brewery && (
        <View style={styles.breweryDetails}>
          <Text style={styles.title}>{brewery.name}</Text>
          <Text>City: {brewery.city}</Text>
          <Text>State: {brewery.stateProvince}</Text>
          <Text>Type: {brewery.breweryType}</Text>
          <Text>Address: {brewery.address1}</Text>
          {brewery.phone && <Text>Phone: {brewery.phone}</Text>}
          {brewery.websiteUrl && (
            <Text
              style={styles.link}
              onPress={() => openURL(brewery.websiteUrl)}
            >
              Visit Website
            </Text>
          )}
          {session && (
            <TouchableOpacity
              style={styles.button}
              onPress={() => setModalVisible(true)}
            >
              <Text style={styles.buttonText}>Write Review</Text>
            </TouchableOpacity>
          )}
        </View>
      )}

      <ReviewModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        onReviewSubmitted={(review) => {
          addReview(review);
          fetchBreweryReviews(review.breweryId);
        }}
        breweryId={breweryIdString}
      />

      <Text style={styles.subtitle}>Reviews</Text>
      {sortedReviews.length > 0 ? (
        <ReviewsList
          reviews={sortedReviews}
          showBreweryName={false}
        />
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
  },
  breweryDetails: {
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  subtitle: {
    fontSize: 20,
    marginBottom: 10,
    textAlign: 'center',
  },
  link: {
    color: 'blue',
    marginTop: 5,
  },
  emptyText: {
    textAlign: 'center',
    fontSize: 16,
  },
  button: {
    backgroundColor: 'blue',
    color: 'white',
    paddingVertical: 8, // Reduced vertical padding
    paddingHorizontal: 12, // Reduced horizontal padding
    borderRadius: 5,
    elevation: 2,
    marginTop: 10,
    marginBottom: 10,
    width: 150,
  },
  buttonText: {
    textAlign: 'center',
    color: 'white',
    fontWeight: 'bold',
  },
});

export default BreweryDetailsScreen;
