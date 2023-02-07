-- AlterTable
ALTER TABLE "Assessment" ADD COLUMN     "team_id" INTEGER;

-- AddForeignKey
ALTER TABLE "Assessment" ADD CONSTRAINT "Assessment_team_id_fkey" FOREIGN KEY ("team_id") REFERENCES "Team"("team_id") ON DELETE SET NULL ON UPDATE CASCADE;
