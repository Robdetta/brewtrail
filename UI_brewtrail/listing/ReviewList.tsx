import React from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  Button,
  TouchableOpacity,
} from 'react-native';
import { Link } from 'expo-router'; // Use navigate from Expo Router
import { Review } from '@/types/types';

interface ReviewsListProps {
  reviews: Review[];
  onEdit?: (review: Review) => void;
  onDelete?: (review: Review) => void;
  showBreweryName?: boolean;
  showUserName?: boolean;
  navigable?: boolean;
}

const ReviewsList: React.FC<ReviewsListProps> = ({
  reviews,
  onEdit,
  onDelete,
  showBreweryName = true,
  showUserName = true,
  navigable = true,
}) => {
  // Helper function to render each review item
  const renderReviewItem = ({ item }: { item: Review }) => {
    const reviewContent = (
      <>
        {showBreweryName && (
          <Text style={styles.title}>{item.breweryName}</Text>
        )}
        <Text>Rating: {item.rating}</Text>
        <Text>Comment: {item.comment}</Text>
        {showUserName && <Text>Reviewed by: {item.userName}</Text>}
        <Text>Posted: {new Date(item.createdAt).toLocaleDateString()}</Text>
      </>
    );

    return (
      <View style={styles.card}>
        {navigable ? (
          <Link
            href={`/BreweryDetails/${item.openBreweryDbId}`}
            style={{ flex: 1 }}
            asChild
          >
            <TouchableOpacity>{reviewContent}</TouchableOpacity>
          </Link>
        ) : (
          <View>{reviewContent}</View>
        )}
        <View style={styles.buttonContainer}>
          {onEdit && (
            <TouchableOpacity
              onPress={() => onEdit(item)}
              style={styles.editButton}
            >
              <Text style={styles.buttonText}>Edit</Text>
            </TouchableOpacity>
          )}
          {onDelete && (
            <TouchableOpacity
              onPress={() => onDelete(item)}
              style={styles.deleteButton}
            >
              <Text style={styles.buttonText}>Delete</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    );
  };

  return (
    <FlatList
      data={reviews}
      keyExtractor={(item, index) => index}
      renderItem={renderReviewItem}
    />
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#f9c2ff',
    padding: 20,
    marginVertical: 8,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#ddd',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
    elevation: 3,
    flexDirection: 'column',
    justifyContent: 'space-between', // Ensures the buttons stay at the bottom
    width: 350, // Width of the card, adjust this to make the card narrower or wider
    alignSelf: 'center', // Aligns the card to the center of the container
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    marginTop: 10,
  },
  editButton: {
    backgroundColor: '#2196F3',
    padding: 10,
    borderRadius: 5,
  },
  deleteButton: {
    backgroundColor: 'red',
    padding: 10,
    borderRadius: 5,
  },
  buttonText: {
    color: 'white',
  },
});

export default ReviewsList;
