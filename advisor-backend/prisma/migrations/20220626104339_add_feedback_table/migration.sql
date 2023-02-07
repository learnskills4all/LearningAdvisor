-- CreateTable
CREATE TABLE "Feedback" (
    "feedback_id" SERIAL NOT NULL,
    "assessment_id" INTEGER NOT NULL,
    "feedback_text" TEXT NOT NULL,
    "feedback_additional_information" TEXT NOT NULL,
    "order" INTEGER NOT NULL,
    CONSTRAINT "Feedback_pkey" PRIMARY KEY ("feedback_id")
);
-- CreateIndex
CREATE UNIQUE INDEX "Feedback_assessment_id_order_key" ON "Feedback"("assessment_id", "order");
-- AddForeignKey
ALTER TABLE "Feedback"
ADD CONSTRAINT "Feedback_assessment_id_fkey" FOREIGN KEY ("assessment_id") REFERENCES "Assessment"("assessment_id") ON DELETE RESTRICT ON UPDATE CASCADE;