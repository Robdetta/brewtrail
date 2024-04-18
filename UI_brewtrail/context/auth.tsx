import { useRouter, useSegments } from 'expo-router';
import * as React from 'react';
import { Session } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase-client';
import { UserProfile } from '@/types/types';
import { fetchUserProfile } from '@/services/services';

// Define the shape of the context

interface AuthContextType {
  session: Session | null;
  userProfile: UserProfile;
  loading: boolean;
  setUserProfile: (userProfile: UserProfile | null) => void;
  signUp: (email: string, password: string, username: string) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = React.createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = React.useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [session, setSession] = React.useState<Session | null>(null);
  const [userProfile, setUserProfile] = React.useState<UserProfile | null>(
    null,
  );
  const [loading, setLoading] = React.useState(true); // Initialize loading state
  const router = useRouter();

  const updateSessionAndProfile = async (session: Session | null) => {
    setSession(session);
    setLoading(true);
    if (session?.access_token) {
      const profile = await fetchUserProfile(session.access_token);
      setUserProfile(profile);
    } else {
      setUserProfile(null);
    }
    setLoading(false);
  };

  React.useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      updateSessionAndProfile(session);
    });

    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        updateSessionAndProfile(session);
      },
    );

    return () => listener.subscription.unsubscribe();
  }, []);

  const signUp = async (email: string, password: string, username: string) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { username } },
    });
    if (error) throw error;
    if (data.session) setSession(data.session);
    // Optionally handle user notifications or navigation here
  };

  const signIn = async (email: string, password: string) => {
    setLoading(true);
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) {
      console.error('Error signing in:', error);
      setLoading(false);
      throw error; // or handle the error as per your application's needs
    }
    updateSessionAndProfile(data.session);
    router.replace('/(tabs)');
  };

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) console.error('Error signing out:', error);
    setSession(null);
    setUserProfile(null);
    router.replace('/(modals)/login');
  };

  return (
    <AuthContext.Provider
      value={{
        session,
        userProfile,
        loading,
        signUp,
        signIn,
        signOut,
        setUserProfile,
      }}
    >
      {!loading && children}
    </AuthContext.Provider>
  );
};
