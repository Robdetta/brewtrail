import React from 'react';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { Link, Tabs } from 'expo-router';
import { Pressable } from 'react-native';

import Colors from '@/constants/Colors';
import { useColorScheme } from '@/components/useColorScheme';
import { useClientOnlyValue } from '@/components/useClientOnlyValue';
import { FontAwesome5 } from '@expo/vector-icons';
import { MaterialIcons } from '@expo/vector-icons';

// You can explore the built-in icon families and icons on the web at https://icons.expo.fyi/

const Layout = () => {
  return (
    <Tabs>
      <Tabs.Screen
        name='index'
        options={{
          tabBarLabel: 'Feed',
          tabBarIcon: ({ color, size }) => (
            <MaterialIcons
              name='feed'
              color={color}
              size={size}
            />
          ),
        }}
      />
      <Tabs.Screen
        name='friends'
        options={{
          tabBarLabel: 'Friends',
          tabBarIcon: ({ color, size }) => (
            <FontAwesome5
              name='user-friends'
              color={color}
              size={size}
            />
          ),
        }}
      />
      <Tabs.Screen
        name='explore'
        options={{
          tabBarLabel: 'Explore',
          tabBarIcon: ({ color, size }) => (
            <FontAwesome5
              name='search'
              color={color}
              size={size}
            />
          ),
        }}
      />
      <Tabs.Screen
        name='reviews'
        options={{
          tabBarLabel: 'Reviews',
          tabBarIcon: ({ color, size }) => (
            <MaterialIcons
              name='reviews'
              color={color}
              size={size}
            />
          ),
        }}
      />
      <Tabs.Screen
        name='profile'
        options={{
          tabBarLabel: 'Profile',
          tabBarIcon: ({ color, size }) => (
            <FontAwesome5
              name='user'
              color={color}
              size={size}
            />
          ),
        }}
      />
    </Tabs>
  );
};

export default Layout;
