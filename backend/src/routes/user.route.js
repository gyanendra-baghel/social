import { Router } from "express";
import { authenticateToken } from "../services/authService.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import {
  loginUser,
  registerUser,
  logoutUser,
  searchUsers,
  getCurrentUser,
  updateCurrentUser,
  deleteCurrentUser,
} from "../controllers/user.controller.js";

const router = Router();

router.route("/signup").post(asyncHandler(registerUser));
router.route("/login").post(asyncHandler(loginUser));
router.route("/logout").post(authenticateToken, asyncHandler(logoutUser));
router.route("/search").get(authenticateToken, asyncHandler(searchUsers));
router
  .route("/")
  .get(authenticateToken, asyncHandler(getCurrentUser))
  .post(authenticateToken, asyncHandler(updateCurrentUser))
  .delete(authenticateToken, asyncHandler(deleteCurrentUser));

export default router;
