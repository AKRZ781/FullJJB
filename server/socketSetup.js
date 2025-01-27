import { Server } from "socket.io";
import jwt from "jsonwebtoken";
import User from "./models/userModel.js";
import Message from "./models/chatModel.js";

const setupSocket = (server) => {
  const io = new Server(server, {
    cors: {
      origin: process.env.FRONTEND_URL || "http://localhost:5173",
      methods: ["GET", "POST"],
      credentials: true,
    },
  });

  io.use((socket, next) => {
    const token = socket.handshake.auth.token;
    if (!token) return next(new Error("Authentication error: No token provided"));

    try {
      const user = jwt.verify(token, process.env.JWT_SECRET);
      socket.userId = user.id;
      next();
    } catch (err) {
      return next(new Error("Authentication error: Invalid or expired token"));
    }
  });

  io.on("connection", (socket) => {

    socket.on("fetch_messages", async () => {
      try {
        const messages = await Message.findAll({
          include: [{ model: User, as: "sender", attributes: ["id", "name"] }],
          order: [["createdAt", "ASC"]],
        });
        socket.emit("previous_messages", messages);
      } catch (error) {
        console.error("Error fetching messages:", error);
        socket.emit("fetch_error", { error: "Failed to fetch messages." });
      }
    });

    socket.on("create_message", async (data) => {
      const { message } = data;
      try {
        const newMessage = await Message.create({ sender_id: socket.userId, message });
        const user = await User.findByPk(socket.userId);
        io.emit("new_chat_message", {
          ...newMessage.toJSON(),
          sender: { id: user.id, name: user.name },
        });
      } catch (error) {
        console.error("Error creating message:", error);
      }
    });

    socket.on("delete_message", async (msgId) => {
      try {
        await Message.destroy({ where: { id: msgId } });
        io.emit("message_deleted", msgId);
      } catch (error) {
        console.error("Error deleting message:", error);
      }
    });

    socket.on("disconnect", () => {
    });
  });

  return io;
};

export default setupSocket;