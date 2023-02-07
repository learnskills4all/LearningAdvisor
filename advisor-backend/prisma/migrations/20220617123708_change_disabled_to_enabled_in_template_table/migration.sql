/*
  Warnings:

  - You are about to drop the column `disabled` on the `Template` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Template" DROP COLUMN "disabled",
ADD COLUMN     "enabled" BOOLEAN NOT NULL DEFAULT false;
