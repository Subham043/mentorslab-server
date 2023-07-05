-- CreateTable
CREATE TABLE `IttcRegistration` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `orderId` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `amount` TEXT NULL,
    `receipt` TEXT NULL,
    `name` TEXT NULL,
    `phone` TEXT NULL,
    `email` TEXT NULL,
    `message` TEXT NULL,
    `status` ENUM('PENDING', 'PAID_PARTIAL', 'PAID_FULL') NOT NULL DEFAULT 'PENDING',
    `paymentReferenceId` TEXT NULL,

    UNIQUE INDEX `IttcRegistration_orderId_key`(`orderId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
