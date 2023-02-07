-- AlterTable
ALTER TABLE "Answer" ADD COLUMN     "disabled" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "Category" ADD COLUMN     "disabled" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "Maturity" ADD COLUMN     "disabled" BOOLEAN NOT NULL DEFAULT false;
