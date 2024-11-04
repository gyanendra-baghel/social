-- AlterTable
ALTER TABLE "User" ADD COLUMN     "bio" TEXT,
ADD COLUMN     "public" BOOLEAN NOT NULL DEFAULT true;
