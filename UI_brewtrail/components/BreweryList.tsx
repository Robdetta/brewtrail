import React from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';

interface Brewery {
  id: string; // or number, depending on your ID type
  name: string;
  city: string;
  state: string;
  // Include other brewery properties as needed
}

// Define the props expected by BreweryList
interface BreweryListProps {
  breweries: Brewery[];
  navigation: StackNavigationProp<any, any>; // Use the appropriate type based on your navigation setup
}

const BreweryList: React.FC<BreweryListProps> = ({ breweries, navigation }) => (
  <FlatList
    data={breweries}
    keyExtractor={(item) => item.id.toString()}
    renderItem={({ item }) => (
      <TouchableOpacity
        onPress={() => navigation.navigate('BreweryDetails', { brewery: item })}
      >
        <View style={styles.item}>
          <Text style={styles.title}>{item.name}</Text>
          <Text>City: {item.city}</Text>
          <Text>State: {item.state}</Text>
          {/* You can add more brewery info here */}
        </View>
      </TouchableOpacity>
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
  // Add styles for city and state if needed
});

export default BreweryList;
