import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from 'react';

import type { User } from 'firebase/auth';

import {
  listenToAuthChanges,
  logoutUser,
} from '@/services/firebase/auth';

interface AuthContextValue {
  user: User | null;
  loading: boolean;
  logout: () => Promise<void>;
}

const AuthContext =
  createContext<AuthContextValue | undefined>(
    undefined
  );

export function AuthProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [user, setUser] =
    useState<User | null>(null);

  const [loading, setLoading] =
    useState(true);

  useEffect(() => {
    const unsubscribe =
      listenToAuthChanges((currentUser) => {
        setUser(currentUser);
        setLoading(false);
      });

    return unsubscribe;
  }, []);

  const logout = async () => {
    await logoutUser();
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error(
      'useAuth deve ser usado dentro de AuthProvider'
    );
  }

  return context;
}
