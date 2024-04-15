import { useRouter, useSegments } from 'expo-router';
import * as React from 'react';
import { Session } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase-client';

// Define the shape of the context

interface AuthContextType {
  session: Session | null;
  loading: boolean;
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
  const [loading, setLoading] = React.useState(true); // Initialize loading state
  const router = useRouter();

  React.useEffect(() => {
    const updateSession = (session: Session | null) => {
      setSession(session);
      setLoading(false); // Set loading to false once the session is determined
    };

    supabase.auth.getSession().then(({ data: { session } }) => {
      updateSession(session);
    });

    supabase.auth.onAuthStateChange((_event, session) => {
      updateSession(session);
    });
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
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) throw error;
    if (data.session) setSession(data.session);
    router.replace('/(tabs)');
  };

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    setSession(null);
    router.replace('/(modals)/login');
  };

  return (
    <AuthContext.Provider value={{ session, loading, signUp, signIn, signOut }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
