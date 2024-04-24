import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  Button,
  StyleSheet,
  Linking,
  FlatList,
} from 'react-native';
import {
  fetchBreweryDetails,
  fetchReviewsForBrewery,
} from '@/services/services';
import { Link, useLocalSearchParams } from 'expo-router';
import ReviewModal from '../(modals)/reviewModal';
import { useReviews } from '@/context/ReviewContext';
import { Review } from '@/types/types';
import { useAuth } from '@/context/auth';

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
        <FlatList
          data={sortedReviews}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item }) => (
            <View style={styles.review}>
              <Text style={styles.reviewText}>Rating: {item.rating}</Text>
              <Text style={styles.reviewText}>Comment: {item.comment}</Text>
              <Text style={styles.reviewText}>Posted by: {item.userName}</Text>
              <Text style={styles.reviewText}>
                Posted: {new Date(item.createdAt).toLocaleDateString()}
              </Text>
            </View>
          )}
          ListEmptyComponent={<Text>No reviews yet.</Text>}
        />
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

      {session ? (
        <Button
          title='Write Review'
          onPress={() => setModalVisible(true)}
        />
      ) : (
        <Link href='/(modals)/login'>
          <Button title='Please Log In' />
        </Link>
      )}
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
  reviewText: {
    fontSize: 16,
    color: '#333', // Dark grey for better readability
  },
});

export default BreweryDetailsScreen;
