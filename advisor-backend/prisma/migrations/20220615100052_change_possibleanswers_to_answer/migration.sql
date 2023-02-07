/*
  Warnings:

  - You are about to drop the column `possible_answer_id` on the `CheckpointAndAnswersInAssessments` table. All the data in the column will be lost.
  - You are about to drop the `PossibleAnswers` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `answer_id` to the `CheckpointAndAnswersInAssessments` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "CheckpointAndAnswersInAssessments" DROP CONSTRAINT "CheckpointAndAnswersInAssessments_possible_answer_id_fkey";

-- DropForeignKey
ALTER TABLE "PossibleAnswers" DROP CONSTRAINT "PossibleAnswers_template_id_fkey";

-- AlterTable
ALTER TABLE "CheckpointAndAnswersInAssessments" DROP COLUMN "possible_answer_id",
ADD COLUMN     "answer_id" INTEGER NOT NULL;

-- DropTable
DROP TABLE "PossibleAnswers";

-- CreateTable
CREATE TABLE "Answer" (
    "answer_id" SERIAL NOT NULL,
    "answer_text" TEXT NOT NULL DEFAULT E'New Answer',
    "answer_weight" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "template_id" INTEGER NOT NULL,

    CONSTRAINT "Answer_pkey" PRIMARY KEY ("answer_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Answer_answer_text_template_id_key" ON "Answer"("answer_text", "template_id");

-- AddForeignKey
ALTER TABLE "Answer" ADD CONSTRAINT "Answer_template_id_fkey" FOREIGN KEY ("template_id") REFERENCES "Template"("template_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CheckpointAndAnswersInAssessments" ADD CONSTRAINT "CheckpointAndAnswersInAssessments_answer_id_fkey" FOREIGN KEY ("answer_id") REFERENCES "Answer"("answer_id") ON DELETE RESTRICT ON UPDATE CASCADE;
