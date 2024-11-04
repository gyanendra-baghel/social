import prisma, { FriendshipStatus } from "../config/db.js";
import { ApiError } from "../utils/ApiError.js";

export const getFriends = async (userId) => {
  const friends = await prisma.friend.findMany({
    where: {
      OR: [{ userId: userId }, { friendId: userId }],
      status: FriendshipStatus.ACCEPTED,
    },
    include: {
      user: {
        select: {
          id: true,
          username: true,
          fullname: true,
          avatar: true,
        },
      },
      friend: {
        select: {
          id: true,
          username: true,
          fullname: true,
          avatar: true,
        },
      },
    },
  });

  const friendsOnly = friends.map((record) =>
    record.userId == userId ? record.friend : record.user
  );
  return friendsOnly;
};

// Add a new friend
export const addFriend = async (userId, friendUsername) => {
  const friend = await prisma.user.findUnique({
    where: { username: friendUsername },
  });

  if (!friend || friend.id == userId) {
    throw new ApiError(404, "Friend not found");
  }

  const existingFriendship = await prisma.friend.findFirst({
    where: {
      OR: [
        { userId: userId, friendId: friend.id },
        { userId: friend.id, friendId: userId },
      ],
    },
  });

  if (existingFriendship) {
    if (
      existingFriendship.status == FriendshipStatus.PENDING &&
      existingFriendship.userId != userId
    ) {
      const friendStatus = await prisma.friend.update({
        where: {
          userId_friendId: {
            userId: existingFriendship.userId,
            friendId: existingFriendship.friendId,
          },
        },
        data: {
          status: FriendshipStatus.ACCEPTED,
        },
      });
      return friendStatus;
    } else {
      return existingFriendship;
    }
  }

  // Create pending friend
  try {
    const friendStatus = await prisma.friend.create({
      data: {
        userId: userId,
        friendId: friend.id,
        status: FriendshipStatus.PENDING,
      },
    });

    return friendStatus;
  } catch (error) {
    throw new ApiError(400, "Friend request failed");
  }
};

// Remove a friend
export const removeFriend = async (userId, friendUsername) => {
  const friend = await prisma.user.findUnique({
    where: { username: friendUsername },
  });

  if (!friend) {
    throw new ApiError(404, "Friend not found");
  }

  await prisma.friend.deleteMany({
    where: {
      OR: [
        { userId: userId, friendId: friend.id },
        { userId: friend.id, friendId: userId },
      ],
    },
  });
};

// Get pending friends
export const getPendingFriends = async (userId) => {
  const pendingFriends = await prisma.friend.findMany({
    where: {
      OR: [
        // { userId: userId, status: FriendshipStatus.PENDING },
        { friendId: userId, status: FriendshipStatus.PENDING },
      ],
    },
    include: {
      user: {
        select: {
          username: true,
          fullname: true,
          avatar: true,
        },
      },
    },
  });

  const friendsOnly = pendingFriends.map((record) => record.user);

  return friendsOnly;
};

// Recommend friends
export const recommendFriends = async (userId) => {
  const friends = await getFriends(userId);

  const friendIds = friends.map((friend) => friend.id);

  const recommendedUsers = await prisma.user.findMany({
    where: {
      AND: [
        { id: { notIn: [...friendIds, userId] }, public: false }, // Exclude current user and existing friends
      ],
    },
    select: {
      id: true,
      username: true,
      fullname: true,
    },
    take: 20,
  });

  return recommendedUsers;
};
