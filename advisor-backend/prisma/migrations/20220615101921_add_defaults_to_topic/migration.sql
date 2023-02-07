/*
 Warnings:
 
 - You are about to drop the column `roles` on the `User` table. All the data in the column will be lost.
 - A unique constraint covering the columns `[topic_name,template_id]` on the table `Topic` will be added. If there are existing duplicate values, this will fail.
 - Added the required column `role` to the `User` table without a default value. This is not possible if the table is not empty.
 
 */
-- AlterTable
ALTER TABLE "Topic"
ALTER COLUMN "topic_name"
SET DEFAULT E'New Topic';
-- CreateIndex
CREATE UNIQUE INDEX "Topic_topic_name_template_id_key" ON "Topic"("topic_name", "template_id");