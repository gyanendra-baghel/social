import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
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

router.route("/signup").post(registerUser);
router.route("/login").post(loginUser);
router.route("/logout").post(verifyJWT, logoutUser);
router.route("/search").get(verifyJWT, searchUsers);
router
  .route("/")
  .get(verifyJWT, getCurrentUser)
  .post(verifyJWT, updateCurrentUser)
  .delete(verifyJWT, deleteCurrentUser);

export default router;
