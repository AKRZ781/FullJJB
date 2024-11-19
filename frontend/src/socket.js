import { io } from "socket.io-client";

let socket = null;

export const initializeSocket = (token) => {
  if (!token) {
    console.error("Token is missing. Cannot initialize socket.");
    return null;
  }

  socket = io("http://localhost:8081", {
    transports: ["websocket"],
    auth: { token },
    withCredentials: true,
  });

  socket.on("connect", () => {
    console.log("Socket connected:", socket.id);
  });

  socket.on("connect_error", (err) => {
    console.error("Socket connection error:", err.message);
  });

  socket.on("disconnect", () => {
    console.log("Socket disconnected");
  });

  return socket;
};

export const getSocket = () => socket;

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    console.log("Socket disconnected manually");
  }
};
