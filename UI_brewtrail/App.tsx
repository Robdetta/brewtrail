import React, { useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  Button,
  FlatList,
} from 'react-native';

// Other imports and the Brewery interface remain the same

export default function App() {
  const [city, setCity] = useState('');
  const [state, setState] = useState(''); // State input
  const [breweries, setBreweries] = useState<Brewery[]>([]);

  const searchBreweries = async () => {
    const url = `http://localhost:8080/api/search?city=${city}&state=${state}`; // Include state in the request

    try {
      const response = await fetch(url);
      const data = await response.json();
      setBreweries(data);
    } catch (error) {
      console.error('Error:', error);
      setBreweries([]);
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        onChangeText={setCity}
        value={city}
        placeholder='Enter City Name'
      />
      <TextInput
        style={styles.input}
        onChangeText={setState}
        value={state}
        placeholder='Enter State' // New input for state
      />
      <Button
        onPress={searchBreweries}
        title='Search'
        color='#841584'
      />
      <FlatList
        data={breweries}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.item}>
            <Text style={styles.title}>{item.name}</Text>
            <Text>Type: {item.brewery_type}</Text>
            <Text>City: {item.city}</Text>
            <Text>State: {item.state}</Text> {/* Display the state as well */}
          </View>
        )}
      />
      <StatusBar style='auto' />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  input: {
    height: 40,
    margin: 12,
    borderWidth: 1,
    padding: 10,
    width: '80%',
  },
  item: {
    backgroundColor: '#f9c2ff',
    padding: 20,
    marginVertical: 8,
    width: '80%',
  },
  title: {
    fontSize: 20,
  },
});
