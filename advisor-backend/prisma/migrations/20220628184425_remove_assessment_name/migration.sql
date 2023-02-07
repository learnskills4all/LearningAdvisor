/*
  Warnings:

  - You are about to drop the column `assessment_name` on the `Assessment` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "Assessment_assessment_name_assessment_type_team_id_key";

-- AlterTable
ALTER TABLE "Assessment" DROP COLUMN "assessment_name";
