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
}

const ReviewsList: React.FC<ReviewsListProps> = ({
  reviews,
  onEdit,
  onDelete,
}) => {
  const renderItem = ({ item }: { item: Review }) => (
    <Link
      href={`/BreweryDetails/${item.openBreweryDbId}`}
      asChild
    >
      <TouchableOpacity style={styles.card}>
        <Text style={styles.title}>{item.breweryName}</Text>
        <Text>Rating: {item.rating}</Text>
        <Text>Comment: {item.comment}</Text>
        <Text>Reviewed by: {item.userName}</Text>
        <Text>Posted: {new Date(item.createdAt).toLocaleDateString()}</Text>
        <View style={styles.buttonContainer}>
          {onEdit && (
            <Button
              title='Edit'
              onPress={() => onEdit(item)}
            />
          )}
          {onDelete && (
            <Button
              title='Delete'
              onPress={() => onDelete(item)}
              color='red'
            />
          )}
        </View>
      </TouchableOpacity>
    </Link>
  );
  return (
    <FlatList
      data={reviews}
      keyExtractor={(item, index) => index}
      renderItem={renderItem}
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
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    marginTop: 10,
  },
});

export default ReviewsList;
