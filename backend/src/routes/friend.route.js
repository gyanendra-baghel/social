import { Router } from "express";
import { asyncHandler } from "../utils/asyncHandler.js";
import { authenticateToken } from "../services/authService.js";
import {
  getUserFriends,
  addUserFriend,
  removeUserFriend,
  getPendingRequests,
  recommendUsers,
} from "../controllers/friend.controller.js";

const router = Router();

router.route("/").get(authenticateToken, asyncHandler(getUserFriends));
router.route("/add").post(authenticateToken, asyncHandler(addUserFriend)); // Request and Add Friend
router.route("/remove").post(authenticateToken, asyncHandler(removeUserFriend));
router.route("/request").post(authenticateToken, asyncHandler(addUserFriend));
router
  .route("/recommends")
  .post(authenticateToken, asyncHandler(recommendUsers));
router
  .route("/pendings")
  .get(authenticateToken, asyncHandler(getPendingRequests));

export default router;
