-- DropForeignKey
ALTER TABLE "Answer" DROP CONSTRAINT "Answer_template_id_fkey";

-- DropForeignKey
ALTER TABLE "Assessment" DROP CONSTRAINT "Assessment_team_id_fkey";

-- DropForeignKey
ALTER TABLE "Assessment" DROP CONSTRAINT "Assessment_template_id_fkey";

-- DropForeignKey
ALTER TABLE "AssessmentParticipants" DROP CONSTRAINT "AssessmentParticipants_assessment_id_fkey";

-- DropForeignKey
ALTER TABLE "AssessmentParticipants" DROP CONSTRAINT "AssessmentParticipants_user_id_fkey";

-- DropForeignKey
ALTER TABLE "Category" DROP CONSTRAINT "Category_template_id_fkey";

-- DropForeignKey
ALTER TABLE "Checkpoint" DROP CONSTRAINT "Checkpoint_category_id_fkey";

-- DropForeignKey
ALTER TABLE "Checkpoint" DROP CONSTRAINT "Checkpoint_maturity_id_fkey";

-- DropForeignKey
ALTER TABLE "CheckpointAndAnswersInAssessments" DROP CONSTRAINT "CheckpointAndAnswersInAssessments_answer_id_fkey";

-- DropForeignKey
ALTER TABLE "CheckpointAndAnswersInAssessments" DROP CONSTRAINT "CheckpointAndAnswersInAssessments_assessment_id_fkey";

-- DropForeignKey
ALTER TABLE "CheckpointAndAnswersInAssessments" DROP CONSTRAINT "CheckpointAndAnswersInAssessments_checkpoint_id_fkey";

-- DropForeignKey
ALTER TABLE "CheckpointInTopic" DROP CONSTRAINT "CheckpointInTopic_checkpoint_id_fkey";

-- DropForeignKey
ALTER TABLE "CheckpointInTopic" DROP CONSTRAINT "CheckpointInTopic_topic_id_fkey";

-- DropForeignKey
ALTER TABLE "Feedback" DROP CONSTRAINT "Feedback_assessment_id_fkey";

-- DropForeignKey
ALTER TABLE "Maturity" DROP CONSTRAINT "Maturity_template_id_fkey";

-- DropForeignKey
ALTER TABLE "SubArea" DROP CONSTRAINT "SubArea_category_id_fkey";

-- DropForeignKey
ALTER TABLE "Topic" DROP CONSTRAINT "Topic_template_id_fkey";

-- DropForeignKey
ALTER TABLE "UserInTeam" DROP CONSTRAINT "UserInTeam_team_id_fkey";

-- DropForeignKey
ALTER TABLE "UserInTeam" DROP CONSTRAINT "UserInTeam_user_id_fkey";

-- AddForeignKey
ALTER TABLE "Checkpoint" ADD CONSTRAINT "Checkpoint_maturity_id_fkey" FOREIGN KEY ("maturity_id") REFERENCES "Maturity"("maturity_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Checkpoint" ADD CONSTRAINT "Checkpoint_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "Category"("category_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Answer" ADD CONSTRAINT "Answer_template_id_fkey" FOREIGN KEY ("template_id") REFERENCES "Template"("template_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Maturity" ADD CONSTRAINT "Maturity_template_id_fkey" FOREIGN KEY ("template_id") REFERENCES "Template"("template_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Topic" ADD CONSTRAINT "Topic_template_id_fkey" FOREIGN KEY ("template_id") REFERENCES "Template"("template_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CheckpointInTopic" ADD CONSTRAINT "CheckpointInTopic_checkpoint_id_fkey" FOREIGN KEY ("checkpoint_id") REFERENCES "Checkpoint"("checkpoint_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CheckpointInTopic" ADD CONSTRAINT "CheckpointInTopic_topic_id_fkey" FOREIGN KEY ("topic_id") REFERENCES "Topic"("topic_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserInTeam" ADD CONSTRAINT "UserInTeam_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("user_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserInTeam" ADD CONSTRAINT "UserInTeam_team_id_fkey" FOREIGN KEY ("team_id") REFERENCES "Team"("team_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Assessment" ADD CONSTRAINT "Assessment_team_id_fkey" FOREIGN KEY ("team_id") REFERENCES "Team"("team_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Assessment" ADD CONSTRAINT "Assessment_template_id_fkey" FOREIGN KEY ("template_id") REFERENCES "Template"("template_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AssessmentParticipants" ADD CONSTRAINT "AssessmentParticipants_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("user_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AssessmentParticipants" ADD CONSTRAINT "AssessmentParticipants_assessment_id_fkey" FOREIGN KEY ("assessment_id") REFERENCES "Assessment"("assessment_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Category" ADD CONSTRAINT "Category_template_id_fkey" FOREIGN KEY ("template_id") REFERENCES "Template"("template_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SubArea" ADD CONSTRAINT "SubArea_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "Category"("category_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CheckpointAndAnswersInAssessments" ADD CONSTRAINT "CheckpointAndAnswersInAssessments_checkpoint_id_fkey" FOREIGN KEY ("checkpoint_id") REFERENCES "Checkpoint"("checkpoint_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CheckpointAndAnswersInAssessments" ADD CONSTRAINT "CheckpointAndAnswersInAssessments_answer_id_fkey" FOREIGN KEY ("answer_id") REFERENCES "Answer"("answer_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CheckpointAndAnswersInAssessments" ADD CONSTRAINT "CheckpointAndAnswersInAssessments_assessment_id_fkey" FOREIGN KEY ("assessment_id") REFERENCES "Assessment"("assessment_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Feedback" ADD CONSTRAINT "Feedback_assessment_id_fkey" FOREIGN KEY ("assessment_id") REFERENCES "Assessment"("assessment_id") ON DELETE CASCADE ON UPDATE CASCADE;
