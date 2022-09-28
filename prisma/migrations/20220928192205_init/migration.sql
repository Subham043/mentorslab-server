/*
  Warnings:

  - You are about to drop the column `hased_refresh_token` on the `User` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `User` DROP COLUMN `hased_refresh_token`,
    ADD COLUMN `hashed_refresh_token` VARCHAR(191) NULL;
