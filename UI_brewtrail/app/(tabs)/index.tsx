import { StyleSheet } from 'react-native';
import EditScreenInfo from '@/components/EditScreenInfo';
import { Text, View } from '@/components/Themed';
import { Tabs } from 'expo-router';
import React from 'react';
import Colors from '@/constants/Colors';

const Layout = () => {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors.primary,
      }}
    >
      <Tabs.Screen
        name='index'
        options={{ tabBarLabel: 'Feed' }}
      />
    </Tabs>
  );
};
export default Layout;
