'use client';

import { useEffect, useState } from 'react';
import {
  CurrentUser,
  getCurrentUser,
  getToken,
  isAuthenticated as checkAuthenticated,
} from '@/lib/auth';

export function useAuth() {
  const [user, setUser] = useState<CurrentUser | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = getToken();
    const authenticated = checkAuthenticated();
    const currentUser = getCurrentUser();

    setIsAuthenticated(!!token && authenticated);
    setUser(currentUser);
    setLoading(false);
  }, []);

  return {
    user,
    isAuthenticated,
    loading,
  };
}