import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import api from '../lib/api';
import { signOut as betterAuthSignOut, authClient } from '../lib/auth';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchUser = useCallback(async () => {
    try {
      const { data } = await api.get('/api/jwt/me');
      setUser(data.user);
    } catch {
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  const issueJwt = useCallback(async () => {
    const { data } = await api.post('/api/jwt/issue-jwt');
    setUser(data.user);
    setLoading(false);
    return data.user;
  }, []);

  useEffect(() => {
    const init = async () => {
      try {
        const session = await authClient.getSession();
        if (session?.data?.user) {
          await issueJwt();
        } else {
          await fetchUser();
        }
      } catch {
        setLoading(false);
      }
    };
    init();
  }, [fetchUser, issueJwt]);

  const syncUser = async (userData) => {
    await api.post('/api/jwt/sync-user', userData);
  };

  const logout = async () => {
    try {
      await betterAuthSignOut();
      await api.post('/api/jwt/logout');
    } catch {
      /* ignore */
    }
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, setUser, loading, fetchUser, issueJwt, syncUser, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};
