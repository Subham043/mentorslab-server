-- CreateTable
CREATE TABLE `ExamQuestionAnswer` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `uuid` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `image` TEXT NULL,
    `question` TEXT NOT NULL,
    `answer_a` TEXT NULL,
    `answer_b` TEXT NULL,
    `answer_c` TEXT NULL,
    `answer_d` TEXT NULL,
    `correct_answer` ENUM('answer_a', 'answer_b', 'answer_c', 'answer_d') NOT NULL DEFAULT 'answer_a',
    `marks` INTEGER NULL DEFAULT 1,
    `duration` INTEGER NULL,
    `uploadedBy` INTEGER NULL,
    `examId` INTEGER NULL,
    `draft` BOOLEAN NOT NULL DEFAULT false,

    UNIQUE INDEX `ExamQuestionAnswer_uuid_key`(`uuid`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ExamAssigned` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `requestedById` INTEGER NULL,
    `examId` INTEGER NULL,
    `questionAnswerId` INTEGER NULL,
    `assignedRole` ENUM('ASSIGNED', 'PURCHASED') NOT NULL DEFAULT 'ASSIGNED',
    `status` ENUM('PENDING', 'ONGOING', 'COMPLETED', 'ABORTED') NOT NULL DEFAULT 'PENDING',
    `reason` TEXT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `PaymentExam` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `orderId` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `status` ENUM('PENDING', 'PAID_PARTIAL', 'PAID_FULL') NOT NULL DEFAULT 'PENDING',
    `amount` TEXT NOT NULL,
    `receipt` TEXT NULL,
    `paymentReferenceId` TEXT NULL,
    `paymentBy` INTEGER NULL,
    `forExamAssignedId` INTEGER NULL,

    UNIQUE INDEX `PaymentExam_orderId_key`(`orderId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `ExamQuestionAnswer` ADD CONSTRAINT `ExamQuestionAnswer_uploadedBy_fkey` FOREIGN KEY (`uploadedBy`) REFERENCES `User`(`id`) ON DELETE SET NULL ON UPDATE SET NULL;

-- AddForeignKey
ALTER TABLE `ExamQuestionAnswer` ADD CONSTRAINT `ExamQuestionAnswer_examId_fkey` FOREIGN KEY (`examId`) REFERENCES `Exam`(`id`) ON DELETE SET NULL ON UPDATE SET NULL;

-- AddForeignKey
ALTER TABLE `ExamAssigned` ADD CONSTRAINT `ExamAssigned_requestedById_fkey` FOREIGN KEY (`requestedById`) REFERENCES `User`(`id`) ON DELETE SET NULL ON UPDATE SET NULL;

-- AddForeignKey
ALTER TABLE `ExamAssigned` ADD CONSTRAINT `ExamAssigned_examId_fkey` FOREIGN KEY (`examId`) REFERENCES `Exam`(`id`) ON DELETE SET NULL ON UPDATE SET NULL;

-- AddForeignKey
ALTER TABLE `ExamAssigned` ADD CONSTRAINT `ExamAssigned_questionAnswerId_fkey` FOREIGN KEY (`questionAnswerId`) REFERENCES `ExamQuestionAnswer`(`id`) ON DELETE SET NULL ON UPDATE SET NULL;

-- AddForeignKey
ALTER TABLE `PaymentExam` ADD CONSTRAINT `PaymentExam_paymentBy_fkey` FOREIGN KEY (`paymentBy`) REFERENCES `User`(`id`) ON DELETE SET NULL ON UPDATE SET NULL;

-- AddForeignKey
ALTER TABLE `PaymentExam` ADD CONSTRAINT `PaymentExam_forExamAssignedId_fkey` FOREIGN KEY (`forExamAssignedId`) REFERENCES `ExamAssigned`(`id`) ON DELETE SET NULL ON UPDATE SET NULL;
