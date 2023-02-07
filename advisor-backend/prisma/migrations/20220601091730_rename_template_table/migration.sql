/*
  Warnings:

  - You are about to drop the `AssessmentTemplate` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Assessment" DROP CONSTRAINT "Assessment_template_id_fkey";

-- DropForeignKey
ALTER TABLE "Category" DROP CONSTRAINT "Category_template_id_fkey";

-- DropForeignKey
ALTER TABLE "PossibleAnswers" DROP CONSTRAINT "PossibleAnswers_template_id_fkey";

-- DropForeignKey
ALTER TABLE "Topic" DROP CONSTRAINT "Topic_template_id_fkey";

-- DropTable
DROP TABLE "AssessmentTemplate";

-- CreateTable
CREATE TABLE "Template" (
    "template_id" SERIAL NOT NULL,
    "template_name" TEXT NOT NULL,
    "template_type" "AssessmentType" NOT NULL,
    "disabled" BOOLEAN NOT NULL DEFAULT false,
    "weight_range_min" INTEGER NOT NULL DEFAULT 1,
    "weight_range_max" INTEGER NOT NULL DEFAULT 3,
    "score_formula" TEXT NOT NULL DEFAULT E'sum(x)',
    "include_no_answer" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "Template_pkey" PRIMARY KEY ("template_id")
);

-- AddForeignKey
ALTER TABLE "PossibleAnswers" ADD CONSTRAINT "PossibleAnswers_template_id_fkey" FOREIGN KEY ("template_id") REFERENCES "Template"("template_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Topic" ADD CONSTRAINT "Topic_template_id_fkey" FOREIGN KEY ("template_id") REFERENCES "Template"("template_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Assessment" ADD CONSTRAINT "Assessment_template_id_fkey" FOREIGN KEY ("template_id") REFERENCES "Template"("template_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Category" ADD CONSTRAINT "Category_template_id_fkey" FOREIGN KEY ("template_id") REFERENCES "Template"("template_id") ON DELETE RESTRICT ON UPDATE CASCADE;
