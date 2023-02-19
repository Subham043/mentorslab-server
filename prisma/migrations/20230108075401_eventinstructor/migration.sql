-- CreateTable
CREATE TABLE `EventInstructor` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `name` TEXT NULL,
    `designation` TEXT NULL,
    `description` TEXT NULL,
    `image` TEXT NULL,
    `facebook` TEXT NULL,
    `instagram` TEXT NULL,
    `twitter` TEXT NULL,
    `linkedin` TEXT NULL,
    `heading` TEXT NULL,
    `eventId` INTEGER NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `EventInstructor` ADD CONSTRAINT `EventInstructor_eventId_fkey` FOREIGN KEY (`eventId`) REFERENCES `Event`(`id`) ON DELETE SET NULL ON UPDATE SET NULL;