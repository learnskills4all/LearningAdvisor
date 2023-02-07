/*
 Warnings:
 
 - Added the required column `order` to the `SubArea` table without a default value. This is not possible if the table is not empty.
 
 */
-- AlterTable
ALTER TABLE "SubArea"
ADD COLUMN "order" INTEGER NOT NULL DEFAULT 1;
-- AlterTable
ALTER TABLE "SubArea"
ALTER COLUMN "order" DROP DEFAULT;