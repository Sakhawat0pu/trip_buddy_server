/*
  Warnings:

  - Added the required column `requesterContactNo` to the `TripBuddyRequest` table without a default value. This is not possible if the table is not empty.
  - Added the required column `requesterEmail` to the `TripBuddyRequest` table without a default value. This is not possible if the table is not empty.
  - Added the required column `requesterName` to the `TripBuddyRequest` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "TripBuddyRequest" ADD COLUMN     "message" TEXT,
ADD COLUMN     "requesterAccomPreference" TEXT,
ADD COLUMN     "requesterContactNo" TEXT NOT NULL,
ADD COLUMN     "requesterEmail" TEXT NOT NULL,
ADD COLUMN     "requesterName" TEXT NOT NULL;
