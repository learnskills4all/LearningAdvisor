-- AlterTable
ALTER TABLE "Template" ADD COLUMN     "template_feedback" TEXT NOT NULL DEFAULT E'';

-- RenameIndex
ALTER INDEX "Maturity_template_id_maturity_order_idx" RENAME TO "Maturity_template_id_order_idx";
