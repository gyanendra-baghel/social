/*
  Warnings:

  - You are about to drop the `FriendRequest` table. If the table is not empty, all the data it contains will be lost.

*/
-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "FriendshipStatus" ADD VALUE 'PENDING';
ALTER TYPE "FriendshipStatus" ADD VALUE 'DECLINED';

-- DropForeignKey
ALTER TABLE "FriendRequest" DROP CONSTRAINT "FriendRequest_fromUserId_fkey";

-- DropForeignKey
ALTER TABLE "FriendRequest" DROP CONSTRAINT "FriendRequest_toUserId_fkey";

-- DropTable
DROP TABLE "FriendRequest";

-- DropEnum
DROP TYPE "RequestStatus";
