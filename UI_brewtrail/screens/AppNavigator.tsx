import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import HomeScreen from './HomeScreen'; // Adjust the import path as needed
import ReviewScreen from './ReviewScreen'; // Adjust the import path as needed
import BreweryDetailsScreen from './BreweryDetails'; // Adjust the import path as needed

const Stack = createStackNavigator();

const AppNavigator = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName='Home'>
        <Stack.Screen
          name='Home'
          component={HomeScreen}
          // options={{ headerShown: false }} // Hide the header
        />
        <Stack.Screen
          name='BreweryDetails'
          component={BreweryDetailsScreen}
          options={({ route }) => ({ title: route.params.breweryName })} // Optional: Set the header title to the brewery's name
        />
        <Stack.Screen
          name='Review'
          component={ReviewScreen}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
