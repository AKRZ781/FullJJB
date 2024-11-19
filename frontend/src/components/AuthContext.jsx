import React, { createContext, useContext, useEffect, useState } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [authenticated, setAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const apiUrl = import.meta.env.VITE_API_URL;

  useEffect(() => {
    const fetchAuthStatus = async () => {
      try {
        const res = await axios.get(`${apiUrl}/api/auth/whoami`, { withCredentials: true });

        if (res.data.Status === "Success") {
          setAuthenticated(true);
          setUser(res.data.User);
        } else {
          setAuthenticated(false);
        }
      } catch (err) {
        setAuthenticated(false);
      } finally {
        setLoading(false);
      }
    };

    fetchAuthStatus();
  }, [apiUrl]);

  return (
    <AuthContext.Provider value={{ authenticated, user, loading }}>
      {children}
    </AuthContext.Provider>
  );
};
