import React, { useState } from 'react';
import { View, TextInput, Button, StyleSheet, Text } from 'react-native';
import { submitReview } from '../services/BreweryService'; // Adjust the import path as needed

const ReviewScreen = ({ route, navigation }) => {
  const { breweryId } = route.params;
  const [rating, setRating] = useState('');
  const [comment, setComment] = useState('');

  const handleSubmitReview = async () => {
    const userId = 1;
    try {
      await submitReview(breweryId, userId, Number(rating), comment);
      alert('Review submitted successfully');
      setRating('');
      setComment('');
      navigation.goBack(); // Navigate back to the previous screen after submission
    } catch (error) {
      console.error('Error submitting review:', error);
      alert('Failed to submit review');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Write a Review</Text>
      <TextInput
        style={styles.input}
        onChangeText={setRating}
        value={rating}
        placeholder='Rating'
        keyboardType='numeric'
      />
      <TextInput
        style={styles.input}
        onChangeText={setComment}
        value={comment}
        placeholder='Comment'
        multiline
      />
      <Button
        title='Submit Review'
        onPress={handleSubmitReview}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
  },
  input: {
    width: '100%',
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#cccccc',
    borderRadius: 5,
    padding: 10,
  },
});

export default ReviewScreen;
