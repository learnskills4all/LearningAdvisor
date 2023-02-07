/*
  Warnings:

  - You are about to drop the column `role` on the `AssessmentParticipants` table. All the data in the column will be lost.
  - You are about to drop the column `disabled` on the `PossibleAnswers` table. All the data in the column will be lost.
  - You are about to drop the `CategoryInTemplate` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `CheckpointInTemplateCategory` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `SubAreaInTemplateCategory` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `TeamInvite` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `template_id` to the `Category` table without a default value. This is not possible if the table is not empty.
  - Added the required column `category_id` to the `Checkpoint` table without a default value. This is not possible if the table is not empty.
  - Added the required column `template_id` to the `PossibleAnswers` table without a default value. This is not possible if the table is not empty.
  - Added the required column `category_id` to the `SubArea` table without a default value. This is not possible if the table is not empty.
  - Added the required column `invite_token` to the `Team` table without a default value. This is not possible if the table is not empty.
  - Added the required column `template_id` to the `Topic` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "CategoryInTemplate" DROP CONSTRAINT "CategoryInTemplate_category_id_fkey";

-- DropForeignKey
ALTER TABLE "CategoryInTemplate" DROP CONSTRAINT "CategoryInTemplate_template_id_fkey";

-- DropForeignKey
ALTER TABLE "CheckpointInTemplateCategory" DROP CONSTRAINT "CheckpointInTemplateCategory_checkpoint_id_fkey";

-- DropForeignKey
ALTER TABLE "CheckpointInTemplateCategory" DROP CONSTRAINT "CheckpointInTemplateCategory_template_category_id_fkey";

-- DropForeignKey
ALTER TABLE "SubAreaInTemplateCategory" DROP CONSTRAINT "SubAreaInTemplateCategory_subarea_id_fkey";

-- DropForeignKey
ALTER TABLE "SubAreaInTemplateCategory" DROP CONSTRAINT "SubAreaInTemplateCategory_template_category_id_fkey";

-- DropForeignKey
ALTER TABLE "TeamInvite" DROP CONSTRAINT "TeamInvite_team_id_fkey";

-- DropForeignKey
ALTER TABLE "TeamInvite" DROP CONSTRAINT "TeamInvite_user_id_fkey";

-- AlterTable
ALTER TABLE "AssessmentParticipants" DROP COLUMN "role";

-- AlterTable
ALTER TABLE "AssessmentTemplate" ADD COLUMN     "include_no_answer" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "score_formula" TEXT NOT NULL DEFAULT E'sum(x)',
ADD COLUMN     "weight_range_max" INTEGER NOT NULL DEFAULT 3,
ADD COLUMN     "weight_range_min" INTEGER NOT NULL DEFAULT 1;

-- AlterTable
ALTER TABLE "Category" ADD COLUMN     "template_id" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "Checkpoint" ADD COLUMN     "category_id" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "PossibleAnswers" DROP COLUMN "disabled",
ADD COLUMN     "template_id" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "SubArea" ADD COLUMN     "category_id" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "Team" ADD COLUMN     "invite_token" UUID NOT NULL;

-- AlterTable
ALTER TABLE "Topic" ADD COLUMN     "template_id" INTEGER NOT NULL;

-- DropTable
DROP TABLE "CategoryInTemplate";

-- DropTable
DROP TABLE "CheckpointInTemplateCategory";

-- DropTable
DROP TABLE "SubAreaInTemplateCategory";

-- DropTable
DROP TABLE "TeamInvite";

-- AddForeignKey
ALTER TABLE "Checkpoint" ADD CONSTRAINT "Checkpoint_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "Category"("category_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PossibleAnswers" ADD CONSTRAINT "PossibleAnswers_template_id_fkey" FOREIGN KEY ("template_id") REFERENCES "AssessmentTemplate"("template_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Topic" ADD CONSTRAINT "Topic_template_id_fkey" FOREIGN KEY ("template_id") REFERENCES "AssessmentTemplate"("template_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Category" ADD CONSTRAINT "Category_template_id_fkey" FOREIGN KEY ("template_id") REFERENCES "AssessmentTemplate"("template_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SubArea" ADD CONSTRAINT "SubArea_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "Category"("category_id") ON DELETE RESTRICT ON UPDATE CASCADE;
