-- DropIndex
DROP INDEX "Team_team_name_key";

-- AlterTable
ALTER TABLE "Team" ALTER COLUMN "team_name" SET DEFAULT E'New Team';
