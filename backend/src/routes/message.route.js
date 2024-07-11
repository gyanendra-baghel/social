import { Router } from "express"
import { verifyJWT } from "../middlewares/auth.middleware.js"
import { getMessages, sendMessage } from "../controllers/message.controller.js"

const router = Router()

router.route('/').get(verifyJWT, getMessages);
router.route("/send").post(verifyJWT, sendMessage);

export default router