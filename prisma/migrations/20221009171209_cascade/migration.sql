-- DropForeignKey
ALTER TABLE `Content` DROP FOREIGN KEY `Content_uploadedBy_fkey`;

-- DropForeignKey
ALTER TABLE `ContentAssigned` DROP FOREIGN KEY `ContentAssigned_assignedById_fkey`;

-- DropForeignKey
ALTER TABLE `ContentAssigned` DROP FOREIGN KEY `ContentAssigned_assignedContentId_fkey`;

-- DropForeignKey
ALTER TABLE `ContentAssigned` DROP FOREIGN KEY `ContentAssigned_assignedToId_fkey`;

-- AlterTable
ALTER TABLE `ContentAssigned` MODIFY `assignedById` INTEGER NULL,
    MODIFY `assignedToId` INTEGER NULL,
    MODIFY `assignedContentId` INTEGER NULL;

-- AddForeignKey
ALTER TABLE `Content` ADD CONSTRAINT `Content_uploadedBy_fkey` FOREIGN KEY (`uploadedBy`) REFERENCES `User`(`id`) ON DELETE SET NULL ON UPDATE SET NULL;

-- AddForeignKey
ALTER TABLE `ContentAssigned` ADD CONSTRAINT `ContentAssigned_assignedById_fkey` FOREIGN KEY (`assignedById`) REFERENCES `User`(`id`) ON DELETE SET NULL ON UPDATE SET NULL;

-- AddForeignKey
ALTER TABLE `ContentAssigned` ADD CONSTRAINT `ContentAssigned_assignedToId_fkey` FOREIGN KEY (`assignedToId`) REFERENCES `User`(`id`) ON DELETE SET NULL ON UPDATE SET NULL;

-- AddForeignKey
ALTER TABLE `ContentAssigned` ADD CONSTRAINT `ContentAssigned_assignedContentId_fkey` FOREIGN KEY (`assignedContentId`) REFERENCES `Content`(`id`) ON DELETE SET NULL ON UPDATE SET NULL;
