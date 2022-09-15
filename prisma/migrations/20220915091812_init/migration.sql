-- CreateTable
CREATE TABLE `User` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `phone` VARCHAR(191) NULL,
    `name` VARCHAR(191) NULL,
    `otp` INTEGER NULL,
    `role` ENUM('USER', 'ADMIN') NOT NULL DEFAULT 'USER',

    UNIQUE INDEX `User_email_key`(`email`),
    UNIQUE INDEX `User_phone_key`(`phone`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Content` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `type` ENUM('PDF', 'VIDEO') NOT NULL DEFAULT 'VIDEO',
    `file_path` TEXT NOT NULL,
    `heading` TEXT NOT NULL,
    `description` TEXT NULL,
    `uploadedBy` INTEGER NULL,
    `draft` BOOLEAN NOT NULL DEFAULT false,
    `restricted` BOOLEAN NOT NULL DEFAULT false,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Content` ADD CONSTRAINT `Content_uploadedBy_fkey` FOREIGN KEY (`uploadedBy`) REFERENCES `User`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;