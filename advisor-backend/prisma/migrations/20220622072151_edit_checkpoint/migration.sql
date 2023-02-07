/*
 Warnings:
 
 - You are about to drop the column `checkpoint_name` on the `Checkpoint` table. All the data in the column will be lost.
 - You are about to drop the column `roles` on the `User` table. All the data in the column will be lost.
 - A unique constraint covering the columns `[checkpoint_description,category_id]` on the table `Checkpoint` will be added. If there are existing duplicate values, this will fail.
 - Added the required column `order` to the `Checkpoint` table without a default value. This is not possible if the table is not empty.
 - Added the required column `role` to the `User` table without a default value. This is not possible if the table is not empty.
 
 */
-- DropForeignKey
ALTER TABLE "Checkpoint" DROP CONSTRAINT "Checkpoint_maturity_id_fkey";
-- AlterTable
ALTER TABLE "Checkpoint" DROP COLUMN "checkpoint_name",
  ADD COLUMN "checkpoint_additional_information" TEXT NOT NULL DEFAULT E'',
  ADD COLUMN "order" INTEGER NOT NULL,
  ALTER COLUMN "checkpoint_description"
SET DEFAULT E'New Checkpoint',
  ALTER COLUMN "maturity_id" DROP NOT NULL;
--- CreateIndex
CREATE UNIQUE INDEX "Checkpoint_checkpoint_description_category_id_key" ON "Checkpoint"("checkpoint_description", "category_id");
-- AddForeignKey
ALTER TABLE "Checkpoint"
ADD CONSTRAINT "Checkpoint_maturity_id_fkey" FOREIGN KEY ("maturity_id") REFERENCES "Maturity"("maturity_id") ON DELETE
SET NULL ON UPDATE CASCADE;