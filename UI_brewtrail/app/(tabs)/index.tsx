import { Text, View } from '@/components/Themed';
import React, { useEffect, useState } from 'react';
import { Link, Redirect, Stack } from 'expo-router';
import { supabase } from '../../lib/supabase-client';
import { Session } from '@supabase/supabase-js';
import { useAuth } from '@/context/auth';

const Feed = () => {
  const { session } = useAuth();

  return (
    <View>
      {session && session.user && (
        <Text>{session.user.user_metadata.username}</Text>
      )}
    </View>
  );
};

export default Feed;
