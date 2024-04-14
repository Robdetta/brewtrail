import React from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { Link } from 'expo-router'; // Use navigate from Expo Router

interface Brewery {
  id: string;
  name: string;
  city: string;
  state: string;
}

interface BreweryListProps {
  breweries: Brewery[];
}

const BreweryList: React.FC<BreweryListProps> = ({ breweries }) => {
  const renderItem = ({ item }: { item: Brewery }) => (
    // Updated to use `href` instead of `to`
    <Link
      href={`/BreweryDetails/${item.id}` as any}
      asChild
    >
      <View style={styles.item}>
        <Text style={styles.title}>{item.name}</Text>
        <Text>City: {item.city}</Text>
        <Text>State: {item.state}</Text>
      </View>
    </Link>
  );

  return (
    <FlatList
      data={breweries}
      keyExtractor={(item) => item.id.toString()}
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
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  link: {
    // If you need to style your Link components, do it here
    // For example, to remove text decoration:
  },
});

export default BreweryList;
