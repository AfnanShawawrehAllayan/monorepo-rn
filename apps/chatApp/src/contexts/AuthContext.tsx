import React, { createContext, useContext, useState, useCallback } from 'react';

interface AuthContextType {
  isAuthenticated: boolean;
  token: string | null;
  login: (token: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [token, setToken] = useState<string | null>(null);

  const login = useCallback((newToken: string) => {
    setToken(newToken);
    setIsAuthenticated(true);
    // TODO: Store token in secure storage
  }, []);

  const logout = useCallback(() => {
    setToken(null);
    setIsAuthenticated(false);
    // TODO: Clear token from secure storage
  }, []);

  return (
    <AuthContext.Provider value={{ isAuthenticated, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
