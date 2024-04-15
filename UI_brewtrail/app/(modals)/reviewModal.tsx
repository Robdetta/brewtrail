import React, { useState } from 'react';
import {
  Modal,
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  Alert,
} from 'react-native';
import { useAuth } from '@/context/auth'; // Make sure this path matches where your context is defined
import { submitReview } from '@/services/services';
import { supabase } from '@/lib/supabase-client';

const ReviewModal = ({ visible, onClose, breweryId }) => {
  const [rating, setRating] = useState('');
  const [comment, setComment] = useState('');
  const [error, setError] = useState('');

  const handleReviewSubmit = async () => {
    const { data: session } = await supabase.auth.getSession();
    if (!session) {
      Alert.alert(
        'Authentication Error',
        'You must be logged in to submit a review.',
      );
      return;
    }

    try {
      // Assuming you are using the session correctly to retrieve the JWT
      const token = session.session?.access_token;
      if (!token) {
        throw new Error('No token found. Please login again.');
      }

      await submitReview(
        breweryId,
        session.session?.user.user_metadata.id, // Assuming userID is needed; adjust according to your API requirements
        parseInt(rating),
        comment,
        token,
      );
      Alert.alert('Success', 'Review submitted successfully.');
      onClose(); // Close modal on successful submission
      // Optionally refresh data here if needed
    } catch (error) {
      console.error('Error submitting review:', error);
      setError('Failed to submit review. Please try again.');
    }
  };

  return (
    <Modal
      animationType='slide'
      transparent={true}
      visible={visible}
      onRequestClose={() => onClose()}
    >
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          <Text style={styles.modalText}>Write a Review</Text>
          <TextInput
            style={styles.input}
            onChangeText={setRating}
            value={rating}
            placeholder='Rating (1-5)'
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
            onPress={handleReviewSubmit}
          />
          <Button
            title='Cancel'
            onPress={() => onClose()}
          />
          {error ? <Text style={styles.errorText}>{error}</Text> : null}
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22,
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalText: {
    marginBottom: 15,
    textAlign: 'center',
  },
  input: {
    height: 40,
    margin: 12,
    borderWidth: 1,
    padding: 10,
    width: 200,
  },
  errorText: {
    color: 'red',
    marginTop: 10,
  },
});

export default ReviewModal;
