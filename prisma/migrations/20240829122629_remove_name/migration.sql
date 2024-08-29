/*
  Warnings:

  - You are about to drop the column `name` on the `question` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "question" DROP COLUMN "name",
ALTER COLUMN "attributes" DROP NOT NULL;
