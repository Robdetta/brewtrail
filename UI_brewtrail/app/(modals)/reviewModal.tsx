import React, { useState } from 'react';
import { Modal, View, Text, TextInput, Button, StyleSheet } from 'react-native';
import { useAuth } from '@/context/auth'; // Import useAuth to access user session
import { supabase } from '@/lib/supabase-client';

const ReviewModal = ({ visible, onClose, breweryId }) => {
  const [rating, setRating] = useState('');
  const [comment, setComment] = useState('');
  const { session } = useAuth();

  const submitReview = async () => {
    if (session) {
      const { data, error } = await supabase
        .from('review')
        .insert([
          { user_id: session.user.id, brewery_id: breweryId, rating, comment },
        ]);

      if (error) {
        console.error('Error submitting review:', error);
        return;
      }
      onClose(); // Close modal on successful submission
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
            onPress={submitReview}
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
});

export default ReviewModal;
