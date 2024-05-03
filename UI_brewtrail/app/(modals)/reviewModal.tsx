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
import { Review } from '@/types/types';

interface ReviewModalProps {
  visible: boolean;
  onClose: () => void;
  onReviewSubmitted: (review: Review) => void; // Expect a review object
  breweryId: string;
}

const ReviewModal: React.FC<ReviewModalProps> = ({
  visible,
  onClose,
  onReviewSubmitted,
  breweryId,
}) => {
  const [rating, setRating] = useState('');
  const [comment, setComment] = useState('');
  const [error, setError] = useState('');
  const effectiveBreweryId = Array.isArray(breweryId)
    ? breweryId[0]
    : breweryId;
  const [modalVisible, setModalVisible] = useState(false);
  const [modalMessage, setModalMessage] = useState('');

  const validateInput = (): boolean => {
    const parsedRating = parseInt(rating);
    if (!parsedRating || parsedRating < 1 || parsedRating > 5) {
      setError('Please enter a valid rating between 1 and 5.');
      return false;
    }
    if (!comment || comment.length > 200) {
      // Limiting comments to 200 characters for simplicity
      setError('Please keep your comment under 200 characters.');
      return false;
    }
    return true;
  };

  const handleRatingChange = (text: string) => {
    const num = parseInt(text);
    if (num >= 1 && num <= 5) {
      setRating(text);
    } else if (text === '') {
      setRating('');
    }
    // Optionally, could use else to set some error state to tell the user the input is invalid
  };

  const handleReviewSubmit = async () => {
    if (!validateInput()) {
      return;
    }
    const { data: session } = await supabase.auth.getSession();
    if (!session) {
      setModalMessage(
        'Authentication Error, You must be logged in to submit a review.',
      );
      setModalVisible(true);
      return;
    }

    const token = session.session?.access_token;
    if (!token) {
      setModalMessage('Session Error, No token found. Please login again.');
      setModalVisible(true);
      return;
    }

    const userId = session.session?.user.user_metadata.id;
    const parsedRating = parseInt(rating);

    try {
      await submitReview(
        effectiveBreweryId,
        userId,
        parsedRating,
        comment,
        token,
      );
      setModalMessage('Success, Review submitted successfully.');

      // Create the review object to pass
      const newReview: Review = {
        openBreweryDbId: effectiveBreweryId,
        rating: parsedRating,
        comment: comment,
        reviewId: 0,
        createdAt: new Date(),
        userName: '',
        breweryName: '',
        breweryId: effectiveBreweryId,
      };

      onClose(); // Close the modal
      onReviewSubmitted(newReview); // Pass the full review object to update context
    } catch (error) {
      console.error('Error submitting review:', error);
      setError('Failed to submit review: ' + error.message);
    }
  };

  return (
    <Modal
      animationType='slide'
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          <Text style={styles.modalText}>Write a Review</Text>
          <TextInput
            style={styles.input}
            onChangeText={handleRatingChange}
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
            maxLength={200} // Set a maxLength for comment input
          />
          <Button
            title='Submit Review'
            onPress={handleReviewSubmit}
          />
          <Button
            title='Cancel'
            onPress={onClose}
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
    fontSize: 14,
    marginBottom: 10,
  },
});

export default ReviewModal;
