import { Text, View } from '@/components/Themed';
import React, { useEffect, useState } from 'react';
import { Link, Stack } from 'expo-router';
import { supabase } from '../../lib/supabase-client';
import { Session } from '@supabase/supabase-js';
import Auth from './profile';

const Feed = () => {
  const [session, setSession] = useState<Session | null>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });
  }, []);

  return (
    <View>
      <Auth />
      {session && session.user && <Text>{session.user.id}</Text>}
    </View>
  );
};

export default Feed;
