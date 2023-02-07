-- DropIndex
DROP INDEX "Feedback_assessment_id_order_key";

-- CreateIndex
CREATE INDEX "Feedback_assessment_id_order_idx" ON "Feedback"("assessment_id", "order");
