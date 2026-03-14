import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import config from "./config/index.js";
import { responseHandler } from "./utils/responseHandler.js";

const app = express();

app.use(
  cors({
    origin: (origin, callback) => callback(null, true), // Allow all origins
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);



app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(cookieParser());

app.use(responseHandler);

import userRouter from "./routes/user.route.js";
import healthRouter from "./routes/health.route.js";
import friendRouter from "./routes/friend.route.js";
import messageRouter from "./routes/message.route.js";
import { error } from "console";

app.use("/api/v1/user", userRouter);
app.use("/api/v1/friend", friendRouter);
app.use("/api/v1/health", healthRouter);
app.use("/api/v1/message", messageRouter);

app.use((err, req, res, next) => {
  // TODO: Log the error stack for debugging purposes
  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal Server Error";

  if (process.env.NODE_ENV === "development") {
    console.log(err);
  }
  return res.status(statusCode).json({
    success: false,
    message,
    ...(process.env.NODE_ENV === "development" && { stack: err.stack }), // Send stack only in development
  });
});

export { app };
