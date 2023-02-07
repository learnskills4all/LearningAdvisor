/*
  Warnings:

  - A unique constraint covering the columns `[subarea_name,category_id]` on the table `SubArea` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "SubArea_subarea_name_category_id_key" ON "SubArea"("subarea_name", "category_id");
