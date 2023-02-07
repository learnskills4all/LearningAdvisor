/*
  Warnings:

  - A unique constraint covering the columns `[assessment_name]` on the table `Assessment` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Assessment_assessment_name_key" ON "Assessment"("assessment_name");
