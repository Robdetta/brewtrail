import React from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { useNavigation, useRouter } from 'expo-router'; // Use navigate from Expo Router

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
  const navigate = useNavigation(); // Hook to perform navigation
  const router = useRouter();

  const renderItem = ({ item }: { item: Brewery }) => (
    <TouchableOpacity
      onPress={() => router.navigate(`/brewerydetails/${item.id}`)}
    >
      <View style={styles.item}>
        <Text style={styles.title}>{item.name}</Text>
        <Text>City: {item.city}</Text>
        <Text>State: {item.state}</Text>
      </View>
    </TouchableOpacity>
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
});

export default BreweryList;
