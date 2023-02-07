/*
  Warnings:

  - Made the column `maturity_id` on table `Checkpoint` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "Checkpoint" DROP CONSTRAINT "Checkpoint_maturity_id_fkey";

-- DropForeignKey
ALTER TABLE "CheckpointAndAnswersInAssessments" DROP CONSTRAINT "CheckpointAndAnswersInAssessments_answer_id_fkey";

-- AlterTable
ALTER TABLE "Checkpoint" ALTER COLUMN "maturity_id" SET NOT NULL;

-- AlterTable
ALTER TABLE "CheckpointAndAnswersInAssessments" ALTER COLUMN "answer_id" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Checkpoint" ADD CONSTRAINT "Checkpoint_maturity_id_fkey" FOREIGN KEY ("maturity_id") REFERENCES "Maturity"("maturity_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CheckpointAndAnswersInAssessments" ADD CONSTRAINT "CheckpointAndAnswersInAssessments_answer_id_fkey" FOREIGN KEY ("answer_id") REFERENCES "Answer"("answer_id") ON DELETE SET NULL ON UPDATE CASCADE;
