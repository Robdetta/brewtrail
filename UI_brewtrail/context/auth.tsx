import { useRouter, useSegments } from 'expo-router';
import * as React from 'react';
import { Session } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase-client';
import { UserProfile } from '@/types/types';
import { fetchUserProfile } from '@/services/services';

// Define the shape of the context

interface AuthContextType {
  session: Session | null;
  userProfile: UserProfile | null;
  loading: boolean;
  setUserProfile: (userProfile: UserProfile | null) => void;
  signUp: (
    email: string,
    password: string,
    username: string,
  ) => Promise<{ data?: Session | null; error?: SupabaseAuthError }>;
  signIn: (
    email: string,
    password: string,
  ) => Promise<{ success: boolean; error?: string }>;
  signOut: () => Promise<void>;
}

interface SignUpResponse {
  session?: Session; // Assuming Session is the correct type for your auth session
  error?: string;
}

interface SupabaseAuthError {
  message: string;
  status: number;
  details?: string;
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

  const signUp = async (
    email: string,
    password: string,
    username: string,
  ): Promise<SignUpResponse> => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: { data: { username } },
      });

      if (error) {
        console.error('Signup error:', error);
        return { error: error.message };
      }

      if (data.session) {
        setSession(data.session);
        return { session: data.session };
      }
      return {}; // No session created, no error found - handle as needed
    } catch (error: any) {
      console.error('Exception in signUp:', error);
      // Handle or log the exception as necessary
      return { error: error.message || 'An unexpected error occurred' };
    }
  };

  const signIn = async (
    email: string,
    password: string,
  ): Promise<{ success: boolean; error?: string }> => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) throw new Error(error.message); // Assuming error.message contains "Invalid login credentials"
      updateSessionAndProfile(data.session);
      router.replace('/(tabs)');
      return { success: true };
    } catch (error: any) {
      console.error('Error signing in:', error.message);
      return { success: false, error: error.message }; // Pass the error message back to the component
    }
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
