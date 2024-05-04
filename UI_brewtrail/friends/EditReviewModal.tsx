import { Review } from '@/types/reviewTypes';
import React, { useState } from 'react';
import { View, Text, TextInput, Button, Modal, StyleSheet } from 'react-native';
import { handleRatingInput } from '@/app/util/ratingInputHandler';
import { validateReviewInput } from '@/app/util/validateReviewInput';

interface EditReviewModalProps {
  review: Review;
  visible: boolean;
  onClose: () => void;
  onSave: (rating: number, comment: string) => void;
}

const EditReviewModal: React.FC<EditReviewModalProps> = ({
  review,
  visible,
  onClose,
  onSave,
}) => {
  const [rating, setRating] = useState(review.rating.toString());
  const [comment, setComment] = useState(review.comment);
  const [error, setError] = useState('');
  const [errorComment, setErrorComment] = useState<string>('');

  const handleCommentChange = (text: string) => {
    if (text.length <= 200) {
      setComment(text);
      setErrorComment('');
    } else {
      setErrorComment('Comment must be under 200 characters.');
    }
  };

  const handleSave = () => {
    if (!validateReviewInput(rating, comment, setError)) {
      onSave(Number(rating), comment); // Ensure conversion to number if necessary
      onClose();
    }
  };

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType='slide'
      onRequestClose={onClose}
    >
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          <Text style={styles.modalText}>Edit Your Review</Text>
          <TextInput
            style={styles.input}
            value={rating}
            onChangeText={(text) => handleRatingInput(text, setRating)}
            placeholder='Rating (1-5)'
            keyboardType='numeric'
          />
          <TextInput
            style={styles.input}
            value={comment}
            onChangeText={setComment}
            multiline
            placeholder='Please enter a comment under 200 characters'
            maxLength={200}
          />
          <Button
            title='Save Changes'
            onPress={handleSave} // Call handleSave here instead of onSave directly
          />
          <Button
            title='Cancel'
            onPress={onClose}
          />
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

export default EditReviewModal;
