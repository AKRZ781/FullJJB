import React, { createContext, useContext, useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import axios from 'axios';

const SocketContext = createContext();

export const useSocket = () => useContext(SocketContext);

const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const getTokenFromCookie = (cookieName) => {
    const cookie = document.cookie
      .split('; ')
      .find(row => row.startsWith(`${cookieName}=`));
    return cookie ? cookie.split('=')[1] : null;
  };

  const connectSocket = async (token) => {
    const newSocket = io(import.meta.env.VITE_API_URL, {
      auth: { token },
      withCredentials: true
    });

    newSocket.on('connect', () => {
      console.log('Socket connected:', newSocket.id);
    });

    newSocket.on('connect_error', async (err) => {
      console.error('Socket connection error:', err);
      if (err.message.includes("Authentication error: Invalid token") && !isRefreshing) {
        setIsRefreshing(true);
        try {
          const res = await axios.post(`${import.meta.env.VITE_API_URL}/api/auth/refresh-token`, {}, { withCredentials: true });
          const newToken = res.data.token;
          document.cookie = `token=${newToken}; path=/; secure; httponly; samesite=strict`;
          newSocket.disconnect();
          connectSocket(newToken);
        } catch (refreshErr) {
          console.error('Error refreshing token:', refreshErr);
        } finally {
          setIsRefreshing(false);
        }
      }
    });

    newSocket.on('disconnect', () => {
      console.log('Socket disconnected');
    });

    setSocket(newSocket);
  };

  useEffect(() => {
    const token = getTokenFromCookie('token');
    if (token) {
      connectSocket(token);
    }
  }, []);

  return (
    <SocketContext.Provider value={socket}>
      {children}
    </SocketContext.Provider>
  );
};

export default SocketProvider;
