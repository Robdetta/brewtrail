import { Review } from '@/types/reviewTypes';
import React, { useState } from 'react';
import { View, Text, TextInput, Button, Modal } from 'react-native';

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
      animationType='slide'
      onRequestClose={onClose}
    >
      <View style={{ marginTop: 50, padding: 20 }}>
        <Text>Edit Your Review</Text>
        <TextInput
          value={rating}
          onChangeText={setRating}
          keyboardType='numeric'
          style={{
            height: 40,
            borderColor: 'gray',
            borderWidth: 1,
            marginBottom: 20,
          }}
        />
        <TextInput
          value={comment}
          onChangeText={setComment}
          style={{
            height: 40,
            borderColor: 'gray',
            borderWidth: 1,
            marginBottom: 20,
          }}
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
    </Modal>
  );
};

export default EditReviewModal;
