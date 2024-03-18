import React, { useEffect, useState } from 'react';
import { View, Text, Button, StyleSheet, Linking } from 'react-native';
import {
  fetchBreweryDetails,
  fetchReviewsForBrewery,
} from '../services/BreweryService'; // Adjust the import path as needed

const BreweryDetailsScreen = ({ route, navigation }) => {
  const { breweryId } = route.params;
  const [brewery, setBrewery] = useState(null);
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    const getBreweryDetails = async () => {
      const details = await fetchBreweryDetails(breweryId);
      setBrewery(details);
    };

    const getReviews = async () => {
      const fetchedReviews = await fetchReviewsForBrewery(breweryId);
      setReviews(fetchedReviews);
    };

    getBreweryDetails();
    getReviews();
  }, [breweryId]);

  const openURL = (url) => {
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
          <Text>State: {brewery.state}</Text>
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

      <Button
        title='Write Review'
        onPress={() => navigation.navigate('Review', { breweryId })}
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
