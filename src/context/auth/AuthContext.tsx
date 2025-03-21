'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';
import { UserProfile, getUserProfile } from '@/api/profile';

interface User {
  token: string;
  profile?: UserProfile;
}

interface AuthContextType {
  user: User | null;
  login: (token: string) => void;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const router = useRouter();

  const loadUserProfile = async (token: string) => {
    const result = await getUserProfile(token);
    if (result.success && result.profile) {
      setUser(currentUser => 
        currentUser ? { ...currentUser, profile: result.profile } : null
      );
    }
  };

  useEffect(() => {
    const token = Cookies.get('token');
    if (token) {
      setUser({ token });
      loadUserProfile(token);
    }
  }, []);

  const login = (token: string) => {
    Cookies.set('token', token, {
      expires: 7,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict'
    });
    setUser({ token });
    loadUserProfile(token);
  };

  const logout = () => {
    Cookies.remove('token');
    setUser(null);
    router.push('/auth/login');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}; 