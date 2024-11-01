import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import prisma from "../config/db.js";
import { ApiError } from "../utils/ApiError.js";

const JWT_SECRET = process.env.JWT_SECRET || "your_jwt_secret";
const JWT_EXPIRES_IN = "1h";

export const authUser = async (username, password) => {
  const user = await prisma.user.findUnique({
    where: { username },
  });

  if (!user) {
    throw new ApiError(401, "Invalid credentials");
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    throw new ApiError(401, "Invalid credentials");
  }

  const token = jwt.sign({ id: user.id, username: user.username }, JWT_SECRET, {
    expiresIn: JWT_EXPIRES_IN,
  });

  return { user, token };
};

export const authenticateToken = async (req, res, next) => {
  try {
    const token =
      req.cookies?.token || req.header("Authorization")?.replace("Bearer ", "");

    if (!token) {
      return res.sendResponse(401, null, "Unauthorized request");
    }

    const decodedTokenUser = jwt.verify(token, JWT_SECRET);

    if (!decodedTokenUser.id) {
      return res.sendResponse(401, null, "Invalid Access Token");
    }

    req.user = decodedTokenUser;
    next();
  } catch (error) {
    const options = {
      httpOnly: true,
      secure: true,
      sameSite: "None",
    };

    return res
      .status(401)
      .clearCookie("token", options)
      .json({ message: error?.message || "Invalid Access Token" });
  }
};
