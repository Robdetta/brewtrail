import { TextInput, Button, StyleSheet } from 'react-native';
import React, { useState } from 'react';

import EditScreenInfo from '@/components/EditScreenInfo';
import { Text, View } from '@/components/Themed';
import BreweryList from '@/listing/BreweryList';
import { searchBreweries } from '../../services/services';

const exploreScreen = () => {
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [breweries, setBreweries] = useState([]);

  const handleSearch = async () => {
    try {
      const results = await searchBreweries(city, state);
      setBreweries(results);
    } catch (error) {
      console.error(error);
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
        placeholder='Enter State'
      />
      <Button
        onPress={handleSearch}
        title='Search'
        color='#841584'
      />
      <BreweryList breweries={breweries} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  input: {
    height: 40,
    marginVertical: 12,
    borderWidth: 1,
    padding: 10,
    width: '100%',
  },
});

export default exploreScreen;
