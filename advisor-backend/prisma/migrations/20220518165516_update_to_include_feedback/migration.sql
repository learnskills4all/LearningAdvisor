/*
  Warnings:
  - The primary key for the `AssessmentParticipants` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `CategoryInTemplate` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `CheckpointInTemplateCategory` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `category_id` on the `CheckpointInTemplateCategory` table. All the data in the column will be lost.
  - You are about to drop the column `template_id` on the `CheckpointInTemplateCategory` table. All the data in the column will be lost.
  - The primary key for the `SubAreaInTemplateCategory` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `category_id` on the `SubAreaInTemplateCategory` table. All the data in the column will be lost.
  - You are about to drop the column `template_id` on the `SubAreaInTemplateCategory` table. All the data in the column will be lost.
  - The primary key for the `User` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `user_id` column on the `User` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The primary key for the `UserInTeam` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - Changed the type of `user_id` on the `AssessmentParticipants` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Added the required column `template_category_id` to the `CheckpointInTemplateCategory` table without a default value. This is not possible if the table is not empty.
  - Added the required column `answer_weight` to the `PossibleAnswers` table without a default value. This is not possible if the table is not empty.
  - Added the required column `template_category_id` to the `SubAreaInTemplateCategory` table without a default value. This is not possible if the table is not empty.
  - Added the required column `username` to the `User` table without a default value. This is not possible if the table is not empty.
  - Made the column `password_hash` on table `User` required. This step will fail if there are existing NULL values in that column.
  - Changed the type of `user_id` on the `UserInTeam` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- DropForeignKey
ALTER TABLE "AssessmentParticipants" DROP CONSTRAINT "AssessmentParticipants_user_id_fkey";

-- DropForeignKey
ALTER TABLE "CheckpointInTemplateCategory" DROP CONSTRAINT "CheckpointInTemplateCategory_category_id_fkey";

-- DropForeignKey
ALTER TABLE "CheckpointInTemplateCategory" DROP CONSTRAINT "CheckpointInTemplateCategory_template_id_fkey";

-- DropForeignKey
ALTER TABLE "SubAreaInTemplateCategory" DROP CONSTRAINT "SubAreaInTemplateCategory_category_id_fkey";

-- DropForeignKey
ALTER TABLE "SubAreaInTemplateCategory" DROP CONSTRAINT "SubAreaInTemplateCategory_template_id_fkey";

-- DropForeignKey
ALTER TABLE "UserInTeam" DROP CONSTRAINT "UserInTeam_user_id_fkey";

-- AlterTable
ALTER TABLE "AssessmentParticipants" DROP CONSTRAINT "AssessmentParticipants_pkey",
DROP COLUMN "user_id",
ADD COLUMN     "user_id" INTEGER NOT NULL,
ADD CONSTRAINT "AssessmentParticipants_pkey" PRIMARY KEY ("user_id", "assessment_id");

-- AlterTable
ALTER TABLE "AssessmentTemplate" ADD COLUMN     "disabled" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "CategoryInTemplate" DROP CONSTRAINT "CategoryInTemplate_pkey",
ADD COLUMN     "template_category_id" SERIAL NOT NULL,
ADD CONSTRAINT "CategoryInTemplate_pkey" PRIMARY KEY ("template_category_id");

-- AlterTable
ALTER TABLE "CheckpointInTemplateCategory" DROP CONSTRAINT "CheckpointInTemplateCategory_pkey",
DROP COLUMN "category_id",
DROP COLUMN "template_id",
ADD COLUMN     "template_category_id" INTEGER NOT NULL,
ADD CONSTRAINT "CheckpointInTemplateCategory_pkey" PRIMARY KEY ("template_category_id", "checkpoint_id");

-- AlterTable
ALTER TABLE "PossibleAnswers" ADD COLUMN     "answer_weight" DOUBLE PRECISION NOT NULL;

-- AlterTable
ALTER TABLE "SubAreaInTemplateCategory" DROP CONSTRAINT "SubAreaInTemplateCategory_pkey",
DROP COLUMN "category_id",
DROP COLUMN "template_id",
ADD COLUMN     "template_category_id" INTEGER NOT NULL,
ADD CONSTRAINT "SubAreaInTemplateCategory_pkey" PRIMARY KEY ("template_category_id", "subarea_id");

-- AlterTable
ALTER TABLE "User" DROP CONSTRAINT "User_pkey",
ADD COLUMN     "username" TEXT NOT NULL,
DROP COLUMN "user_id",
ADD COLUMN     "user_id" SERIAL NOT NULL,
ALTER COLUMN "password_hash" SET NOT NULL,
ADD CONSTRAINT "User_pkey" PRIMARY KEY ("user_id");

-- AlterTable
ALTER TABLE "UserInTeam" DROP CONSTRAINT "UserInTeam_pkey",
ADD COLUMN     "joined_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
DROP COLUMN "user_id",
ADD COLUMN     "user_id" INTEGER NOT NULL,
ADD CONSTRAINT "UserInTeam_pkey" PRIMARY KEY ("user_id", "team_id");

-- CreateTable
CREATE TABLE "TeamInvite" (
    "team_invite_id" UUID NOT NULL,
    "team_id" INTEGER NOT NULL,
    "user_id" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "TeamInvite_pkey" PRIMARY KEY ("team_invite_id")
);

-- CreateTable
CREATE TABLE "Feedback" (
    "feedback_id" SERIAL NOT NULL,
    "feedback_name" TEXT NOT NULL,
    "feedback_text" TEXT NOT NULL,
    "topic_id" INTEGER NOT NULL,
    "maturity_id" INTEGER NOT NULL,
    "answer_weight" DOUBLE PRECISION NOT NULL,
    "category_id" INTEGER NOT NULL,
    "weight_factor" INTEGER NOT NULL,

    CONSTRAINT "Feedback_pkey" PRIMARY KEY ("feedback_id")
);

-- CreateIndex
CREATE INDEX "AssessmentParticipants_assessment_id_user_id_idx" ON "AssessmentParticipants"("assessment_id", "user_id");

-- CreateIndex
CREATE INDEX "CategoryInTemplate_template_id_category_id_idx" ON "CategoryInTemplate"("template_id", "category_id");

-- CreateIndex
CREATE INDEX "UserInTeam_team_id_user_id_idx" ON "UserInTeam"("team_id", "user_id");

-- AddForeignKey
ALTER TABLE "TeamInvite" ADD CONSTRAINT "TeamInvite_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TeamInvite" ADD CONSTRAINT "TeamInvite_team_id_fkey" FOREIGN KEY ("team_id") REFERENCES "Team"("team_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserInTeam" ADD CONSTRAINT "UserInTeam_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AssessmentParticipants" ADD CONSTRAINT "AssessmentParticipants_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CheckpointInTemplateCategory" ADD CONSTRAINT "CheckpointInTemplateCategory_template_category_id_fkey" FOREIGN KEY ("template_category_id") REFERENCES "CategoryInTemplate"("template_category_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SubAreaInTemplateCategory" ADD CONSTRAINT "SubAreaInTemplateCategory_template_category_id_fkey" FOREIGN KEY ("template_category_id") REFERENCES "CategoryInTemplate"("template_category_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Feedback" ADD CONSTRAINT "Feedback_maturity_id_fkey" FOREIGN KEY ("maturity_id") REFERENCES "Maturity"("maturity_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Feedback" ADD CONSTRAINT "Feedback_topic_id_fkey" FOREIGN KEY ("topic_id") REFERENCES "Topic"("topic_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Feedback" ADD CONSTRAINT "Feedback_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "Category"("category_id") ON DELETE RESTRICT ON UPDATE CASCADE;