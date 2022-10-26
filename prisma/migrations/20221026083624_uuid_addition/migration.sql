/*
  Warnings:

  - A unique constraint covering the columns `[uuid]` on the table `Content` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[uuid]` on the table `LiveSessionContent` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[orderId]` on the table `Payment` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[orderId]` on the table `PaymentLiveSession` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE `Content` ADD COLUMN `uuid` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `LiveSessionContent` ADD COLUMN `uuid` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `Payment` ADD COLUMN `orderId` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `PaymentLiveSession` ADD COLUMN `orderId` VARCHAR(191) NULL;

-- CreateIndex
CREATE UNIQUE INDEX `Content_uuid_key` ON `Content`(`uuid`);

-- CreateIndex
CREATE UNIQUE INDEX `LiveSessionContent_uuid_key` ON `LiveSessionContent`(`uuid`);

-- CreateIndex
CREATE UNIQUE INDEX `Payment_orderId_key` ON `Payment`(`orderId`);

-- CreateIndex
CREATE UNIQUE INDEX `PaymentLiveSession_orderId_key` ON `PaymentLiveSession`(`orderId`);
