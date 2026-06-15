'use client';

import { createContext, useContext, useEffect, useState, ReactNode, useCallback } from 'react';
import { createClient, isSupabaseConfigured } from '@/utils/supabase/client';
import { User, AuthChangeEvent, Session } from '@supabase/supabase-js';

export type UserRole = 'admin' | 'desk' | 'nurse' | 'marketing';

export interface Profile {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  is_approved: boolean;
  updated_at: string;
  created_at: string;
}

interface AuthContextType {
  user: User | null;
  profile: Profile | null;
  isLoading: boolean;
  signOut: () => Promise<void>;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Define developer mode mock data for easy UI viewing without database configuration
const MOCK_DEV_USER = {
  id: 'dev-user-id',
  email: 'developer@reviv.clinic',
  user_metadata: { name: '개발자 관리자' }
} as unknown as User;

const MOCK_DEV_PROFILE: Profile = {
  id: 'dev-user-id',
  email: 'developer@reviv.clinic',
  name: '개발용 관리자(Admin)',
  role: 'admin',
  is_approved: true,
  updated_at: new Date().toISOString(),
  created_at: new Date().toISOString()
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Initialize Supabase only if correctly configured
  const supabase = isSupabaseConfigured() ? createClient() : null;

  const fetchProfile = useCallback(async (userId: string) => {
    if (!supabase) {
      setUser(MOCK_DEV_USER);
      setProfile(MOCK_DEV_PROFILE);
      setIsLoading(false);
      return;
    }

    try {
      // Get current authenticated user details from Supabase auth
      const { data: { user: currentUser } } = await supabase.auth.getUser();
      const devEmail = process.env.NEXT_PUBLIC_DEV_ADMIN_EMAIL;
      const isDevAdmin = devEmail && currentUser?.email === devEmail;

      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();
      
      if (error) {
        console.error('Failed to fetch profile:', error);
        if (isDevAdmin && currentUser) {
          // Grant mock admin profile for developer account even if DB profiles entry is missing
          setProfile({
            id: userId,
            email: currentUser.email!,
            name: currentUser.user_metadata?.full_name || currentUser.user_metadata?.name || 'Developer Admin',
            role: 'admin',
            is_approved: true,
            updated_at: new Date().toISOString(),
            created_at: new Date().toISOString()
          });
        } else {
          setProfile(null);
        }
      } else {
        const profileData = data as Profile;
        if (isDevAdmin) {
          // Force override role/approval for developer email bypass
          setProfile({
            ...profileData,
            role: 'admin',
            is_approved: true
          });
        } else {
          setProfile(profileData);
        }
      }
    } catch (err) {
      console.error('Profile fetch error:', err);
      setProfile(null);
    }
  }, [supabase]);

  const refreshProfile = useCallback(async () => {
    if (user) {
      await fetchProfile(user.id);
    }
  }, [user, fetchProfile]);

  useEffect(() => {
    // 1. Bypass mode: inject developer session when Supabase variables are dummy.
    // Defer setting state to microtask to prevent react-hooks/set-state-in-effect warning.
    if (!supabase) {
      Promise.resolve().then(() => {
        setUser(MOCK_DEV_USER);
        setProfile(MOCK_DEV_PROFILE);
        setIsLoading(false);
      });
      return;
    }

    const fetchSession = async () => {
      setIsLoading(true);
      const { data: { session } } = await supabase.auth.getSession();
      
      if (session) {
        setUser(session.user);
        await fetchProfile(session.user.id);
      } else {
        setUser(null);
        setProfile(null);
      }
      setIsLoading(false);
    };

    fetchSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event: AuthChangeEvent, session: Session | null) => {
      if (session) {
        setUser(session.user);
        await fetchProfile(session.user.id);
      } else {
        setUser(null);
        setProfile(null);
      }
      setIsLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [fetchProfile, supabase]);

  const signOut = async () => {
    if (supabase) {
      await supabase.auth.signOut();
    }
    setUser(null);
    setProfile(null);
  };

  return (
    <AuthContext.Provider value={{ user, profile, isLoading, signOut, refreshProfile }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
