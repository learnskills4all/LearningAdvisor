-- DropForeignKey
ALTER TABLE "CheckpointAndAnswersInAssessments" DROP CONSTRAINT "CheckpointAndAnswersInAssessments_answer_id_fkey";

-- AlterTable
ALTER TABLE "CheckpointAndAnswersInAssessments" ALTER COLUMN "answer_id" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "CheckpointAndAnswersInAssessments" ADD CONSTRAINT "CheckpointAndAnswersInAssessments_answer_id_fkey" FOREIGN KEY ("answer_id") REFERENCES "Answer"("answer_id") ON DELETE SET NULL ON UPDATE CASCADE;
