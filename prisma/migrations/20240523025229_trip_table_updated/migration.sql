/*
  Warnings:

  - Added the required column `description` to the `Trip` table without a default value. This is not possible if the table is not empty.
  - Made the column `tripType` on table `Trip` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Trip" ADD COLUMN     "description" TEXT NOT NULL,
ADD COLUMN     "photos" TEXT[],
ALTER COLUMN "tripType" SET NOT NULL;
