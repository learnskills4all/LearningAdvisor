-- CreateEnum
CREATE TYPE "AssessmentType" AS ENUM ('INDIVIDUAL', 'TEAM');

-- CreateEnum
CREATE TYPE "Role" AS ENUM ('USER', 'ASSESSOR', 'ADMIN');

-- CreateTable
CREATE TABLE "User" (
    "user_id" UUID NOT NULL,
    "password_hash" TEXT,
    "role" "Role" NOT NULL DEFAULT E'USER',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("user_id")
);

-- CreateTable
CREATE TABLE "Checkpoint" (
    "checkpoint_id" SERIAL NOT NULL,
    "checkpoint_name" TEXT NOT NULL,
    "checkpoint_description" TEXT NOT NULL,
    "weight" INTEGER NOT NULL,
    "maturity_id" INTEGER NOT NULL,

    CONSTRAINT "Checkpoint_pkey" PRIMARY KEY ("checkpoint_id")
);

-- CreateTable
CREATE TABLE "PossibleAnswers" (
    "possible_answer_id" SERIAL NOT NULL,
    "answer" TEXT NOT NULL,
    "disabled" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "PossibleAnswers_pkey" PRIMARY KEY ("possible_answer_id")
);

-- CreateTable
CREATE TABLE "Maturity" (
    "maturity_id" SERIAL NOT NULL,
    "maturity_name" TEXT NOT NULL,
    "maturity_order" INTEGER NOT NULL,

    CONSTRAINT "Maturity_pkey" PRIMARY KEY ("maturity_id")
);

-- CreateTable
CREATE TABLE "Topic" (
    "topic_id" SERIAL NOT NULL,
    "topic_name" TEXT NOT NULL,

    CONSTRAINT "Topic_pkey" PRIMARY KEY ("topic_id")
);

-- CreateTable
CREATE TABLE "CheckpointInTopic" (
    "checkpoint_id" INTEGER NOT NULL,
    "topic_id" INTEGER NOT NULL,

    CONSTRAINT "CheckpointInTopic_pkey" PRIMARY KEY ("topic_id","checkpoint_id")
);

-- CreateTable
CREATE TABLE "Team" (
    "team_id" SERIAL NOT NULL,
    "team_name" TEXT NOT NULL,

    CONSTRAINT "Team_pkey" PRIMARY KEY ("team_id")
);

-- CreateTable
CREATE TABLE "UserInTeam" (
    "user_id" UUID NOT NULL,
    "team_id" INTEGER NOT NULL,

    CONSTRAINT "UserInTeam_pkey" PRIMARY KEY ("user_id","team_id")
);

-- CreateTable
CREATE TABLE "Assessment" (
    "assessment_id" SERIAL NOT NULL,
    "assessment_name" TEXT NOT NULL,
    "country_name" TEXT NOT NULL,
    "department_name" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "completed_at" TIMESTAMP(3) NOT NULL,
    "assessment_type" "AssessmentType" NOT NULL,
    "template_id" INTEGER NOT NULL,

    CONSTRAINT "Assessment_pkey" PRIMARY KEY ("assessment_id")
);

-- CreateTable
CREATE TABLE "AssessmentParticipants" (
    "user_id" UUID NOT NULL,
    "assessment_id" INTEGER NOT NULL,
    "role" "Role" NOT NULL,

    CONSTRAINT "AssessmentParticipants_pkey" PRIMARY KEY ("user_id","assessment_id")
);

-- CreateTable
CREATE TABLE "AssessmentTemplate" (
    "template_id" SERIAL NOT NULL,
    "template_name" TEXT NOT NULL,
    "template_type" "AssessmentType" NOT NULL,

    CONSTRAINT "AssessmentTemplate_pkey" PRIMARY KEY ("template_id")
);

-- CreateTable
CREATE TABLE "Category" (
    "category_id" SERIAL NOT NULL,
    "category_name" TEXT NOT NULL,
    "color" INTEGER NOT NULL,

    CONSTRAINT "Category_pkey" PRIMARY KEY ("category_id")
);

-- CreateTable
CREATE TABLE "CategoryInTemplate" (
    "category_id" INTEGER NOT NULL,
    "template_id" INTEGER NOT NULL,

    CONSTRAINT "CategoryInTemplate_pkey" PRIMARY KEY ("template_id","category_id")
);

-- CreateTable
CREATE TABLE "SubArea" (
    "subarea_id" SERIAL NOT NULL,
    "subarea_name" TEXT NOT NULL,
    "subarea_summary" TEXT NOT NULL,
    "subarea_description" TEXT NOT NULL,

    CONSTRAINT "SubArea_pkey" PRIMARY KEY ("subarea_id")
);

-- CreateTable
CREATE TABLE "CheckpointInTemplateCategory" (
    "checkpoint_id" INTEGER NOT NULL,
    "template_id" INTEGER NOT NULL,
    "category_id" INTEGER NOT NULL,

    CONSTRAINT "CheckpointInTemplateCategory_pkey" PRIMARY KEY ("template_id","category_id","checkpoint_id")
);

-- CreateTable
CREATE TABLE "SubAreaInTemplateCategory" (
    "subarea_id" INTEGER NOT NULL,
    "template_id" INTEGER NOT NULL,
    "category_id" INTEGER NOT NULL,

    CONSTRAINT "SubAreaInTemplateCategory_pkey" PRIMARY KEY ("template_id","category_id","subarea_id")
);

-- CreateTable
CREATE TABLE "CheckpointAndAnswersInAssessments" (
    "assessment_id" INTEGER NOT NULL,
    "checkpoint_id" INTEGER NOT NULL,
    "possible_answer_id" INTEGER NOT NULL,

    CONSTRAINT "CheckpointAndAnswersInAssessments_pkey" PRIMARY KEY ("assessment_id","checkpoint_id")
);

-- CreateIndex
CREATE INDEX "User_role_idx" ON "User"("role");

-- CreateIndex
CREATE INDEX "UserInTeam_team_id_user_id_idx" ON "UserInTeam"("team_id", "user_id");

-- CreateIndex
CREATE INDEX "AssessmentParticipants_assessment_id_user_id_idx" ON "AssessmentParticipants"("assessment_id", "user_id");

-- AddForeignKey
ALTER TABLE "Checkpoint" ADD CONSTRAINT "Checkpoint_maturity_id_fkey" FOREIGN KEY ("maturity_id") REFERENCES "Maturity"("maturity_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CheckpointInTopic" ADD CONSTRAINT "CheckpointInTopic_checkpoint_id_fkey" FOREIGN KEY ("checkpoint_id") REFERENCES "Checkpoint"("checkpoint_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CheckpointInTopic" ADD CONSTRAINT "CheckpointInTopic_topic_id_fkey" FOREIGN KEY ("topic_id") REFERENCES "Topic"("topic_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserInTeam" ADD CONSTRAINT "UserInTeam_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserInTeam" ADD CONSTRAINT "UserInTeam_team_id_fkey" FOREIGN KEY ("team_id") REFERENCES "Team"("team_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Assessment" ADD CONSTRAINT "Assessment_template_id_fkey" FOREIGN KEY ("template_id") REFERENCES "AssessmentTemplate"("template_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AssessmentParticipants" ADD CONSTRAINT "AssessmentParticipants_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AssessmentParticipants" ADD CONSTRAINT "AssessmentParticipants_assessment_id_fkey" FOREIGN KEY ("assessment_id") REFERENCES "Assessment"("assessment_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CategoryInTemplate" ADD CONSTRAINT "CategoryInTemplate_template_id_fkey" FOREIGN KEY ("template_id") REFERENCES "AssessmentTemplate"("template_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CategoryInTemplate" ADD CONSTRAINT "CategoryInTemplate_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "Category"("category_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CheckpointInTemplateCategory" ADD CONSTRAINT "CheckpointInTemplateCategory_checkpoint_id_fkey" FOREIGN KEY ("checkpoint_id") REFERENCES "Checkpoint"("checkpoint_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CheckpointInTemplateCategory" ADD CONSTRAINT "CheckpointInTemplateCategory_template_id_fkey" FOREIGN KEY ("template_id") REFERENCES "AssessmentTemplate"("template_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CheckpointInTemplateCategory" ADD CONSTRAINT "CheckpointInTemplateCategory_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "Category"("category_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SubAreaInTemplateCategory" ADD CONSTRAINT "SubAreaInTemplateCategory_template_id_fkey" FOREIGN KEY ("template_id") REFERENCES "AssessmentTemplate"("template_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SubAreaInTemplateCategory" ADD CONSTRAINT "SubAreaInTemplateCategory_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "Category"("category_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SubAreaInTemplateCategory" ADD CONSTRAINT "SubAreaInTemplateCategory_subarea_id_fkey" FOREIGN KEY ("subarea_id") REFERENCES "SubArea"("subarea_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CheckpointAndAnswersInAssessments" ADD CONSTRAINT "CheckpointAndAnswersInAssessments_checkpoint_id_fkey" FOREIGN KEY ("checkpoint_id") REFERENCES "Checkpoint"("checkpoint_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CheckpointAndAnswersInAssessments" ADD CONSTRAINT "CheckpointAndAnswersInAssessments_possible_answer_id_fkey" FOREIGN KEY ("possible_answer_id") REFERENCES "PossibleAnswers"("possible_answer_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CheckpointAndAnswersInAssessments" ADD CONSTRAINT "CheckpointAndAnswersInAssessments_assessment_id_fkey" FOREIGN KEY ("assessment_id") REFERENCES "Assessment"("assessment_id") ON DELETE RESTRICT ON UPDATE CASCADE;
