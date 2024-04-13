import { supabase } from '@/lib/supabase-client';
import { Session } from '@supabase/supabase-js';
import {
  PropsWithChildren,
  createContext,
  useContext,
  useEffect,
  useState,
} from 'react';

interface UserProfile {
  auth_uid: string | null;
  created_at: string;
  email: string | null;
  id: number;
  name: string | null;
  password_hash: string | null;
  updated_at: string;
  isAdmin: boolean; // Ensure this matches the actual data
}

type AuthData = {
  session: Session | null;
  profile: UserProfile | null;
  loading: boolean;
  isAdmin: boolean;
};

const AuthContext = createContext<AuthData>({
  session: null,
  loading: true,
  profile: null,
  isAdmin: false,
});

export default function AuthProvider({ children }: PropsWithChildren) {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSession = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      setSession(session);

      if (session) {
        const { data } = await supabase
          .from('app_users')
          .select('*')
          .eq('id', session.user.id)
          .single();
        if (Error) {
          console.error('Error fetching user profile:', Error);
        } else {
          setUser(data as UserProfile); // Assuming `user` includes any custom fields like `isAdmin`
        }
      }

      setLoading(false);
    };

    fetchSession();
    supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });
  }, []);

  return (
    <AuthContext.Provider
      value={{
        session,
        loading,
        profile: user,
        isAdmin: user?.isAdmin ?? false,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
