import React from 'react';
import { View, Text, Button, Modal, StyleSheet } from 'react-native';

interface DeleteReviewModalProps {
  visible: boolean;
  onClose: () => void;
  onConfirmDelete: () => void;
}

const DeleteReviewModal: React.FC<DeleteReviewModalProps> = ({
  visible,
  onClose,
  onConfirmDelete,
}) => {
  return (
    <Modal
      visible={visible}
      animationType='slide'
      transparent={true}
      onRequestClose={onClose}
    >
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          <Text style={styles.modalText}>
            Are you sure you want to delete this review?
          </Text>
          <Button
            title='Yes, Delete It'
            onPress={onConfirmDelete}
            color='red'
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
});

export default DeleteReviewModal;
