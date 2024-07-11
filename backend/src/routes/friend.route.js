import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import {
  addFriend,
  addPendingFriend,
  getFriends,
  pendingFriends,
  recommendFriends,
  removeFriend,
} from "../controllers/friend.controller.js";

const router = Router();

router.route("/").get(verifyJWT, getFriends);
router.route("/pendings").get(verifyJWT, pendingFriends);
router.route("/add").post(verifyJWT, addFriend);
router.route("/request").post(verifyJWT, addPendingFriend);
router.route("/remove").post(verifyJWT, removeFriend);
router.route("/recommends").post(verifyJWT, recommendFriends);

export default router;
