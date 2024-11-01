import { z } from "zod";
import {
  getChatMessagesBetweenUsers,
  saveMessageBySenderAndReceiver,
} from "../services/messageService.js";
import { ApiError } from "../utils/ApiError.js";

const getMessages = async (req, res) => {
  const user = req.user;
  const { receiver } = req.body;

  const messageSchema = z.object({
    receiver: z.string(),
  });

  const result = messageSchema.safeParse(req.body);
  if (!result.success) {
    throw new ApiError(400, "Please provide receiver");
  }

  const messages = await getChatMessagesBetweenUsers(user.id, receiver);
  return res.sendResponse(200, messages, "");
};

const sendMessage = async (req, res) => {
  const sender = req.user;
  let { receiver, content, type } = req.body;

  const messageSchema = z.object({
    receiver: z.string(),
    content: z.string(),
    type: z.string(),
  });
  const result = messageSchema.safeParse(req.body);
  if (!result.success) {
    throw new ApiError(400, "Please provide receiver");
  }

  await saveMessageBySenderAndReceiver(sender.id, receiver, content);
  return res.sendResponse(200, message, "Message Saved");
};

export { sendMessage, getMessages };
