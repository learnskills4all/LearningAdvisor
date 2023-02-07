/*
 Warnings:
 
 - You are about to drop the column `maturity_order` on the `Maturity` table. All the data in the column will be lost.
 - Added the required column `order` to the `Maturity` table without a default value. This is not possible if the table is not empty.
 
 */
-- AlterTable
ALTER TABLE "Maturity"
  RENAME COLUMN "maturity_order" TO "order";