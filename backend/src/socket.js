import { Server } from "socket.io";
import cookieParser from "socket.io-cookie";
import jwt from "jsonwebtoken";
import config from "./config/index.js";
import { saveMessageBySenderAndReceiver } from "./services/messageService.js";

const socketHandler = (server) => {
  const io = new Server(server, {
    cors: {
      origin: config.corsOrigin,
      credentials: true,
    },
  });

  io.use(cookieParser);

  io.use(async (socket, next) => {
    const token = socket.request.headers.cookie?.token;
    console.log("Token: ", token);
    if (!token) {
      return next(new Error("Authentication error"));
    }
    const decodedUser = await jwt.verify(token, process.env.JWT_SECRET);

    if (!decodedUser) {
      return next(new Error("Invalid Access Token"));
    }

    socket.user = decodedUser;
    next();
  });

  const onlineUsers = new Map();

  io.on("connection", (socket) => {
    const userID = socket.user.id;
    const username = socket.user.username;
    onlineUsers.set(username, socket.id);

    socket.on("sendMessage", async (msg) => {
      // console.log("Message: ", msg);
      try {
        if (
          ["receiverUsername", "type", "content"].some((index) => !msg[index])
        ) {
          console.log("Invalid message", msg);
          return;
        }
        if (msg.senderUsername !== username) {
          console.log("Unauthorized sender");
          return;
        }
        await saveMessageBySenderAndReceiver(
          userID,
          msg.receiverUsername,
          msg.content
        );

        const targetSocketId = onlineUsers.get(msg.receiverUsername);
        console.log("Target Socket ID: ", targetSocketId);
        if (targetSocketId) {
          io.to(targetSocketId).emit("message", { ...msg, sender: username });
        }
      } catch (error) {
        console.error("Error sending message: ", error);
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
};

export default socketHandler;
