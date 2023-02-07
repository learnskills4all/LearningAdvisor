/*
  Warnings:

  - A unique constraint covering the columns `[template_name,template_type]` on the table `Template` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Template_template_name_template_type_key" ON "Template"("template_name", "template_type");
