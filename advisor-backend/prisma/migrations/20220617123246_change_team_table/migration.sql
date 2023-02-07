/*
  Warnings:

  - You are about to drop the column `feedback_text` on the `Assessment` table. All the data in the column will be lost.
  - You are about to drop the column `answer_id` on the `CheckpointAndAnswersInAssessments` table. All the data in the column will be lost.
  - You are about to drop the `Answer` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[team_name]` on the table `Team` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[invite_token]` on the table `Team` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `possible_answer_id` to the `CheckpointAndAnswersInAssessments` table without a default value. This is not possible if the table is not empty.
  - Added the required column `team_country` to the `Team` table without a default value. This is not possible if the table is not empty.
  - Added the required column `team_department` to the `Team` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Answer" DROP CONSTRAINT "Answer_template_id_fkey";

-- DropForeignKey
ALTER TABLE "CheckpointAndAnswersInAssessments" DROP CONSTRAINT "CheckpointAndAnswersInAssessments_answer_id_fkey";

-- DropIndex
DROP INDEX "Topic_topic_name_template_id_key";

-- AlterTable
ALTER TABLE "Assessment" DROP COLUMN "feedback_text";

-- AlterTable
ALTER TABLE "CheckpointAndAnswersInAssessments" DROP COLUMN "answer_id",
ADD COLUMN     "possible_answer_id" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "Team" ADD COLUMN     "team_country" TEXT NOT NULL,
ADD COLUMN     "team_department" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Topic" ALTER COLUMN "topic_name" DROP DEFAULT;

-- DropTable
DROP TABLE "Answer";

-- CreateTable
CREATE TABLE "PossibleAnswers" (
    "possible_answer_id" SERIAL NOT NULL,
    "answer" TEXT NOT NULL,
    "answer_weight" DOUBLE PRECISION NOT NULL,
    "template_id" INTEGER NOT NULL,

    CONSTRAINT "PossibleAnswers_pkey" PRIMARY KEY ("possible_answer_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Team_team_name_key" ON "Team"("team_name");

-- CreateIndex
CREATE UNIQUE INDEX "Team_invite_token_key" ON "Team"("invite_token");

-- AddForeignKey
ALTER TABLE "PossibleAnswers" ADD CONSTRAINT "PossibleAnswers_template_id_fkey" FOREIGN KEY ("template_id") REFERENCES "Template"("template_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CheckpointAndAnswersInAssessments" ADD CONSTRAINT "CheckpointAndAnswersInAssessments_possible_answer_id_fkey" FOREIGN KEY ("possible_answer_id") REFERENCES "PossibleAnswers"("possible_answer_id") ON DELETE RESTRICT ON UPDATE CASCADE;
