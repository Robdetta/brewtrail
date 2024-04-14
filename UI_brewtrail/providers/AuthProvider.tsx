import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase-client';
import { Session, User } from '@supabase/supabase-js';

interface UserProfile {
  auth_uid?: string | null;
  created_at?: string;
  email?: string | null;
  id?: number;
  name?: string | null;
  password_hash?: string | null;
  updated_at?: string;
  isAdmin?: boolean; // Ensure this matches the actual data
}

type AuthData = {
  session: Session | null;
  profile: UserProfile | null;
  loading: boolean;
  isAdmin: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthData>({
  session: null,
  profile: null,
  loading: true,
  isAdmin: false,
  signIn: async () => {},
  signUp: async () => {},
  signOut: async () => {},
});

export const AuthProvider = ({ children }: React.PropsWithChildren<{}>) => {
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSession = async () => {
      setLoading(true);
      const { data: sessionData, error } = await supabase.auth.getSession();
      if (sessionData && sessionData.session) {
        setSession(sessionData.session);
        setProfile(sessionData.session.user as UserProfile); // Safe casting if user matches UserProfile
      } else {
        console.error('Error fetching session:', error);
      }
      setLoading(false);
    };

    fetchSession();

    const { data: listener } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        setSession(session);
        setProfile(session?.user as unknown as UserProfile); // Again, ensure safe casting
      },
    );

    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);

  const signIn = async (email: string, password: string) => {
    setLoading(true);
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    setLoading(false);

    if (error) {
      console.error('Sign-in error:', error.message);
      return;
    }

    if (data) {
      setSession(data.session);
      setUser(data.session.user); // Make sure you understand what's being returned
    }
  };

  const signUp = async (email: string, password: string) => {
    setLoading(true);
    const { data, error } = await supabase.auth.signUp({ email, password });
    setLoading(false);

    if (error) {
      console.error('Sign-up error:', error.message);
      return;
    }

    if (data) {
      setSession(data?.session);
      setUser(data.session.user); // Adjust as per the actual API
    }
  };

  const signOut = async () => {
    setLoading(true);
    const { error } = await supabase.auth.signOut();
    setLoading(false);
    if (error) {
      console.error('Sign-out error:', error.message);
      return;
    }
    setSession(null);
    setProfile(null);
  };

  return (
    <AuthContext.Provider
      value={{
        session,
        profile,
        loading,
        isAdmin: profile?.isAdmin ?? false,
        signIn,
        signUp,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
function setUser(user: User) {
  throw new Error('Function not implemented.');
}
