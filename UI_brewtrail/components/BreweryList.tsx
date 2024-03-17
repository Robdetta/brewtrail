import React from 'react';
import { View, Text, FlatList, StyleSheet, Button } from 'react-native';

interface Brewery {
  id: string; // Assuming 'id' is a string, adjust the type as needed
  name: string;
  brewery_type: string;
  city: string;
  state: string;
  // Include other fields as necessary
}

interface BreweryListProps {
  breweries: Brewery[]; // Use the Brewery interface to type the breweries array
  navigation: any;
}

const BreweryList: React.FC<BreweryListProps> = ({ breweries, navigation }) => (
  <FlatList
    data={breweries}
    keyExtractor={(item) => item.id}
    renderItem={({ item }) => (
      <View style={styles.item}>
        <Text style={styles.title}>{item.name}</Text>
        <Text>Type: {item.brewery_type}</Text>
        <Text>City: {item.city}</Text>
        <Text>State: {item.state}</Text>
        <Button
          title='Write Review'
          onPress={() => navigation.navigate('Review', { breweryId: item.id })} // Navigate to ReviewScreen
        />
        {/* Add a button or other elements here as needed */}
      </View>
    )}
  />
);

const styles = StyleSheet.create({
  item: {
    backgroundColor: '#f9c2ff',
    padding: 20,
    marginVertical: 8,
  },
  title: {
    fontSize: 20,
  },
});

export default BreweryList;
