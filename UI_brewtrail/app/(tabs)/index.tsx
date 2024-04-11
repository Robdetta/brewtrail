import { Text, View } from '@/components/Themed';
import React, { useEffect, useState } from 'react';
import { Link, Stack } from 'expo-router';
import { supabase } from '../lib/supabase-client';

const Feed = () => {
  const [userName, setUserName] = useState('');

  useEffect(() => {
    fetchUserProfile();
  }, []);

  const fetchUserProfile = async () => {
    const user = supabase.auth.getUser();

    if (user) {
      // Assuming you have a 'profiles' table with 'id' and 'username'
      const { data, error } = await supabase
        .from('app_users')
        .select('name')
        .eq('id', user.id)
        .single();

      if (error) {
        console.error('Error fetching profile:', error);
      } else {
        setUserName(data.username);
      }
    }
  };

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Welcome, {userName}</Text>
    </View>
  );
};

export default Feed;
