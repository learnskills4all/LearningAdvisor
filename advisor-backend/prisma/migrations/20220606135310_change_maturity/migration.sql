/*
  Warnings:

  - A unique constraint covering the columns `[maturity_name,template_id]` on the table `Maturity` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `template_id` to the `Maturity` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Maturity" ADD COLUMN     "template_id" INTEGER NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Maturity_maturity_name_template_id_key" ON "Maturity"("maturity_name", "template_id");

-- AddForeignKey
ALTER TABLE "Maturity" ADD CONSTRAINT "Maturity_template_id_fkey" FOREIGN KEY ("template_id") REFERENCES "Template"("template_id") ON DELETE RESTRICT ON UPDATE CASCADE;
