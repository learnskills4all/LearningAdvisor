/*
 Warnings:
 
 - Added the required column `additional_information` to the `Assessment` table without a default value. This is not possible if the table is not empty.
 
 */
-- AlterTable
ALTER TABLE "Assessment"
ADD COLUMN "information" TEXT NOT NULL DEFAULT E'';
ALTER TABLE "Assessment"
ALTER COLUMN "information" DROP DEFAULT;
-- AlterTable
ALTER TABLE "Template"
ADD COLUMN "information" TEXT NOT NULL DEFAULT E'';