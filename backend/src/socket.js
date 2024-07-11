import { Server } from "socket.io";
import cookieParser from "socket.io-cookie"
import { User } from "./models/user.model.js";
import jwt from "jsonwebtoken"
import config from "./config/index.js";
import { saveMessage } from "./utils/messages.js";

const socketHandler = (server) => {
  const io = new Server(server, {
    cors: {
      origin: config.corsOrigin,
      credentials: true
    }
  });

  io.use(cookieParser);

  io.use(async (socket, next) => {
    const token = socket.request.headers.cookie?.accessToken;
    if (!token) {
      return next(new Error('Authentication error'));
    }
    const decodedToken = await jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    const user = await User.findById(decodedToken?._id).select("-password -refreshToken")

    if (!user) {
      return next(new Error("Invalid Access Token"))
    }

    socket.user = user;
    next()
  });

  const onlineUsers = new Map();

  io.on("connection", (socket) => {
    const username = socket.user.username;
    // if (onlineUsers.has(username)) {
    //   console.log(`User connection rejected: ${username} is already connected. ${socket.id}`);
    //   socket.disconnect(true);
    //   return;
    // }
    console.log(`User connected: ${username} ${socket.id}`);
    onlineUsers.set(username, socket.id);
    // console.log(Array.from(onlineUsers.keys()));

    socket.on("sendMessage", async (msg) => {
      if (['receiver', 'type', 'content'].some((index) => !msg[index])) {
        console.log({ ...msg, sender: username });
        return;
      }
      saveMessage({ senderUsername: username, receiverUsername: msg.receiver, type: msg.type, content: msg.content });
      // console.log({ ...msg, sender: username });
      const targetSocketId = onlineUsers.get(msg.receiver);
      if (targetSocketId) {
        io.to(targetSocketId).emit("message", { ...msg, sender: username });
      }
    });

    socket.on("disconnect", async () => {
      onlineUsers.delete(username);
      console.log(`User disconnected: ${username}`);
    });

    // Error handling
    socket.on("error", (error) => {
      console.error(`Socket error for user ${username}:`, error);
    });
  });
}

export default socketHandler