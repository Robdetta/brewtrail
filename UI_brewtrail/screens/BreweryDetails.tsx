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

  const handleWriteReview = () => {
    // Navigate to the ReviewScreen and pass the brewery ID as a parameter
    navigation.navigate('Review', { breweryId: brewery.id });
  };

  return (
    <View style={styles.container}>
      <View>
        <Text style={styles.title}>{brewery.name}</Text>
        <Text>City: {brewery.city}</Text>
        <Text>State: {brewery.state}</Text>
        {/* Display more brewery details here */}
      </View>
      <Button
        title='Write Review'
        onPress={handleWriteReview}
      />
      {/* Reviews section and Write Review button */}
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
  // Add styles for city, state, and other details
});

export default BreweryDetailsScreen;
