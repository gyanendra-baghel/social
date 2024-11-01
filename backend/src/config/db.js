import { PrismaClient, FriendshipStatus, MessageType } from "@prisma/client";

const prisma = new PrismaClient({
  log: ["error", "warn"],
});

export default prisma;

export { FriendshipStatus, MessageType };
