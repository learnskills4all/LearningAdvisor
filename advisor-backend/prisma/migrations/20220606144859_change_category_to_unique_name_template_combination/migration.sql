/*
  Warnings:

  - A unique constraint covering the columns `[category_name,template_id]` on the table `Category` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "Category_category_name_key";

-- CreateIndex
CREATE UNIQUE INDEX "Category_category_name_template_id_key" ON "Category"("category_name", "template_id");
