import { z } from "zod";
import { authUser } from "../services/authService.js";
import {
  getUserById,
  addUser,
  deleteUser,
  searchUser,
  updateUser,
} from "../services/userServices.js";
import { ApiError } from "../utils/ApiError.js";

const registerUser = async (req, res) => {
  const { fullname, email, username, password } = req.body;
  const userSchema = z.object({
    fullname: z.string(),
    email: z.string(),
    username: z.string(),
    password: z.string(),
  });

  const result = userSchema.safeParse(req.body);
  if (!result.success) {
    throw new ApiError(400, "Please provide valid credentials");
  }

  const createdUser = await addUser(fullname, username, email, password);
  return res.sendResponse(201, createdUser, "User created successfully");
};

const loginUser = async (req, res) => {
  const { username, password } = req.body;

  const userSchema = z.object({
    username: z.string(),
    password: z.string(),
  });

  const result = userSchema.safeParse(req.body);
  if (!result.success) {
    throw new ApiError(400, "Please provide username and password");
  }

  const { user, token } = await authUser(username, password);
  const options = {
    httpOnly: true,
    secure: true,
    sameSite: "None",
  };

  return res
    .cookie("token", token, options)
    .sendResponse(200, { user, token }, "User logged In Successfully");
};

const logoutUser = async (req, res) => {
  const options = {
    httpOnly: true,
    secure: true,
    sameSite: "None",
  };

  return res
    .clearCookie("token", options)
    .sendResponse(200, null, "User logged out Successfully");
};

const searchUsers = async (req, res) => {
  const { q } = req.query;

  const searchSchema = z.object({
    q: z.string().min(1),
  });

  const result = searchSchema.safeParse(req.body);
  if (!result.success) {
    throw new ApiError(400, "Please provide input");
  }

  const users = await searchUser(q);
  return res.sendResponse(200, users, "Search result retrived");
};

const getCurrentUser = async (req, res) => {
  const user = await getUserById(req.user.id);
  return res.sendResponse(200, user, "User retrived successfully");
};

const updateCurrentUser = async (req, res) => {
  const user = req.user;
  const updatedUser = req.body;

  //  const userSchema = z.object({
  //    fullname: z.string(),
  //    email: z.string(),
  //    username: z.string(),
  //    password: z.string(),
  //  });

  //  const result = userSchema.safeParse(req.body);
  //  if (!result.success) {
  //    throw new ApiError(400, "Please provide valid credentials");
  //  }

  updateUser(user, updatedUser);
  return res.sendResponse(200, user, "Crediential Updated");
};

// Delete user by ID
const deleteCurrentUser = async (req, res) => {
  const userId = req.user.id;

  deleteUser(userId);
  return res
    .clearCookie("token", options)
    .sendResponse(200, null, "User deleted");
};

export {
  registerUser,
  loginUser,
  logoutUser,
  searchUsers,
  getCurrentUser,
  updateCurrentUser,
  deleteCurrentUser,
};
