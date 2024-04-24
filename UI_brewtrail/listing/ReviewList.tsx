import React from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import { Link } from 'expo-router'; // Use navigate from Expo Router
import { Review } from '@/types/types';

interface ReviewsListProps {
  reviews: Review[];
}

const ReviewsList: React.FC<ReviewsListProps> = ({ reviews }) => {
  const renderItem = ({ item }: { item: Review }) => (
    <Link
      href={`/BreweryDetails/${item.openBreweryDbId}`}
      asChild
    >
      <View style={styles.item}>
        <Text style={styles.title}>{item.breweryName}</Text>
        <Text>Rating: {item.rating}</Text>
        <Text>Comment: {item.comment}</Text>
        <Text>Reviewed by: {item.userName}</Text>
        <Text>Posted: {new Date(item.createdAt).toLocaleDateString()}</Text>
      </View>
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
  item: {
    backgroundColor: '#f9c2ff',
    padding: 20,
    marginVertical: 8,
    borderRadius: 5, // Rounded corners for each list item
    borderWidth: 1,
    borderColor: '#ddd', // Optional, for better UI
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
});

export default ReviewsList;
