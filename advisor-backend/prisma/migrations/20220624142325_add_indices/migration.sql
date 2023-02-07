-- CreateIndex
CREATE INDEX "Answer_template_id_idx" ON "Answer"("template_id");
-- CreateIndex
CREATE INDEX "Category_template_id_order_idx" ON "Category"("template_id", "order");
-- CreateIndex
CREATE INDEX "Checkpoint_category_id_order_idx" ON "Checkpoint"("category_id", "order");
-- CreateIndex
CREATE INDEX "Checkpoint_maturity_id_idx" ON "Checkpoint"("maturity_id");
-- CreateIndex
CREATE INDEX "CheckpointAndAnswersInAssessments_checkpoint_id_idx" ON "CheckpointAndAnswersInAssessments"("checkpoint_id");
-- CreateIndex
CREATE INDEX "CheckpointInTopic_checkpoint_id_topic_id_idx" ON "CheckpointInTopic"("checkpoint_id", "topic_id");
-- CreateIndex
CREATE INDEX "Maturity_template_id_maturity_order_idx" ON "Maturity"("template_id", "maturity_order");
-- CreateIndex
CREATE INDEX "SubArea_category_id_idx" ON "SubArea"("category_id");
-- CreateIndex
CREATE INDEX "Template_enabled_idx" ON "Template"("enabled");
-- CreateIndex
CREATE INDEX "Topic_template_id_idx" ON "Topic"("template_id");
-- CreateIndex
CREATE INDEX "User_username_idx" ON "User"("username");