/*
  Warnings:

  - You are about to drop the column `role` on the `User` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "User_role_idx";

-- AlterTable
ALTER TABLE "User" DROP COLUMN "role",
ADD COLUMN     "roles" "Role"[];

-- CreateIndex
CREATE INDEX "User_roles_idx" ON "User"("roles");
