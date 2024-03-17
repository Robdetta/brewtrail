import React, { useState } from 'react';
import { View, TextInput, Button, StyleSheet, StatusBar } from 'react-native';
import BreweryList from '../components/BreweryList';
import { searchBreweries } from '../services/BreweryService';

const HomeScreen = ({ navigation }) => {
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [breweries, setBreweries] = useState([]);

  const handleSearch = async () => {
    const results = await searchBreweries(city, state);
    setBreweries(results);
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
        placeholder='Enter State'
      />
      <Button
        onPress={handleSearch}
        title='Search'
        color='#841584'
      />
      <BreweryList
        breweries={breweries}
        navigation={navigation}
      />
      <StatusBar style='auto' />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
});

export default HomeScreen;
