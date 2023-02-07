/*
  Warnings:

  - A unique constraint covering the columns `[assessment_name,assessment_type,team_id]` on the table `Assessment` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "Assessment_assessment_name_assessment_type_key";

-- CreateIndex
CREATE UNIQUE INDEX "Assessment_assessment_name_assessment_type_team_id_key" ON "Assessment"("assessment_name", "assessment_type", "team_id");
