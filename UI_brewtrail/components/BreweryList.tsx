import React from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';

const BreweryList = ({ breweries }) => (
  <FlatList
    data={breweries}
    keyExtractor={(item) => item.id.toString()}
    renderItem={({ item }) => (
      <View style={styles.item}>
        <Text style={styles.title}>{item.name}</Text>
        <Text>Type: {item.brewery_type}</Text>
        <Text>City: {item.city}</Text>
        <Text>State: {item.state}</Text>
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
