import {
  TextInput,
  Button,
  StyleSheet,
  AsyncStorage,
  FlatList,
  TouchableOpacity,
} from 'react-native';
import React, { useState, useEffect } from 'react';

import EditScreenInfo from '@/components/EditScreenInfo';
import { Text, View } from '@/components/Themed';
import BreweryList from '@/listing/BreweryList';
import { searchBreweries } from '../../services/services';

const ExploreScreen = () => {
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [breweries, setBreweries] = useState([]);
  const [searchHistory, setSearchHistory] = useState([]);

  useEffect(() => {
    loadSearchHistory();
  }, []);

  const loadSearchHistory = async () => {
    try {
      const history = await AsyncStorage.getItem('searchHistory');
      if (history !== null) {
        setSearchHistory(JSON.parse(history));
      }
    } catch (error) {
      console.error('Error loading search history:', error);
    }
  };

  const handleSearch = async () => {
    try {
      const results = await searchBreweries(city, state);
      setBreweries(results);

      // Check if the search returned any results
      if (results.length > 0) {
        // Check if the current search query is already in the search history
        const newQuery = `${city}, ${state}`;
        if (!searchHistory.includes(newQuery)) {
          // Add the current search to the search history if it's not already present
          const newHistory = [newQuery, ...searchHistory];
          setSearchHistory(newHistory);
          AsyncStorage.setItem('searchHistory', JSON.stringify(newHistory));
        }
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleHistoryPress = async (item) => {
    // Extract city and state from the selected item in the search history
    const [selectedCity, selectedState] = item.split(', ');

    // Set the city and state in the state variables
    setCity(selectedCity);
    setState(selectedState);

    // Trigger the search directly
    try {
      const results = await searchBreweries(selectedCity, selectedState);
      setBreweries(results);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
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
      </View>
      <View style={styles.historyContainer}>
        <Text style={styles.historyTitle}>Search History</Text>
        <FlatList
          data={searchHistory}
          renderItem={({ item }) => (
            <TouchableOpacity onPress={() => handleHistoryPress(item)}>
              <Text style={styles.historyItem}>{item}</Text>
            </TouchableOpacity>
          )}
          keyExtractor={(item, index) => index.toString()}
        />
      </View>
      {breweries.length === 0 ? (
        <Text>No results found.</Text>
      ) : (
        <BreweryList breweries={breweries} />
      )}
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
  searchContainer: {
    width: '100%',
    marginBottom: 20,
  },
  input: {
    height: 40,
    marginVertical: 12,
    borderWidth: 1,
    padding: 10,
    width: '100%',
  },
  historyContainer: {
    width: '100%',
  },
  historyTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  historyItem: {
    fontSize: 16,
    marginBottom: 5,
    color: 'blue',
  },
});

export default ExploreScreen;
