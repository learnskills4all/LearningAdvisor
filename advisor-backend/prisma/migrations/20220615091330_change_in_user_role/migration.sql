/*
  Warnings:

  - You are about to drop the column `roles` on the `User` table. All the data in the column will be lost.
  - Added the required column `role` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
--DROP INDEX "User_roles_idx";

-- AlterTable
--ALTER TABLE "User" DROP COLUMN "roles",
--ADD COLUMN     "role" "Role" NOT NULL;

-- CreateIndex
--CREATE INDEX "User_role_idx" ON "User"("role");
