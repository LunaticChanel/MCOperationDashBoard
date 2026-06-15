'use client';

import { useAuth, UserRole } from '@/context/AuthContext';
import { ReactNode } from 'react';

interface RoleGuardProps {
  allowedRoles: UserRole[];
  children: ReactNode;
  fallback?: ReactNode;
}

export default function RoleGuard({ 
  allowedRoles, 
  children, 
  fallback = null 
}: RoleGuardProps) {
  const { user, profile, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-4">
        <div className="w-6 h-6 border-2 border-amber-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  // Not logged in, not approved, or role not allowed
  if (!user || !profile || !profile.is_approved || !allowedRoles.includes(profile.role)) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
}
