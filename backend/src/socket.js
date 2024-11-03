import { Server } from "socket.io";
import cookieParser from "socket.io-cookie";
import jwt from "jsonwebtoken";
import config from "./config/index.js";
import { saveMessageBySenderAndReceiver } from "./services/messageService.js";
import { getFriends } from "./services/friendService.js";

const socketHandler = (server) => {
  const io = new Server(server, {
    cors: {
      origin: config.corsOrigin,
      credentials: true,
    },
  });

  io.use(cookieParser);

  io.use(async (socket, next) => {
    try {
      const token = socket.request.headers.cookie?.token;
      if (!token) {
        throw new Error("Authentication error");
      }
      const decodedUser = await jwt.verify(token, process.env.JWT_SECRET);
      if (!decodedUser) {
        return new Error("Invalid Access Token");
      }
      socket.user = decodedUser;
    } catch (error) {
      console.error(error.message);
      return next(new Error(error.message || "Invalid Access Token"));
    }
    next();
  });

  const onlineUsers = new Map();

  io.on("connection", async (socket) => {
    const userID = socket.user.id;
    const username = socket.user.username;
    onlineUsers.set(username, socket.id);

    const friends = await getFriends(userID);
    friends.forEach((friend) => {
      const friendSocketId = onlineUsers.get(friend.username);
      if (friendSocketId) {
        io.to(friendSocketId).emit("user-status", {
          username,
          status: "online",
        });
      }
    });

    socket.on("sendMessage", async (msg) => {
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
        if (targetSocketId) {
          io.to(targetSocketId).emit("message", { ...msg, sender: username });
        }
      } catch (error) {
        console.error("Error sending message: ", error);
      }
    });

    socket.on("disconnect", async () => {
      onlineUsers.delete(username);
      friends.forEach((friend) => {
        const friendSocketId = onlineUsers.get(friend.username);
        if (friendSocketId) {
          io.to(friendSocketId).emit("user-status", {
            username,
            status: "offline",
          });
        }
      });
      console.log(`User disconnected: ${username}`);
    });

    // Error handling
    socket.on("error", (error) => {
      console.error(`Socket error for user ${username}:`, error);
    });

    // Send friends status
    const friendsStatus = friends.map((friend) => {
      return {
        username: friend.username,
        status: onlineUsers.has(friend.username) ? "online" : "offline",
      };
    });
    socket.emit("friends-status", friendsStatus);
    console.log(`User connected: ${username}`);
  });
};

export default socketHandler;
