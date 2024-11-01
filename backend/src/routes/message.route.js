import { Router } from "express";
import { authenticateToken } from "../services/authService.js";
import { getMessages, sendMessage } from "../controllers/message.controller.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const router = Router();

router.route("/").post(authenticateToken, asyncHandler(getMessages));
router.route("/send").post(authenticateToken, asyncHandler(sendMessage));

export default router;
