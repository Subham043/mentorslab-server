-- CreateTable
CREATE TABLE `User` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `phone` VARCHAR(191) NULL,
    `name` VARCHAR(191) NULL,
    `password` VARCHAR(191) NOT NULL,
    `otp` INTEGER NULL,
    `verified` BOOLEAN NOT NULL DEFAULT false,
    `blocked` BOOLEAN NOT NULL DEFAULT false,
    `hashed_refresh_token` TEXT NULL,
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
    `name` TEXT NOT NULL,
    `heading` TEXT NOT NULL,
    `description` TEXT NULL,
    `amount` VARCHAR(191) NULL,
    `uploadedBy` INTEGER NULL,
    `draft` BOOLEAN NOT NULL DEFAULT false,
    `restricted` BOOLEAN NOT NULL DEFAULT false,
    `paid` BOOLEAN NOT NULL DEFAULT false,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ContentAssigned` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `assignedById` INTEGER NULL,
    `assignedToId` INTEGER NULL,
    `assignedContentId` INTEGER NULL,
    `assignedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `assignedRole` ENUM('ASSIGNED', 'PURCHASED') NOT NULL DEFAULT 'ASSIGNED',

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Payment` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `status` ENUM('PENDING', 'PAID_PARTIAL', 'PAID_FULL') NOT NULL DEFAULT 'PENDING',
    `amount` TEXT NOT NULL,
    `paymentReferenceId` TEXT NULL,
    `paymentBy` INTEGER NULL,
    `forContentAssignedId` INTEGER NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `LiveSessionContent` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `image` TEXT NULL,
    `name` TEXT NOT NULL,
    `heading` TEXT NOT NULL,
    `description` TEXT NULL,
    `amount` VARCHAR(191) NULL,
    `uploadedBy` INTEGER NULL,
    `draft` BOOLEAN NOT NULL DEFAULT false,
    `paid` BOOLEAN NOT NULL DEFAULT false,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `LiveSessionContentAssigned` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `requestedById` INTEGER NULL,
    `liveSessionContentId` INTEGER NULL,
    `scheduledAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `status` ENUM('PENDING', 'COMPLETED') NOT NULL DEFAULT 'PENDING',

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `PaymentLiveSession` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `status` ENUM('PENDING', 'PAID_PARTIAL', 'PAID_FULL') NOT NULL DEFAULT 'PENDING',
    `amount` TEXT NOT NULL,
    `paymentReferenceId` TEXT NULL,
    `paymentBy` INTEGER NULL,
    `forLiveSessionContentAssignedId` INTEGER NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Content` ADD CONSTRAINT `Content_uploadedBy_fkey` FOREIGN KEY (`uploadedBy`) REFERENCES `User`(`id`) ON DELETE SET NULL ON UPDATE SET NULL;

-- AddForeignKey
ALTER TABLE `ContentAssigned` ADD CONSTRAINT `ContentAssigned_assignedById_fkey` FOREIGN KEY (`assignedById`) REFERENCES `User`(`id`) ON DELETE SET NULL ON UPDATE SET NULL;

-- AddForeignKey
ALTER TABLE `ContentAssigned` ADD CONSTRAINT `ContentAssigned_assignedToId_fkey` FOREIGN KEY (`assignedToId`) REFERENCES `User`(`id`) ON DELETE SET NULL ON UPDATE SET NULL;

-- AddForeignKey
ALTER TABLE `ContentAssigned` ADD CONSTRAINT `ContentAssigned_assignedContentId_fkey` FOREIGN KEY (`assignedContentId`) REFERENCES `Content`(`id`) ON DELETE SET NULL ON UPDATE SET NULL;

-- AddForeignKey
ALTER TABLE `Payment` ADD CONSTRAINT `Payment_paymentBy_fkey` FOREIGN KEY (`paymentBy`) REFERENCES `User`(`id`) ON DELETE SET NULL ON UPDATE SET NULL;

-- AddForeignKey
ALTER TABLE `Payment` ADD CONSTRAINT `Payment_forContentAssignedId_fkey` FOREIGN KEY (`forContentAssignedId`) REFERENCES `ContentAssigned`(`id`) ON DELETE SET NULL ON UPDATE SET NULL;

-- AddForeignKey
ALTER TABLE `LiveSessionContent` ADD CONSTRAINT `LiveSessionContent_uploadedBy_fkey` FOREIGN KEY (`uploadedBy`) REFERENCES `User`(`id`) ON DELETE SET NULL ON UPDATE SET NULL;

-- AddForeignKey
ALTER TABLE `LiveSessionContentAssigned` ADD CONSTRAINT `LiveSessionContentAssigned_requestedById_fkey` FOREIGN KEY (`requestedById`) REFERENCES `User`(`id`) ON DELETE SET NULL ON UPDATE SET NULL;

-- AddForeignKey
ALTER TABLE `LiveSessionContentAssigned` ADD CONSTRAINT `LiveSessionContentAssigned_liveSessionContentId_fkey` FOREIGN KEY (`liveSessionContentId`) REFERENCES `LiveSessionContent`(`id`) ON DELETE SET NULL ON UPDATE SET NULL;

-- AddForeignKey
ALTER TABLE `PaymentLiveSession` ADD CONSTRAINT `PaymentLiveSession_paymentBy_fkey` FOREIGN KEY (`paymentBy`) REFERENCES `User`(`id`) ON DELETE SET NULL ON UPDATE SET NULL;

-- AddForeignKey
ALTER TABLE `PaymentLiveSession` ADD CONSTRAINT `PaymentLiveSession_forLiveSessionContentAssignedId_fkey` FOREIGN KEY (`forLiveSessionContentAssignedId`) REFERENCES `LiveSessionContentAssigned`(`id`) ON DELETE SET NULL ON UPDATE SET NULL;
