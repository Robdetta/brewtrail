import { useRouter, useSegments } from 'expo-router';
import * as React from 'react';

// Define the shape of the context
interface AuthContextType {
  user: string | undefined;
  signIn: () => void;
  signOut: () => void;
}

// Create the context
const AuthContext = React.createContext<AuthContextType | undefined>(undefined);

// Custom hook to access the context
export function useAuth() {
  const context = React.useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

// Provider component to wrap the application and provide authentication context
export function AuthProvider({ children }: React.PropsWithChildren<{}>) {
  const rootSegment = useSegments()[0];
  const router = useRouter();
  const [user, setUser] = React.useState<string | undefined>(undefined);

  React.useEffect(() => {
    if (user === undefined) return;

    if (!user && rootSegment !== '(auth)') {
      router.replace('/(modals)/login');
    } else if (user && rootSegment === '(app)') {
      router.replace('/');
    }
  }, [user, rootSegment]);

  // Function to sign in
  const signIn = () => {
    setUser('Rob');
  };

  // Function to sign out
  const signOut = () => {
    setUser('');
  };

  // Value object to be provided by the context
  const authContextValue: AuthContextType = {
    user,
    signIn,
    signOut,
  };

  return (
    <AuthContext.Provider value={authContextValue}>
      {children}
    </AuthContext.Provider>
  );
}
