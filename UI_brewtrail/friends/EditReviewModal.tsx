import { Review } from '@/types/reviewTypes';
import React, { useState } from 'react';
import { View, Text, TextInput, Button, Modal, StyleSheet } from 'react-native';

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

  const handleSave = () => {
    onSave(Number(rating), comment); // Ensure conversion to number if necessary
    onClose();
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
            onChangeText={setRating}
            keyboardType='numeric'
          />
          <TextInput
            style={styles.input}
            value={comment}
            onChangeText={setComment}
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
