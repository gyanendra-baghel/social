import prisma, { MessageType } from "../config/db.js";
import { ApiError } from "../utils/ApiError.js";
import { getUserByUsername } from "./userServices.js";

export const saveMessageBySenderAndReceiver = async (
  senderId,
  receiverUsername,
  content,
  messageType = MessageType.TEXT
) => {
  const receiver = await prisma.user.findUnique({
    where: { username: receiverUsername },
  });

  console.log(receiverUsername);

  if (!receiver) {
    throw new ApiError(404, "Friend not found");
  }
  const receiverId = receiver.id;
  // Step 1: Find an existing Chat between the sender and receiver
  let chat = await prisma.chat.findFirst({
    where: {
      OR: [
        { userOneId: senderId, userTwoId: receiverId },
        { userOneId: receiverId, userTwoId: senderId },
      ],
    },
  });

  try {
    // Step 2: If no Chat exists, create a new one
    if (!chat) {
      chat = await prisma.chat.create({
        data: {
          userOneId: senderId,
          userTwoId: receiverId,
        },
      });
    }
    // Step 3: Create and save the new Message
    const message = await prisma.message.create({
      data: {
        chatId: chat.id,
        senderId,
        content,
        messageType,
      },
    });
  } catch (error) {
    throw new ApiError(400, "Failed to send message");
  }

  return message;
};

export const getMessages = async (chatId) => {
  const messages = await prisma.directMessage.findMany({
    where: {
      chatId: chatId,
    },
    orderBy: {
      createdAt: "asc",
    },
    include: {
      sender: {
        select: {
          id: true,
          username: true,
          fullname: true,
        },
      },
    },
  });

  return messages;
};

// Delete a message by ID
export const deleteMessage = async (messageId) => {
  const deletedMessage = await prisma.directMessage.delete({
    where: {
      id: messageId,
    },
  });

  return deletedMessage;
};

// Mark a message as seen
export const markMessageAsSeen = async (messageId) => {
  const updatedMessage = await prisma.directMessage.update({
    where: {
      id: messageId,
    },
    data: {
      seen: true,
    },
  });

  return updatedMessage;
};

// Fetch all messages for a user across all chats
export const getAllMessagesForUser = async (userId) => {
  const chats = await prisma.directChat.findMany({
    where: {
      OR: [{ userOneId: userId }, { userTwoId: userId }],
    },
    include: {
      messages: {
        include: {
          sender: {
            select: {
              id: true,
              username: true,
              fullname: true,
            },
          },
        },
      },
    },
  });

  return chats;
};

export const getChatMessagesBetweenUsers = async (
  userOneId,
  userTwoUsername
) => {
  const userTwo = await getUserByUsername(userTwoUsername);
  const userTwoId = userTwo.id;

  const chat = await prisma.chat.findFirst({
    where: {
      OR: [
        { userOneId: userOneId, userTwoId: userTwoId },
        { userOneId: userTwoId, userTwoId: userOneId },
      ],
    },
    include: {
      messages: {
        include: {
          sender: { select: { username: true } }, // Include sender's username
        },
      },
      userOne: { select: { username: true } }, // Include userOne's username
      userTwo: { select: { username: true } }, // Include userTwo's username
    },
  });

  if (!chat) {
    return [];
  }

  // Format the response with sender and receiver details for each message
  const formattedMessages = chat.messages.map((message) => ({
    id: message.id,
    content: message.content,
    messageType: message.messageType,
    seen: message.seen,
    deleted: message.deleted,
    createdAt: message.createdAt,
    senderUsername: message.sender.username,
    receiverUsername:
      message.senderId === chat.userOneId
        ? chat.userTwo.username
        : chat.userOne.username,
  }));

  return formattedMessages;
};

export const getChatIdByUsernames = async (
  senderUsername,
  receiverUsername
) => {
  // Fetch user IDs for sender and receiver
  const sender = await prisma.user.findUnique({
    where: { username: senderUsername },
    select: { id: true },
  });

  const receiver = await prisma.user.findUnique({
    where: { username: receiverUsername },
    select: { id: true },
  });

  if (!sender || !receiver) {
    throw new ApiError(404, "One or both users not found");
  }

  // Find the chat between the two users
  const chat = await prisma.chat.findFirst({
    where: {
      OR: [
        { userOneId: sender.id, userTwoId: receiver.id },
        { userOneId: receiver.id, userTwoId: sender.id },
      ],
    },
    select: { id: true },
  });

  return chat ? chat.id : null;
};
