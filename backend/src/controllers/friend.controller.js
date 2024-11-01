import { z } from "zod";
import { ApiError } from "../utils/ApiError.js";
import {
  getFriends,
  addFriend,
  removeFriend,
  getPendingFriends,
  recommendFriends,
} from "../services/friendService.js";

const getUserFriends = async (req, res) => {
  const userID = req.user.id;

  const friends = await getFriends(userID);
  return res.sendResponse(200, friends, "Friend Retrived");
};

const addUserFriend = async (req, res) => {
  const user = req.user;
  const { friendUsername } = req.body;

  const messageSchema = z.object({
    friendUsername: z.string(),
  });
  const result = messageSchema.safeParse(req.body);
  if (!result.success) {
    throw new ApiError(400, "friendUsername is required!");
  }

  const friendStatus = await addFriend(user.id, friendUsername);
  return res.sendResponse(201, friendStatus, "Request Done");
};

const removeUserFriend = async (req, res) => {
  const user = req.user;
  const { friendUsername } = req.body;

  const messageSchema = z.object({
    friendUsername: z.string(),
  });
  const result = messageSchema.safeParse(req.body);
  if (!result.success) {
    throw new ApiError(400, "friendUsername is required!");
  }

  await removeFriend(user.id, friendUsername);
  return res.sendResponse(200, null, "Friend removed successfully");
};

const getPendingRequests = async (req, res) => {
  const user = req.user;
  const friends = await getPendingFriends(user.id);

  return res.sendResponse(200, friends, "Pending Request Retrived");
};

const recommendUsers = async (req, res) => {
  const user = req.user;
  const friends = await recommendFriends(user.id);

  return res.sendResponse(200, friends, "User Retrived");
};

export {
  getUserFriends,
  addUserFriend,
  removeUserFriend,
  getPendingRequests,
  recommendUsers,
};
