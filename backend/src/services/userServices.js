import prisma from "../config/db.js";
import bcrypt from "bcrypt";
import { ApiError } from "../utils/ApiError.js";

export const getUserByUsername = async (username) => {
  const user = await prisma.user.findUnique({ where: { username } });
  if (!user) {
    throw new ApiError(404, "User not found");
  }
  return user;
};

export const getUserById = async (id) => {
  const user = await prisma.user.findUnique({ where: { id } });
  if (!user) {
    throw new Error("User not found");
  }
  return user;
};

export const addUser = async (fullname, username, email, password) => {
  const hashedPassword = await bcrypt.hash(password, 10);

  if (
    await prisma.user.findFirst({ where: { OR: [{ username }, { email }] } })
  ) {
    throw new ApiError(400, "Username or email already exists");
  }
  newUser = await prisma.user.create({
    data: {
      fullname,
      username,
      email,
      password: hashedPassword,
    },
  });

  return newUser;
};

// Search users by query
export const searchUser = async (query) => {
  if (!query || typeof query !== "string" || query.trim().length === 0) {
    return { users: [], message: "Please enter words." };
  }

  const users = await prisma.user.findMany({
    where: {
      OR: [
        { username: { contains: query, mode: "insensitive" } },
        { fullname: { contains: query, mode: "insensitive" } },
      ],
    },
    select: {
      username: true,
      fullname: true,
    },
    take: 20,
  });

  return users;
};

// Update the current user
export const updateUser = async (user, updates) => {
  const { fullName, email, password } = updates;
  const data = {};

  if (fullName) data.fullname = fullName;
  if (email) data.email = email;
  if (password) data.password = await bcrypt.hash(password, 10); // Hash the password if updating

  const updatedUser = await prisma.user.update({
    where: { id: user.id },
    data,
  });

  return updatedUser;
};

export const deleteUser = async (userId) => {
  // Step 1: Remove the user from their friends' lists
  const userFriends = await prisma.friend.findMany({
    where: {
      OR: [{ userId }, { friendId: userId }],
    },
  });

  for (const friend of userFriends) {
    await prisma.friend.delete({ where: { id: friend.id } });
  }

  // Step 2: Delete user-related messages
  await prisma.directMessage.deleteMany({
    where: {
      senderId: userId,
    },
  });

  // Step 3: Delete the user
  await prisma.user.delete({
    where: { id: userId },
  });
};
